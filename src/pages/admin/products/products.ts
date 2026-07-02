import "../../../styles/admin.css";
import { requireAdmin, logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";
import { getProductos, getCategorias } from "../../../utils/api";
import type { Producto } from "../../../types/Producto";
import type { Categoria } from "../../../types/Categoria";

requireAdmin();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const usuario = getUser();
const userEmailEl = document.getElementById("userEmail");
if (userEmailEl && usuario) userEmailEl.textContent = usuario.mail;

const tabla = document.getElementById("tabla-productos") as HTMLTableSectionElement;
const modalOverlay = document.getElementById("modal-overlay") as HTMLElement;
const modalTitulo = document.getElementById("modalTitulo") as HTMLElement;
const form = document.getElementById("formProducto") as HTMLFormElement;
const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputDescripcion = document.getElementById("descripcion") as HTMLTextAreaElement;
const inputPrecio = document.getElementById("precio") as HTMLInputElement;
const inputStock = document.getElementById("stock") as HTMLInputElement;
const selectCategoria = document.getElementById("categoria") as HTMLSelectElement;
const inputImagen = document.getElementById("imagen") as HTMLInputElement;
const selectDisponible = document.getElementById("disponible") as HTMLSelectElement;

let productos: Producto[] = [];
let categorias: Categoria[] = [];
let editandoId: number | null = null;

const cerrarModal = () => {
  modalOverlay.style.display = "none";
  form.reset();
  editandoId = null;
};

document.getElementById("cerrarModal")?.addEventListener("click", cerrarModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) cerrarModal();
});

const cargarSelectCategorias = () => {
  const activas = categorias.filter((c) => !c.eliminado);
  selectCategoria.innerHTML = activas.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("");
};

const render = () => {
  const activos = productos.filter((p) => !p.eliminado);

  if (activos.length === 0) {
    tabla.innerHTML = `<tr><td colspan="8">No hay productos activos.</td></tr>`;
    return;
  }

  tabla.innerHTML = activos.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td><img src="${p.imagen}" alt="${p.nombre}" /></td>
      <td>${p.nombre}</td>
      <td>${p.categoria.nombre}</td>
      <td>$${p.precio.toLocaleString("es-AR")}</td>
      <td>${p.stock}</td>
      <td><span class="badge ${p.disponible ? "disponible" : "no-disponible"}">${p.disponible ? "Disponible" : "No disponible"}</span></td>
      <td>
        <button class="btn-accion btn-editar" data-id="${p.id}">Editar</button>
        <button class="btn-accion btn-eliminar" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");

  tabla.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number((btn as HTMLElement).dataset.id);
      const producto = productos.find((p) => p.id === id);
      if (!producto) return;

      editandoId = id;
      modalTitulo.textContent = "Editar producto";
      inputNombre.value = producto.nombre;
      inputDescripcion.value = producto.descripcion;
      inputPrecio.value = String(producto.precio);
      inputStock.value = String(producto.stock);
      cargarSelectCategorias();
      selectCategoria.value = String(producto.categoria.id);
      inputImagen.value = producto.imagen;
      selectDisponible.value = String(producto.disponible);
      modalOverlay.style.display = "flex";
    });
  });

  tabla.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number((btn as HTMLElement).dataset.id);
      const producto = productos.find((p) => p.id === id);
      if (!producto) return;

      if (confirm(`¿Dar de baja el producto "${producto.nombre}"?`)) {
        producto.eliminado = true;
        render();
      }
    });
  });
};

document.getElementById("btnNuevo")?.addEventListener("click", () => {
  editandoId = null;
  modalTitulo.textContent = "Nuevo producto";
  form.reset();
  cargarSelectCategorias();
  modalOverlay.style.display = "flex";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const precio = Number(inputPrecio.value);
  const stock = Number(inputStock.value);
  const categoriaId = Number(selectCategoria.value);
  const imagen = inputImagen.value.trim();
  const disponible = selectDisponible.value === "true";

  if (!nombre || !descripcion) {
    alert("Completá nombre y descripción.");
    return;
  }
  if (!precio || precio <= 0) {
    alert("El precio debe ser mayor a 0.");
    return;
  }
  if (stock < 0 || Number.isNaN(stock)) {
    alert("El stock no puede ser negativo.");
    return;
  }
  const categoria = categorias.find((c) => c.id === categoriaId);
  if (!categoria) {
    alert("Seleccioná una categoría válida.");
    return;
  }

  if (editandoId !== null) {
    const producto = productos.find((p) => p.id === editandoId);
    if (producto) {
      producto.nombre = nombre;
      producto.descripcion = descripcion;
      producto.precio = precio;
      producto.stock = stock;
      producto.categoria = categoria;
      producto.imagen = imagen;
      producto.disponible = disponible;
    }
  } else {
    const nuevoId = Math.max(0, ...productos.map((p) => p.id)) + 1;
    productos.push({
      id: nuevoId,
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
      imagen,
      disponible,
      eliminado: false,
    });
  }

  cerrarModal();
  render();
});

const init = async () => {
  [productos, categorias] = await Promise.all([getProductos(), getCategorias()]);
  render();
};

init();