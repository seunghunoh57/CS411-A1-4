import { Injectable, Inject, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  auth:any;
  constructor(private inj: Injector) {
    // this.auth = inj.get(AuthService);
  }
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.auth = this.inj.get(AuthService);

    if(!this.auth.getToken()) return next.handle(req);
    // Get the auth header from the service.
    const authHeader = this.auth.getToken();
    // Clone the request to add the new header.
    const authReq = req.clone({setHeaders: {Authorization: authHeader}});
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
