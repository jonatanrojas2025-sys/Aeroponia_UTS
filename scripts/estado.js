// ============================================================
// ESTADO GENERAL - ALERTA
// ============================================================

import {
    getDatosActuales,
    getRegistrosHistorial,
    getCultivoInfo,
    getOffline,
    getFechaInicio,
    getLastUpdate,
    obtenerDiasTranscurridos,
    getEtapaActual,
    configuracion
} from './utils.js';

import { analizarSensor } from './analisis.js';
import { actualizarPanelCrecimiento } from './crecimiento.js';
import { actualizarAsistente } from './asistente.js';

let previewEtapa = null;

export function actualizarEstadoGeneral() {
    const alerta = document.getElementById("alertaBox");
    const datos = getDatosActuales();
    const registros = getRegistrosHistorial();

    if (!datos || !registros.length) return;

    const cultivo = getCultivoInfo();
    const totalRegistros = registros.length;
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const offline = getOffline();
    const fechaInicio = getFechaInicio();

    if (offline) {
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
        actualizarPanelCrecimiento(previewEtapa);
        return;
    }

    let problemas = [];
    let advertencias = [];

    for (const sensor in configuracion) {
        const valor = Number(datos[configuracion[sensor].campo]);
        if (!Number.isFinite(valor)) continue;

        const analisis = analizarSensor(sensor, valor);
        if (analisis.estado.estado === "danger") {
            problemas.push(configuracion[sensor].nombre);
        } else if (analisis.estado.estado === "warning") {
            advertencias.push(configuracion[sensor].nombre);
        }
    }

    let nivel = "success";
    let icono = "✅";
    let mensaje = `${cultivo.nombre} en óptimas condiciones.`;

    if (problemas.length > 0) {
        nivel = "danger";
        icono = "🚨";
        mensaje = `${problemas.length} problema(s): ${problemas.join(", ")}. ¡ACTÚA!`;
    } else if (advertencias.length > 0) {
        nivel = "loading";
        icono = "⚠️";
        mensaje = `${advertencias.length} aviso(s): ${advertencias.join(", ")}.`;
    }

    alerta.className = `alerta-box ${nivel}`;
    alerta.innerHTML = `
        <i class="fas ${icono === '🚨' ? 'fa-triangle-exclamation' : icono === '⚠️' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
        <span>
            <strong>${icono} ${mensaje}</strong>
            📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre} (Día ${dias})
            ${fechaInicio ? ` | 📅 ${new Date(fechaInicio).toLocaleDateString()}` : ''}
            ${getLastUpdate() ? ` | ⏱️ ${getLastUpdate().toLocaleTimeString()}` : ''}
        </span>
    `;

    actualizarPanelCrecimiento(previewEtapa);
    actualizarAsistente();
}