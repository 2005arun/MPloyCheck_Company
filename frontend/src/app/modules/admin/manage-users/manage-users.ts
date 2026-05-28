import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { User } from '../../../core/services/user';
import { LoadingService } from '../../../core/services/loading.service';
import { ThemeService } from '../../../core/services/theme.service';
import { IUser } from '../../../shared/models/user.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.scss',
})
export class ManageUsers implements OnInit {
  authService = inject(Auth);
  userService = inject(User);
  router = inject(Router);
  loadingService = inject(LoadingService);
  snackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);
  themeService = inject(ThemeService);

  users: IUser[] = [];
  displayedColumns: string[] = ['username', 'role', 'department', 'accessLevel', 'actions'];
  loading$ = this.loadingService.loading$;
  darkMode$ = this.themeService.darkMode$;
  form: FormGroup;
  editingId: string | null = null;
  showForm = signal(false);
  dataLoading = signal(true);
  sidebarCollapsed = signal(false);
  currentUser: IUser | null = null;

  constructor() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }

    this.currentUser = this.authService.getUser();

    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.minLength(6)]],
      role: ['user', [Validators.required]],
      department: [''],
      accessLevel: ['Read', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.dataLoading.set(true);
    this.userService.getUsers(3000).subscribe({
      next: (users) => {
        this.users = users;
        this.dataLoading.set(false);
      },
      error: (error) => {
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.dataLoading.set(false);
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.set(!this.sidebarCollapsed());
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  openAddForm(): void {
    this.editingId = null;
    this.form.reset({ role: 'user', accessLevel: 'Read' });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.get('password')?.updateValueAndValidity();
    this.showForm.set(true);
  }

  editUser(user: IUser): void {
    this.editingId = user._id || user.id;
    this.form.patchValue({
      username: user.username,
      role: user.role,
      department: user.department,
      accessLevel: user.accessLevel
    });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.showForm.set(true);
  }

  saveUser(): void {
    if (this.form.invalid) return;

    if (this.editingId) {
      this.userService.updateUser(this.editingId, this.form.value).subscribe({
        next: () => {
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
          this.closeForm();
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Error updating user', 'Close', { duration: 3000 });
        }
      });
    } else {
      if (!this.form.get('password')?.value) {
        this.snackBar.open('Password is required for new users', 'Close', { duration: 3000 });
        return;
      }
      this.userService.createUser(this.form.value).subscribe({
        next: () => {
          this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
          this.closeForm();
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Error creating user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteUser(user: IUser): void {
    const id = user._id || user.id;
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Error deleting user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  closeForm(): void {
    this.editingId = null;
    this.form.reset();
    this.showForm.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
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
