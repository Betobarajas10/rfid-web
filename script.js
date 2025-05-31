// Importar SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue, set, update, push } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Tu configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC6T4wb8ZhNT55Tss8bOUGUNSRMlhz-brY",
  authDomain: "controlaccesoesp32-820ba.firebaseapp.com",
  databaseURL: "https://controlaccesoesp32-820ba-default-rtdb.firebaseio.com",
  projectId: "controlaccesoesp32-820ba",
  storageBucket: "controlaccesoesp32-820ba.firebasestorage.app",
  messagingSenderId: "53262617630",
  appId: "1:53262617630:web:5cee0e97225dd940b5320f",
  measurementId: "G-E86XLYSPCP"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Cargar historial en tiempo real
const tabla = document.getElementById("tablaAccesos");
const accesosRef = ref(db, "accesos");

onValue(accesosRef, (snapshot) => {
  tabla.innerHTML = "";
  const datos = snapshot.val();
  if (datos) {
    Object.values(datos).reverse().forEach((registro) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${registro.nombre || "Desconocido"}</td>
        <td>${registro.uid}</td>
        <td>${registro.fecha}</td>
        <td>${registro.hora}</td>
      `;
      tabla.appendChild(fila);
    });
  } else {
    tabla.innerHTML = "<tr><td colspan='4'>No hay registros aún</td></tr>";
  }
});

// Bloquear o habilitar tarjetas
window.actualizarPermiso = function () {
  const uid = document.getElementById("uidInput").value.trim();
  const permitido = document.getElementById("permisoInput").value === "true";
  if (!uid) return alert("UID vacío");

  update(ref(db, `usuarios/${uid}`), { permitido })
    .then(() => alert("Actualizado correctamente"))
    .catch((e) => alert("Error: " + e));
};

// Abrir puerta remotamente
window.abrirPuerta = function () {
  set(ref(db, "control_remoto/abrir_puerta"), true)
    .then(() => alert("Puerta activada"))
    .catch((e) => alert("Error al abrir puerta: " + e));
};
