import "../../styles/client.css";
import "../../styles/productDetail.css";
import { requireClient, logout } from "../../utils/auth";
import { getProductos } from "../../utils/api";
import { addToCarrito } from "../../utils/cart";
import type { Producto } from "../../types/Producto";

requireClient();

document.getElementById("logoutBtn")?.addEventListener("click", logout);

const container = document.getElementById("detalle-container") as HTMLElement;
const params = new URLSearchParams(window.location.search);
const idProducto = Number(params.get("id"));

const render = (producto: Producto | undefined) => {
  if (!producto) {
    container.innerHTML = `
      <p>No se encontró el producto.</p>
      <a href="../client/client.html">Volver al catálogo</a>
    `;
    return;
  }

  const sinStock = producto.stock === 0;
  const noDisponible = !producto.disponible || sinStock;

  container.innerHTML = `
    <div class="detalle-producto">
      <img src="${producto.imagen}" alt="${producto.nombre}" class="detalle-imagen" />
      <div class="detalle-info">
        <h1>${producto.nombre}</h1>
        <p class="detalle-descripcion">${producto.descripcion}</p>
        <p class="detalle-precio">$${producto.precio}</p>
        <p>Stock disponible: ${producto.stock}</p>
        <span class="badge ${producto.disponible ? "disponible" : "no-disponible"}">
          ${producto.disponible ? "Disponible" : "No disponible"}
        </span>

        ${noDisponible ? `
          <p class="mensaje-error">Este producto no está disponible para la compra.</p>
        ` : `
          <div class="selector-cantidad">
            <label for="cantidad">Cantidad:</label>
            <input type="number" id="cantidad" value="1" min="1" max="${producto.stock}" />
          </div>
          <button id="btnAgregar" class="btn-agregar">Agregar al carrito</button>
          <p id="mensajeConfirmacion" class="mensaje-confirmacion" style="display:none;">
            Producto agregado al carrito.
          </p>
        `}

        <a href="../client/client.html" class="volver">&larr; Volver al catálogo</a>
      </div>
    </div>
  `;

  if (!noDisponible) {
    const inputCantidad = document.getElementById("cantidad") as HTMLInputElement;
    const btnAgregar = document.getElementById("btnAgregar") as HTMLButtonElement;
    const mensajeConfirmacion = document.getElementById("mensajeConfirmacion") as HTMLElement;

    btnAgregar.addEventListener("click", () => {
      const cantidad = Number(inputCantidad.value);

      if (!cantidad || cantidad <= 0) {
        alert("Ingresá una cantidad válida.");
        return;
      }
      if (cantidad > producto.stock) {
        alert(`Solo hay ${producto.stock} unidades disponibles.`);
        return;
      }

      addToCarrito({
        productoId: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad,
      });

      mensajeConfirmacion.style.display = "block";
    });
  }
};

const init = async () => {
  const productos = await getProductos();
  const producto = productos.find((p) => p.id === idProducto);
  render(producto);
};

init();