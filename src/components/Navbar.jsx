import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ usuario, setUsuario }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);

  // Función para actualizar el contador desde localStorage
  const actualizarContador = () => {
    const stored = JSON.parse(localStorage.getItem("carrito")) || [];
    setCount(stored.length);
  };

  useEffect(() => {
    // Actualizar al montar
    actualizarContador();

    // Escuchar evento global que dispare cualquier CardProducto
    window.addEventListener("carritoActualizado", actualizarContador);

    return () => {
      window.removeEventListener("carritoActualizado", actualizarContador);
    };
  }, []);

  const role = usuario?.role || usuario?.rol || usuario?.tipo || "";
  const roleLower = String(role).toLowerCase();

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    setUsuario(null);
    navigate("/");
  };

  const handleDeleteAccount = () => {
    if (!usuario) return;
    const ok = confirm("¿Eliminar cuenta? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const filtrados = usuarios.filter(u => {
        if (u.id && usuario.id) return u.id !== usuario.id;
        if (u.email && usuario.email) return u.email !== usuario.email;
        return JSON.stringify(u) !== JSON.stringify(usuario);
      });
      localStorage.setItem("usuarios", JSON.stringify(filtrados));
    } catch (e) {}

    localStorage.removeItem("usuarioActual");
    setUsuario(null);
    navigate("/");
  };

  const showDashboard = roleLower && !roleLower.includes("comprador");

  return (
    <header style={{ background: "#1f2937", color: "#fff", padding: "0.6rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/" style={{ textDecoration: "none", color: "#fff", fontWeight: 800, fontSize: 18 }}>Mi Tienda</Link>
        <nav style={{ display: "flex", gap: 12, marginLeft: 8 }}>
          <Link to="/" style={{ color: "#d1d5db", textDecoration: "none", fontSize: 14 }}>Inicio</Link>
          {showDashboard && <Link to="/dashboard" style={{ color: "#d1d5db", textDecoration: "none", fontSize: 14 }}>Dashboard</Link>}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", position: "relative" }}>
        {usuario ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ textAlign: "right", lineHeight: 1 }}>
              <div style={{ fontWeight: 700 }}>{usuario.nombre || "Usuario"}</div>
              {role && <div style={{ fontSize: 12, color: "#d1d5db" }}>{role}</div>}
            </div>

            <button onClick={() => setOpen(v => !v)} aria-expanded={open} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", padding: "6px 8px", borderRadius: 6, cursor: "pointer" }}>⋯</button>

            {open && (
              <div style={{ position: "absolute", top: "3.4rem", right: "6rem", background: "#fff", color: "#111", borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.12)", padding: "8px", minWidth: 160, zIndex: 40 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => { setOpen(false); handleLogout(); }} style={{ textAlign: "left", background: "transparent", border: "none", padding: "6px 8px", cursor: "pointer" }}>Salir</button>
                  <button onClick={() => { setOpen(false); handleDeleteAccount(); }} style={{ textAlign: "left", background: "transparent", border: "none", padding: "6px 8px", cursor: "pointer", color: "#b91c1c" }}>Eliminar cuenta</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link to="/login" style={{ color: "#d1d5db", textDecoration: "none", fontSize: 14 }}>Ingresar</Link>
            <Link to="/registro" style={{ color: "#d1d5db", textDecoration: "none", fontSize: 14 }}>Registro</Link>
          </div>
        )}

        <Link to="/carrito" style={{ position: "relative", color: "#fff", textDecoration: "none", display: "inline-block" }}>
          <span style={{ fontSize: 18 }}>🛒</span>
          {count > 0 && (
            <span style={{ position: "absolute", top: -6, right: -10, background: "#ef4444", color: "#fff", borderRadius: 12, padding: "2px 6px", fontSize: 12, fontWeight: 700 }}>
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
