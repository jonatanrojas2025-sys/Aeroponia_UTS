// ============================================================
// PANEL DE CRECIMIENTO - PROGRESO Y ETAPAS
// ============================================================

import { 
    getCultivoInfo,
    obtenerDiasTranscurridos,
    getEtapaActual,
    getOffline
} from './utils.js';

export function actualizarPanelCrecimiento() {
    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
    const offline = getOffline();

    const etapaIcono = document.getElementById('etapaIcono');
    if (etapaIcono) etapaIcono.textContent = etapaActual.nombre.split(' ')[0] || '🌱';

    const etapaNombre = document.getElementById('etapaNombre');
    if (etapaNombre) etapaNombre.textContent = etapaActual.nombre;

    const etapaDia = document.getElementById('etapaDia');
    if (etapaDia) etapaDia.textContent = `Día ${dias}`;

    const etapaDesc = document.getElementById('etapaDesc');
    if (etapaDesc) etapaDesc.textContent = cultivo.etapas.find(e => e.nombre === etapaActual.nombre)?.descripcion || '';

    const progresoPorcentaje = document.getElementById('progresoPorcentaje');
    if (progresoPorcentaje) progresoPorcentaje.textContent = `${porcentaje}%`;
    
    const barra = document.getElementById('progresoBarra');
    if (barra) {
        barra.style.width = `${porcentaje}%`;
        barra.classList.toggle('offline', offline);
    }
    
    const diasTranscurridos = document.getElementById('diasTranscurridos');
    if (diasTranscurridos) diasTranscurridos.textContent = dias;

    const diasTotales = document.getElementById('diasTotales');
    if (diasTotales) diasTotales.textContent = cultivo.ciclo.promedio;

    const panel = document.getElementById('panelCrecimiento');
    if (panel) panel.classList.toggle('offline', offline);

    const etapaPanel = document.getElementById('panelEtapaActual');
    if (etapaPanel) etapaPanel.classList.toggle('offline', offline);
}