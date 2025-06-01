import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue, update, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC6T4wb8ZhNT55Tss8bOUGUNSRMlhz-brY",
  authDomain: "controlaccesoesp32-820ba.firebaseapp.com",
  databaseURL: "https://controlaccesoesp32-820ba-default-rtdb.firebaseio.com",
  projectId: "controlaccesoesp32-820ba",
  storageBucket: "controlaccesoesp32-820ba.appspot.com",
  messagingSenderId: "53262617630",
  appId: "1:53262617630:web:5cee0e97225dd940b5320f",
  measurementId: "G-E86XLYSPCP"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencias a las tablas HTML
const tabla = document.getElementById("tablaAccesos");
const tablaDenegados = document.getElementById("tablaDenegados");

// Escuchar accesos permitidos
onValue(ref(db, "accesos"), (snapshot) => {
  const datos = snapshot.val();
  tabla.innerHTML = "";

  if (!datos) {
    tabla.innerHTML = "<tr><td colspan='4'>No hay registros aún</td></tr>";
    return;
  }

  Object.entries(datos).forEach(([uid, entradas]) => {
    Object.entries(entradas).forEach(([timestamp, registro]) => {
      const nombre = registro.nombre || "Desconocido";
      const fecha = registro.FECHA || "-";
      const hora = registro.hora || "-";

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${nombre}</td>
        <td>${uid}</td>
        <td>${fecha}</td>
        <td>${hora}</td>
      `;
      tabla.appendChild(fila);
    });
  });
});

// Escuchar accesos denegados
onValue(ref(db, "denegados"), (snapshot) => {
  const datos = snapshot.val();
  tablaDenegados.innerHTML = "";

  if (!datos) {
    tablaDenegados.innerHTML = "<tr><td colspan='3'>No hay registros aún</td></tr>";
    return;
  }

  Object.entries(datos).forEach(([timestamp, registro]) => {
    const uid = registro.UID || "Desconocido";
    const fecha = registro.fecha || "-";
    const hora = registro.hora || "-";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${uid}</td>
      <td>${fecha}</td>
      <td>${hora}</td>
    `;
    tablaDenegados.appendChild(fila);
  });
});

// Botón para actualizar permisos
document.getElementById("btnActualizar").onclick = () => {
  const uid = document.getElementById("uidInput").value.trim().toUpperCase();
  const permitido = document.getElementById("permisoInput").value === "true";

  if (!uid) {
    alert("Por favor ingresa un UID válido.");
    return;
  }

  update(ref(db, `usuarios/${uid}`), { permitido })
    .then(() => alert("Permiso actualizado correctamente"))
    .catch((error) => alert("Error al actualizar permiso: " + error));
};

// Botón para abrir puerta remotamente
document.getElementById("btnAbrir").onclick = () => {
  set(ref(db, "control_remoto/abrir_puerta"), true)
    .then(() => alert("Puerta activada remotamente"))
    .catch((error) => alert("Error al abrir puerta: " + error));
};
