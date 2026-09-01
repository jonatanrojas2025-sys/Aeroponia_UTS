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

    registros.slice().reverse().slice(0, 30).forEach(r => {
        const ph = Number(r.PH);
        const temp = Number(r.Temperatura_Ambiente);
        const tempAgua = Number(r.Temperatura_Agua);
        const hum = Number(r.Humedad_Ambiente);
        const luz = Number(r.luz);
        const bombaOn = r.bomba === true || r.bomba === "true" || r.bomba === 1;

        let fecha = "--";
        if (r.timestamp) {
            fecha = new Date(r.timestamp).toLocaleTimeString();
        }

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
                <td>${Number.isFinite(ph) && ph !== -273.15 ? ph.toFixed(2) : "--"}</td>
                <td>${Number.isFinite(temp) && temp !== -273.15 ? temp.toFixed(1)+"°C" : "--"}</td>
                <td>${Number.isFinite(tempAgua) && tempAgua !== -273.15 ? tempAgua.toFixed(1)+"°C" : "--"}</td>
                <td>${Number.isFinite(hum) && hum !== -273.15 ? hum.toFixed(1)+"%" : "--"}</td>
                <td>${Number.isFinite(luz) && luz !== -273.15 ? luz.toFixed(0)+" lux" : "--"}</td>
                <td class="${bombaOn ? 'td-ok' : ''}">${bombaOn ? "🔴 ON" : "⚪ OFF"}</td>
                <td class="${estadoClase}">${estadoTexto}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}