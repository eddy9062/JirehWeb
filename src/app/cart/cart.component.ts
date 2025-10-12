import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe, NgOptimizedImage } from '@angular/common';

import { map } from 'rxjs';
import { CartService } from '../core/services/card.service';
import { CartProductLoadingComponent } from "./components/cart-product-loading/cart-product-loading.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, NgOptimizedImage, AsyncPipe, CartProductLoadingComponent],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  cartService = inject(CartService);
  // observable de productos
  cartProducts$ = this.cartService.cart$;

  // observable del total
  total$ = this.cartProducts$.pipe(
    map((cartProducts) =>
      cartProducts.reduce(
        (sum, cp) => sum + cp.product.precio * cp.quantity,
        0
      )
    )
  );

  showErrorToast = false;

  decrement(productId: string) {
    this.cartService.decrementQuantity(productId);
  }

  increment(productId: string) {
    this.cartService.incrementQuantity(productId);
  }
}
