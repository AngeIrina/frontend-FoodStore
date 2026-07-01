import type { Categoria } from "../types/Categoria";
import type { Producto } from "../types/Producto";
import type { IUser } from "../types/IUser";
import type { Pedido } from "../types/Pedido";

// Capa de acceso a datos. Hoy lee JSON locales en /data/*.json; el día que
// exista la API real del backend, alcanza con cambiar la URL de cada fetch
// por el endpoint correspondiente (ej: fetch("/api/products")).

export const getCategorias = async (): Promise<Categoria[]> => {
  const res = await fetch("/data/categorias.json");
  return res.json();
};

export const getProductos = async (): Promise<Producto[]> => {
  const res = await fetch("/data/productos.json");
  return res.json();
};

export const getUsuarios = async (): Promise<IUser[]> => {
  const res = await fetch("/data/usuarios.json");
  return res.json();
};

export const getPedidos = async (): Promise<Pedido[]> => {
  const res = await fetch("/data/pedidos.json");
  return res.json();
};