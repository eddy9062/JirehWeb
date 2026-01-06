import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito.service';
import { CartService } from '../../../core/services/card.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../../core/services/search.service';
import { AutoFocusDirective } from '../../directivas/auto-focus.directive';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Cliente } from '../../models/cliente';
import { InicialesPipe } from '../pipes/iniciales.pipe';
import { AlertService } from '../../../core/services/alert.service';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from "../login/login.component";
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    RouterLink,
    NgClass,
    AutoFocusDirective,
    InicialesPipe,
    LoginComponent
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private modalService = inject(ModalService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  user$: Observable<Cliente | null> = this.authService.user$;
  showAuthModal = false;
  activeTab = 'login';

//cliente: Cliente = this.getEmptyCliente();
//activeTab: 'login' | 'register' = 'login';
  // 🔹 Devuelve un cliente vacío (para evitar undefined)
  
  // 🧠 Simula el estado de autenticación
  isAuthenticated = false;
  totalItems = 0;
  searchTerm = '';
  showSearch = false;
  showSearchIcon = false;
  isHome = false; // 👈 nuevo: controla si estamos en home
  showMenu = false;

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private carritoService: CarritoService,
    private searchService: SearchService,
    private _http: HttpClient, 
    private alertService: AlertService,
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    // Mantener contador del carrito
    this.cartService.cart$.subscribe((cart) => {
      this.totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
    });
    // Detectar navegación
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        const currentRoute = event.urlAfterRedirects;
        this.isHome = currentRoute === '/' || currentRoute === '/home'; // 👈 ajusta según tus rutas reales

        // Cerrar buscador al cambiar de ruta
        if (!this.showSearchIcon && this.showSearch) {
          this.closeSearch();
        }
      });

      // Escucha los cambios del servicio
    this.modalService.showAuthModal$.subscribe(show => {
      this.showAuthModal = show;
    });
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

   openLogin(x: string) {
    this.activeTab = x;
    this.modalService.openAuth();
  }

  closeModal() {
    this.modalService.closeAuth();
  }

  logout() {
    this.authService.logout();
    this.showMenu = false;
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchService.setSearchTerm(this.searchTerm);
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchTerm = '';
      this.searchService.clear();
      // Si se cierra el buscador, limpiar el término
      this.closeSearch();
    }
  }

  // 🔹 Limpieza centralizada (puedes reutilizarla)
  private closeSearch() {
    this.showSearch = false;
    this.searchTerm = '';
    this.searchService.setSearchTerm(''); // esto hace que muestre todos los productos
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // 🟢 1️⃣ Cerrar buscador si se hace clic fuera
    if (!target.closest('.search-container') && this.showSearch) {
      this.closeSearch();
    }

    // 🟢 2️⃣ Cerrar menú del avatar si se hace clic fuera
    if (!target.closest('.user-menu') && this.showMenu) {
      this.showMenu = false;
    }
  }


openRegister() {
  this.activeTab = 'register';
  this.showAuthModal = true;
}
  
}
