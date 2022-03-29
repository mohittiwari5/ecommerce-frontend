import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class MTFormService {

  private countriesUrl = environment.mohitApiUrl + '/countries';
  private statesUrl = environment.mohitApiUrl + '/states';


  constructor(private httpClient: HttpClient) { }

  
  public getCountries(): Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );

  }

  public getStates(theCountryCode: string): Observable<State[]>{

    //search URL

    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );

  }


  public getCreditCardMonths(startMonth: number):Observable<number[]>{

    let data: number[] = [];

    //build an array for "Month" dropdown list
    //- start at current month and loop until

    for(let theMonth = startMonth; theMonth<=12; theMonth++){
      data.push(theMonth);
    }

    //of() convert data to type Observable
    return of(data);

  }

  public getCreditCardYears():Observable<number[]>{

    let data: number[] = [];

    //build an array for "Year" dropdown list
    //- start at current Year and loop for next 10 Years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear<=endYear; theYear++){
      data.push(theYear);
    }

    //of() convert data to type Observable
    return of(data);
  }

}


interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}