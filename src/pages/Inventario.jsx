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
    if (stored) setUsuario(JSON.parse(stored));
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

  // 👉 función para obtener los nombres de las columnas según el tipo
  const getExtraLabels = (tipo) => {
    switch (tipo) {
      case "mascotas":
        return { extra1Label: "Tamaño", extra2Label: "Tipo de animal" };
      case "ferreteria":
        return { extra1Label: "Material", extra2Label: "Marca" };
      case "ropa":
        return { extra1Label: "Talla", extra2Label: "Color" };
      case "electronica":
        return { extra1Label: "Modelo", extra2Label: "Garantía" };
      default:
        return { extra1Label: "Extra 1", extra2Label: "Extra 2" };
    }
  };

  const { extra1Label, extra2Label } = getExtraLabels(usuario?.tipoEmpresa);

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
      tipoEmpresa: usuario.tipoEmpresa || null,
      // guardamos con label porque lo puede necesitar otra vista,
      // pero vamos a mostrar solo el value en la tabla
      extra1: extra1 ? { label: extra1Label, value: extra1 } : null,
      extra2: extra2 ? { label: extra2Label, value: extra2 } : null,
    };

    setProductos([nuevoProducto, ...productos]);
    setNombre("");
    setCantidad("");
    setPrecio("");
    setExtra1("");
    setExtra2("");
  };

  // === Renderizar inputs adicionales según tipo ===
  const renderPreguntas = () => {
    if (!usuario?.tipoEmpresa) return null;

    return (
      <>
        <input
          type="text"
          placeholder={extra1Label}
          value={extra1}
          onChange={(e) => setExtra1(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder={extra2Label}
          value={extra2}
          onChange={(e) => setExtra2(e.target.value)}
          required
        />
      </>
    );
  };

  // === Eliminar producto ===
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
                <th>{extra1Label}</th>
                <th>{extra2Label}</th>
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

                  {/* 👇 ahora solo mostramos el valor, no el label */}
                  <td>
                    {p.extra1?.value ? (
                      <div
                        style={{
                          background: "#f2f2f2",
                          borderRadius: "8px",
                          padding: "4px 6px",
                          textAlign: "center",
                        }}
                      >
                        {p.extra1.value}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {p.extra2?.value ? (
                      <div
                        style={{
                          background: "#f2f2f2",
                          borderRadius: "8px",
                          padding: "4px 6px",
                          textAlign: "center",
                        }}
                      >
                        {p.extra2.value}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

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
