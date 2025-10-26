import { Component, input, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-offer',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-offer.component.html',
})
export class ProductOfferComponent implements OnInit {
  product = input.required<Product>();
  discount!: number;

  ngOnInit(): void {
    const previousPrice = this.product().previousPrice;
    const currentPrice = this.product().precio_venta;

    //console.log(this.product)

    if (previousPrice) {
      this.discount = Math.round(
        ((previousPrice - currentPrice) / previousPrice) * 100
      );
    }
  }
}
