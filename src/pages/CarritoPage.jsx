import { useState, useEffect } from "react";
import tarjetasValidas from "../DatosPrueba/tarjetas.json";

export default function CarritoPage() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [datosTarjeta, setDatosTarjeta] = useState({
    nombre: "",
    numero: "",
    vencimiento: "",
    cvv: "",
  });

  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));

  // === Cargar carrito agrupado ===
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("carrito")) || [];
    if (stored.length === 0) return setCarrito([]);

    const agrupado = {};
    stored.forEach((p) => {
      const key = p.id || p.nombre; // usar ID si existe
      if (!agrupado[key]) agrupado[key] = { ...p, cantidad: 1 };
      else agrupado[key].cantidad += 1;
    });
    setCarrito(Object.values(agrupado));
  }, []);

  const actualizarLocalStorage = (nuevo) => {
    const lista = [];
    nuevo.forEach((p) => {
      for (let i = 0; i < p.cantidad; i++) {
        lista.push(p);
      }
    });
    localStorage.setItem("carrito", JSON.stringify(lista));
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  const incrementar = (i) => {
    const nuevo = [...carrito];
    nuevo[i].cantidad += 1;
    setCarrito(nuevo);
    actualizarLocalStorage(nuevo);
  };

  const decrementar = (i) => {
    const nuevo = [...carrito];
    nuevo[i].cantidad -= 1;
    if (nuevo[i].cantidad === 0) nuevo.splice(i, 1);
    setCarrito(nuevo);
    actualizarLocalStorage(nuevo);
  };

  const eliminar = (i) => {
    const nuevo = [...carrito];
    nuevo.splice(i, 1);
    setCarrito(nuevo);
    actualizarLocalStorage(nuevo);
  };

  const totalGeneral = carrito
    .reduce((acc, p) => acc + (Number(p.precio) || 0) * p.cantidad, 0)
    .toFixed(2);

  const handlePagar = () => {
    if (!usuarioActual) {
      alert("❌ Debes iniciar sesión para poder pagar");
      return;
    }
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const { nombre, numero, vencimiento, cvv } = datosTarjeta;
    if (!nombre || !numero || !vencimiento || !cvv) {
      alert("Por favor, completa todos los datos de la tarjeta.");
      return;
    }

    const valida = tarjetasValidas.some(
      (t) =>
        t.nombre === nombre &&
        t.numero === numero &&
        t.vencimiento === vencimiento &&
        t.cvv === cvv
    );

    if (!valida) {
      alert("❌ Datos de la tarjeta incorrectos");
      return;
    }

    alert(`✅ ¡Gracias por tu compra! Total: $${totalGeneral}`);
    setCarrito([]);
    localStorage.removeItem("carrito");
    setDatosTarjeta({ nombre: "", numero: "", vencimiento: "", cvv: "" });
    setMostrarPago(false);
    window.dispatchEvent(new Event("carritoActualizado"));
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "2rem auto",
        padding: "1.5rem",
        backgroundColor: "#1e1e1e",
        borderRadius: "12px",
        color: "#f5f5f5",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🛒 Tu Carrito</h1>

      {carrito.length === 0 ? (
        <p style={{ textAlign: "center" }}>El carrito está vacío</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "2rem",
              backgroundColor: "#2a2a2a",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#333" }}>
                <th style={{ padding: "0.8rem" }}>Producto</th>
                <th>Detalles</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {carrito.map((p, i) => (
                <tr
                  key={i}
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #444",
                  }}
                >
                  {/* 🧱 Producto */}
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.8rem",
                      textAlign: "left",
                    }}
                  >
                    <img
                      src={p.imagen}
                      alt={p.nombre}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                    <div>
                      <strong style={{ fontSize: "1rem", color: "#fff" }}>
                        {p.nombre}
                      </strong>
                      {/* Solo mostrar descripción si existe */}
                      {p.descripcion && (
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "#bbb",
                            margin: "4px 0 0 0",
                          }}
                        >
                          {p.descripcion.length > 80
                            ? p.descripcion.slice(0, 80) + "…"
                            : p.descripcion}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* 🧰 Detalles */}
                  <td style={{ fontSize: "0.9rem", color: "#ddd" }}>
                    {p.marca && (
                      <p style={{ margin: "2px 0" }}>
                        <strong>Marca:</strong> {p.marca}
                      </p>
                    )}
                    {p.tipoHerramienta && (
                      <p style={{ margin: "2px 0" }}>
                        <strong>Tipo:</strong> {p.tipoHerramienta}
                      </p>
                    )}
                    {p.tamaño && (
                      <p style={{ margin: "2px 0" }}>
                        <strong>Tamaño:</strong> {p.tamaño}
                      </p>
                    )}
                    {p.extra1?.label && p.extra1?.value && (
                      <p style={{ margin: "2px 0" }}>
                        <strong>{p.extra1.label}:</strong> {p.extra1.value}
                      </p>
                    )}
                    {p.extra2?.label && p.extra2?.value && (
                      <p style={{ margin: "2px 0" }}>
                        <strong>{p.extra2.label}:</strong> {p.extra2.value}
                      </p>
                    )}
                  </td>

                  {/* 💲 Precio */}
                  <td>${(Number(p.precio) || 0).toFixed(2)}</td>

                  {/* 🔢 Cantidad */}
                  <td>
                    <button
                      onClick={() => decrementar(i)}
                      style={{
                        marginRight: "0.5rem",
                        backgroundColor: "#ddd",
                        color: "#111",
                        border: "none",
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>
                    {p.cantidad}
                    <button
                      onClick={() => incrementar(i)}
                      style={{
                        marginLeft: "0.5rem",
                        backgroundColor: "#ddd",
                        color: "#111",
                        border: "none",
                        padding: "0.3rem 0.6rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </td>

                  {/* 💰 Total */}
                  <td>${((Number(p.precio) || 0) * p.cantidad).toFixed(2)}</td>

                  {/* 🗑️ Acciones */}
                  <td>
                    <button
                      onClick={() => eliminar(i)}
                      style={{
                        backgroundColor: "#4f46e5",
                        color: "white",
                        border: "none",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* === Total y Pago === */}
          <div
            style={{
              textAlign: "right",
              marginBottom: "1.5rem",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            Total: ${totalGeneral}
          </div>

          {usuarioActual ? (
            !mostrarPago ? (
              <div style={{ textAlign: "right" }}>
                <button
                  onClick={() => setMostrarPago(true)}
                  style={{
                    padding: "0.8rem 1.5rem",
                    backgroundColor: "#4f46e5",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Proceder al Pago 💳
                </button>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginTop: "1rem",
                  color: "#111",
                }}
              >
                <h2 style={{ marginBottom: "1rem", color: "#4f46e5" }}>
                  Datos de la Tarjeta
                </h2>
                <div
                  style={{
                    display: "grid",
                    gap: "0.8rem",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Nombre en la tarjeta"
                    value={datosTarjeta.nombre}
                    onChange={(e) =>
                      setDatosTarjeta({ ...datosTarjeta, nombre: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Número de tarjeta"
                    value={datosTarjeta.numero}
                    onChange={(e) =>
                      setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={datosTarjeta.vencimiento}
                    onChange={(e) =>
                      setDatosTarjeta({
                        ...datosTarjeta,
                        vencimiento: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={datosTarjeta.cvv}
                    onChange={(e) =>
                      setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value })
                    }
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <button
                    onClick={() => setMostrarPago(false)}
                    style={{
                      padding: "0.7rem 1.2rem",
                      backgroundColor: "#ddd",
                      color: "#111",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePagar}
                    style={{
                      padding: "0.7rem 1.2rem",
                      backgroundColor: "#4f46e5",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Confirmar Pago
                  </button>
                </div>
              </div>
            )
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#ff4d4f",
                fontWeight: "bold",
              }}
            >
              ❌ Debes iniciar sesión para poder pagar
            </p>
          )}
        </>
      )}
    </div>
  );
}
