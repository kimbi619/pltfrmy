import { ApplicationConfig, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { 
  provideHttpClient, 
  withInterceptors, 
  HttpRequest, 
  HttpHandlerFn,
  HttpInterceptorFn
} from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { TaskService } from './services/task.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
  
  return next(req); 
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    TaskService 
  ]
};
