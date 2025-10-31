import { Component, inject, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgClass], // 👈 importante
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent {
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  
  @Input() isOpen = false;
  activeTab = '';


  openLogin(x: string) {
    this.activeTab = x;
    this.modalService.openAuth();
  }

  logout() {
    //console.log('logout sidebar')
    this.authService.logout();
//    this.showMenu = false;
  }
}
