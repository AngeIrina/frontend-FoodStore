export interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

const CART_KEY = "carrito";

export const getCarrito = (): ItemCarrito[] => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCarrito = (items: ItemCarrito[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
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
  localStorage.removeItem(CART_KEY);
};