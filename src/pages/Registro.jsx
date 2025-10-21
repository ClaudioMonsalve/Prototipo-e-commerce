import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("comprador"); // 'comprador' o 'vendedor'
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!email || !password) {
      alert("Completa email y contraseña");
      return;
    }

    if (usuarios.some(u => u.email === email)) {
      alert("Email ya registrado");
      return;
    }

    const usuario = {
      id: Date.now(),
      nombre: nombre || (email.split?.("@")?.[0] ?? "Usuario"),
      email,
      password,
      rol, // guardamos el rol para lógica (vendedor/comprador)
    };

    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // guardar como usuario actual (sesión simple)
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));

    // si es vendedor, su nombre queda disponible en usuarioActual.vendedor cuando cree productos
    navigate("/");
  };

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h2>Registro</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          Contraseña
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          Soy
          <select value={rol} onChange={(e) => setRol(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            <option value="comprador">Comprador</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ padding: "10px 14px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
            Registrarse
          </button>
          <button type="button" onClick={() => navigate("/login")} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", background: "#4f46e5", cursor: "pointer" }}>
            Ir a Login
          </button>
        </div>
      </form>
    </main>
  );
}
