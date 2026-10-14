import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
})
export class EmptyState {
  icon = input('diamond');
  title = input('Nothing here yet');
  message = input('Please check back soon.');
}
