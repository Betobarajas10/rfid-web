// Configura tu Firebase aquí (usa tu propia configuración)
const firebaseConfig = {
  apiKey: "AIzaSyC6T4wb8ZhNT55Tss8bOUGUNSRMlhz-brY",
  authDomain: "controlaccesoesp32-820ba.firebaseapp.com",
  databaseURL: "https://controlaccesoesp32-820ba-default-rtdb.firebaseio.com",
  projectId: "controlaccesoesp32-820ba",
  storageBucket: "controlaccesoesp32-820ba.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const tablaCuerpo = document.querySelector("#accesosTable tbody");

// Función para leer datos de 'accesos' y mostrarlos en la tabla
function cargarAccesos() {
  const accesosRef = db.ref("accesos");

  accesosRef.on("value", (snapshot) => {
    tablaCuerpo.innerHTML = ""; // Limpiar tabla antes de actualizar

    const accesos = snapshot.val();
    if (!accesos) {
      tablaCuerpo.innerHTML = "<tr><td colspan='4'>No hay registros</td></tr>";
      return;
    }

    // Recorrer cada UID
    Object.keys(accesos).forEach(uid => {
      const registrosUID = accesos[uid];
      // Recorrer registros individuales (timestamp u otro ID)
      Object.keys(registrosUID).forEach(regId => {
        const reg = registrosUID[regId];
        const fila = document.createElement("tr");

        // Mostrar nombre (permitido o desconocido)
        const nombre = reg.nombre || "Desconocido";
        const fecha = reg.fecha || "-";
        const hora = reg.hora || "-";

        fila.innerHTML = `
          <td>${nombre}</td>
          <td>${reg.uid}</td>
          <td>${fecha}</td>
          <td>${hora}</td>
        `;
        tablaCuerpo.appendChild(fila);
      });
    });
  });
}

window.onload = cargarAccesos;
