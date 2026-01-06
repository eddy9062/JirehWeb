import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { initDropdowns, initModals } from 'flowbite';
import { ProductOfferComponent } from '../shared/components/product-offer/product-offer.component';
import { Product } from '../shared/models/product';
import { ProductsService } from '../core/services/product.service';
import { HomeProductComponent } from './components/home-product/home-product.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 IMPORTANTE
import { FiltroPipe } from '../shared/components/pipes/filtro.pipe';
import { Subscription } from 'rxjs';
import { SearchService } from '../core/services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductOfferComponent,
    HomeProductComponent,
    RouterLink,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  //private readonly PAGE_SIZE = 20;

  productsService = inject(ProductsService);

  products: Product[] = [];

  filteredProducts: Product[] = []; // filtrados por search
  productsOffers: Product[] = [];
  visibleProducts: Product[] = [];
  pageSize = 24;
  visibleCount = this.pageSize;

  @ViewChild('loadMore', { static: false }) loadMore!: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;

  searchTerm: string = '';

  constructor(private searchService: SearchService) {
    this.searchService.searchTerm$
      .pipe(takeUntilDestroyed())
      .subscribe((term) => {
        this.searchTerm = term;
        this.visibleCount = this.pageSize; // clave: al buscar, reinicia el "cargar más"
        this.reobserve(); // vuelve a observar el sentinel
      });
  }

  ngOnInit(): void {
    this.productsService.getAll().subscribe((products) => {
      this.products = products;
      this.filteredProducts = [...this.products];
      this.productsOffers = this.products;

      /*console.log(this.products);
      console.log(this.visibleProducts);
      console.log(this.PAGE_SIZE);*/
      // inicializar con 20
      //this.visibleProducts = this.products.slice(0, this.PAGE_SIZE);
      this.visibleFilteredProducts;

      // 👇 inicializa el observer aquí, no en ngAfterViewInit
      setTimeout(() => {
        this.initFlowbiteComponents();
        this.reobserve(); // para volver a observar después de que aparezca el #loadMore
      }, 200);
    });
  }

  ngAfterViewInit() {
    this.createObserver();
    this.reobserve();
  }

  private createObserver() {
  this.observer?.disconnect();

  this.observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry?.isIntersecting) return;

    if (this.visibleFilteredProducts.length >= this.filterProducts.length) return;

    this.visibleCount += this.pageSize;
    this.reobserve(); // importante: seguir observando el sentinel
  }, { root: null, threshold: 0.1 });
}

  private reobserve() {
    // espera a que Angular pinte el #loadMore cuando el *ngIf sea true
    queueMicrotask(() => {
      if (!this.observer) return;
      if (!this.loadMore?.nativeElement) return;

      this.observer.disconnect();
      this.observer.observe(this.loadMore.nativeElement);
    });
  }

  get filterProducts() {
    const t = (this.searchTerm ?? '').trim().toLowerCase();
    if (!t) return this.products;

    return this.products.filter((p) => {
      const name = (p?.name ?? '').toString().toLowerCase();
      const desc = (p?.description ?? '').toString().toLowerCase();
      return name.includes(t) || desc.includes(t);
    });
  }

  get visibleFilteredProducts() {
    return this.filterProducts.slice(0, this.visibleCount);
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
    this.visibleProducts = this.filterProducts.slice(0, this.visibleCount);
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
