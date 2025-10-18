import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardProducto from "../components/CardProducto";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // q mantiene el valor del input de búsqueda en la UI
  const [q, setQ] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  });

  // cargar productos desde localStorage (o array vacío)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(stored);
  }, []);

  // sincronizar input con cambios en la URL (ej: back/forward)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get("q") || "");
  }, [location.search]);

  // aplicar búsqueda y sort cuando cambian query params o productos
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = (params.get("q") || "").trim().toLowerCase();
    const sort = params.get("sort") || "";

    let list = [...productos];

    if (qParam) {
      list = list.filter(p => {
        const nombre = (p.nombre || "").toString().toLowerCase();
        const desc = (p.descripcion || "").toString().toLowerCase();
        return nombre.includes(qParam) || desc.includes(qParam);
      });
    }

    if (sort === "price-desc") {
      list.sort((a,b) => (Number(b.precio) || 0) - (Number(a.precio) || 0));
    } else if (sort === "price-asc") {
      list.sort((a,b) => (Number(a.precio) || 0) - (Number(b.precio) || 0));
    } else if (sort === "name-asc") {
      list.sort((a,b) => (a.nombre || "").localeCompare(b.nombre || ""));
    } else if (sort === "name-desc") {
      list.sort((a,b) => (b.nombre || "").localeCompare(a.nombre || ""));
    }

    setFiltrados(list);
  }, [location.search, productos]);

  const updateSort = (value) => {
    const params = new URLSearchParams(location.search);
    if (value) params.set("sort", value);
    else params.delete("sort");
    // conservar q si existe
    const qParam = new URLSearchParams(location.search).get("q");
    if (qParam) params.set("q", qParam);
    navigate({ pathname: "/", search: params.toString() });
  };

  const submitSearch = (e) => {
    e?.preventDefault?.();
    const params = new URLSearchParams(location.search);
    if (q && q.trim() !== "") params.set("q", q.trim());
    else params.delete("q");
    // conservar sort si existe
    const sortParam = new URLSearchParams(location.search).get("sort");
    if (sortParam) params.set("sort", sortParam);
    navigate({ pathname: "/", search: params.toString() });
  };

  return (
    <main style={{ maxWidth: 1100, margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Productos</h2>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <form onSubmit={submitSearch} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #ddd", outline: "none", width: 240 }}
            />
            <button type="submit" style={{ padding: "6px 10px", borderRadius: 6, cursor: "pointer", border: "none", background: "#4f46e5", color: "#fff" }}>
              Buscar
            </button>
          </form>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ color: "#444", fontSize: 14 }}>Ordenar:</label>
            <select
              aria-label="Ordenar productos"
              onChange={(e) => updateSort(e.target.value)}
              defaultValue={new URLSearchParams(location.search).get("sort") || ""}
              style={{ padding: "6px 8px", borderRadius: 6 }}
            >
              <option value="">Por defecto</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="name-asc">Nombre: A → Z</option>
              <option value="name-desc">Nombre: Z → A</option>
            </select>
          </div>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p>No hay productos que coincidan.</p>
      ) : (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {filtrados.map((p, i) => (
            <CardProducto key={i} producto={p} />
          ))}
        </div>
      )}
    </main>
  );
}
