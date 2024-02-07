import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import axios, { AxiosRequestConfig } from 'axios';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environtment/environment';

@Injectable({ providedIn: 'root' })
export class ConverterService {
  constructor(private _httpClient: HttpClient) {}
  public url = 'https://currency-converter241.p.rapidapi.com';
  private apiKey = environment.apiKey;
  private apiHost = environment.host
  getCurrencyHTTPClient(): Observable<any> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'currency-converter241.p.rapidapi.com',
    });

    const options = {
      headers: headers,
    };

    return this._httpClient.get<any>(this.url + '/all', options).pipe(
      tap((response) => {
        return response.data;
      })
    );
  }
  async getCurrencyAxios(): Promise<any> {
    const options = {
      method: 'GET',
      url: this.url + '/all',
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': 'currency-converter241.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async ConvertCurrencyAxios(
    amount: number,
    from: string,
    to: string
  ) {
    const options = {
      method: 'GET',
      url: this.url + '/convert',
      params: {
        amount: amount,
        from: from,
        to: to,
      },
      headers: {
        'X-RapidAPI-Key': this.apiKey,
        'X-RapidAPI-Host': this.apiHost,
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  ConvertCurrencyHTTPClient(
    amount: number,
    from: string,
    to: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': this.apiHost,
    });

    const queryParams = new HttpParams()
    .set('amount', amount) 
    .set('from', from)     
    .set('to', to);        

    const options = {
      headers: headers,
      params: queryParams,
    };

    return this._httpClient.get<any>(this.url + '/convert', options).pipe(
      tap((response) => {
        return response.data;
      })
    );
  }
}
