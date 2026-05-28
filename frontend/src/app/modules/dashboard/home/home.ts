import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { User } from '../../../core/services/user';
import { LoadingService } from '../../../core/services/loading.service';
import { ThemeService } from '../../../core/services/theme.service';
import { IUser, IDashboardStats } from '../../../shared/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  authService = inject(Auth);
  userService = inject(User);
  router = inject(Router);
  loadingService = inject(LoadingService);
  themeService = inject(ThemeService);

  users: IUser[] = [];
  currentUser: IUser | null = null;
  displayedColumns: string[] = ['username', 'role', 'department', 'accessLevel'];
  loading$ = this.loadingService.loading$;
  darkMode$ = this.themeService.darkMode$;

  stats = signal<IDashboardStats>({ totalUsers: 0, adminCount: 0, userCount: 0, departmentCount: 0 });
  dataLoading = signal(true);
  sidebarCollapsed = signal(false);

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadData();
  }

  loadData(): void {
    this.dataLoading.set(true);

    // Load users with 3s delay (async demo)
    this.userService.getUsers(3000).subscribe({
      next: (users) => {
        this.users = users;
        this.dataLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.dataLoading.set(false);
      }
    });

    // Load stats
    this.userService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  getAccessBadgeClass(access: string | undefined): string {
    switch (access) {
      case 'Admin': return 'badge-admin';
      case 'Write': return 'badge-write';
      case 'Read': return 'badge-read';
      default: return 'badge-read';
    }
  }

  getRoleBadgeClass(role: string): string {
    return role === 'admin' ? 'role-admin' : 'role-user';
  }
}
