// Importar los módulos Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue, update, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Configuración Firebase (reemplaza con la tuya)
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

// Referencia a la tabla donde se mostrará el historial
const tabla = document.getElementById("tablaAccesos");
const accesosRef = ref(db, "accesos");

// Escuchar cambios en tiempo real y mostrar historial
onValue(accesosRef, (snapshot) => {
  tabla.innerHTML = "";
  const datos = snapshot.val();
  console.log("Datos accesos:", datos);  // <--- Aquí imprimimos para ver

  if (datos) {
    Object.entries(datos).forEach(([uid, registro]) => {
      console.log("Registro UID:", uid, registro);  // <--- Imprime cada registro
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${registro.nombre || "Desconocido"}</td>
        <td>${registro.uid || uid}</td>
        <td>${registro.FECHA || "-"}</td>
        <td>${registro.hora || "-"}</td>
      `;
      tabla.appendChild(fila);
    });
  } else {
    tabla.innerHTML = "<tr><td colspan='4'>No hay registros aún</td></tr>";
  }
});


// Función para actualizar permiso de usuario
window.actualizarPermiso = function () {
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
window.abrirPuerta = function () {
  set(ref(db, "control_remoto/abrir_puerta"), true)
    .then(() => alert("Puerta activada remotamente"))
    .catch((error) => alert("Error al abrir puerta: " + error));
};
