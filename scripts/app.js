// ============================================================
// APP - PUNTO DE ENTRADA PRINCIPAL (ORQUESTADOR)
// ============================================================

// Importar módulos
import { valorActualRef, historialRef, onValue } from './firebase-config.js';
import { configuracion, DATA_TIMEOUT_MS } from './config.js';
import { 
    setDatosActuales, 
    setRegistrosHistorial, 
    getDatosActuales, 
    getRegistrosHistorial,
    setOffline,
    getOffline,
    setLastUpdate,
    getLastUpdate,
    getCultivoInfo
} from './utils.js';

import { renderizarSensores, actualizarTarjeta, actualizarTarjetaBomba } from './sensores.js';
import { actualizarPanelCrecimiento } from './crecimiento.js';
import { actualizarGrafica } from './grafica.js';
import { actualizarTabla } from './historial.js';
import { procesarAlarmas, actualizarHistorialAlarmas } from './alertas.js';
import { actualizarEstadoGeneral } from './estado.js';

// ============================================================
// VARIABLES GLOBALES
// ============================================================

let dataTimeout = null;
let chatIniciado = false;

// ============================================================
// FUNCIONES DE CONEXIÓN
// ============================================================

function actualizarEstadoOffline(offline) {
    setOffline(offline);
    
    const badge = document.getElementById("statusBadge");
    const text = document.getElementById("statusText");
    const icon = document.getElementById("statusIcon");
    
    if (offline) {
        badge.className = "status-badge offline";
        text.textContent = '📡 Sin datos ESP32';
        icon.className = 'fas fa-wifi-slash';
    } else {
        badge.className = "status-badge connected";
        text.textContent = '✅ Conectado';
        icon.className = 'fas fa-circle';
    }
    
    const datos = getDatosActuales();
    if (datos) {
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
        actualizarTarjetaBomba(datos.bomba);
    }
    
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();
}

function reiniciarTimeout() {
    if (dataTimeout) clearTimeout(dataTimeout);
    dataTimeout = setTimeout(() => {
        actualizarEstadoOffline(true);
    }, DATA_TIMEOUT_MS);
}

// ============================================================
// FIREBASE - VALOR ACTUAL
// ============================================================

onValue(valorActualRef, snapshot => {
    const datos = snapshot.val();
    if (!datos) return;

    setDatosActuales(datos);
    setLastUpdate(new Date());

    if (getOffline()) {
        actualizarEstadoOffline(false);
    }

    reiniciarTimeout();

    for (const sensor in configuracion) {
        const campo = configuracion[sensor].campo;
        const valor = Number(datos[campo]);
        actualizarTarjeta(sensor, valor);
    }
    actualizarTarjetaBomba(datos.bomba);

    actualizarEstadoGeneral();
    
    // ====== PROCESAR ALARMAS ======
    const registros = getRegistrosHistorial();
    const lastUpdate = getLastUpdate();
    procesarAlarmas(datos, registros, lastUpdate);

    console.log("📊 Datos recibidos:", {
        pH: datos.PH,
        temp: datos.Temperatura_Ambiente,
        tempAgua: datos.Temperatura_Agua,
        humedad: datos.Humedad_Ambiente,
        luz: datos.luz,
        bomba: datos.bomba
    });

}, error => {
    console.error("Firebase error (ValorActual):", error);
});

// ============================================================
// FIREBASE - HISTORIAL
// ============================================================

onValue(historialRef, snapshot => {
    const data = snapshot.val();
    if (!data) {
        setRegistrosHistorial([]);
        return;
    }

    const registros = Object.entries(data)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    setRegistrosHistorial(registros);

    document.getElementById("contador-registros").textContent = registros.length;
    actualizarTabla();
    actualizarGrafica();
    actualizarEstadoGeneral();
    actualizarHistorialAlarmas();

}, error => {
    console.error("Firebase error (Historial):", error);
});

// ============================================================
// SELECTOR DE CULTIVO
// ============================================================

document.getElementById('selectorCultivo').addEventListener('change', function() {
    const cultivo = this.value;
    import('./utils.js').then(({ setCultivo }) => {
        setCultivo(cultivo);
    });

    const datos = getDatosActuales();
    if (datos) {
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
        actualizarTarjetaBomba(datos.bomba);
        actualizarEstadoGeneral();
        actualizarPanelCrecimiento();
    }
});

// ============================================================
// SECCIONES CONTRAÍBLES
// ============================================================

window.toggleSeccion = function(id) {
    const contenido = document.getElementById(id);
    const flecha = document.getElementById(`flecha-${id}`);
    if (!contenido) return;

    const oculto = contenido.classList.toggle("oculto");
    if (flecha) {
        flecha.style.transform = oculto ? "rotate(-90deg)" : "rotate(0deg)";
    }
};

// ============================================================
// INICIALIZACIÓN
// ============================================================

renderizarSensores();
actualizarPanelCrecimiento();
reiniciarTimeout();

console.log("🚀 Dashboard Aeroponia UTS - Versión modular");
console.log("✅ Estructura organizada en archivos separados");