import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Página del cliente (raíz)
        main: resolve(__dirname, "index.html"),
        // Login
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        // Registro
        register: resolve(__dirname, "src/pages/auth/register/register.html"),
        // Tienda del cliente
        client: resolve(__dirname, "src/pages/client/client.html"),
        // Detalle de producto
        productDetail: resolve(__dirname, "src/pages/productDetail/productDetail.html"),
        // Carrito
        cart: resolve(__dirname, "src/pages/cart/cart.html"),
        // Mis pedidos (cliente)
        orders: resolve(__dirname, "src/pages/orders/orders.html"),
        // Panel de administración
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        adminCategories: resolve(__dirname, "src/pages/admin/categories/categories.html"),
        adminProducts: resolve(__dirname, "src/pages/admin/products/products.html"),
        adminOrders: resolve(__dirname, "src/pages/admin/orders/orders.html"),
      },
    },
  },
});