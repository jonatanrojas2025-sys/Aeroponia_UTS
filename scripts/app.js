// ============================================================
// APP - PUNTO DE ENTRADA PRINCIPAL
// ============================================================

// Importar módulos
import './firebase-config.js';
import './guia.js';
import './utils.js';
import './cultivos-db.js';
import './analisis.js';
import './sensores.js';
import './crecimiento.js';
import './grafica.js';
import './historial.js';
import './asistente.js';

import {
    db,
    valorActualRef,
    historialRef,
    set,
    onValue
} from './firebase-config.js';

import {
    setDatosActuales,
    setRegistrosHistorial,
    setOffline,
    setLastUpdate,
    setFechaInicio,
    getFechaInicio,
    getCultivoInfo,
    getOffline,
    getDatosActuales,
    getRegistrosHistorial,
    configuracion
} from './utils.js';

import {
    renderizarSensores,
    actualizarTarjeta,
    actualizarTarjetaBomba,
    actualizarDetalleAbierto
} from './sensores.js';

import {
    actualizarPanelCrecimiento,
    cancelarPreview
} from './crecimiento.js';

import { actualizarGrafica } from './grafica.js';
import { actualizarTabla } from './historial.js';
import { actualizarAsistente, iniciarChat, renderizarChips } from './asistente.js';
import { actualizarEstadoGeneral } from './estado.js';

// ============================================================
// CONSTANTES
// ============================================================

const DATA_TIMEOUT_MS = 30000;
let dataTimeout = null;
let offlineStartTime = null;
let offlineTimerInterval = null;
let datosRecibidos = false;
let previewEtapa = null;

// ============================================================
// INICIALIZACIÓN
// ============================================================

// Renderizar sensores
renderizarSensores();

// Cargar fecha de siembra
const fechaGuardada = localStorage.getItem('fechaSiembra');
if (fechaGuardada) {
    setFechaInicio(fechaGuardada);
    document.getElementById('fechaSiembraPanel').value = fechaGuardada;
} else {
    const hoy = new Date();
    const fechaStr = hoy.toISOString().split('T')[0];
    setFechaInicio(fechaStr);
    document.getElementById('fechaSiembraPanel').value = fechaStr;
    localStorage.setItem('fechaSiembra', fechaStr);
}

// ============================================================
// FUNCIONES DE ESTADO Y OFFLINE
// ============================================================

function actualizarEstadoOffline(offline) {
    setOffline(offline);

    const badge = document.getElementById("statusBadge");
    const text = document.getElementById("statusText");
    const icon = document.getElementById("statusIcon");
    const banner = document.getElementById("offlineBanner");
    const alerta = document.getElementById("alertaBox");

    if (offline) {
        badge.className = "status-badge offline";
        text.textContent = '📡 Sin datos ESP32';
        icon.className = 'fas fa-wifi-slash';

        banner.classList.add("visible");

        if (offlineStartTime === null) {
            offlineStartTime = new Date();
        }
        iniciarTimerOffline();

        alerta.className = "alerta-box offline";
        alerta.innerHTML = `
            <i class="fas fa-microchip"></i>
            <span>
                <strong>📡 ESP32 SIN TRANSMITIR DATOS</strong>
                <span style="color:#94a3b8; display:block; font-size:13px; margin-top:4px;">
                    El sistema sigue funcionando de forma autónoma.
                    <span style="color:#fcd34d; display:inline-block; margin-top:4px; padding:2px 10px; background:rgba(245,158,11,0.15); border-radius:12px;">
                        🤖 MODO AUTÓNOMO ACTIVO
                    </span>
                </span>
            </span>
        `;

        document.getElementById('chartContainer').classList.add('offline');
        document.getElementById('tableWrapper').classList.add('offline');

    } else {
        badge.className = "status-badge connected";
        text.textContent = '✅ Conectado';
        icon.className = 'fas fa-circle';

        banner.classList.remove("visible");

        if (offlineStartTime !== null) {
            offlineStartTime = null;
        }
        if (offlineTimerInterval) {
            clearInterval(offlineTimerInterval);
            offlineTimerInterval = null;
        }

        document.getElementById('chartContainer').classList.remove('offline');
        document.getElementById('tableWrapper').classList.remove('offline');
    }

    const datos = getDatosActuales();
    if (datos) {
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
        actualizarTarjetaBomba(datos.bomba);
    }

    actualizarPanelCrecimiento(previewEtapa);
    actualizarDetalleAbierto();
    actualizarAsistente();
    renderizarChips();
}

function iniciarTimerOffline() {
    if (offlineTimerInterval) {
        clearInterval(offlineTimerInterval);
    }

    offlineTimerInterval = setInterval(() => {
        if (!offlineStartTime) return;

        const ahora = new Date();
        const diff = Math.floor((ahora - offlineStartTime) / 1000);

        let tiempoStr = '';
        if (diff < 60) {
            tiempoStr = `hace ${diff}s`;
        } else if (diff < 3600) {
            const mins = Math.floor(diff / 60);
            tiempoStr = `hace ${mins}m ${diff % 60}s`;
        } else {
            const horas = Math.floor(diff / 3600);
            const mins = Math.floor((diff % 3600) / 60);
            tiempoStr = `hace ${horas}h ${mins}m`;
        }

        const timerElement = document.getElementById('offlineTimer');
        if (timerElement) {
            timerElement.textContent = `(${tiempoStr})`;
        }
    }, 1000);
}

function reiniciarTimeout() {
    if (dataTimeout) {
        clearTimeout(dataTimeout);
    }

    dataTimeout = setTimeout(() => {
        if (getOffline()) {
            actualizarEstadoOffline(true);
            return;
        }
        actualizarEstadoOffline(true);
    }, DATA_TIMEOUT_MS);
}

// ============================================================
// FIREBASE - VALOR ACTUAL
// ============================================================

onValue(valorActualRef, snapshot => {
    const datos = snapshot.val();

    if (!datos) {
        return;
    }

    datosRecibidos = true;
    setDatosActuales(datos);
    setLastUpdate(new Date());

    const ultimaSpan = document.getElementById('ultimaActualizacion');
    if (ultimaSpan) {
        ultimaSpan.textContent = getLastUpdate().toLocaleTimeString();
    }

    if (getOffline()) {
        actualizarEstadoOffline(false);
        if (chatIniciado) {
            agregarMensaje("🔗 ¡Datos recibidos!", "bot");
        }
    }

    reiniciarTimeout();

    for (const sensor in configuracion) {
        const campo = configuracion[sensor].campo;
        const valor = Number(datos[campo]);
        actualizarTarjeta(sensor, valor);
    }
    actualizarTarjetaBomba(datos.bomba);

    actualizarEstadoGeneral();
    actualizarDetalleAbierto();

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
    actualizarDetalleAbierto();

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

    document.getElementById("chatMensajes").innerHTML = "";
    chatIniciado = false;
    cancelarPreview();

    const datos = getDatosActuales();
    if (datos) {
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
        actualizarTarjetaBomba(datos.bomba);
        actualizarEstadoGeneral();
        if (sensorAbierto) actualizarDetalle(sensorAbierto);
    }

    iniciarChat();
});

// ============================================================
// FECHA DE SIEMBRA
// ============================================================

const fechaPanel = document.getElementById('fechaSiembraPanel');

fechaPanel.addEventListener('change', function() {
    if (getOffline()) return;
    setFechaInicio(this.value);
    localStorage.setItem('fechaSiembra', this.value);
    cancelarPreview();
    actualizarEstadoGeneral();

    const datos = getDatosActuales();
    if (datos) {
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
    }
});

document.getElementById('btnHoy').addEventListener('click', function() {
    if (getOffline()) return;
    const hoy = new Date();
    const fechaStr = hoy.toISOString().split('T')[0];
    fechaPanel.value = fechaStr;
    setFechaInicio(fechaStr);
    localStorage.setItem('fechaSiembra', fechaStr);
    cancelarPreview();
    actualizarEstadoGeneral();
});

document.getElementById('btnSemana').addEventListener('click', function() {
    if (getOffline()) return;
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 7);
    const fechaStr = hoy.toISOString().split('T')[0];
    fechaPanel.value = fechaStr;
    setFechaInicio(fechaStr);
    localStorage.setItem('fechaSiembra', fechaStr);
    cancelarPreview();
    actualizarEstadoGeneral();
});

// ============================================================
// BOTONES DE ACCIÓN
// ============================================================

document.getElementById('btnAplicar').addEventListener('click', function() {
    import('./crecimiento.js').then(({ aplicarPreview }) => aplicarPreview());
});

document.getElementById('btnCancelar').addEventListener('click', function() {
    import('./crecimiento.js').then(({ cancelarPreview }) => cancelarPreview());
});

document.getElementById('btnDia0').addEventListener('click', function() {
    import('./crecimiento.js').then(({ dia0 }) => dia0());
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
// INICIALIZACIÓN FINAL
// ============================================================

reiniciarTimeout();

setTimeout(() => {
    actualizarPanelCrecimiento(null);
}, 100);

console.log("🚀 Dashboard Aeroponia UTS - Versión modular");
console.log("✅ Estructura organizada en archivos separados");