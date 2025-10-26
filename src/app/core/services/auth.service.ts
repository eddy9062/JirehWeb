import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Cliente } from '../../shared/models/cliente';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url;

  private userSubject = new BehaviorSubject<Cliente | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private _http: HttpClient) {
    this.url = `${environment.api_url}/api/`;
    // 🛡️ Intenta leer localStorage de forma segura

    if (this.hasLocalStorage()) {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          this.userSubject.next(JSON.parse(stored));
        } catch (e) {
          console.warn('Error parsing user from localStorage:', e);
          localStorage.removeItem('user');
        }
      }
    }
  }

  private setUser(user: Cliente): void {
    this.userSubject.next(user);
    if (this.hasLocalStorage()) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getToken(): string | null {
  const user = this.getUser();
  return user?.token || null;
}


  private hasLocalStorage(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const testKey = '__test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  login(user: Cliente) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post<any>(this.url + 'login_cli', user, { headers }).pipe(
      tap((response) => {
        // 👇 Verificar si el backend indica fallo
        console.log(response)
        if (response?.message === 'fail') {
          throw new Error('Usuario o contraseña incorrectos');
        }
        // 🧠 Guarda el usuario con su token
        const userData: Cliente = {
          ...response,
          token: response.token,
        };
        this.setUser(userData);
      })
    );
  }

  registraCliente(data: Cliente): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post<any>(this.url + 'user_cli', data, { headers }).pipe(
      tap((response) => {
        // 👇 Verificar si el backend indica fallo
        if (response?.message === 'fail') {
          throw new Error('Usuario o contraseña incorrectos');
        }
        // 🧠 Guarda el usuario con su token
        const userData: Cliente = {
          ...response,
          token: response.token,
        };
        this.setUser(userData);
      })
    );
  }

  logout() {
    this.userSubject.next(null);
    if (this.hasLocalStorage()) {
      localStorage.removeItem('user');
    }
  }

  getUser(): Cliente | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
