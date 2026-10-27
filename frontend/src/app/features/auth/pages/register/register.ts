import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { getSafeReturnUrl } from '../../utils/return-url';

// The two password boxes must match
const passwordsMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null =>
  group.get('password')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true };

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = signal(false);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  // For the live checklist under the password box
  get hasMinLength(): boolean {
    return this.form.controls.password.value.length >= 8;
  }

  get hasLetterAndNumber(): boolean {
    const value = this.form.controls.password.value;
    return /[A-Za-z]/.test(value) && /\d/.test(value);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { name, email, password } = this.form.getRawValue();

    // Create the account, then sign in straight away
    this.auth
      .register({ name, email, password })
      .pipe(switchMap(() => this.auth.login({ email, password })))
      .subscribe({
        next: () => this.router.navigateByUrl(getSafeReturnUrl(this.route) ?? '/'),
        error: (err: HttpErrorResponse) => {
          this.submitting.set(false);
          this.errorMessage.set(this.readError(err));
        },
      });
  }

  private readError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Cannot reach the server. Please try again in a moment.';
    if (err.status === 409) return 'An account with this email already exists. Try signing in.';
    if (err.status === 422) return 'Please check the details and try again.';
    if (err.status === 429) return 'Too many attempts. Please wait a minute and try again.';
    const detail = err.error?.detail;
    return typeof detail === 'string' ? detail : 'Something went wrong. Please try again.';
  }
}
