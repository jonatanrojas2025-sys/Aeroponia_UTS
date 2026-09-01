// ============================================================
// UTILIDADES - VARIABLES GLOBALES Y FUNCIONES COMPARTIDAS
// ============================================================

import { cultivosDB } from './cultivos-db.js';
import { configuracion, RANGOS_POR_DEFECTO } from './config.js';

// Variables globales
let cultivoSeleccionado = 'lechuga';
let datosActuales = null;
let registrosHistorial = [];
let fechaInicio = null;
let isOffline = false;
let lastUpdateTime = null;
let previewEtapa = null;

// ============================================================
// EXPORTAR CONFIGURACIÓN
// ============================================================

export { configuracion };

// ============================================================
// GETTERS Y SETTERS
// ============================================================

export function setCultivo(valor) { cultivoSeleccionado = valor; }
export function getCultivoSeleccionado() { return cultivoSeleccionado; }

export function setDatosActuales(datos) { datosActuales = datos; }
export function getDatosActuales() { return datosActuales; }

export function setRegistrosHistorial(registros) { registrosHistorial = registros; }
export function getRegistrosHistorial() { return registrosHistorial; }

export function setFechaInicio(fecha) { fechaInicio = fecha; }
export function getFechaInicio() { return fechaInicio; }

export function setOffline(estado) { isOffline = estado; }
export function getOffline() { return isOffline; }

export function setLastUpdate(time) { lastUpdateTime = time; }
export function getLastUpdate() { return lastUpdateTime; }

export function setPreviewEtapa(valor) { previewEtapa = valor; }
export function getPreviewEtapa() { return previewEtapa; }

// ============================================================
// FUNCIONES DE CULTIVO
// ============================================================

export function getCultivoInfo() {
    return cultivosDB[cultivoSeleccionado] || cultivosDB.lechuga;
}

// ============================================================
// FUNCIONES DE FECHA Y ETAPAS
// ============================================================

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
    let sensorKey = sensor;
    if (sensor === 'hum') sensorKey = 'humedad';
    
    let rango = cultivo[sensorKey];
    if (!rango) {
        rango = RANGOS_POR_DEFECTO[sensorKey] || RANGOS_POR_DEFECTO.ph;
    }
    
    // Determinar etapa actual
    let etapaActual = cultivo.etapas[0];
    for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
        if (dias >= cultivo.etapas[i].dia) {
            etapaActual = cultivo.etapas[i];
            break;
        }
    }
    
    return { ...rango, etapa: etapaActual.nombre };
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

// ============================================================
// FUNCIONES DE SENSORES
// ============================================================

export function obtenerEstado(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);

    if (valor === null || valor === undefined || isNaN(valor) || valor === -273.15) {
        return { estado: "warning", texto: "⚠️ Sin datos" };
    }

    if (!rango || typeof rango.min !== 'number' || typeof rango.max !== 'number') {
        return { estado: "warning", texto: "⚠️ Sin rango" };
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
    if (!Number.isFinite(valor) || valor === -273.15) return "--";
    return valor.toFixed(c.decimales) + c.unidad;
}