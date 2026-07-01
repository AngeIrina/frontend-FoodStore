import "../../styles/client.css";
import { requireClient, logout } from "../../utils/auth";
import { productos, categorias } from "../../data/products";

requireClient();

const logoutBtn = document.getElementById("logoutBtn");
const listaCategorias = document.getElementById("lista-categorias");
const contenedorProductos = document.getElementById("contenedor-productos");

const renderProductos = (listaAMostrar: typeof productos) => {
  if (!contenedorProductos) return;

  if (listaAMostrar.length === 0) {
    contenedorProductos.innerHTML = `<p>No se encontraron productos.</p>`;
    return;
  }

  contenedorProductos.innerHTML = listaAMostrar.map(p => `
    <article class="producto">
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>${p.descripcion}</p>
      <p class="precio">$${p.precio}</p>
      <button class="btn-agregar" data-nombre="${p.nombre}">
        Agregar
      </button>
    </article>
  `).join("");
};

// Render de categorías
if (listaCategorias) {
  listaCategorias.innerHTML = categorias.map(cat => `
    <li>
      <a href="#" data-categoria="${cat}">${cat}</a>
    </li>
  `).join("");

  // Filtro 
  listaCategorias.addEventListener("click", (e) => {
    e.preventDefault();

    const link = (e.target as HTMLElement).closest("a");
    if (!link) return;

    const seleccionada = link.dataset.categoria;

    // marcar activa
    document.querySelectorAll("#lista-categorias a").forEach(a => {
      a.classList.remove("active");
    });
    link.classList.add("active");

    // filtrar
    const filtrados = productos.filter(
      p => p.categoria.toLowerCase() === seleccionada?.toLowerCase()
    );
    renderProductos(filtrados);
  });
}

contenedorProductos?.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.classList.contains("btn-agregar")) {
    const nombre = target.dataset.nombre;
    console.log(`Producto seleccionado: ${nombre}`);
  }
});

logoutBtn?.addEventListener("click", logout);

renderProductos(productos);