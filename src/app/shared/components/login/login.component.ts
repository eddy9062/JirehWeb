import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { Cliente } from '../../models/cliente';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Input() show = false; // visible desde el padre
  @Input() activeTab = ''; // visible desde el padre
  @Output() close = new EventEmitter<void>();
cliente: Cliente = this.getEmptyCliente();
  //activeTab: 'login' | 'register' = 'login';
  private getEmptyCliente(): Cliente {
      return {
        cod_cliente: 0,
        nombre: '',
        direccion: '',
        telefono: '',
        nit: '',
        usuario: '',
        password: '',
        tipo_usuario: 0,
        token: '',
        pDescuento: 0,
      };
    }

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private modalService: ModalService
  ) {this.modalService.showAuthModal$.subscribe(show => (this.show = show));}

  login() {
    this.authService.login(this.cliente as Cliente).subscribe({
      next: (response) => {
        this.alertService.success('Inicio de sesión exitoso');
        this.modalService.closeAuth(); // cierra el modal
      },
      error: () => {
        this.alertService.error('Usuario o contraseña incorrectos');
      },
    });
  }

  registrar() {
    this.authService.registraCliente(this.cliente as Cliente).subscribe({
      next: (response) => {
        this.alertService.success('Registro completado con éxito');
        this.modalService.closeAuth();
      },
      error: () => {
        this.alertService.error('Error al registrar el usuario');
      },
    });
  }

openLogin(tab: 'login' | 'register') {
    this.activeTab = tab;
  }

  closeModal() {
    this.modalService.closeAuth();
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }
}
