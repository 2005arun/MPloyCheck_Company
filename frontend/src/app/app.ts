import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from './core/services/loading.service';
import { ThemeService } from './core/services/theme.service';
import { Auth } from './core/services/auth';
import { Observable, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatProgressSpinnerModule],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('MployCheck');

  loadingService = inject(LoadingService);
  themeService = inject(ThemeService);
  authService = inject(Auth);
  router = inject(Router);

  loading$!: Observable<boolean>;
  isLoginPage = signal(false);

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;

    // Track if we're on the login page to hide sidebar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage.set(event.urlAfterRedirects?.includes('/auth/login'));
    });

    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
  }
}