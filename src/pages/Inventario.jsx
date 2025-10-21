import { useState, useEffect } from "react";
import "./Inventario.css";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState("Vendedor Anónimo");

  // Cargar usuario activo correctamente
  useEffect(() => {
    try {
      const data = localStorage.getItem("usuarioActivo");
      if (!data) return;
      const parsed = JSON.parse(data);
      setUsuarioActivo(parsed?.nombre || String(data));
    } catch {
      setUsuarioActivo("Vendedor Anónimo");
    }
  }, []);

  // Cargar productos del usuario actual
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const propios = todos.filter((p) => p.vendedor === usuarioActivo);
    setProductos(propios);
  }, [usuarioActivo]);

  // Guardar productos en localStorage sin perder los de otros vendedores
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const otros = todos.filter((p) => p.vendedor !== usuarioActivo);
    localStorage.setItem("productos", JSON.stringify([...otros, ...productos]));
  }, [productos, usuarioActivo]);

  // Agregar producto
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim() || !cantidad || !precio) return;

    const total = (Number(cantidad) * Number(precio)).toFixed(2);

    const sellerNombre = usuario?.nombre || usuario?.email || "Vendedor";
    const sellerId = usuario?.id || usuario?.email || sellerNombre.toString().replace(/\s+/g, "").toLowerCase();

    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre.trim(),
      cantidad,
      precio: Number(precio),
      total,
      descripcion: "Producto agregado desde el inventario.",
      imagen: "https://via.placeholder.com/150",
      vendedor: { nombre: sellerNombre, id: sellerId },
      categoria: "Inventario"
    };

    setProductos([nuevoProducto, ...productos]);
    setNombre("");
    setCantidad("");
    setPrecio("");
  };

  // Eliminar producto individual
  const handleEliminar = (id) => {
    const nuevos = productos.filter((p) => p.id !== id);
    setProductos(nuevos);

    // Eliminar del storage global
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const actualizados = todos.filter((p) => p.id !== id);
    localStorage.setItem("productos", JSON.stringify(actualizados));
  };

  // Limpiar todo el inventario del usuario
  const handleLimpiarInventario = () => {
    if (!confirm("¿Eliminar todos los productos de tu inventario?")) return;
    setProductos([]);
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const otros = todos.filter((p) => p.vendedor !== usuarioActivo);
    localStorage.setItem("productos", JSON.stringify(otros));
  };

  return (
    <main>
      <header>
        <h1>📦 Sistema de Gestión de Inventario</h1>
        <p>Usuario activo: <strong>{usuarioActivo}</strong></p>
      </header>

      <section className="form-section">
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit}>
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
          {productos.length > 0 && (
            <button type="button" onClick={handleLimpiarInventario} style={{ marginLeft: 8 }}>
              Limpiar Inventario
            </button>
          )}
        </form>
      </section>

      <section className="tabla-section">
        <h2>Inventario Actual</h2>
        {productos.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: 10 }}>
            No tienes productos en tu inventario.
          </p>
        ) : (
          <table>
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
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>${Number(p.precio).toFixed(2)}</td>
                  <td>${p.total}</td>
                  <td>
                    <button onClick={() => handleEliminar(p.id)} className="eliminar">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <footer>
        <p>© 2025 Sistema de Inventario | Hecho por 🧠</p>
      </footer>
    </main>
  );
}
