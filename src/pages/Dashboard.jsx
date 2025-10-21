import { useState, useEffect } from "react";
import "./Inventario.css";

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [usuario, setUsuario] = useState(null); // null hasta cargar

  // Cargar usuario activo desde localStorage
  useEffect(() => {
    if (typeof window === "undefined") return; // SSR seguro
    const data = localStorage.getItem("usuarioActivo");
    if (!data) return setUsuario({ nombre: "Vendedor Anónimo", id: null });
    try {
      const parsed = JSON.parse(data);
      setUsuario(parsed || { nombre: "Vendedor Anónimo", id: null });
    } catch {
      setUsuario({ nombre: "Vendedor Anónimo", id: null });
    }
  }, []);

  // Cargar productos del usuario actual
  useEffect(() => {
    if (!usuario) return; // Esperar a cargar
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const propios = todos.filter(
      (p) =>
        p.vendedor &&
        (p.vendedor.id === usuario.id || p.vendedor.email === usuario.email)
    );
    setProductos(propios);
  }, [usuario]);

  // Guardar productos sin perder los de otros vendedores
  useEffect(() => {
    if (!usuario) return;
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const otros = todos.filter(
      (p) =>
        !p.vendedor ||
        (p.vendedor.id !== usuario.id && p.vendedor.email !== usuario.email)
    );
    localStorage.setItem("productos", JSON.stringify([...otros, ...productos]));
  }, [productos, usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usuario) return;

    const total = (Number(cantidad) * Number(precio)).toFixed(2);

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      cantidad,
      precio: Number(precio),
      total,
      descripcion: "Producto agregado desde el inventario.",
      imagen: "https://via.placeholder.com/150",
      vendedor: {
        nombre: usuario.nombre,
        id: usuario.id || usuario.email,
        email: usuario.email || null,
      },
      categoria: "Inventario",
    };

    setProductos([nuevoProducto, ...productos]);
    setNombre("");
    setCantidad("");
    setPrecio("");
  };

  const handleEliminar = (id) => {
    const nuevos = productos.filter((p) => p.id !== id);
    setProductos(nuevos);

    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const actualizados = todos.filter((p) => p.id !== id);
    localStorage.setItem("productos", JSON.stringify(actualizados));
  };

  if (!usuario) return <p>Cargando usuario...</p>; // espera a cargar

  return (
    <main>
      <header>
        <h1>📦 Sistema de Gestión de Inventario</h1>
        <p>Usuario: {usuario.nombre}</p>
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

