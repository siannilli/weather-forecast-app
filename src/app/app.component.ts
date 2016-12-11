import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Weather forecast application assessment';
  locations: string[] = ['Rome, IT', 'Zug, CH', 'Vienna, AT'];
  selectedCity: string = this.locations[0];
  mobileMenuHidden: boolean = true;
}
