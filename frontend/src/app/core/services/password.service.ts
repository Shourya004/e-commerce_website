import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private http = inject(HttpClient);

  // Asks the backend to email a reset link
  forgotPassword(email: string) {
    return this.http.post<void>('/auth/forgot-password', { email });
  }

  // Sets the new password using the token from the email link
  resetPassword(token: string, newPassword: string) {
    return this.http.post<void>('/auth/reset-password', { token, new_password: newPassword });
  }
}
