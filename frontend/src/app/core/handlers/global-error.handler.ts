import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // One place for all unexpected errors.
    // Later: show a friendly message or send the error to a logging service.
    console.error('Something went wrong:', error);
  }
}
