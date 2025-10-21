import { useState, useEffect } from "react";

export default function Inventario({ usuario }) {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  // Cargar productos desde localStorage
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(todos);
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario) {
      alert("Debes iniciar sesión para agregar productos");
      return;
    }

    const sellerNombre = usuario?.nombre || usuario?.email || "Vendedor";
    const sellerId = usuario?.id || usuario?.email || sellerNombre.toLowerCase().replace(/\s+/g, "");

    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre.trim(),
      cantidad: Number(cantidad),
      precio: Number(precio),
      vendedor: { nombre: sellerNombre, id: sellerId }
    };

    setProductos([nuevoProducto, ...productos]);
    setNombre("");
    setCantidad("");
    setPrecio("");
  };

  const handleEliminar = (id) => {
    const filtrados = productos.filter((p) => p.id !== id);
    setProductos(filtrados);
  };

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <header>
        <h1>📦 Sistema de Gestión de Inventario</h1>
      </header>

      <section style={{ marginBottom: 24 }}>
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Precio ($)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            step="0.01"
            required
          />
          <button type="submit">Agregar</button>
        </form>
      </section>

      <section>
        <h2>Inventario Actual</h2>
        {productos.length === 0 ? (
          <p>No tienes productos en tu inventario.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio ($)</th>
                <th>Total</th>
                <th>Vendedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>${(p.cantidad * p.precio).toFixed(2)}</td>
                  <td>{p.vendedor?.nombre}</td>
                  <td>
                    <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer style={{ marginTop: 24 }}>
        <p>© 2025 Sistema de Inventario | Hecho por 🧠</p>
      </footer>
    </main>
  );
}
