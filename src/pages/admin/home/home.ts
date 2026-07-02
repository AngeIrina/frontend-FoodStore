import "../../../styles/admin.css";
import { requireAdmin, logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";
import { getCategorias, getProductos, getPedidos } from "../../../utils/api";
import { getPedidosLocales } from "../../../utils/pedidos";
import type { Estado } from "../../../types/Estado";

requireAdmin();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const usuario = getUser();
const userEmailEl = document.getElementById("userEmail");
if (userEmailEl && usuario) {
  userEmailEl.textContent = usuario.mail;
}

const statsContainer = document.getElementById("stats-container") as HTMLElement;
const pedidosEstadoContainer = document.getElementById("pedidos-estado-container") as HTMLElement;

const claseEstado: Record<Estado, string> = {
  PENDIENTE: "estado-pendiente",
  EN_PREPARACION: "estado-en-preparacion",
  ENTREGADO: "estado-entregado",
  CANCELADO: "estado-cancelado",
};

const etiquetaEstado: Record<Estado, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const init = async () => {
  const [categorias, productos, pedidosJson] = await Promise.all([
    getCategorias(),
    getProductos(),
    getPedidos(),
  ]);
  const pedidos = [...pedidosJson, ...getPedidosLocales()];

  const categoriasActivas = categorias.filter((c) => !c.eliminado);
  const productosActivos = productos.filter((p) => !p.eliminado);
  const productosDisponibles = productosActivos.filter((p) => p.disponible);
  const productosNoDisponibles = productosActivos.filter((p) => !p.disponible);

  statsContainer.innerHTML = `
    <div class="stat-card">
      <span class="stat-numero">${categoriasActivas.length}</span>
      <span class="stat-label">Categorías activas</span>
    </div>
    <div class="stat-card">
      <span class="stat-numero">${productosActivos.length}</span>
      <span class="stat-label">Productos activos</span>
    </div>
    <div class="stat-card">
      <span class="stat-numero">${productosDisponibles.length}</span>
      <span class="stat-label">Productos disponibles</span>
    </div>
    <div class="stat-card">
      <span class="stat-numero">${productosNoDisponibles.length}</span>
      <span class="stat-label">Productos no disponibles</span>
    </div>
    <div class="stat-card">
      <span class="stat-numero">${pedidos.length}</span>
      <span class="stat-label">Pedidos totales</span>
    </div>
  `;

  const pedidosPorEstado: Partial<Record<Estado, number>> = {};
  pedidos.forEach((p) => {
    pedidosPorEstado[p.estado] = (pedidosPorEstado[p.estado] ?? 0) + 1;
  });

  const estados: Estado[] = ["PENDIENTE", "EN_PREPARACION", "ENTREGADO", "CANCELADO"];

  pedidosEstadoContainer.innerHTML = `
    <h3>Pedidos por estado</h3>
    <div class="pedidos-estado-lista">
      ${
        pedidos.length === 0
          ? `<p>Todavía no hay pedidos cargados.</p>`
          : estados
              .filter((e) => pedidosPorEstado[e])
              .map(
                (e) => `<span class="badge-estado ${claseEstado[e]}">${etiquetaEstado[e]}: ${pedidosPorEstado[e]}</span>`
              )
              .join("")
      }
    </div>
  `;
};

init();