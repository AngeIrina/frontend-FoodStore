import type { Categoria } from "./Categoria";

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  categoria: Categoria;
  eliminado?: boolean;
}