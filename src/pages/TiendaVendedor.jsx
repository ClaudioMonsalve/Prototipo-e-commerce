import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CardProducto from "../components/CardProducto";

export default function TiendaVendedor() {
  const { sellerKey } = useParams(); // coincide con encodeURIComponent en el link
  const decoded = decodeURIComponent(sellerKey || "");
  const [productos, setProductos] = useState([]);
  const [lista, setLista] = useState([]);
  const [vendedorNombre, setVendedorNombre] = useState(""); // <-- nombre real

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(stored);
  }, []);

  useEffect(() => {
    if (!decoded) {
      setLista([]);
      setVendedorNombre("");
      return;
    }

    // filtrar por varias propiedades posibles que guardaste en productos
    const filtrados = productos.filter(p => {
      const keys = [
        p.vendedor?.id,
        p.vendedorId,
        p.sellerId,
        p.vendedor?.email,
        p.email,
        p.vendedor?.nombre,
        p.vendedorNombre,
        p.vendedor,
        p.tienda,
        p.sellerName,
        p.seller
      ].map(k => (k === undefined || k === null) ? "" : String(k));
      return keys.some(k => k.toLowerCase() === decoded.toLowerCase());
    });

    setLista(filtrados);

    // sacar el nombre del vendedor de alguno de los productos filtrados
    if (filtrados.length > 0) {
      const nombre = filtrados[0].vendedor?.nombre || filtrados[0].vendedorNombre || "Tienda";
      setVendedorNombre(nombre);
    } else {
      setVendedorNombre("Tienda");
    }
  }, [decoded, productos]);

  return (
    <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0 }}>{vendedorNombre}</h2>
          <p style={{ marginTop: 6, color: "#6b7280" }}>{lista.length} producto(s)</p>
        </div>
        <div>
          <Link to="/" style={{ textDecoration: "none", color: "#4f46e5" }}>← Volver a Productos</Link>
        </div>
      </div>

      {lista.length === 0 ? (
        <p>No se encontraron productos para este vendedor.</p>
      ) : (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {lista.map((p, i) => <CardProducto key={i} producto={p} />)}
        </div>
      )}
    </main>
  );
}
