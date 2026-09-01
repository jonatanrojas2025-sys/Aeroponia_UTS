// ============================================================
// HISTORIAL - TABLA
// ============================================================

import { getRegistrosHistorial, getOffline, obtenerEstado } from './utils.js';

export function actualizarTabla() {
    const registros = getRegistrosHistorial();
    const tbody = document.getElementById("tabla-body");

    if (!registros || !registros.length) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">📭 No hay datos históricos.</td></tr>`;
        return;
    }

    const offline = getOffline();
    let html = "";

    // Mostrar los últimos 30 registros (más recientes primero)
    const registrosMostrar = registros.slice().reverse().slice(0, 30);

    registrosMostrar.forEach(r => {
        const ph = Number(r.PH);
        const temp = Number(r.Temperatura_Ambiente);
        const tempAgua = Number(r.Temperatura_Agua);
        const hum = Number(r.Humedad_Ambiente);
        const luz = Number(r.luz);
        const bombaOn = r.bomba === true || r.bomba === "true";

        let fecha = "--";
        if (r.timestamp) {
            fecha = new Date(r.timestamp).toLocaleTimeString();
        }

        // Evaluar estado general
        const estados = [
            obtenerEstado("ph", ph).estado,
            obtenerEstado("temp", temp).estado,
            obtenerEstado("temp-agua", tempAgua).estado,
            obtenerEstado("hum", hum).estado,
            obtenerEstado("luz", luz).estado
        ];

        let estadoTexto = "✅ Normal";
        let estadoClase = "td-ok";
        if (estados.includes("danger")) {
            estadoTexto = "❌ Revisar";
            estadoClase = "td-danger";
        } else if (estados.includes("warning")) {
            estadoTexto = "⚠️ Atención";
            estadoClase = "td-warning";
        }

        if (offline) {
            estadoTexto = "📡 Sin datos";
            estadoClase = "td-danger";
        }

        html += `
            <tr>
                <td style="color:#64748b; font-size:12px;">${fecha}</td>
                <td>${Number.isFinite(ph) ? ph.toFixed(2) : "--"}</td>
                <td>${Number.isFinite(temp) ? temp.toFixed(1)+"°C" : "--"}</td>
                <td>${Number.isFinite(tempAgua) ? tempAgua.toFixed(1)+"°C" : "--"}</td>
                <td>${Number.isFinite(hum) ? hum.toFixed(1)+"%" : "--"}</td>
                <td>${Number.isFinite(luz) ? luz.toFixed(0)+" lux" : "--"}</td>
                <td class="${bombaOn ? 'td-ok' : ''}">${bombaOn ? "🔴 ON" : "⚪ OFF"}</td>
                <td class="${estadoClase}">${estadoTexto}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}