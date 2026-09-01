// ============================================================
// ESTADO GENERAL - ALERTA Y CONEXIÓN
// ============================================================

import { 
    getDatosActuales, 
    getRegistrosHistorial, 
    getCultivoInfo,
    getOffline,
    getLastUpdate,
    obtenerDiasTranscurridos,
    getEtapaActual,
    configuracion,
    obtenerEstado
} from './utils.js';

let previewEtapa = null;

export function actualizarEstadoGeneral() {
    const alerta = document.getElementById("alertaBox");
    const datos = getDatosActuales();
    const registros = getRegistrosHistorial();

    if (!datos || !registros || !registros.length) {
        alerta.className = "alerta-box loading";
        alerta.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>Esperando datos del sistema...</span>`;
        return;
    }

    const cultivo = getCultivoInfo();
    const totalRegistros = registros.length;
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const offline = getOffline();
    const lastUpdate = getLastUpdate();

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
                <span style="color:#64748b; display:block; font-size:12px; margin-top:4px;">
                    📊 ${totalRegistros} registros históricos | 🌱 ${etapaActual.nombre}
                </span>
            </span>
        `;
        return;
    }

    let problemas = [];
    let advertencias = [];

    for (const sensor in configuracion) {
        const valor = Number(datos[configuracion[sensor].campo]);
        if (!Number.isFinite(valor) || valor === -273.15) continue;

        const estado = obtenerEstado(sensor, valor);
        if (estado.estado === "danger") {
            problemas.push(configuracion[sensor].nombre);
        } else if (estado.estado === "warning") {
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
            ${lastUpdate ? ` | ⏱️ ${lastUpdate.toLocaleTimeString()}` : ''}
        </span>
    `;
}