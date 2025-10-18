import { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home";
import CarritoPage from "./pages/CarritoPage";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Dashboard from "./pages/Dashboard";
import TiendaVendedor from "./pages/TiendaVendedor";

// Contexto del carrito
export const CartContext = createContext({
  addToCart: () => {},
  cartCount: 0,
  setCartCount: () => {}, // 🔥 agregar setCartCount para poder actualizar desde otros componentes
});

function App() {
  const [usuario, setUsuario] = useState(
    JSON.parse(localStorage.getItem("usuarioActual"))
  );

  // Inicializar productos de ejemplo si no existen
  useEffect(() => {
    const existentes = JSON.parse(localStorage.getItem("productos")) || [];
    if (existentes.length === 0) {
      const productosEjemplo = [
        {
          nombre: "Camiseta Rock",
          precio: 25.99,
          imagen: "https://via.placeholder.com/150?text=Camiseta",
          vendedor: { nombre: "RockStore", id: "rockstore" },
        },
        {
          nombre: "Zapatos Deportivos",
          precio: 49.99,
          imagen: "https://via.placeholder.com/150?text=Zapatos",
          vendedor: { nombre: "Sporty", id: "sporty" },
        },
        {
          nombre: "Mochila Urbana",
          precio: 35.5,
          imagen: "https://via.placeholder.com/150?text=Mochila",
          vendedor: { nombre: "UrbanShop", id: "urbanshop" },
        },
        {
          nombre: "Gorra Cool",
          precio: 15.0,
          imagen: "https://via.placeholder.com/150?text=Gorra",
          vendedor: { nombre: "CapWorld", id: "capworld" },
        },
      ];
      localStorage.setItem("productos", JSON.stringify(productosEjemplo));
    }
  }, []);

  // contador del carrito (número total de unidades)
  const [cartCount, setCartCount] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("carrito")) || [];
    return stored.length;
  });

  // Función para agregar productos al carrito
  const addToCart = (producto) => {
    if (!producto) return;
    const unidad = {
      nombre: producto.nombre || "Sin nombre",
      precio: Number(producto.precio) || 0,
      imagen: producto.imagen || "https://via.placeholder.com/150",
    };
    const current = JSON.parse(localStorage.getItem("carrito")) || [];
    current.push(unidad);
    localStorage.setItem("carrito", JSON.stringify(current));
    setCartCount(current.length);
  };

  // Escuchar cambios en localStorage (ej. otra pestaña)
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
          <Route path="/dashboard" element={<Dashboard usuario={usuario} />} />
          <Route path="/tienda/:sellerKey" element={<TiendaVendedor />} />
        </Routes>
      </Router>
    </CartContext.Provider>
  );
}

export default App;