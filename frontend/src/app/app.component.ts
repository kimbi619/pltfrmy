import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SignupComponent } from "./pages/public/signup/signup.component";
import { LoginComponent } from './pages/public/login/login.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet ],
  template: `
    <router-outlet />
  `,
  styles: [],
})
export class AppComponent {
  title = 'frontend';
}
