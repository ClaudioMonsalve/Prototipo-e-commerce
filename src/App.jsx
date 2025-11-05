import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import CarritoPage from "./pages/CarritoPage";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import TiendaVendedor from "./pages/TiendaVendedor";
import Inventario from "./pages/Inventario";

// 🛒 Contexto del carrito
export const CartContext = createContext({
  addToCart: () => {},
  cartCount: 0,
  setCartCount: () => {},
});

function App() {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuarioActual"))
  );

  // ✅ Cargar productos de ejemplo si no existen
  useEffect(() => {
    const existentes = JSON.parse(localStorage.getItem("productos")) || [];
    if (existentes.length === 0) {
      const productosEjemplo = [
        {
          id: 1,
          nombre: "Camiseta Rock",
          descripcion: "Camiseta 100% algodón con estampado de banda.",
          marca: "RockStore",
          precio: 25.99,
          tipoHerramienta: "",
          tamaño: "",
          cantidad: 10,
          imagen: "https://via.placeholder.com/150?text=Camiseta",
          vendedor: { nombre: "RockStore", id: "rockstore" },
        },
        {
          id: 2,
          nombre: "Zapatos Deportivos",
          descripcion: "Zapatos de entrenamiento ultraligeros.",
          marca: "Sporty",
          precio: 49.99,
          tipoHerramienta: "",
          tamaño: "",
          cantidad: 5,
          imagen: "https://via.placeholder.com/150?text=Zapatos",
          vendedor: { nombre: "Sporty", id: "sporty" },
        },
        {
          id: 3,
          nombre: "Mochila Urbana",
          descripcion: "Resistente al agua y con múltiples compartimentos.",
          marca: "UrbanShop",
          precio: 35.5,
          tipoHerramienta: "",
          tamaño: "",
          cantidad: 15,
          imagen: "https://via.placeholder.com/150?text=Mochila",
          vendedor: { nombre: "UrbanShop", id: "urbanshop" },
        },
        {
          id: 4,
          nombre: "Gorra Cool",
          descripcion: "Gorra ajustable estilo urbano.",
          marca: "CapWorld",
          precio: 15.0,
          tipoHerramienta: "",
          tamaño: "",
          cantidad: 8,
          imagen: "https://via.placeholder.com/150?text=Gorra",
          vendedor: { nombre: "CapWorld", id: "capworld" },
        },
      ];
      localStorage.setItem("productos", JSON.stringify(productosEjemplo));
    }
  }, []);

  // 🧮 Contador del carrito (número total de unidades)
  const [cartCount, setCartCount] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("carrito")) || [];
    return stored.length;
  });

  // ✅ Función para agregar productos al carrito (ahora con todos los detalles)
  const addToCart = (producto) => {
    try {
      const lista = JSON.parse(localStorage.getItem("carrito")) || [];

      const item = {
        id: producto.id ?? Date.now(),
        nombre: producto.nombre || "Sin nombre",
        descripcion: producto.descripcion || "",
        marca: producto.marca || "",
        tipoHerramienta: producto.tipoHerramienta || "",
        tamaño: producto.tamaño || "",
        cantidad: 1, // unidad agregada
        precio: Number(producto.precio) || 0,
        imagen:
          producto.imagen && producto.imagen.trim() !== ""
            ? producto.imagen
            : "https://via.placeholder.com/150?text=Sin+Imagen",
        vendedor: producto.vendedor || null,
        tipoEmpresa: producto.tipoEmpresa || null,

        // Extras dinámicos si existen
        extra1:
          producto.extra1 && producto.extra1.label
            ? producto.extra1
            : producto.extra1
            ? { label: "Extra 1", value: producto.extra1 }
            : null,

        extra2:
          producto.extra2 && producto.extra2.label
            ? producto.extra2
            : producto.extra2
            ? { label: "Extra 2", value: producto.extra2 }
            : null,
      };

      lista.push(item);
      localStorage.setItem("carrito", JSON.stringify(lista));
      setCartCount(lista.length);
      window.dispatchEvent(new Event("carritoActualizado"));
    } catch (e) {
      console.error("❌ Error al agregar al carrito:", e);
    }
  };

  // 🔁 Escuchar cambios de localStorage (otras pestañas)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "carrito") {
        try {
          const stored = JSON.parse(e.newValue) || [];
          setCartCount(stored.length);
        } catch {
          setCartCount(0);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <CartContext.Provider value={{ addToCart, cartCount, setCartCount }}>
      <Router>
        <Navbar usuario={usuario} setUsuario={setUsuario} cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/login" element={<Login setUsuario={setUsuario} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/tienda/:sellerKey" element={<TiendaVendedor />} />
          <Route path="/inventario" element={<Inventario />} />
        </Routes>
      </Router>
    </CartContext.Provider>
  );
}

export default App;
