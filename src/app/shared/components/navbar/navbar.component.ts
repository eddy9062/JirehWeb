import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CarritoService } from '../../../core/services/carrito.service';
import { CartService } from '../../../core/services/card.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent  implements OnInit{
 private cartService = inject(CartService);
  totalItems = 0;

  //cantidad$!: Observable<number>;

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private carritoService: CarritoService){

  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
     //this.cantidad$ = this.carritoService.cantidad$;
     this.cartService.cart$.subscribe((cart) => {
      this.totalItems = cart.reduce((sum, c) => sum + c.quantity, 0);
    });
  }

  /*cantidad(){
   console.log('dsdsdsd')
   return 5
  }*/
}
