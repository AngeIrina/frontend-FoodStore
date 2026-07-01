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
        // Panel de administración
        adminHome: resolve(__dirname, "src/pages/admin/home/home.html"),
        // Tienda del cliente
        client: resolve(__dirname, "src/pages/client/client.html"),
      },
    },
  },
});
