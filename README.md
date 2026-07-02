# Food Store — Frontend

Trabajo Práctico Integrador - Programación III

Frontend web del sistema de gestión de pedidos de comida. Aplicación multi-página construida con **TypeScript + Vite**, sin frameworks ni router: cada pantalla es un HTML propio con su script de módulo. Los datos (categorías, productos, usuarios y pedidos) se consumen desde archivos JSON locales vía `fetch`, simulando una API. La sesión, el carrito y los pedidos generados por el cliente se persisten en `localStorage`.

Este frontend es independiente del backend Java/JPA de este mismo TP: no hay integración real entre ambos para esta entrega.

## Stack

- TypeScript
- Vite (multi-page app)
- HTML5 + CSS3 (sin frameworks)
- `fetch` + JSON locales como fuente de datos
- `localStorage` para sesión, carrito y pedidos generados por el cliente

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abrí la URL que muestra la consola (por defecto `http://localhost:5173`).

## Credenciales de prueba

Rol - Mail - Contraseña
| ADMIN | admin@admin.com | 123456 |
| USUARIO (cliente) | cliente@food.com | cliente123 |

También podés crear una cuenta nueva desde "Registrarse": siempre se crea con rol USUARIO (no persiste en el JSON, solo en memoria/localStorage de esa sesión).

## Estructura de carpetas

src/
├── types/              interfaces y tipos (Producto, Categoria, Pedido, Usuario, etc.)
├── utils/               capa de datos (api.ts), sesión (auth.ts, localStorage.ts), carrito  (cart.ts), pedidos locales (pedidos.ts), config (config.ts)
├── styles/              una hoja de estilos por sección
└── pages/
    ├── auth/            login y registro
    ├── client/          catálogo (búsqueda, filtro por categoría, orden)
    ├── productDetail/   detalle de producto y alta al carrito
    ├── cart/            carrito y checkout
    ├── orders/          "Mis pedidos" del cliente
    └── admin/           panel de administración (dashboard, categorías, productos, pedidos)

public/
├── data/                categorias.json, productos.json, usuarios.json, pedidos.json
└── assets/              logo.svg

## Funcionalidad por rol

**Cliente (USUARIO):** catálogo con búsqueda y filtro por categoría, detalle de producto, carrito persistente por usuario, checkout (forma de pago, envío), historial de "Mis pedidos" con detalle completo.

**Administrador (ADMIN):** dashboard con estadísticas generales, ABM de categorías, ABM de productos, gestión de pedidos (de todos los usuarios, con filtro por estado y cambio de estado). También puede navegar la tienda como cliente desde "Ver Tienda".

## Reglas de negocio y decisiones de diseño

- **Costo de envío**: fijo en $500 (constante `ENVIO` en `src/utils/config.ts`). No hay cálculo dinámico por distancia ni integración con un servicio de envíos real.
- **Operaciones de escritura del admin son en memoria**: alta/edición/baja de categorías y productos, y cambio de estado de pedidos, se aplican solo durante la sesión del navegador y se pierden al recargar la página. Los archivos JSON de `public/data/` no se modifican.
- **Carrito por usuario**: se guarda en `localStorage` con una clave distinta por email (`carrito_<mail>`), para que no se mezcle entre distintos usuarios logueados en el mismo navegador.
- **Pedidos generados por el cliente**: se guardan en `localStorage` (clave `pedidosCliente`) y se combinan con los del `pedidos.json` estático al mostrarlos, tanto en "Mis pedidos" como en la gestión de pedidos del admin.
- **Datos reales vs. PDF de consigna**: se siguió la estructura real de los JSON provistos por la cátedra (objetos anidados: `producto.categoria`, `pedido.usuarioDto`, `detalle.producto`) en vez de la descripción simplificada del PDF. Los estados de pedido usados son `PENDIENTE`, `EN_PREPARACION`, `ENTREGADO` y `CANCELADO` (este último agregado para que el admin pueda cancelar pedidos, no está en los JSON de ejemplo).