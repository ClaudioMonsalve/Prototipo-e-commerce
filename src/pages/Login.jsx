import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUsuario }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find(u => u.email === email);

    if (!user) {
      alert("Esta cuenta no está registrada");
      return;
    }

    if (user.password !== password) {
      alert("Contraseña incorrecta");
      return;
    }

    // Login exitoso
    localStorage.setItem("usuarioActual", JSON.stringify(user));
    setUsuario(user);
    alert(`Bienvenido, ${user.email}`);
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: "block", marginBottom: "1rem", width: "100%" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: "block", marginBottom: "1rem", width: "100%" }} />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
