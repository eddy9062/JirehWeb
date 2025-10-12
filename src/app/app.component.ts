import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule,NavbarComponent, FooterComponent, SidebarComponent, RouterOutlet,NgClass],
  templateUrl: './app.component.html',
})
export class AppComponent {
  isSidebarOpen = false; // empieza abierto


  constructor(private renderer: Renderer2) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.updateBodyScroll();
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.updateBodyScroll();
  }

  private updateBodyScroll() {
    if (this.isSidebarOpen) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }

  ngOnDestroy() {
    // por si se destruye el componente con el sidebar abierto
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }
}

