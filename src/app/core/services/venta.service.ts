import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  public url;
  //public _token?: any;

  constructor(private _http: HttpClient, private authService: AuthService) {
    this.url = `${environment.api_url}/api/`;
   }


  registraMovimiento(data: any): Observable<any> {
    const token = this.authService.getToken(); // 👈 obtener token
    const paramData = {
      codigoSQL: 43,
      encabezado: data,
    };
    console.log(paramData)
    //console.log(token)

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    return this._http.post(this.url + 'getapiMulti_cli', paramData, {
      headers: headers,
    });
  }

  getMovimiento(pId: number): Observable<any> {
    const token = this.authService.getToken(); // 👈 obtener token
    const paramData = {
      codigoSQL: 44,
      parametro: `N${pId}|N${pId}|N${pId}`
    };
    console.log(paramData)
    //encabezado: [{'parametro': `N${pId}`, 'detalle': [{'parametro': `N${pId}`}]}]
    //console.log(token)
//parametro: `N${pId}`
//.set('Authorization', `Bearer ${token}`);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
      
    return this._http.post(this.url + 'getapi_cli', paramData, {
      headers: headers,
    });
    /*return this.http.post<Product[]>(this.baseUrl + 'getapist', paramData, {
          headers: headers,
        });*/
  }

  public convertirFecha(fechaISO: string): string {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const anio = fecha.getUTCFullYear();

    return `${anio}-${mes}-${dia}`;
  }

}
