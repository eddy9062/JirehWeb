import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import {  initDropdowns, initModals } from 'flowbite';
import { ProductOfferComponent } from '../shared/components/product-offer/product-offer.component';
import { Product } from '../shared/models/product';
import { ProductsService } from '../core/services/product.service';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 IMPORTANTE
import { FiltroPipe } from "../shared/components/pipes/filtro.pipe";
import { Subscription } from 'rxjs';
import { SearchService } from '../core/services/search.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductOfferComponent, HomeProductComponent, RouterLink, FiltroPipe],
  templateUrl: './home.component.html',
})


export class HomeComponent implements OnInit {
  private readonly PAGE_SIZE = 20;

  productsService = inject(ProductsService);

  products: Product[] = [];
  filteredProducts: Product[] = [];   // filtrados por search
  productsOffers: Product[] = [];
  visibleProducts: Product[] = [];

  private observer?: IntersectionObserver;

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef;

  searchTerm: string = '';
  private searchSub!: Subscription;

constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.productsService.getAll().subscribe((products) => {
      this.products = products;
      this.filteredProducts = [...this.products];
      this.productsOffers = this.products;

      //console.log(this.products)
      // inicializar con 20
      this.visibleProducts = this.products.slice(0, this.PAGE_SIZE);

        // 👇 inicializa el observer aquí, no en ngAfterViewInit
    setTimeout(() => {
  if (this.loadMore) {
    this.initObserver();
  }
  this.initFlowbiteComponents();
}, 200);

    });

    this.searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }

private initFlowbiteComponents() {
  try {
    // Inicializa solo lo necesario
    initDropdowns();
    initModals();
  } catch (err) {
    console.warn('Error al inicializar Flowbite:', err);
  }
}

private resetVisible() {
    this.visibleProducts = this.filteredProducts.slice(0, this.PAGE_SIZE);
    this.observer?.disconnect(); // reinicia el observer
    if (this.loadMore) this.initObserver();
  }

  private initObserver() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadMoreProducts();
      }
    });

    this.observer.observe(this.loadMore.nativeElement);
  }

  loadMoreProducts() {
  const currentLength = this.visibleProducts.length;
  const next = this.products.slice(currentLength, currentLength + 20);
  this.visibleProducts = [...this.visibleProducts, ...next];

  // 👇 Si ya cargamos todos los productos, desconectamos el observer
    if (this.visibleProducts.length >= this.products.length) {
      this.observer?.disconnect();
    }
}

trackById(index: number, item: Product) {
  return item.id ?? index;
}

}
