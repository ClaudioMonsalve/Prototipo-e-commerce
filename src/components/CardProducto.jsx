import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../App"; // ajusta la ruta si hace falta

export default function CardProducto({ producto = {}, onAgregar = null }) {
  const [hover, setHover] = useState(false);
  const precioNum = Number(producto.precio) || 0;
  const { addToCart } = useContext(CartContext) || {};

  const vendedorNombre =
    producto.vendedor?.nombre ||
    producto.vendedorNombre ||
    producto.vendedor ||
    producto.tienda ||
    producto.sellerName ||
    producto.seller ||
    "Vendedor";

  const vendedorKey =
    producto.vendedor?.id ||
    producto.vendedorId ||
    producto.sellerId ||
    producto.vendedor?.email ||
    producto.email ||
    vendedorNombre;

  const categoria = producto.categoria || producto.tipo || "Sin categoría";

  const fallbackAddToLocalStorage = (productoToAdd) => {
    // En tu app el carrito en localStorage era una lista de "unidades".
    // Para mantener compatibilidad con CarritoPage que agrupa por nombre,
    // añadimos una unidad por cada click (no usamos objeto {cantidad:1} aquí).
    try {
      const lista = JSON.parse(localStorage.getItem("carrito")) || [];

      // crear unidad mínima que usas en el resto del código
      const unidad = {
        nombre: productoToAdd.nombre || "Sin nombre",
        precio: Number(productoToAdd.precio) || 0,
        imagen: productoToAdd.imagen || "https://via.placeholder.com/150",
        id: productoToAdd.id ?? null,
      };

      lista.push(unidad);
      localStorage.setItem("carrito", JSON.stringify(lista));

      // evento de compatibilidad para Navbars que escuchan window
      window.dispatchEvent(new Event("carritoActualizado"));
    } catch (e) {
      console.error("Error al actualizar localStorage carrito:", e);
    }
  };

  const handleAgregar = () => {
    if (typeof onAgregar === "function") {
      onAgregar(producto);
      // compatibilidad: si alguien usa el event listener en Navbar
      window.dispatchEvent(new Event("carritoActualizado"));
      return;
    }

    // Si existe contexto (recomendado), usarlo
    if (typeof addToCart === "function") {
      addToCart(producto);
      // no estrictamente necesario si App sincroniza localStorage en useEffect,
      // pero mantener event por compatibilidad con código aún dependiente.
      window.dispatchEvent(new Event("carritoActualizado"));
      return;
    }

    // Fallback: si no hay contexto ni prop, escribir directamente en localStorage
    fallbackAddToLocalStorage(producto);
  };

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={producto.nombre || "Producto"}
      style={{
        width: 240,
        borderRadius: 14,
        overflow: "hidden",
        background: "#fff",
        boxShadow: hover
          ? "0 14px 40px rgba(10,20,50,0.12)"
          : "0 6px 18px rgba(10,20,50,0.06)",
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 180ms ease",
        display: "flex",
        flexDirection: "column",
        fontFamily:
          "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      }}
    >
      <div style={{ position: "relative", height: 150, background: "#f7f7fb" }}>
        <img
          src={producto.imagen || "https://via.placeholder.com/400x300?text=Producto"}
          alt={producto.nombre || "Producto"}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            background:
              "linear-gradient(90deg, rgba(100,103,255,0.95), rgba(138,107,255,0.95))",
            color: "#fff",
            padding: "6px 8px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {categoria}
        </div>
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: "#101827", lineHeight: 1.2 }}>
          {producto.nombre || "Sin nombre"}
        </h3>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280", flex: 1 }}>
            {producto.descripcion && producto.descripcion.length > 90
              ? producto.descripcion.slice(0, 90).trim() + "…"
              : producto.descripcion || "Descripción breve del producto."}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 999,
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4f46e5",
                fontWeight: 700,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {vendedorNombre[0]?.toUpperCase() || "V"}
            </div>

            <Link to={`/tienda/${encodeURIComponent(String(vendedorKey))}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Vendido por</span>
                <strong style={{ fontSize: 13, color: "#0f172a" }}>{vendedorNombre}</strong>
              </div>
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Precio</span>
            <strong style={{ fontSize: 16, color: "#0f172a" }}>${precioNum.toFixed(2)}</strong>
          </div>

          <button
            onClick={handleAgregar}
            aria-label={`Agregar ${producto.nombre || "producto"} al carrito`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(90deg,#5b60ff,#8a6bff)",
              color: "#fff",
              fontWeight: 700,
              boxShadow: "0 6px 18px rgba(91,96,255,0.18)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20" r="1" fill="white" />
              <circle cx="18" cy="20" r="1" fill="white" />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
