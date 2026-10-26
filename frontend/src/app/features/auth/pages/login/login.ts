import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = signal(false);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.auth.login(this.form.getRawValue()).subscribe({
      next: (user) => this.router.navigateByUrl(this.targetUrl(user.role)),
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  private targetUrl(role: string): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    // Only allow addresses inside our own site
    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }
    return role === 'admin' ? '/admin' : '/';
  }

  private readError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Cannot reach the server. Please try again in a moment.';
    if (err.status === 400 || err.status === 401) return 'Incorrect email or password.';
    if (err.status === 429) return 'Too many attempts. Please wait a minute and try again.';
    const detail = err.error?.detail;
    return typeof detail === 'string' ? detail : 'Something went wrong. Please try again.';
  }
}
