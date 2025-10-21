import { useState, useEffect } from "react";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  // Cargar productos desde localStorage al iniciar
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(stored);
  }, []);

  // Guardar productos en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!nombre.trim() || cantidad <= 0 || precio <= 0) return;

    const nuevo = { nombre: nombre.trim(), cantidad: Number(cantidad), precio: Number(precio) };
    setProductos((prev) => [...prev, nuevo]);

    setNombre("");
    setCantidad("");
    setPrecio("");
  };

  const handleEliminar = (index) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <header>
        <h1>📦 Sistema de Gestión de Inventario</h1>
      </header>

      <section style={{ marginBottom: 24 }}>
        <h2>Agregar Producto</h2>
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
          <button type="submit">Agregar</button>
        </form>
      </section>

      <section>
        <h2>Inventario Actual</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio ($)</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, index) => (
              <tr key={index}>
                <td>{p.nombre}</td>
                <td>{p.cantidad}</td>
                <td>${p.precio.toFixed(2)}</td>
                <td>${(p.cantidad * p.precio).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEliminar(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 8 }}>No hay productos en el inventario.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <footer style={{ marginTop: 24 }}>
        <p>© 2025 Sistema de Inventario | Hecho por 🧠</p>
      </footer>
    </main>
  );
}
