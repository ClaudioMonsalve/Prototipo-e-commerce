import { useEffect, useState } from "react";
import "./Inventario.css";

export default function Inventario() {
  // === Estados principales ===
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);

  // Campos base
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  // Campos dinámicos según tipo de empresa
  const [extra1, setExtra1] = useState("");
  const [extra2, setExtra2] = useState("");

  // === Cargar usuario al iniciar ===
  useEffect(() => {
    const stored = localStorage.getItem("usuarioActual");
    if (stored) {
      setUsuario(JSON.parse(stored));
    }
  }, []);

  // === Cargar productos del usuario actual ===
  useEffect(() => {
    if (!usuario) return;
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const propios = todos.filter((p) => p.vendedorId === usuario.id);
    setProductos(propios);
  }, [usuario]);

  // === Guardar productos ===
  useEffect(() => {
    if (!usuario) return;
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const otros = todos.filter((p) => p.vendedorId !== usuario.id);
    localStorage.setItem("productos", JSON.stringify([...otros, ...productos]));
  }, [productos, usuario]);

  // === Agregar producto ===
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
      tipoEmpresa: usuario.tipoEmpresa,
      extra1,
      extra2,
    };

    setProductos([nuevoProducto, ...productos]);
    setNombre("");
    setCantidad("");
    setPrecio("");
    setExtra1("");
    setExtra2("");
  };

  // === Eliminar producto ===
  const handleEliminar = (id) => {
    const nuevos = productos.filter((p) => p.id !== id);
    setProductos(nuevos);
  };

  // === Renderizar preguntas personalizadas ===
  const renderPreguntas = () => {
    if (!usuario?.tipoEmpresa) return null;

    switch (usuario.tipoEmpresa) {
      case "mascotas":
        return (
          <>
            <input
              type="text"
              placeholder="Tamaño del producto"
              value={extra1}
              onChange={(e) => setExtra1(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Tipo de animal (perro, gato, etc.)"
              value={extra2}
              onChange={(e) => setExtra2(e.target.value)}
              required
            />
          </>
        );

      case "ferreteria":
        return (
          <>
            <input
              type="text"
              placeholder="Material o tipo de herramienta"
              value={extra1}
              onChange={(e) => setExtra1(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Marca o proveedor"
              value={extra2}
              onChange={(e) => setExtra2(e.target.value)}
              required
            />
          </>
        );

      case "ropa":
        return (
          <>
            <input
              type="text"
              placeholder="Talla (S, M, L, XL...)"
              value={extra1}
              onChange={(e) => setExtra1(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Color"
              value={extra2}
              onChange={(e) => setExtra2(e.target.value)}
              required
            />
          </>
        );

      case "electronica":
        return (
          <>
            <input
              type="text"
              placeholder="Modelo o especificaciones"
              value={extra1}
              onChange={(e) => setExtra1(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Garantía (meses)"
              value={extra2}
              onChange={(e) => setExtra2(e.target.value)}
              required
            />
          </>
        );

      default:
        return null;
    }
  };

  // === Vista principal ===
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
        <p>Vendedor: {usuario.nombre}</p>
        {usuario.tipoEmpresa && <p>Tipo de empresa: {usuario.tipoEmpresa}</p>}
      </header>

      {/* === Formulario === */}
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

          {/* Preguntas adicionales */}
          {renderPreguntas()}

          <button type="submit">Agregar</button>
        </form>
      </section>

      {/* === Tabla === */}
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
                <th>Extra 1</th>
                <th>Extra 2</th>
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
                  <td>{p.extra1}</td>
                  <td>{p.extra2}</td>
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
