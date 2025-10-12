import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartProduct } from '../../shared/models/cart-product';
import { Product } from '../../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private storageKey = 'cart-products';
  private memoryFallback: CartProduct[] = []; // fallback en memoria
  private cartSubject = new BehaviorSubject<CartProduct[]>(this.loadCart());

  cart$ = this.cartSubject.asObservable(); // observable para los componentes

  // 🔎 Detecta qué almacenamiento usar
  private get storage(): Storage | null {
    try {
      localStorage.setItem('__test', '1');
      localStorage.removeItem('__test');
      return localStorage;
    } catch {
      try {
        sessionStorage.setItem('__test', '1');
        sessionStorage.removeItem('__test');
        return sessionStorage;
      } catch {
        return null;
      }
    }
  }

  // 🔹 Cargar carrito desde storage o memoria
  private loadCart(): CartProduct[] {
    if (this.storage) {
      const data = this.storage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }
    return this.memoryFallback;
  }

  // 🔹 Guardar carrito en storage y notificar
  private saveCart(cart: CartProduct[]): void {
    if (this.storage) {
      this.storage.setItem(this.storageKey, JSON.stringify(cart));
    } else {
      this.memoryFallback = cart;
    }
    this.cartSubject.next(cart); // notificar a los observadores
  }

  // --- MÉTODOS PÚBLICOS ---

  getCart(): CartProduct[] {
    return this.cartSubject.getValue();
  }

  addProduct(product: Product): void {
    // 👈 forzamos copia inmutable para evitar mutaciones silenciosas
    const cart = [...this.getCart()];
    const matched = cart.find((c) => c.product.id === product.id);

    if (matched) {
      matched.quantity++;
    } else {
      cart.push({ product, quantity: 1 });
    }

    this.saveCart(cart); // guardar y notificar
  }

  removeProduct(productId: string): void {
    const cart = this.getCart().filter((c) => c.product.id !== productId);
    this.saveCart(cart);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getTotalItems(): number {
    return this.getCart().reduce((sum, c) => sum + c.quantity, 0);
  }

decrementQuantity(productId: string): void {
    const cart = this.getCart();
    const matched = cart.find((c) => c.product.id === productId);

    if (matched) {
      if (matched.quantity > 1) {
        matched.quantity--;
      } else {
        // si la cantidad es 1 y se decrementa, eliminamos el producto
        const updatedCart = cart.filter((c) => c.product.id !== productId);
        this.saveCart(updatedCart);
        return;
      }
      this.saveCart([...cart]);
    }
  }

  incrementQuantity(productId: string): void {
    const cart = this.getCart();
    const matched = cart.find((c) => c.product.id === productId);

    if (matched) {
      matched.quantity++;
      this.saveCart([...cart]);
    }
  }


}
