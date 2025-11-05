import { useEffect, useState } from "react";
import "./Inventario.css";

export default function Inventario() {
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [tipoHerramienta, setTipoHerramienta] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [imagen, setImagen] = useState("");
  const [preview, setPreview] = useState(null);

  // === Cargar usuario ===
  useEffect(() => {
    const stored = localStorage.getItem("usuarioActual");
    if (stored) setUsuario(JSON.parse(stored));
  }, []);

  // === Cargar productos del usuario ===
  useEffect(() => {
    if (!usuario) return;
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const propios = todos.filter((p) => p.vendedorId === usuario.id);
    setProductos(propios);
  }, [usuario]);

  // === Guardar productos al cambiar ===
  useEffect(() => {
    if (!usuario) return;
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const otros = todos.filter((p) => p.vendedorId !== usuario.id);
    localStorage.setItem("productos", JSON.stringify([...otros, ...productos]));
  }, [productos, usuario]);

  // === Manejar imagen subida ===
  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagen(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // === Guardar producto ===
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("Debes iniciar sesión para agregar productos");
      return;
    }

    if (
      !tipoHerramienta ||
      !tamaño ||
      !cantidad ||
      !precio ||
      !descripcion ||
      !marca ||
      !nombre
    ) {
      alert("Completa todos los campos");
      return;
    }

    const total = (Number(cantidad) * Number(precio)).toFixed(2);

    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      marca: marca.trim(),
      tipoHerramienta,
      tamaño: tamaño.trim(),
      cantidad: Number(cantidad),
      precio: Number(precio),
      total,
      imagen: imagen || "https://via.placeholder.com/200x200?text=Sin+Imagen",
      vendedor: usuario.nombre || usuario.email,
      vendedorId: usuario.id,
      tipoEmpresa: usuario.tipoEmpresa || null,
      creadoEn: new Date().toISOString(),
    };

    setProductos([nuevoProducto, ...productos]);

    // Reset form
    setNombre("");
    setDescripcion("");
    setMarca("");
    setTipoHerramienta("");
    setTamaño("");
    setCantidad("");
    setPrecio("");
    setImagen("");
    setPreview(null);
  };

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
    <div className="inventario-page">
      <main>
        <header>
          <h1>🧰 Inventario - Venta de Herramientas</h1>
          <p>Vendedor: {usuario.nombre}</p>
          {usuario.tipoEmpresa && <p>Tipo de empresa: {usuario.tipoEmpresa}</p>}
        </header>

        {/* === FORMULARIO === */}
        <section className="form-section">
          <h2>Agregar Herramienta</h2>
          <form onSubmit={handleSubmit}>
            <div className="fila">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                required
              />
            </div>

            <div className="fila">
              <select
                value={tipoHerramienta}
                onChange={(e) => setTipoHerramienta(e.target.value)}
                required
              >
                <option value="">Selecciona tipo de herramienta</option>
                <option value="Manual">Manual</option>
                <option value="Eléctrica">Eléctrica</option>
              </select>
              <input
                type="text"
                placeholder="Tamaño"
                value={tamaño}
                onChange={(e) => setTamaño(e.target.value)}
                required
              />
            </div>

            <div className="fila">
              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                min="0"
                step="1"
                required
              />
              <input
                type="number"
                placeholder="Precio ($)"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                step="0.01"
                min="0"
                required
              />
            </div>

            <textarea
              placeholder="Descripción del producto"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              required
            />

            {/* === Imagen === */}
            <div className="fila">
              <label
                style={{
                  background: "#4f46e5",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                📸 Subir Imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                  style={{ display: "none" }}
                />
              </label>

              {preview && (
                <img
                  src={preview}
                  alt="Vista previa"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    objectFit: "cover",
                    marginLeft: 10,
                  }}
                />
              )}
            </div>

            <button type="submit">Agregar</button>
          </form>
        </section>

        {/* === TABLA === */}
        <section className="tabla-section">
          <h2>Inventario Actual</h2>
          {productos.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: 10 }}>
              No tienes herramientas registradas.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Descripción</th>
                  <th>Marca</th>
                  <th>Tipo</th>
                  <th>Tamaño</th>
                  <th>Cantidad</th>
                  <th>Precio ($)</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img
                        src={p.imagen}
                        alt={p.nombre}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </td>
                    <td>{p.nombre}</td>
                    <td style={{ maxWidth: 280, whiteSpace: "pre-wrap" }}>
                      {p.descripcion}
                    </td>
                    <td>{p.marca}</td>
                    <td>{p.tipoHerramienta}</td>
                    <td>{p.tamaño}</td>
                    <td>{p.cantidad}</td>
                    <td>${p.precio.toFixed(2)}</td>
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
          <p>© 2025 Sistema de Inventario | Venta de Herramientas 🔧</p>
        </footer>
      </main>
    </div>
  );
}
