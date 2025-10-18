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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("carrito")) || [];
    if (stored.length === 0) {
      setCarrito([]);
      return;
    }

    const carritoMap = {};
    stored.forEach((p) => {
      const precioNum = Number(p.precio) || 0;
      if (carritoMap[p.nombre]) {
        carritoMap[p.nombre].cantidad += 1;
      } else {
        carritoMap[p.nombre] = { ...p, cantidad: 1, precio: precioNum };
      }
    });
    setCarrito(Object.values(carritoMap));
  }, []);

  const actualizarLocalStorage = (nuevoCarrito) => {
    const listaExpandida = [];
    nuevoCarrito.forEach((p) => {
      const precioNum = Number(p.precio) || 0;
      for (let i = 0; i < p.cantidad; i++) {
        listaExpandida.push({
          nombre: p.nombre,
          precio: precioNum,
          imagen: p.imagen,
        });
      }
    });
    localStorage.setItem("carrito", JSON.stringify(listaExpandida));
  };

  const incrementar = (index) => {
    const nuevo = [...carrito];
    nuevo[index].cantidad += 1;
    setCarrito(nuevo);
    actualizarLocalStorage(nuevo);
  };

  const decrementar = (index) => {
    const nuevo = [...carrito];
    nuevo[index].cantidad -= 1;
    if (nuevo[index].cantidad === 0) {
      nuevo.splice(index, 1);
    }
    setCarrito(nuevo);
    actualizarLocalStorage(nuevo);
  };

  const eliminar = (index) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
    actualizarLocalStorage(nuevo);
  };

  const totalGeneral = carrito
    .reduce((acc, p) => acc + (Number(p.precio) || 0) * p.cantidad, 0)
    .toFixed(2);

  const handlePagar = () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const { nombre, numero, vencimiento, cvv } = datosTarjeta;
    if (!nombre || !numero || !vencimiento || !cvv) {
      alert("Por favor, completa todos los datos de la tarjeta.");
      return;
    }

    // Validar tarjeta contra JSON
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
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "1.8rem",
          color: "#ffffff",
        }}
      >
        🛒 Tu Carrito
      </h1>

      {carrito.length === 0 ? (
        <div style={{ textAlign: "center", fontSize: "1.1rem" }}>
          <p>El carrito está vacío</p>
        </div>
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
              color: "#f5f5f5",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#333" }}>
                <th style={{ padding: "0.8rem" }}>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((p, i) => {
                const precio = Number(p.precio) || 0;
                return (
                  <tr
                    key={i}
                    style={{
                      textAlign: "center",
                      borderBottom: "1px solid #444",
                    }}
                  >
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.5rem",
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
                      <span>{p.nombre}</span>
                    </td>
                    <td>${precio.toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => decrementar(i)}
                        style={{
                          marginRight: "0.5rem",
                          backgroundColor: "#444",
                          color: "#fff",
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
                          backgroundColor: "#444",
                          color: "#fff",
                          border: "none",
                          padding: "0.3rem 0.6rem",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </td>
                    <td>${(precio * p.cantidad).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => eliminar(i)}
                        style={{
                          backgroundColor: "#ff4d4f",
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
                );
              })}
            </tbody>
          </table>

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

          {!mostrarPago ? (
            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setMostrarPago(true)}
                style={{
                  padding: "0.8rem 1.5rem",
                  backgroundColor: "#646cff",
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
                backgroundColor: "#2a2a2a",
                padding: "1rem",
                borderRadius: "8px",
                marginTop: "1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            >
              <h2
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.3rem",
                  color: "#fff",
                }}
              >
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
                  style={{
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #555",
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                  }}
                />
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  value={datosTarjeta.numero}
                  onChange={(e) =>
                    setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })
                  }
                  style={{
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #555",
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                  }}
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
                  style={{
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #555",
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                  }}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={datosTarjeta.cvv}
                  onChange={(e) =>
                    setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value })
                  }
                  style={{
                    padding: "0.6rem",
                    borderRadius: "6px",
                    border: "1px solid #555",
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                  }}
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
                    backgroundColor: "#555",
                    color: "#fff",
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
                    backgroundColor: "#28a745",
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
          )}
        </>
      )}
    </div>
  );
}


