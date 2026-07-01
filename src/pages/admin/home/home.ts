import "../../../styles/admin.css";
import { requireAdmin, logout } from "../../../utils/auth";
import { getProductos } from "../../../utils/api";
import type { Producto } from "../../../types/Producto";

requireAdmin();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const tbody = document.getElementById("tabla-productos") as HTMLTableSectionElement;

const render = (productos: Producto[]) => {
  tbody.innerHTML = productos.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td><img src="${p.imagen}" alt="${p.nombre}" width="60" height="60" style="object-fit:cover" /></td>
      <td>${p.nombre}</td>
      <td>${p.categoria.nombre}</td>
      <td>$${p.precio.toLocaleString("es-AR")}</td>
      <td>${p.stock}</td>
      <td>
        <button>Editar</button>
        <button>Eliminar</button>
      </td>
    </tr>
  `).join("");
};

getProductos().then(render);