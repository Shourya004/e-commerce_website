import { Component } from '@angular/core';
import { Loader } from '../../shared/components/loader/loader';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  imports: [Loader, EmptyState],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  unused = 1;
  onemore = 0;
}
