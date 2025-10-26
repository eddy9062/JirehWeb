import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  success(message: string, title: string = 'Éxito') {
    Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'z-[20000]',
      },
    });
  }

  error(message: string, title: string = 'Error') {
    Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Cerrar',
      didOpen: (popup) => {
    popup.style.zIndex = '10000'; // 👈 más alto que el modal
  }
    });
  }

  warning(message: string, title: string = 'Advertencia') {
    Swal.fire({
      title,
      text: message,
      icon: 'warning',
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'Entendido',
      customClass: {
        popup: 'z-[20000]',
      }, // 👈 MÁS ALTO QUE EL MODAL
    });
  }

  info(message: string, title: string = 'Información') {
    Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Ok',
      customClass: {
        popup: 'z-[20000]',
      }, // 👈 MÁS ALTO QUE EL MODAL
    });
  }

  confirm(message: string, title: string = 'Confirmar'): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      customClass: {
        popup: 'z-[20000]',
      }, // 👈 MÁS ALTO QUE EL MODAL
    }).then((result) => result.isConfirmed);
  }

  toast(message: string, icon: SweetAlertIcon = 'success') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: {
        popup: 'z-[20000]',
      }, // 👈 MÁS ALTO QUE EL MODAL
    });
  }
}
