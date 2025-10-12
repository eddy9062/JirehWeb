import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../shared/models/product';
import id from '@angular/common/locales/id';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://variedades-jireh.ddns.net/jirehserver/api/';

  getAll(): Observable<Product[]> {
   // return this.http.get<Product[]>(this.baseUrl);
    const paramData = {
      codigoSQL: 40
    }
/*
    const paramData = {
      codigoSQL: 40,
      parametro: `N${id}`
    }*/
    //console.log(paramData)
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.http.post<Product[]>(this.baseUrl + 'getapist', paramData, {
      headers: headers,
    });
  }
  

  getById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
    
  }
}
