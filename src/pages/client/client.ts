import "../../styles/client.css";
import { requireClient, logout } from "../../utils/auth";
import { getCategorias, getProductos } from "../../utils/api";
import type { Producto } from "../../types/Producto";
import type { Categoria } from "../../types/Categoria";
import { getUser } from "../../utils/localStorage";

requireClient();

const usuarioActual = getUser();
const linkPanelAdmin = document.getElementById("linkPanelAdmin");
if (linkPanelAdmin && usuarioActual?.rol === "ADMIN") {
  linkPanelAdmin.style.display = "inline";
}

const logoutBtn = document.getElementById("logoutBtn");
const listaCategorias = document.getElementById("lista-categorias");
const contenedorProductos = document.getElementById("contenedor-productos");
const inputBuscar = document.getElementById("buscar") as HTMLInputElement;
const formBusqueda = document.getElementById(
  "form-busqueda",
) as HTMLFormElement;
const selectOrden = document.getElementById(
  "orden",
) as HTMLSelectElement | null;

let productos: Producto[] = [];
let categoriaSeleccionada: string | null = null;

const renderProductos = (lista: Producto[]) => {
  if (!contenedorProductos) return;

  if (lista.length === 0) {
    contenedorProductos.innerHTML = `<p>No se encontraron productos.</p>`;
    return;
  }

  contenedorProductos.innerHTML = lista
    .map(
      (p) => `
    <article class="producto" data-id="${p.id}">
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <p class="precio">$${p.precio}</p>
      <span class="badge ${p.disponible ? "disponible" : "no-disponible"}">
        ${p.disponible ? "Disponible" : "No disponible"}
      </span>
    </article>
  `,
    )
    .join("");
};

const aplicarFiltros = () => {
  let resultado = productos.filter((p) => p.disponible && !p.eliminado);

  if (categoriaSeleccionada) {
    resultado = resultado.filter(
      (p) =>
        p.categoria.nombre.toLowerCase() ===
        categoriaSeleccionada?.toLowerCase(),
    );
  }

  const texto = inputBuscar?.value.trim().toLowerCase() ?? "";
  if (texto) {
    resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(texto));
  }

  const orden = selectOrden?.value ?? "";
  if (orden === "nombre-asc") {
    resultado = [...resultado].sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (orden === "nombre-desc") {
    resultado = [...resultado].sort((a, b) => b.nombre.localeCompare(a.nombre));
  } else if (orden === "precio-asc") {
    resultado = [...resultado].sort((a, b) => a.precio - b.precio);
  } else if (orden === "precio-desc") {
    resultado = [...resultado].sort((a, b) => b.precio - a.precio);
  }

  renderProductos(resultado);
};

const init = async () => {
  const [categorias, productosFetch] = await Promise.all([
    getCategorias(),
    getProductos(),
  ]);
  productos = productosFetch;

  if (listaCategorias) {
    listaCategorias.innerHTML = categorias
      .map(
        (c: Categoria) => `
      <li><a href="#" data-categoria="${c.nombre}">${c.nombre}</a></li>
    `,
      )
      .join("");

    listaCategorias.addEventListener("click", (e) => {
      e.preventDefault();
      const link = (e.target as HTMLElement).closest("a") as HTMLElement | null;
      if (!link) return;

      document
        .querySelectorAll("#lista-categorias a")
        .forEach((a) => a.classList.remove("active"));

      const cat = link.dataset.categoria ?? null;
      if (categoriaSeleccionada === cat) {
        categoriaSeleccionada = null;
      } else {
        categoriaSeleccionada = cat;
        link.classList.add("active");
      }
      if (inputBuscar) inputBuscar.value = ""; // limpia la búsqueda al cambiar de categoría
      aplicarFiltros();
    });
  }

  aplicarFiltros();
};

init();

contenedorProductos?.addEventListener("click", (e) => {
  const card = (e.target as HTMLElement).closest(
    ".producto",
  ) as HTMLElement | null;
  if (!card) return;
  window.location.href = `../productDetail/productDetail.html?id=${card.dataset.id}`;
});

inputBuscar?.addEventListener("input", aplicarFiltros);
formBusqueda?.addEventListener("submit", (e) => e.preventDefault());
selectOrden?.addEventListener("change", aplicarFiltros);
logoutBtn?.addEventListener("click", logout);
