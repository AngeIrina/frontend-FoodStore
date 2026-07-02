import type { Pedido } from "../types/Pedido";

const PEDIDOS_KEY = "pedidosCliente";

export const getPedidosLocales = (): Pedido[] => {
  const data = localStorage.getItem(PEDIDOS_KEY);
  return data ? JSON.parse(data) : [];
};

export const guardarPedidoLocal = (pedido: Pedido): void => {
  const pedidos = getPedidosLocales();
  pedidos.push(pedido);
  localStorage.setItem(PEDIDOS_KEY, JSON.stringify(pedidos));
};