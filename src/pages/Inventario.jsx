import { useState, useEffect } from "react";
import "./Inventario.css"; 

export default function Inventario({ usuario }) { // <-- recibe usuario como prop
  const [productos, setProductos] = useState([]);

  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");

  // Cargar productos desde localStorage al iniciar, filtrando por vendedor
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("inventario")) || [];
    if (usuario?.id || usuario?.email) {
      const userId = usuario.id || usuario.email;
      setProductos(stored.filter(p => p.vendedorId === userId));
    } else {
      setProductos([]);
    }
  }, [usuario]);

  // Guardar productos en localStorage cada vez que cambien
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("inventario")) || [];
    
    // Productos de otros vendedores
    const otros = stored.filter(p => p.vendedorId !== (usuario.id || usuario.email));

    // Guardar la unión: otros + los del vendedor actual
    localStorage.setItem("inventario", JSON.stringify([...productos, ...otros]));
  }, [productos, usuario]);

  // Agregar producto
  const handleSubmit = (e) => {
    e.preventDefault();
    const total = (Number(cantidad) * Number(precio)).toFixed(2);

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      cantidad,
      precio,
      total,
      vendedorId: usuario.id || usuario.email, // <-- asignamos vendedor
    };

    setProductos([nuevoProducto, ...productos]);

    setNombre("");
    setCantidad("");
    setPrecio("");
  };

  // Eliminar producto
  const handleEliminar = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

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
      </section>

      <footer>
        <p>© 2025 Sistema de Inventario | Hecho por 🧠</p>
      </footer>
    </main>
  );
}


