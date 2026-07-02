import "../../styles/client.css";
import "../../styles/orders.css";
import { requireClient, logout } from "../../utils/auth";
import { getUser } from "../../utils/localStorage";
import { getPedidos } from "../../utils/api";
import { getPedidosLocales } from "../../utils/pedidos";
import type { Pedido } from "../../types/Pedido";
import type { Estado } from "../../types/Estado";

requireClient();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const container = document.getElementById("pedidos-container") as HTMLElement;
const modalOverlay = document.getElementById("modal-overlay") as HTMLElement;
const modalContenido = document.getElementById("modal-contenido") as HTMLElement;

document.getElementById("cerrarModal")?.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.style.display = "none";
});

const coloresEstado: Record<Estado, string> = {
  PENDIENTE: "estado-pendiente",
  EN_PREPARACION: "estado-en-preparacion",
  ENTREGADO: "estado-entregado",
  CANCELADO: "estado-cancelado",
};

const etiquetasEstado: Record<Estado, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const renderPedidos = (pedidos: Pedido[]) => {
  if (pedidos.length === 0) {
    container.innerHTML = `
      <div class="pedidos-vacio">
        <p>Todavía no hiciste ningún pedido.</p>
        <a href="../client/client.html" class="btn-agregar">Ir a la tienda</a>
      </div>
    `;
    return;
  }

  const volverLink = `<a href="../client/client.html" class="btn-secundario volver-tienda">← Volver a la tienda</a>`;
  const ordenados = [...pedidos].sort((a, b) => b.fecha.localeCompare(a.fecha));

  const cards = ordenados.map((p) => {
    const primeros = p.detalles.slice(0, 3).map((d) => `${d.cantidad}x ${d.producto.nombre}`).join(", ");
    const resto = p.detalles.length > 3 ? ` y ${p.detalles.length - 3} más` : "";

    return `
      <article class="pedido-card" data-id="${p.id}">
        <div class="pedido-card-header">
          <span>Pedido #${p.id}</span>
          <span class="badge-estado ${coloresEstado[p.estado]}">${etiquetasEstado[p.estado]}</span>
        </div>
        <p>Fecha: ${p.fecha}</p>
        <p>${primeros}${resto}</p>
        <p class="pedido-total">Total: $${p.total}</p>
        <p class="ver-detalle">Ver detalle</p>
      </article>
    `;
  }).join("");

  container.innerHTML = volverLink + `<div class="pedidos-lista">${cards}</div>`;

  container.querySelectorAll(".pedido-card").forEach((el) => {
    el.addEventListener("click", () => {
      const id = Number((el as HTMLElement).dataset.id);
      const pedido = pedidos.find((p) => p.id === id);
      if (pedido) mostrarModal(pedido);
    });
  });
};

const mostrarModal = (pedido: Pedido) => {
  const subtotal = pedido.detalles.reduce((acc, d) => acc + d.subtotal, 0);
  const envio = pedido.total - subtotal;

  modalContenido.innerHTML = `
    <h2>Pedido #${pedido.id}</h2>
    <span class="badge-estado ${coloresEstado[pedido.estado]}">${etiquetasEstado[pedido.estado]}</span>
    <p>Fecha: ${pedido.fecha}</p>
    <p>Forma de pago: ${pedido.formaPago}</p>
    <h3>Productos</h3>
    <ul class="modal-detalle-lista">
      ${pedido.detalles.map((d) => `<li>${d.cantidad} x ${d.producto.nombre} — $${d.subtotal}</li>`).join("")}
    </ul>
    <div class="modal-costos">
      <p>Subtotal: $${subtotal}</p>
      <p>Envío: $${envio}</p>
      <p class="resumen-total">Total: $${pedido.total}</p>
    </div>
  `;

  modalOverlay.style.display = "flex";
};

const init = async () => {
  const usuario = getUser();
  if (!usuario) return;

  const pedidosJson = await getPedidos();
  const pedidosLocales = getPedidosLocales();

  const pedidosDelUsuario = [
    ...pedidosJson.filter((p) => p.usuarioDto.mail === usuario.mail),
    ...pedidosLocales.filter((p) => p.usuarioDto.mail === usuario.mail),
  ];

  renderPedidos(pedidosDelUsuario);
};

init();