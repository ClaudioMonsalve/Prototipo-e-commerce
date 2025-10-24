# 🛒 Prototipo E-commerce con React + Vite

Este proyecto es un **prototipo de e-commerce** desarrollado con **React** y **Vite**, pensado para gestionar productos, usuarios y ventas a nivel básico.  
Está diseñado como ejemplo educativo o base para desarrollos más completos.

---

## ⚛️ Stack Tecnológico

- **React 18**: Interfaz de usuario basada en componentes.  
- **Vite**: Bundler rápido con Hot Module Replacement (HMR).  
- **CSS Modules / CSS simple**: Estilos por componente.  
- **localStorage**: Simula base de datos (no se usa backend).  
- **ESLint**: Reglas básicas para mantener código limpio.

---

<details> <summary>📂 Estructura de carpetas</summary>

public/                  # Archivos estáticos
src/
  components/           # Componentes reutilizables
    Navbar.jsx          # Barra de navegación
    CardProduct.jsx     # Tarjeta de producto
  pages/                # Páginas principales
    Home.jsx            # Página de inicio
    Login.jsx           # Iniciar sesión
    Registro.jsx        # Registro de usuarios
    TiendaVendedor.jsx  # Ver productos de un vendedor
    Inventario.jsx      # Gestión de inventario del vendedor
    CarritoPage.jsx     # Carrito de compras del cliente
  App.jsx               # Componente principal (rutas)
  main.jsx              # Punto de entrada de la app
index.html
package.json
vite.config.js
.eslintrc.js
</details>
---

## 🧩 Componentes Principales

### `Navbar.jsx`
- Barra de navegación principal.  
- Acceso a Inicio, Tienda, Inventario, Carrito y Login/Registro según usuario.

### `CardProduct.jsx`
- Tarjeta de producto reutilizable con **nombre, precio, imagen y cantidad**.  
- Usada en la tienda y la Tienda del Vendedor.

### `Home.jsx`
- Página de inicio del e-commerce.  
- Muestra productos destacados o información general.

### `Login.jsx`
- Inicia sesión como cliente o vendedor.  
- Guarda información en **localStorage** (`usuarioActual`).

### `Registro.jsx`
- Registro de nuevos usuarios y vendedores.  
- Datos guardados en **localStorage**.

### `TiendaVendedor.jsx`
- Muestra productos de un **vendedor específico**.  
- Solo lectura: no permite editar/eliminar.

### `Inventario.jsx`
- Página para **vendedores**:  
  - Ver productos actuales.  
  - Agregar nuevos productos (nombre, cantidad, precio).  
  - Eliminar productos existentes.  
- Datos guardados en **localStorage** (`productos`) filtrados por `vendedorId`.

### `CarritoPage.jsx`
- Carrito de compras para clientes:  
  - Ver productos agregados.  
  - Ajustar cantidades y calcular total.  
  - Persistencia con **localStorage**.

### `App.jsx`
- Contiene las **rutas de la aplicación** y determina qué página mostrar según estado del usuario.

### `main.jsx`
- Punto de entrada que monta `App` en el DOM de `index.html`.

---

## 💾 Almacenamiento de datos

- `localStorage` simula base de datos:  
  - `usuarioActual`: usuario conectado.  
  - `productos`: productos de todos los vendedores.  
  - `carrito`: productos seleccionados por clientes.

---

## 🚀 Scripts disponibles

| Script             | Descripción                                         |
|-------------------|---------------------------------------------------|
| `npm run dev`      | Inicia servidor de desarrollo con HMR             |
| `npm run build`    | Genera build optimizada para producción           |
| `npm run preview`  | Sirve build de producción localmente             |
| `npm run lint`     | Ejecuta ESLint para revisar errores              |

---

## 🎨 Estilos y diseño

- CSS por componente o CSS global.  
- Diseño **minimalista y responsivo** usando React y CSS.  
- No se usan frameworks externos de UI.

---

## 🔧 Personalización y extensibilidad

- **Agregar TypeScript**: renombrar `.jsx` a `.tsx` y configurar `tsconfig.json`.  
- **React Compiler**: usar `@vitejs/plugin-react-swc` para optimizar HMR.  
- **UI avanzada**: integrar Material UI, Chakra UI u otras librerías.  
- **Migrar a backend real**: reemplazar `localStorage` con Firebase, Supabase o servidor propio.

---

## 📚 Recursos útiles

- [React](https://reactjs.org/docs/getting-started.html)  
- [Vite](https://vitejs.dev/)  
- [ESLint](https://eslint.org/docs/latest/)  

---

## 📝 Resumen

Este prototipo permite:

- Gestión de productos para vendedores (`Inventario.jsx`)  
- Visualización de productos por vendedor (`TiendaVendedor.jsx`)  
- Carrito de compras para clientes (`CarritoPage.jsx`)  
- Persistencia de datos mediante `localStorage`  

> Base ideal para proyectos educativos, aprendizaje de **React + Vite** y manejo de estado/rutas.

