import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _showAuthModal = new BehaviorSubject<boolean>(false);
  showAuthModal$ = this._showAuthModal.asObservable();

  // 🔹 Abrir modal de autenticación
  openAuth() {
    this._showAuthModal.next(true);
  }

  // 🔹 Cerrar modal de autenticación
  closeAuth() {
    this._showAuthModal.next(false);
  }
}
