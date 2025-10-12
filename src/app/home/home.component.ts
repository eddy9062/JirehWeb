import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { ProductOfferComponent } from '../shared/components/product-offer/product-offer.component';
import { Product } from '../shared/models/product';
import { ProductsService } from '../core/services/product.service';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FiltroPipe } from "../shared/components/pipes/filtro.pipe";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductOfferComponent, HomeProductComponent, RouterLink, FiltroPipe],
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

  searchTerm = '';

  ngOnInit(): void {
    this.productsService.getAll().subscribe((products) => {
      this.products = products;
      this.filteredProducts = [...this.products];
      this.productsOffers = this.products;

      // inicializar con 20
      this.visibleProducts = this.products.slice(0, this.PAGE_SIZE);

        // 👇 inicializa el observer aquí, no en ngAfterViewInit
    setTimeout(() => {
      if (this.loadMore) {
        this.initObserver();
      }
      initFlowbite();
    }, 200);
    });
  }

  ngAfterViewInit() { }

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

onSearch(event: any) {
  console.log(event.data)

  this.searchTerm = event.data;
  /*
    this.searchTerm = event.data.toLowerCase();

    this.filteredProducts = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm) ||
      p.description?.toLowerCase().includes(this.searchTerm)
    );

    this.resetVisible();
    */
  }

}
