import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PasswordService } from '../../../../core/services/password.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private passwords = inject(PasswordService);

  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  // Set to the email address once the request went through
  sentTo = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const { email } = this.form.getRawValue();

    this.passwords.forgotPassword(email).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sentTo.set(email);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting.set(false);
        this.errorMessage.set(this.readError(err));
      },
    });
  }

  private readError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Cannot reach the server. Please try again in a moment.';
    if (err.status === 429) return 'Too many attempts. Please wait a few minutes and try again.';
    return 'We could not send the reset link. Please try again later.';
  }
}
