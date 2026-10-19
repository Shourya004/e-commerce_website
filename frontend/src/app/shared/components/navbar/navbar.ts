import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  host: { class: 'contents' },
})
export class Navbar {
  menuOpen = signal(false);
  city = '[City]';
  shopName = 'Rudraksh';
  phone = '+910000000000';
  whatsapp = '910000000000';

  links = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Shop', path: '/collections', exact: false },
    { label: 'Offers', path: '/offers', exact: false },
    { label: 'About', path: '/about', exact: false },
    { label: 'Contact', path: '/contact', exact: false },
  ];
}
