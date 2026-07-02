import "../../styles/client.css";
import "../../styles/cart.css";
import { requireClient, logout } from "../../utils/auth";
import { getUser } from "../../utils/localStorage";
import { getProductos } from "../../utils/api";
import { getCarrito, saveCarrito, clearCarrito } from "../../utils/cart";
import { guardarPedidoLocal } from "../../utils/pedidos";
import { ENVIO } from "../../utils/config";
import type { Producto } from "../../types/Producto";
import type { Pedido } from "../../types/Pedido";
import type { FormaPago } from "../../types/FormaPago";

requireClient();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const container = document.getElementById("carrito-container") as HTMLElement;
let productos: Producto[] = [];

const obtenerStockDisponible = (productoId: number): number => {
  return productos.find((p) => p.id === productoId)?.stock ?? 0;
};

const render = () => {
  const carrito = getCarrito();

  if (carrito.length === 0) {
    container.innerHTML = `
      <div class="carrito-vacio">
        <p>Tu carrito está vacío.</p>
        <a href="../client/client.html" class="btn-agregar">Ir a la tienda</a>
      </div>
    `;
    return;
  }

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );
  const total = subtotal + ENVIO;

  container.innerHTML = `
  <a href="../client/client.html" class="btn-secundario volver-tienda">← Seguir comprando</a>
  <div class="carrito-items">
    ${carrito
      .map(
        (item) => `
        <div class="carrito-item" data-id="${item.productoId}">
          <img src="${item.imagen}" alt="${item.nombre}" />
          <div class="carrito-item-info">
            <h3>${item.nombre}</h3>
            <p>Precio unitario: $${item.precio}</p>
            <div class="controles-cantidad">
              <button class="btn-restar">-</button>
              <span>${item.cantidad}</span>
              <button class="btn-sumar">+</button>
            </div>
            <p>Total: $${item.precio * item.cantidad}</p>
          </div>
          <button class="btn-eliminar">Eliminar</button>
        </div>
      `,
      )
      .join("")}
    </div>

    <div class="carrito-resumen">
      <p>Subtotal: $${subtotal}</p>
      <p>Envío: $${ENVIO}</p>
      <p class="resumen-total">Total: $${total}</p>
      <button id="btnVaciar" class="btn-secundario">Vaciar carrito</button>
    </div>

    <form id="formCheckout" class="checkout-form">
      <h2>Finalizar compra</h2>
      <div class="input-box">
        <label for="telefono">Teléfono:</label>
        <input type="tel" id="telefono" required />
      </div>
      <div class="input-box">
        <label for="formaPago">Forma de pago:</label>
        <select id="formaPago" required>
          <option value="">Seleccionar</option>
          <option value="TARJETA">Tarjeta</option>
          <option value="TRANSFERENCIA">Transferencia</option>
          <option value="EFECTIVO">Efectivo</option>
        </select>
      </div>
      <button type="submit" class="btn-agregar">Confirmar pedido</button>
    </form>
  `;

  container.querySelectorAll(".carrito-item").forEach((el) => {
    const id = Number((el as HTMLElement).dataset.id);
    const item = carrito.find((i) => i.productoId === id)!;

    el.querySelector(".btn-sumar")?.addEventListener("click", () => {
      const stockMax = obtenerStockDisponible(id);
      if (item.cantidad + 1 > stockMax) {
        alert(`Solo hay ${stockMax} unidades disponibles.`);
        return;
      }
      item.cantidad += 1;
      saveCarrito(carrito);
      render();
    });

    el.querySelector(".btn-restar")?.addEventListener("click", () => {
      item.cantidad -= 1;
      const actualizado =
        item.cantidad <= 0
          ? carrito.filter((i) => i.productoId !== id)
          : carrito;
      saveCarrito(actualizado);
      render();
    });

    el.querySelector(".btn-eliminar")?.addEventListener("click", () => {
      saveCarrito(carrito.filter((i) => i.productoId !== id));
      render();
    });
  });

  document.getElementById("btnVaciar")?.addEventListener("click", () => {
    if (confirm("¿Vaciar el carrito?")) {
      clearCarrito();
      render();
    }
  });

  const formCheckout = document.getElementById(
    "formCheckout",
  ) as HTMLFormElement;
  formCheckout?.addEventListener("submit", (e) => {
    e.preventDefault();

    const telefono = (
      document.getElementById("telefono") as HTMLInputElement
    ).value.trim();
    const formaPago = (
      document.getElementById("formaPago") as HTMLSelectElement
    ).value as FormaPago;

    if (!telefono || !formaPago) {
      alert("Completá teléfono y forma de pago.");
      return;
    }

    const usuario = getUser();
    if (!usuario) {
      alert("Tu sesión expiró, iniciá sesión de nuevo.");
      return;
    }

    const carritoActual = getCarrito();
    const nuevoPedido: Pedido = {
      id: Date.now(),
      fecha: new Date().toISOString().slice(0, 10),
      estado: "PENDIENTE",
      total,
      formaPago,
      detalles: carritoActual.map((item) => ({
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad,
        producto: productos.find((p) => p.id === item.productoId)!,
      })),
      usuarioDto: usuario,
    };

    guardarPedidoLocal(nuevoPedido);
    clearCarrito();

    alert("¡Pedido confirmado! Ya lo podés ver en Mis Pedidos.");
    window.location.href = "../orders/orders.html";
  });
};

const init = async () => {
  productos = await getProductos();
  render();
};

init();
