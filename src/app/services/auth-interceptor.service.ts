import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, Observable } from 'rxjs';
import { OKTA_AUTH } from '@okta/okta-angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.handleAccess(req, next));

  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    //only add an access token for secured endpoints
    const theEndPoint = environment.mohitApiUrl + '/orders';
    const securedEndpoints = [theEndPoint];

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {

      //get access token
      const accessToken = await this.oktaAuth.getAccessToken();

      //clone the request and add new header with access token

      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });

    }

    //@ts-ignore
    return next.handle(request).toPromise();

  }
}
