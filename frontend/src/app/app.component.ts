import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <h1>Welcome to {{title}}!</h1>
    <router-outlet />
    <app-footer />
  `,
  styles: [],
})
export class AppComponent {
  title = 'frontend';
}
