import "../../../styles/admin.css";
import "../../../styles/orders.css";
import { requireAdmin, logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";
import { getPedidos } from "../../../utils/api";
import { getPedidosLocales } from "../../../utils/pedidos";
import type { Pedido } from "../../../types/Pedido";
import type { Estado } from "../../../types/Estado";

requireAdmin();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const usuario = getUser();
const userEmailEl = document.getElementById("userEmail");
if (userEmailEl && usuario) userEmailEl.textContent = usuario.mail;

const container = document.getElementById("pedidos-container") as HTMLElement;
const filtroEstado = document.getElementById("filtroEstado") as HTMLSelectElement;
const modalOverlay = document.getElementById("modal-overlay") as HTMLElement;
const modalContenido = document.getElementById("modal-contenido") as HTMLElement;

document.getElementById("cerrarModal")?.addEventListener("click", () => {
  modalOverlay.style.display = "none";
});
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.style.display = "none";
});

let pedidos: Pedido[] = [];

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

const render = () => {
  const filtro = filtroEstado.value as Estado | "";
  let lista = filtro ? pedidos.filter((p) => p.estado === filtro) : pedidos;
  lista = [...lista].sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (lista.length === 0) {
    container.innerHTML = `<p>No hay pedidos con ese filtro.</p>`;
    return;
  }

  container.innerHTML = `<div class="pedidos-lista">${lista.map((p) => `
    <article class="pedido-card" data-id="${p.id}">
      <div class="pedido-card-header">
        <span>Pedido #${p.id}</span>
        <span class="badge-estado ${coloresEstado[p.estado]}">${etiquetasEstado[p.estado]}</span>
      </div>
      <p>Cliente: ${p.usuarioDto.nombre} ${p.usuarioDto.apellido}</p>
      <p>Fecha: ${p.fecha}</p>
      <p>${p.detalles.length} producto(s)</p>
      <p class="pedido-total">Total: $${p.total}</p>
    </article>
  `).join("")}</div>`;

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
    <p>Cliente: ${pedido.usuarioDto.nombre} ${pedido.usuarioDto.apellido} (${pedido.usuarioDto.mail})</p>
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

    <div class="input-box">
      <label for="cambiarEstado">Cambiar estado:</label>
      <select id="cambiarEstado">
        <option value="PENDIENTE" ${pedido.estado === "PENDIENTE" ? "selected" : ""}>Pendiente</option>
        <option value="EN_PREPARACION" ${pedido.estado === "EN_PREPARACION" ? "selected" : ""}>En preparación</option>
        <option value="ENTREGADO" ${pedido.estado === "ENTREGADO" ? "selected" : ""}>Entregado</option>
        <option value="CANCELADO" ${pedido.estado === "CANCELADO" ? "selected" : ""}>Cancelado</option>
      </select>
    </div>
    <button id="btnGuardarEstado" class="btn-nuevo">Guardar estado</button>
  `;

  document.getElementById("btnGuardarEstado")?.addEventListener("click", () => {
    const nuevoEstado = (document.getElementById("cambiarEstado") as HTMLSelectElement).value as Estado;
    pedido.estado = nuevoEstado;
    modalOverlay.style.display = "none";
    render();
  });

  modalOverlay.style.display = "flex";
};

filtroEstado.addEventListener("change", render);

const init = async () => {
  const pedidosJson = await getPedidos();
  const pedidosLocales = getPedidosLocales();
  pedidos = [...pedidosJson, ...pedidosLocales];
  render();
};

init();