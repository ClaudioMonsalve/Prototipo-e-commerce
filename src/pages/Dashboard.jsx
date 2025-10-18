import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CardProducto from "../components/CardProducto";

export default function Dashboard({ usuario }) {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [misProductos, setMisProductos] = useState([]);

  const [mode, setMode] = useState(null); // null | "add" | "delete"
  const [selectedIds, setSelectedIds] = useState([]);

  // Formulario inline
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagenFile, setImagenFile] = useState(null); // <-- archivo de imagen

  // Cargar todos los productos
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(stored);
  }, []);

  // Filtrar solo productos del vendedor actual
  useEffect(() => {
    if (!usuario) {
      setMisProductos([]);
      return;
    }

    const todos = JSON.parse(localStorage.getItem("productos")) || [];
    const userId = usuario?.id || usuario?.email;

    const filtrados = todos.filter(p => {
      const vendedorId = p?.vendedor?.id || p?.vendedorId || p?.vendedor?.email || p?.email;
      return vendedorId && userId && String(vendedorId).toLowerCase() === String(userId).toLowerCase();
    });

    setMisProductos(filtrados);
    setSelectedIds([]);
  }, [usuario, productos]);

  if (!usuario) {
    return (
      <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
        <h2>No has iniciado sesión</h2>
        <p>
          <Link to="/login">Iniciar sesión</Link> o <Link to="/registro">Registrarse</Link> para acceder al panel.
        </p>
      </main>
    );
  }

  const role = usuario?.role || usuario?.rol || usuario?.tipo || "comprador";
  const isVendedor = String(role).toLowerCase().includes("vendedor");

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    navigate("/");
    window.location.reload();
  };

  const handleDeleteAccount = () => {
    if (!confirm("¿Eliminar cuenta? Esta acción no se puede deshacer.")) return;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const filtrados = usuarios.filter(u => (u.id && usuario.id ? u.id !== usuario.id : u.email !== usuario.email));
    localStorage.setItem("usuarios", JSON.stringify(filtrados));

    localStorage.removeItem("usuarioActual");
    navigate("/");
    window.location.reload();
  };

  const getProductId = (p) => p?.createdAt || `${String(p.nombre||"").slice(0,40)}::${String(p.precio||"")}`.replace(/\s+/g, "_");

  const toggleSelect = (p) => {
    const id = getProductId(p);
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleEliminarSeleccionados = () => {
    if (selectedIds.length === 0) {
      alert("No hay productos seleccionados.");
      return;
    }

    const todos = JSON.parse(localStorage.getItem("productos") || "[]");
    const nuevo = todos.filter(p => !selectedIds.includes(getProductId(p)));
    localStorage.setItem("productos", JSON.stringify(nuevo));
    setProductos(nuevo);
    setSelectedIds([]);
    setMode(null);
  };

  const handleEliminarUno = (producto) => {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;

    const pid = getProductId(producto);
    const todos = JSON.parse(localStorage.getItem("productos") || "[]");
    const nuevo = todos.filter(p => getProductId(p) !== pid);
    localStorage.setItem("productos", JSON.stringify(nuevo));
    setProductos(nuevo);
    setSelectedIds(prev => prev.filter(id => id !== pid));
  };

  // Convertir archivo a Base64
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagenFile(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e) => {
    e?.preventDefault?.();
    if (!nombre.trim()) {
      alert("El producto necesita un nombre");
      return;
    }

    const sellerNombre = usuario?.nombre || usuario?.email || "Vendedor";
    const sellerId = usuario?.id || usuario?.email || sellerNombre.toString().replace(/\s+/g, "").toLowerCase();

    const todos = JSON.parse(localStorage.getItem("productos") || "[]");
    const nuevo = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio) || 0,
      categoria: categoria.trim() || "Sin categoría",
      imagen: imagenFile || "https://via.placeholder.com/400x300?text=Producto", // <-- Base64 o placeholder
      vendedor: { nombre: sellerNombre, id: sellerId },
      createdAt: Date.now()
    };

    const updated = [nuevo, ...todos];
    localStorage.setItem("productos", JSON.stringify(updated));
    setProductos(updated);

    setNombre("");
    setDescripcion("");
    setPrecio("");
    setCategoria("");
    setImagenFile(null);
    setMode(null);
    alert("Producto creado");
  };

  return (
    <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem" }}>
      {/* Cabecera mínima */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Panel</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleLogout} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>Salir</button>
          <button onClick={handleDeleteAccount} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ef4444", background: "#fff", color: "#b91c1c", cursor: "pointer" }}>Eliminar cuenta</button>
        </div>
      </div>

      {isVendedor ? (
        <section style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>Gestión de productos</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setMode(mode === "add" ? null : "add")} style={{ color: "#fff", background: "#4f46e5", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                {mode === "add" ? "Cerrar formulario" : "Agregar producto"}
              </button>
              {!mode || mode === "add" ? (
                <button onClick={() => { setMode("delete"); setSelectedIds([]); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
                  Eliminar productos
                </button>
              ) : (
                <button onClick={() => { setMode(null); setSelectedIds([]); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
                  Volver
                </button>
              )}
            </div>
          </div>

          {/* Formulario inline */}
          {mode === "add" && (
            <form onSubmit={handleAddSubmit} style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 700 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre del producto" style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
                <input value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" style={{ width: 140, padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
              </div>
              <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoría" style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
              
              {/* Nuevo input para subir imagen */}
              <input type="file" accept="image/*" onChange={handleImagenChange} />

              <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" rows={4} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" style={{ padding: "10px 14px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Guardar</button>
                <button type="button" onClick={() => setMode(null)} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: "transparent", cursor: "pointer" }}>Cancelar</button>
              </div>
            </form>
          )}

          {/* Modo eliminar */}
          {mode === "delete" && (
            <>
              {misProductos.length === 0 ? (
                <p style={{ marginTop: 12 }}>No has subido productos aún.</p>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={handleEliminarSeleccionados} style={{ padding: "8px 12px", borderRadius: 8, background: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}>
                      Eliminar seleccionados ({selectedIds.length})
                    </button>
                    <button onClick={() => setSelectedIds([])} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
                      Limpiar selección
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
                    {misProductos.map((p, i) => {
                      const pid = getProductId(p);
                      const checked = selectedIds.includes(pid);
                      return (
                        <div key={i} style={{ position: "relative", width: 240 }}>
                          <label style={{
                            position: "absolute",
                            left: 8,
                            top: 8,
                            zIndex: 30,
                            background: "rgba(255,255,255,0.9)",
                            padding: "4px 6px",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}>
                            <input type="checkbox" checked={checked} onChange={() => toggleSelect(p)} />
                          </label>

                          <CardProducto producto={p} showSeller={true} />

                          <button onClick={() => handleEliminarUno(p)} style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            padding: "6px 8px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 12
                          }}>
                            Eliminar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </section>
      ) : (
        <section>
          <h3>Bienvenido</h3>
          <p>Como comprador puedes navegar productos, agregarlos al carrito y realizar compras.</p>
        </section>
      )}
    </main>
  );
}

