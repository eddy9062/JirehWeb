import { Component, inject, input } from '@angular/core';
import { Product } from '../../../shared/models/product';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/card.service';


@Component({
  selector: 'app-home-product',
  standalone: true,
  imports: [NgOptimizedImage, CurrencyPipe],
  templateUrl: './home-product.component.html',
})
export class HomeProductComponent {
  product = input.required<Product>();
  cartService = inject(CartService);

  addToCart() {
    this.cartService.addProduct(this.product());
    //console.log('Carrito actualizado:', this.cartService.getCart());
  }
}
