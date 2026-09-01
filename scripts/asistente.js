// ============================================================
// ASISTENTE - CHAT Y RECOMENDACIONES (VERSIÓN SIMPLIFICADA)
// ============================================================

import { getDatosActuales, getCultivoInfo, obtenerDiasTranscurridos, getEtapaActual } from './utils.js';

let chatIniciado = false;

export function actualizarAsistente() {
    // Versión simplificada - muestra estado básico
    const container = document.getElementById("consejosContainer");
    if (!container) return;

    const datos = getDatosActuales();
    if (!datos) return;

    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);

    container.innerHTML = `
        <div class="consejo consejo-info">
            <div class="consejo-icono"><i class="fas fa-leaf"></i></div>
            <div class="consejo-contenido">
                <h4>🌱 ${cultivo.nombre} - ${cultivo.tipo}</h4>
                <p>${cultivo.descripcion}</p>
                <p style="margin-top:6px;">🌱 ${etapaActual.nombre} (Día ${dias})</p>
            </div>
        </div>
    `;
}