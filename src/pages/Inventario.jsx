import { useEffect, useState } from "react";

export default function Inventario({ usuario }) {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagenFile, setImagenFile] = useState(null);

  // Definir usuario activo
  const usuarioActivo = usuario?.nombre || usuario?.email || "Vendedor";

  // Cargar productos del usuario actual
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const propios = todos.filter((p) => {
      const vendedorId = p?.vendedor?.id || p?.vendedorId || p?.vendedor?.email || p?.email;
      const userId = usuario?.id || usuario?.email;
      return vendedorId && userId && String(vendedorId).toLowerCase() === String(userId).toLowerCase();
    });
    setProductos(propios);
  }, [usuario]);

  // Guardar productos en localStorage sin perder los de otros vendedores
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const otros = todos.filter((p) => {
      const vendedorId = p?.vendedor?.id || p?.vendedorId || p?.vendedor?.email || p?.email;
      const userId = usuario?.id || usuario?.email;
      return vendedorId !== userId;
    });
    localStorage.setItem("productos", JSON.stringify([...otros, ...productos]));
  }, [productos, usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = (Number(cantidad) * Number(precio)).toFixed(2);

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      cantidad,
      precio: Number(precio),
      total,
      descripcion: "Producto agregado desde el inventario.",
      imagen: imagenFile || "https://via.placeholder.com/150",
      vendedor: { nombre: usuarioActivo, id: usuario?.id || usuario?.email },
      categoria: "Inventario",
    };

    setProductos([nuevoProducto, ...productos]);
    setNombre("");
    setCantidad("");
    setPrecio("");
    setImagenFile(null);
  };

  const handleEliminar = (id) => {
    const nuevos = productos.filter((p) => p.id !== id);
    setProductos(nuevos);

    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const actualizados = todos.filter((p) => p.id !== id);
    localStorage.setItem("productos", JSON.stringify(actualizados));
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagenFile(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <main>
      <header>
        <h1>📦 Inventario de {usuarioActivo}</h1>
      </header>

      <section style={{ marginTop: 16 }}>
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 500 }}>
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
          <input type="file" accept="image/*" onChange={handleImagenChange} />
          <button type="submit">Agregar Producto</button>
        </form>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Inventario Actual</h2>
        {productos.length === 0 ? (
          <p>No tienes productos en tu inventario.</p>
        ) : (
          <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio ($)</th>
                <th>Total ($)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img src={p.imagen} alt={p.nombre} width="60" height="60" />
                  </td>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>{p.precio.toFixed(2)}</td>
                  <td>{p.total}</td>
                  <td>
                    <button onClick={() => handleEliminar(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
