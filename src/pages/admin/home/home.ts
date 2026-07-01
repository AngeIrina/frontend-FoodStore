import "../../../styles/admin.css";
import { requireAdmin, logout } from "../../../utils/auth";
import { productos, type Producto } from "../../../data/products";

requireAdmin();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const tbody = document.getElementById("tabla-productos") as HTMLTableSectionElement;

productos.forEach((p: Producto) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${p.id}</td>
    <td><img src="${p.imagen}" alt="${p.nombre}" width="60" height="60" style="object-fit:cover" /></td>
    <td>${p.nombre}</td>
    <td>${p.categoria}</td>
    <td>$${p.precio.toLocaleString("es-AR")}</td>
    <td>${p.stock}</td>
    <td>
      <button>Editar</button>
      <button>Eliminar</button>
    </td>
  `;
  tbody.appendChild(tr);
});

