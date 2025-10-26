export interface Cliente {
  cod_cliente: number;
  nombre: string;
  direccion: string;
  telefono: string;
  nit: string;
  usuario: string;
  password: string;
  tipo_usuario: number;
  token: string;
  pDescuento: number;
}