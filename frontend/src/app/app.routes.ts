import { Routes } from '@angular/router';
import { LoginComponent } from './pages/public/login/login.component';
import { SignupComponent } from './pages/public/signup/signup.component';
import { TodoHomeComponent } from './pages/private/todo-home/todo-home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'signup',
        component: SignupComponent,
    },
    {
        path: 'dashboard',
        component: TodoHomeComponent,
        canActivate: [authGuard]
    },
];
