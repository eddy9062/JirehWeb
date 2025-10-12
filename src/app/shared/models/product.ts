export interface Product {
  id: string;
  name: string;
  precio: number;
  description: string;
  reviews: number;
  previousPrice: number | null;
  urlImg: string;
}
