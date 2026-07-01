import type { Producto } from "./Producto";

export interface DetallePedido {
  cantidad: number;
  subtotal: number;
  producto: Producto;
}