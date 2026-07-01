import type { Estado } from "./Estado";
import type { FormaPago } from "./FormaPago";
import type { DetallePedido } from "./DetallePedido";
import type { UsuarioSesion } from "./IUser";

export interface Pedido {
  id: number;
  fecha: string;
  estado: Estado;
  total: number;
  formaPago: FormaPago;
  detalles: DetallePedido[];
  usuarioDto: UsuarioSesion;
}