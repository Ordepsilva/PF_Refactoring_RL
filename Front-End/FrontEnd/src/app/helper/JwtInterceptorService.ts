import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('token'));
        if (currentUser && currentUser.AuthToken) {
            request = request.clone({
                setHeaders: { "x-access-token": `${currentUser.AuthToken}` }
            });
        }
        return next.handle(request);
    }
}