// Importa módulos Firebase desde CDN
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

// Referencia al tbody para historial
const tabla = document.getElementById("tablaAccesos");
const accesosRef = ref(db, "accesos");

// Escuchar cambios en tiempo real y mostrar historial
onValue(accesosRef, (snapshot) => {
  const datos = snapshot.val();
  tabla.innerHTML = ""; // Limpiar filas previas

  if (!datos) {
    tabla.innerHTML = "<tr><td colspan='4'>No hay registros aún</td></tr>";
    return;
  }

  Object.entries(datos).forEach(([key, registro]) => {
    // Validar que registro tenga nombre y uid
    const nombre = registro.nombre || "Desconocido";
    const uid = registro.uid || key;
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

// Función para actualizar permiso de usuario (habilitar o bloquear)
document.getElementById("btnActualizar").onclick = () => {
  const uid = document.getElementById("uidInput").value.trim();
  const permitido = document.getElementById("permisoInput").value === "true";

  if (!uid) {
    alert("Por favor ingresa un UID válido.");
    return;
  }

  update(ref(db, `usuarios/${uid}`), { permitido })
    .then(() => alert("Permiso actualizado correctamente"))
    .catch((error) => alert("Error al actualizar permiso: " + error));
};

// Función para abrir puerta remotamente
document.getElementById("btnAbrir").onclick = () => {
  set(ref(db, "control_remoto/abrir_puerta"), true)
    .then(() => alert("Puerta activada remotamente"))
    .catch((error) => alert("Error al abrir puerta: " + error));
};
