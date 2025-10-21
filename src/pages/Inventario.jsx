import { useEffect, useState } from "react";
import "./Inventario.css";

export default function Inventario() {
  // Estado del usuario (tomado desde localStorage)
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem("usuarioActual");
    if (stored) {
      setUsuario(JSON.parse(stored));
    }
  }, []);

  // Cargar productos del usuario actual
  useEffect(() => {
    if (!usuario) return;

    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const propios = todos.filter((p) => p.vendedorId === usuario.id);
    setProductos(propios);
  }, [usuario]);

  // Guardar productos respetando los de otros vendedores
  useEffect(() => {
    if (!usuario) return;

    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const otros = todos.filter((p) => p.vendedorId !== usuario.id);
    localStorage.setItem(
      "productos",
      JSON.stringify([...otros, ...productos])
    );
  }, [productos, usuario]);

  // Agregar producto
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario) {
      alert("Debes iniciar sesión para agregar productos");
      return;
    }

    const total = (Number(cantidad) * Number(precio)).toFixed(2);

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      cantidad: Number(cantidad),
      precio: Number(precio),
      total,
      vendedor: usuario.nombre || usuario.email,
      vendedorId: usuario.id,
    };

    setProductos([nuevoProducto, ...productos]);
    setNombre("");
    setCantidad("");
    setPrecio("");
  };

  // Eliminar producto
  const handleEliminar = (id) => {
    const nuevos = productos.filter((p) => p.id !== id);
    setProductos(nuevos);
  };

  if (!usuario) {
    return (
      <main>
        <h2>Debes iniciar sesión para ver tu inventario</h2>
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>📦 Sistema de Gestión de Inventario</h1>
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
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            step="0.01"
            required
          />
          <button type="submit">Agregar</button>
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
                <th>Vendido por</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>${p.precio.toFixed(2)}</td>
                  <td>${p.total}</td>
                  <td>{p.vendedor}</td>
                  <td>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="eliminar"
                    >
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
