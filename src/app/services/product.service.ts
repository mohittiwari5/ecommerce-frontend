import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseurl = environment.mohitApiUrl + '/products';
  private categoryurl = environment.mohitApiUrl +'/product-category';

  constructor(private httpClient: HttpClient) { }


  public getProductListPagination(thePage: number,
                                  thePageSize: number,
                                  theCategoryId: number): Observable<GetResponseProduct> {

    //need to build URL based on category id,page and pagesize
    const searchUrl = `${this.baseurl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

    console.log(`Getting Products from --> ${searchUrl}`)
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }


  public getProductList(theCategoryId: number): Observable<Product[]> {
    //need to build URL based on category id
    const searchUrl = `${this.baseurl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  public getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryurl).pipe(
      map((response) => {
        return response._embedded.productCategory
      })
    );
  }


  public searchProductsPagination(thePage: number,
                                  thePageSize: number,
                                  theKeyword: string): Observable<GetResponseProduct> {

    //need to build URL based on category id,page and pagesize
    const searchUrl = `${this.baseurl}/search/findByNameContaining?name=${theKeyword}`
                       + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }


  
  public searchProducts(theKeyword: string): Observable<Product[]> {
    //need to build URL based on category id
    const searchUrl = `${this.baseurl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }


  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map((response) => {
        return response._embedded.products;
      })
    );
  }


  public getProduct(theProductId: number): Observable<Product> {

    //need to build URL based on product id
    const productUrl = `${this.baseurl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);

  }


}


interface GetResponseProduct {
  _embedded: {
    products: Product[];
  }

  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number;
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}