export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  categoria: string;
}

export const categorias: string[] = [
  "Hamburguesas",
  "Pizzas",
  "Papas Fritas",
  "Bebidas",
  "Panchos",
];

export const productos: Producto[] = [
    {
    id: 1,
    nombre: "Hamburguesa triple",
    descripcion: "Triple carne, cheddar y bacon",
    precio: 12000,
    stock: 10,
    imagen: "/assets/hamburguesa-triple.jpg",
    categoria: "Hamburguesas"
  },
  {
    id: 2,
    nombre: "Pizza Muzzarella",
    descripcion: "Salsa casera, orégano y mucho queso",
    precio: 15000,
    stock: 5,
    imagen: "/assets/pizza-muzzarella.jpg",
    categoria: "Pizzas"
  },
  {
    id: 3,
    nombre: "Papas Fritas",
    descripcion: "Super crujientes y doradas",
    precio: 8000,
    stock: 20,
    imagen: "/assets/papas-fritas.jpg",
    categoria: "Papas Fritas"
  },
  {
    id: 4,
    nombre: "Cola Cola 500ml",
    descripcion: "Bebida gaseosa clásica",
    precio: 4000,
    stock: 15,
    imagen: "/assets/bebida-cola.jpg",
    categoria: "Bebidas"
  },
  {
    id: 5,
    nombre: "Pancho Clásico",
    descripcion: "Salchicha, pan y aderezos",
    precio: 2500,
    stock: 10,
    imagen: "/assets/pancho-clasico.jpg",
    categoria: "Panchos"
  },
  {
    id: 6,
    nombre: "Pancho Completo",
    descripcion: "Salchicha, pan, papas pay y salsas",
    precio: 2900,
    stock: 8,
    imagen: "/assets/pancho-completo.jpg",
    categoria: "Panchos"
  }
];