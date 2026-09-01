// ============================================================
// PANEL DE CRECIMIENTO - ETAPAS Y PROGRESO
// ============================================================

import { 
    getCultivoInfo,
    obtenerDiasTranscurridos,
    getEtapaActual,
    getOffline,
    setFechaInicio,
    getFechaInicio,
    getDatosActuales,
    configuracion,
    setPreviewEtapa,
    getPreviewEtapa
} from './utils.js';

import { actualizarTarjeta } from './sensores.js';

let previewEtapa = null;

export function actualizarPanelCrecimiento(previewIdx = null) {
    const cultivo = getCultivoInfo();
    const diasActuales = obtenerDiasTranscurridos();
    const diasMostrar = previewIdx !== null ? cultivo.etapas[previewIdx].dia : diasActuales;
    const etapaActual = getEtapaActual(diasMostrar);
    const porcentaje = Math.min(100, Math.round((diasMostrar / cultivo.ciclo.promedio) * 100));
    const offline = getOffline();

    document.getElementById('etapaIcono').textContent = etapaActual.nombre.split(' ')[0] || '🌱';
    document.getElementById('etapaNombre').textContent = etapaActual.nombre;
    document.getElementById('etapaDia').textContent = `Día ${diasMostrar}`;
    document.getElementById('etapaDesc').textContent = etapaActual.descripcion;
    document.getElementById('progresoPorcentaje').textContent = `${porcentaje}%`;

    const barra = document.getElementById('progresoBarra');
    barra.style.width = `${porcentaje}%`;
    barra.classList.toggle('offline', offline);

    document.getElementById('diasTranscurridos').textContent = diasMostrar;
    document.getElementById('diasTotales').textContent = cultivo.ciclo.promedio;

    const panel = document.getElementById('panelCrecimiento');
    const etapaPanel = document.getElementById('panelEtapaActual');
    panel.classList.toggle('offline', offline);
    etapaPanel.classList.toggle('offline', offline);

    // Selector de etapas
    const selector = document.getElementById('selectorEtapas');
    if (selector) {
        let html = '';
        cultivo.etapas.forEach((e, idx) => {
            let clase = 'btn-etapa';
            const esActual = e.nombre === etapaActual.nombre && previewIdx === null;
            const esPreview = idx === previewIdx && previewIdx !== null;
            if (esActual) clase += ' activo';
            if (esPreview) clase += ' preview';
            html += `<button class="${clase}" onclick="window.seleccionarPreview(${idx})" ${offline ? 'disabled' : ''}>
                ${e.nombre}
            </button>`;
        });
        selector.innerHTML = html;
    }

    // Mini etapas
    const miniEtapas = document.getElementById('miniEtapas');
    if (miniEtapas) {
        let html = '';
        const etapaIdx = cultivo.etapas.indexOf(etapaActual);
        cultivo.etapas.forEach((e, idx) => {
            let clase = 'mini-etapa';
            if (e.nombre === etapaActual.nombre && previewIdx === null) clase += ' actual';
            else if (idx === previewIdx && previewIdx !== null) clase += ' preview';
            else if (idx < etapaIdx) clase += ' completada';
            if (offline) clase += ' offline';
            html += `<span class="${clase}">${e.nombre}</span>`;
        });
        miniEtapas.innerHTML = html;
    }

    const hayPreview = previewIdx !== null;
    const btnAplicar = document.getElementById('btnAplicar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnDia0 = document.getElementById('btnDia0');

    if (offline) {
        btnAplicar.disabled = true;
        btnCancelar.disabled = true;
        btnDia0.disabled = true;
        document.getElementById('cambioPendiente').style.display = 'none';
        return;
    }

    if (hayPreview) {
        btnAplicar.disabled = false;
        btnCancelar.disabled = false;
        btnDia0.disabled = true;
        document.getElementById('cambioPendiente').style.display = 'flex';
        const etapaActualNom = getEtapaActual(diasActuales).nombre;
        document.getElementById('cambioPendienteTexto').textContent = etapaActualNom;
        document.getElementById('cambioPendienteNuevo').textContent = cultivo.etapas[previewIdx].nombre;
    } else {
        btnAplicar.disabled = true;
        btnCancelar.disabled = true;
        btnDia0.disabled = false;
        document.getElementById('cambioPendiente').style.display = 'none';
    }
}

export function seleccionarPreview(idx) {
    if (getOffline()) return;

    const cultivo = getCultivoInfo();
    const diasActuales = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(diasActuales);

    const nombreSeleccionado = cultivo.etapas[idx].nombre
        .replace(/[^a-zA-Záéíóúñ ]/g, '')
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');

    const nombreActual = etapaActual.nombre
        .replace(/[^a-zA-Záéíóúñ ]/g, '')
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');

    if (nombreSeleccionado === nombreActual) {
        cancelarPreview();
        return;
    }

    previewEtapa = idx;
    setPreviewEtapa(idx);
    actualizarPanelCrecimiento(idx);
}

export function aplicarPreview() {
    if (previewEtapa === null || getOffline()) return;

    const cultivo = getCultivoInfo();
    const etapa = cultivo.etapas[previewEtapa];
    const dias = etapa.dia;

    const ahora = new Date();
    const nuevaFecha = new Date(ahora);
    nuevaFecha.setDate(nuevaFecha.getDate() - dias);
    const fechaStr = nuevaFecha.toISOString().split('T')[0];

    setFechaInicio(fechaStr);
    localStorage.setItem('fechaSiembra', fechaStr);
    document.getElementById('fechaSiembraPanel').value = fechaStr;

    // Mapear etapa para Firebase
    let etapaFirebase = "";
    const mapa = {
        "germinacion": "germinacion",
        "plantula": "plantula",
        "crecimiento": "crecimiento",
        "desarrollo": "desarrollo",
        "floracion": "floracion",
        "cosecha": "cosecha"
    };

    let nombreLimpio = etapa.nombre
        .replace(/[^a-zA-Záéíóúñ ]/g, '')
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');

    for (const [key, value] of Object.entries(mapa)) {
        if (nombreLimpio.includes(key) || key.includes(nombreLimpio)) {
            etapaFirebase = value;
            break;
        }
    }

    if (etapaFirebase === "") {
        etapaFirebase = nombreLimpio;
    }

    // Escribir en Firebase
    import('./firebase-config.js').then(({ etapaConfigRef, set }) => {
        set(etapaConfigRef, etapaFirebase)
            .then(() => console.log("✅ Etapa actualizada en Firebase:", etapaFirebase))
            .catch(err => console.error("❌ Error al actualizar etapa:", err));
    });

    previewEtapa = null;
    setPreviewEtapa(null);
    actualizarPanelCrecimiento(null);

    const datos = getDatosActuales();
    if (datos) {
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
    }

    document.getElementById('btnAplicar').disabled = true;
    document.getElementById('btnCancelar').disabled = true;
    document.getElementById('btnDia0').disabled = false;
    document.getElementById('cambioPendiente').style.display = 'none';
}

export function cancelarPreview() {
    previewEtapa = null;
    setPreviewEtapa(null);
    actualizarPanelCrecimiento(null);
    document.getElementById('btnAplicar').disabled = true;
    document.getElementById('btnCancelar').disabled = true;
    document.getElementById('btnDia0').disabled = false;
    document.getElementById('cambioPendiente').style.display = 'none';
}

export function dia0() {
    if (getOffline()) return;

    if (confirm('¿Estás seguro de que quieres reiniciar el cultivo a Día 0?')) {
        const hoy = new Date();
        const fechaStr = hoy.toISOString().split('T')[0];
        setFechaInicio(fechaStr);
        localStorage.setItem('fechaSiembra', fechaStr);
        document.getElementById('fechaSiembraPanel').value = fechaStr;

        previewEtapa = null;
        setPreviewEtapa(null);
        actualizarPanelCrecimiento(null);

        const datos = getDatosActuales();
        if (datos) {
            for (const sensor in configuracion) {
                const valor = Number(datos[configuracion[sensor].campo]);
                actualizarTarjeta(sensor, valor);
            }
        }
    }
}

// Exponer globalmente
window.seleccionarPreview = seleccionarPreview;
window.aplicarPreview = aplicarPreview;
window.cancelarPreview = cancelarPreview;
window.dia0 = dia0;