import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { ProductComponent } from './product/product.component';
import { PaymentSuccessComponent } from './payment/payment-success/payment-success.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Amazon',
    component: HomeComponent,
  },
  {
    path: 'cart',
    title: 'Amazon | Cart',
    component: CartComponent,
  },
  {
    path: 'products/:id',
    title: 'Amazon | Product Details',
    component: ProductComponent,
  },
  {
    path: 'products',
    title: 'Amazon | Product Details',
    component: ProductComponent,
  },
  {
    path: 'payment/success',
    title: 'Amazon | Payment Success',
    component: PaymentSuccessComponent,
  },
];
