import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
})
export class Loader {
  message = input('Loading...');
}
