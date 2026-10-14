import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
})
export class Footer {
  shopName = '[Shop Name]';
  city = '[City]';
  whatsapp = '910000000000';
  year = new Date().getFullYear();

  trustPoints = [
    { icon: 'shield', text: '100% BIS Hallmarked 22kt & 18kt Gold' },
    { icon: 'diamond', text: 'Certified Natural Lab-Graded Diamonds' },
    { icon: 'sync_alt', text: 'Transparent Lifetime Buyback & Exchange' },
    { icon: 'security', text: 'Doorstep Insured Transit Courier' },
  ];
}
