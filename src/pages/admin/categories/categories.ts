import "../../../styles/admin.css";
import { requireAdmin, logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";
import { getCategorias } from "../../../utils/api";
import type { Categoria } from "../../../types/Categoria";

requireAdmin();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const usuario = getUser();
const userEmailEl = document.getElementById("userEmail");
if (userEmailEl && usuario) userEmailEl.textContent = usuario.mail;

const tabla = document.getElementById("tabla-categorias") as HTMLTableSectionElement;
const modalOverlay = document.getElementById("modal-overlay") as HTMLElement;
const modalTitulo = document.getElementById("modalTitulo") as HTMLElement;
const form = document.getElementById("formCategoria") as HTMLFormElement;
const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const inputDescripcion = document.getElementById("descripcion") as HTMLTextAreaElement;

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

const render = () => {
  const activas = categorias.filter((c) => !c.eliminado);

  if (activas.length === 0) {
    tabla.innerHTML = `<tr><td colspan="4">No hay categorías activas.</td></tr>`;
    return;
  }

  tabla.innerHTML = activas.map((c) => `
    <tr>
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.descripcion}</td>
      <td>
        <button class="btn-accion btn-editar" data-id="${c.id}">Editar</button>
        <button class="btn-accion btn-eliminar" data-id="${c.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");

  tabla.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number((btn as HTMLElement).dataset.id);
      const categoria = categorias.find((c) => c.id === id);
      if (!categoria) return;

      editandoId = id;
      modalTitulo.textContent = "Editar categoría";
      inputNombre.value = categoria.nombre;
      inputDescripcion.value = categoria.descripcion;
      modalOverlay.style.display = "flex";
    });
  });

  tabla.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number((btn as HTMLElement).dataset.id);
      const categoria = categorias.find((c) => c.id === id);
      if (!categoria) return;

      if (confirm(`¿Dar de baja la categoría "${categoria.nombre}"?`)) {
        categoria.eliminado = true;
        render();
      }
    });
  });
};

document.getElementById("btnNueva")?.addEventListener("click", () => {
  editandoId = null;
  modalTitulo.textContent = "Nueva categoría";
  form.reset();
  modalOverlay.style.display = "flex";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();

  if (!nombre || !descripcion) {
    alert("Completá todos los campos.");
    return;
  }

  if (editandoId !== null) {
    const categoria = categorias.find((c) => c.id === editandoId);
    if (categoria) {
      categoria.nombre = nombre;
      categoria.descripcion = descripcion;
    }
  } else {
    const nuevoId = Math.max(0, ...categorias.map((c) => c.id)) + 1;
    categorias.push({ id: nuevoId, nombre, descripcion, eliminado: false });
  }

  cerrarModal();
  render();
});

const init = async () => {
  categorias = await getCategorias();
  render();
};

init();