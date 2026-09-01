// ============================================================
// UTILIDADES
// ============================================================

import { cultivosDB, configuracion, rangosPorDefecto } from './cultivos-db.js';

// Variables globales
let cultivoSeleccionado = 'lechuga';
let datosActuales = null;
let registrosHistorial = [];
let fechaInicio = null;
let isOffline = false;
let lastUpdateTime = null;
let previewEtapa = null;

export function setCultivo(valor) {
    cultivoSeleccionado = valor;
}

export function getCultivoSeleccionado() {
    return cultivoSeleccionado;
}

export function getCultivoInfo() {
    return cultivosDB[cultivoSeleccionado] || cultivosDB.lechuga;
}

export function setDatosActuales(datos) {
    datosActuales = datos;
}

export function getDatosActuales() {
    return datosActuales;
}

export function setRegistrosHistorial(registros) {
    registrosHistorial = registros;
}

export function getRegistrosHistorial() {
    return registrosHistorial;
}

export function setFechaInicio(fecha) {
    fechaInicio = fecha;
}

export function getFechaInicio() {
    return fechaInicio;
}

export function setOffline(estado) {
    isOffline = estado;
}

export function getOffline() {
    return isOffline;
}

export function setLastUpdate(time) {
    lastUpdateTime = time;
}

export function getLastUpdate() {
    return lastUpdateTime;
}

export function setPreviewEtapa(valor) {
    previewEtapa = valor;
}

export function getPreviewEtapa() {
    return previewEtapa;
}

export function obtenerDiasTranscurridos() {
    if (fechaInicio) {
        const ahora = new Date();
        const inicio = new Date(fechaInicio);
        const diff = ahora - inicio;
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    }
    return 0;
}

export function getRangoPorEtapa(sensor, dias) {
    const cultivo = getCultivoInfo();
    let etapaActual = cultivo.etapas[0];

    for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
        if (dias >= cultivo.etapas[i].dia) {
            etapaActual = cultivo.etapas[i];
            break;
        }
    }

    if (etapaActual.ajustes && etapaActual.ajustes[sensor]) {
        const ajuste = etapaActual.ajustes[sensor];
        return {
            min: ajuste.min,
            max: ajuste.max,
            ideal: ajuste.ideal,
            unidad: ajuste.unidad || '',
            etapa: etapaActual.nombre
        };
    }

    const base = cultivo[sensor];
    if (base) {
        return { ...base, etapa: etapaActual.nombre };
    }

    const defecto = rangosPorDefecto[sensor];
    return { ...defecto, etapa: etapaActual.nombre };
}

export function getEtapaActual(dias) {
    const cultivo = getCultivoInfo();
    let etapa = cultivo.etapas[0];
    for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
        if (dias >= cultivo.etapas[i].dia) {
            etapa = cultivo.etapas[i];
            break;
        }
    }
    return etapa;
}

export function obtenerEstado(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);

    if (valor === null || valor === undefined || isNaN(valor)) {
        return { estado: "warning", texto: "⚠️ Sin datos" };
    }

    const { min, max } = rango;

    if (sensor === 'luz') {
        if (valor < min) return { estado: "warning", texto: "🌑 Poca luz" };
        if (valor > max) return { estado: "danger", texto: "☀️ Exceso de luz" };
        return { estado: "ok", texto: "☀️ Buena luz" };
    }

    if (valor >= min && valor <= max) {
        return { estado: "ok", texto: "✅ Bueno" };
    }

    const margen = (max - min) * 0.20;
    if (valor >= min - margen && valor <= max + margen) {
        return { estado: "warning", texto: "⚠️ Regular" };
    }

    return { estado: "danger", texto: "❌ Crítico" };
}

export function formato(valor, sensor) {
    const c = configuracion[sensor];
    if (!Number.isFinite(valor)) return "--";
    return valor.toFixed(c.decimales) + c.unidad;
}