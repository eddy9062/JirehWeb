export interface Product {
  id: string;
  name: string;
  cod_articulo: string;
  cod_det_articulo: number;
  precio_venta: number;
  description: string;
  reviews: number;
  previousPrice: number | null;
  urlImg: string;
}
