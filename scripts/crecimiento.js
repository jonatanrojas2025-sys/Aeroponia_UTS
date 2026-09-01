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

// ============================================================
// ACTUALIZAR PANEL DE CRECIMIENTO
// ============================================================

export function actualizarPanelCrecimiento(previewIdx = null) {
    const cultivo = getCultivoInfo();
    const diasActuales = obtenerDiasTranscurridos();
    const diasMostrar = previewIdx !== null ? cultivo.etapas[previewIdx].dia : diasActuales;
    const etapaActual = getEtapaActual(diasMostrar);
    const porcentaje = Math.min(100, Math.round((diasMostrar / cultivo.ciclo.promedio) * 100));
    const offline = getOffline();

    // ============================================================
    // ACTUALIZAR ELEMENTOS CON VERIFICACIÓN DE EXISTENCIA
    // ============================================================

    // Etapa actual
    const etapaIcono = document.getElementById('etapaIcono');
    if (etapaIcono) etapaIcono.textContent = etapaActual.nombre.split(' ')[0] || '🌱';

    const etapaNombre = document.getElementById('etapaNombre');
    if (etapaNombre) etapaNombre.textContent = etapaActual.nombre;

    const etapaDia = document.getElementById('etapaDia');
    if (etapaDia) etapaDia.textContent = `Día ${diasMostrar}`;

    const etapaDesc = document.getElementById('etapaDesc');
    if (etapaDesc) etapaDesc.textContent = etapaActual.descripcion;

    // Progreso
    const progresoPorcentaje = document.getElementById('progresoPorcentaje');
    if (progresoPorcentaje) progresoPorcentaje.textContent = `${porcentaje}%`;

    // ==== BARRA DE PROGRESO (SOLUCIÓN DEL ERROR) ====
    const barra = document.getElementById('progresoBarra');
    if (barra) {
        barra.style.width = `${porcentaje}%`;
        barra.classList.toggle('offline', offline);
    } else {
        console.warn('⚠️ Elemento progresoBarra no encontrado en el HTML');
    }

    const diasTranscurridos = document.getElementById('diasTranscurridos');
    if (diasTranscurridos) diasTranscurridos.textContent = diasMostrar;

    const diasTotales = document.getElementById('diasTotales');
    if (diasTotales) diasTotales.textContent = cultivo.ciclo.promedio;

    // Panel de crecimiento (offline)
    const panel = document.getElementById('panelCrecimiento');
    if (panel) panel.classList.toggle('offline', offline);

    const etapaPanel = document.getElementById('panelEtapaActual');
    if (etapaPanel) etapaPanel.classList.toggle('offline', offline);

    // ============================================================
    // SELECTOR DE ETAPAS (BOTONES)
    // ============================================================

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

    // ============================================================
    // MINI ETAPAS (LÍNEA DE TIEMPO)
    // ============================================================

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

    // ============================================================
    // BOTONES DE ACCIÓN (Aplicar / Cancelar / Día 0)
    // ============================================================

    const hayPreview = previewIdx !== null;
    const btnAplicar = document.getElementById('btnAplicar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnDia0 = document.getElementById('btnDia0');
    const cambioPendiente = document.getElementById('cambioPendiente');

    // Si está offline, deshabilitar todo
    if (offline) {
        if (btnAplicar) btnAplicar.disabled = true;
        if (btnCancelar) btnCancelar.disabled = true;
        if (btnDia0) btnDia0.disabled = true;
        if (cambioPendiente) cambioPendiente.style.display = 'none';
        return;
    }

    // Si hay vista previa, activar botones
    if (hayPreview) {
        if (btnAplicar) btnAplicar.disabled = false;
        if (btnCancelar) btnCancelar.disabled = false;
        if (btnDia0) btnDia0.disabled = true;
        
        if (cambioPendiente) {
            cambioPendiente.style.display = 'flex';
            const etapaActualNom = getEtapaActual(diasActuales).nombre;
            const cambioTexto = document.getElementById('cambioPendienteTexto');
            const cambioNuevo = document.getElementById('cambioPendienteNuevo');
            if (cambioTexto) cambioTexto.textContent = etapaActualNom;
            if (cambioNuevo) cambioNuevo.textContent = cultivo.etapas[previewIdx].nombre;
        }
    } else {
        // Sin vista previa, deshabilitar botones
        if (btnAplicar) btnAplicar.disabled = true;
        if (btnCancelar) btnCancelar.disabled = true;
        if (btnDia0) btnDia0.disabled = false;
        if (cambioPendiente) cambioPendiente.style.display = 'none';
    }
}

// ============================================================
// SELECCIONAR VISTA PREVIA DE ETAPA
// ============================================================

export function seleccionarPreview(idx) {
    if (getOffline()) return;

    const cultivo = getCultivoInfo();
    const diasActuales = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(diasActuales);

    // Normalizar nombres para comparar (sin emojis, sin tildes)
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

    // Si la etapa seleccionada ya es la actual, cancelar preview
    if (nombreSeleccionado === nombreActual) {
        cancelarPreview();
        return;
    }

    previewEtapa = idx;
    setPreviewEtapa(idx);
    actualizarPanelCrecimiento(idx);
}

// ============================================================
// APLICAR CAMBIO DE ETAPA
// ============================================================

export function aplicarPreview() {
    if (previewEtapa === null || getOffline()) return;

    const cultivo = getCultivoInfo();
    const etapa = cultivo.etapas[previewEtapa];
    const dias = etapa.dia;

    // Calcular fecha para llegar a ese día
    const ahora = new Date();
    const nuevaFecha = new Date(ahora);
    nuevaFecha.setDate(nuevaFecha.getDate() - dias);
    const fechaStr = nuevaFecha.toISOString().split('T')[0];

    setFechaInicio(fechaStr);
    localStorage.setItem('fechaSiembra', fechaStr);
    document.getElementById('fechaSiembraPanel').value = fechaStr;

    // ===== MAPEAR ETAPA A FIREBASE (SIN TILDES) =====
    let etapaFirebase = "";
    const mapa = {
        "germinacion": "germinacion",
        "plantula": "plantula",
        "crecimiento": "crecimiento",
        "desarrollo": "desarrollo",
        "floracion": "floracion",
        "cosecha": "cosecha"
    };

    // Normalizar el nombre de la etapa
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

    // ===== ESCRIBIR EN FIREBASE =====
    import('./firebase-config.js').then(({ etapaConfigRef, set }) => {
        set(etapaConfigRef, etapaFirebase)
            .then(() => console.log("✅ Etapa actualizada en Firebase:", etapaFirebase))
            .catch(err => console.error("❌ Error al actualizar etapa:", err));
    });

    // Limpiar preview
    previewEtapa = null;
    setPreviewEtapa(null);
    actualizarPanelCrecimiento(null);

    // Actualizar tarjetas de sensores
    const datos = getDatosActuales();
    if (datos) {
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
    }

    // Deshabilitar botones
    const btnAplicar = document.getElementById('btnAplicar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnDia0 = document.getElementById('btnDia0');
    const cambioPendiente = document.getElementById('cambioPendiente');
    
    if (btnAplicar) btnAplicar.disabled = true;
    if (btnCancelar) btnCancelar.disabled = true;
    if (btnDia0) btnDia0.disabled = false;
    if (cambioPendiente) cambioPendiente.style.display = 'none';
}

// ============================================================
// CANCELAR VISTA PREVIA
// ============================================================

export function cancelarPreview() {
    previewEtapa = null;
    setPreviewEtapa(null);
    actualizarPanelCrecimiento(null);
    
    const btnAplicar = document.getElementById('btnAplicar');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnDia0 = document.getElementById('btnDia0');
    const cambioPendiente = document.getElementById('cambioPendiente');
    
    if (btnAplicar) btnAplicar.disabled = true;
    if (btnCancelar) btnCancelar.disabled = true;
    if (btnDia0) btnDia0.disabled = false;
    if (cambioPendiente) cambioPendiente.style.display = 'none';
}

// ============================================================
// REINICIAR A DÍA 0
// ============================================================

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

        // Actualizar tarjetas de sensores
        const datos = getDatosActuales();
        if (datos) {
            for (const sensor in configuracion) {
                const valor = Number(datos[configuracion[sensor].campo]);
                actualizarTarjeta(sensor, valor);
            }
        }
    }
}

// ============================================================
// EXPONER FUNCIONES GLOBALMENTE PARA ONCLICK EN HTML
// ============================================================

window.seleccionarPreview = seleccionarPreview;
window.aplicarPreview = aplicarPreview;
window.cancelarPreview = cancelarPreview;
window.dia0 = dia0;