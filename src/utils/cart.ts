import { getUser } from "./localStorage";

export interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

const claveCarrito = (): string => {
  const usuario = getUser();
  return usuario ? `carrito_${usuario.mail}` : "carrito_invitado";
};

export const getCarrito = (): ItemCarrito[] => {
  const data = localStorage.getItem(claveCarrito());
  return data ? JSON.parse(data) : [];
};

export const saveCarrito = (items: ItemCarrito[]): void => {
  localStorage.setItem(claveCarrito(), JSON.stringify(items));
};

export const addToCarrito = (item: ItemCarrito): void => {
  const carrito = getCarrito();
  const existente = carrito.find((i) => i.productoId === item.productoId);
  if (existente) {
    existente.cantidad += item.cantidad;
  } else {
    carrito.push(item);
  }
  saveCarrito(carrito);
};

export const clearCarrito = (): void => {
  localStorage.removeItem(claveCarrito());
};

