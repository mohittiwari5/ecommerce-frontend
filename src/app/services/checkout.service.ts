import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl: string = environment.mohitApiUrl + '/checkout/purchase';

  constructor(private httpClient: HttpClient) { }


  public placeOrder(purchase: Purchase): Observable<any>{

    return this.httpClient.post<Purchase>(this.purchaseUrl,purchase);
  }
}
