import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AsyncPipe,
  CommonModule,
  CurrencyPipe,
  NgOptimizedImage,
} from '@angular/common';

import { map } from 'rxjs';
import { CartService } from '../core/services/card.service';
import { CartProductLoadingComponent } from './components/cart-product-loading/cart-product-loading.component';
import { HomeProductComponent } from '../home/components/home-product/home-product.component';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../core/services/alert.service';
import { AuthService } from '../core/services/auth.service';
import { VentaService } from '../core/services/venta.service';
import { MovModel } from '../shared/models/MovModel';
import { DetProductModel } from '../shared/models/DetProductModel';
import { ModalService } from '../core/services/modal.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CurrencyPipe,
    NgOptimizedImage,
    AsyncPipe,
    CartProductLoadingComponent,
    HomeProductComponent,
  ],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  isAuthenticated = false;
  cartService = inject(CartService);
  showAuthModal = false;
  itemCard?: MovModel;
  _lstData: any[] = [];
  /*activeTab: 'login' | 'register' = 'login';*/

  // observable de productos
  cartProducts$ = this.cartService.cart$;

  constructor(
    private authService: AuthService,
    private ventaService: VentaService,
    private alertService: AlertService,
    private modalService: ModalService
  ) {
    this.isAuthenticated = authService.isAuthenticated();
    //console.log(this.cartProducts$)
  }

  // observable del total
  total$ = this.cartProducts$.pipe(
    map((cartProducts) =>
      cartProducts.reduce(
        (sum, cp) => sum + cp.product.precio_venta * cp.quantity,
        0
      )
    )
  );

  //  showErrorToast = false;

  decrement(productId: string) {
    this.cartService.decrementQuantity(productId);
  }

  increment(productId: string) {
    this.cartService.incrementQuantity(productId);
  }
/*
  openLogin() {
    this.showAuthModal = true;
  }*/

  closeModal() {
    this.showAuthModal = false;
  }

  logout() {
    this.authService.logout();
  }

  async onComprar() {
    if (this.isAuthenticated) {
      //console.log('✅ Usuario autenticado ');
      //console.log(this._lstData)
      const movimiento = await this.getMovimientoFromStorage(); // 👈 recibe el objeto
      if (!movimiento) {
        console.warn('⚠️ No se pudo construir el movimiento');
        return;
      }
      await this.processItems(movimiento);
      await this.enviarVenta(this._lstData);
      //await this.processItems(this.itemCard);
    } else {
      this.alertService.info('debe de iniciar seción o crear usuario...');
     // this.openLogin()
     this.modalService.openAuth();
    }
  }

  async getMovimientoFromStorage(): Promise<MovModel | null> {
    const userStr = localStorage.getItem('user');
    const cartStr = localStorage.getItem('cart-products');

    if (!userStr || !cartStr) return null;

    try {
      const user = JSON.parse(userStr);
      const cartItems = JSON.parse(cartStr);

      // Construimos el arreglo de productos
      const productos: DetProductModel[] = cartItems.map((item: any) => ({
        ...item.product,
        cantidad: item.quantity, // 👈 puedes agregar la cantidad si quieres
      }));

      // Construimos el movimiento
      const movimiento = {
        id_operacion: user.id_operacion,
        cod_cliente: user.cod_cliente,
        det: productos,
      };
      return movimiento; // ✅ retorna siempre un objeto MovModel
    } catch (error) {
      console.error('Error al obtener movimiento desde localStorage:', error);
      return null; // ✅ garantiza retorno
    }
  }

  async processItems(items: MovModel) {
    this._lstData.push({
      parametro: `N0|N${items.cod_cliente}`,
      detalle: items.det.map((det) => ({
        parametro: `N${0}|V${det.cod_articulo}|N${det.cod_det_articulo}|N${
          det.cantidad
        }|N${det.precio_venta}`,
      })),
    });
  }

  async enviarVenta(data: any) {
    //console.log(data);
    this.ventaService.registraMovimiento(data).subscribe({
      next: (response) => {
        //console.log(response);
        //console.log(Number(response.codigo));
        if ((response.message = 'Ok')) {
          //console.log(response)
          this.cartService.clear();
          this._lstData = [];
          this.alertService.success('# Cotización: ' + response.codigo);
        }
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }
}
