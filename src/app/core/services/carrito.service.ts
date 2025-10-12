import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private cantidadSubject = new BehaviorSubject<number>(0);
  cantidad$ = this.cantidadSubject.asObservable();

  agregarAlCarrito(cantidad: number = 1) {
    const nuevaCantidad = this.cantidadSubject.value + cantidad;
    this.cantidadSubject.next(nuevaCantidad);
  }

  quitarDelCarrito(cantidad: number = 1) {
    const nuevaCantidad = Math.max(0, this.cantidadSubject.value - cantidad);
    this.cantidadSubject.next(nuevaCantidad);
  }

  resetearCarrito() {
    this.cantidadSubject.next(0);
  }
}