// ============================================================
// APP - VERSIÓN COMPLETA CON CHAT Y ASISTENTE INTEGRADO
// ============================================================

import { valorActualRef, historialRef, onValue } from './firebase-config.js';

// ============================================================
// 1. BASE DE DATOS DE CULTIVOS
// ============================================================

const cultivosDB = {
    lechuga: {
        nombre: "Lechuga",
        tipo: "Hoja verde",
        descripcion: "Cultivo de rápido crecimiento, ideal para principiantes.",
        ph: { min: 5.5, max: 6.5, ideal: 6.0 },
        temp: { min: 15, max: 24, ideal: 20 },
        "temp-agua": { min: 18, max: 24, ideal: 21 },
        humedad: { min: 50, max: 70, ideal: 60 },
        luz: { min: 400, max: 600, ideal: 500 },
        ciclo: { min: 30, max: 45, promedio: 38 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada, sin luz directa." },
            { dia: 7, nombre: "🌿 Plántula", descripcion: "Primeras hojas, luz suave." },
            { dia: 14, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes." },
            { dia: 25, nombre: "🌿 Desarrollo", descripcion: "Planta grande, lista para cosechar." },
            { dia: 35, nombre: "✅ Cosecha", descripcion: "¡Lista para cortar!" }
        ]
    },
    fresa: {
        nombre: "Fresa", tipo: "Fruto", descripcion: "Cultivo de alto valor comercial.",
        ph: { min: 5.5, max: 6.2, ideal: 5.8 },
        temp: { min: 15, max: 26, ideal: 22 },
        "temp-agua": { min: 18, max: 24, ideal: 21 },
        humedad: { min: 65, max: 75, ideal: 70 },
        luz: { min: 500, max: 700, ideal: 600 },
        ciclo: { min: 60, max: 90, promedio: 75 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada, sin luz directa." },
            { dia: 15, nombre: "🌿 Plántula", descripcion: "Primeras hojas, luz suave." },
            { dia: 30, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes." },
            { dia: 50, nombre: "🌿 Floración", descripcion: "Aparecen flores, poliniza." },
            { dia: 70, nombre: "🍓 Cosecha", descripcion: "¡Fresas rojas y dulces!" }
        ]
    },
    tomate: {
        nombre: "Tomate cherry", tipo: "Fruto", descripcion: "Cultivo de gran demanda.",
        ph: { min: 5.8, max: 6.5, ideal: 6.2 },
        temp: { min: 18, max: 28, ideal: 25 },
        "temp-agua": { min: 18, max: 24, ideal: 22 },
        humedad: { min: 60, max: 70, ideal: 65 },
        luz: { min: 600, max: 800, ideal: 700 },
        ciclo: { min: 70, max: 100, promedio: 85 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada." },
            { dia: 20, nombre: "🌿 Plántula", descripcion: "Primeras hojas." },
            { dia: 40, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes." },
            { dia: 60, nombre: "🌿 Floración", descripcion: "Aparecen flores." },
            { dia: 80, nombre: "🍅 Cosecha", descripcion: "¡Tomates rojos y firmes!" }
        ]
    },
    cilantro: {
        nombre: "Cilantro", tipo: "Hierba aromática", descripcion: "Ciclo corto y alta rotación.",
        ph: { min: 6.0, max: 6.8, ideal: 6.4 },
        temp: { min: 15, max: 25, ideal: 20 },
        "temp-agua": { min: 15, max: 22, ideal: 19 },
        humedad: { min: 40, max: 60, ideal: 50 },
        luz: { min: 300, max: 500, ideal: 400 },
        ciclo: { min: 25, max: 40, promedio: 32 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada." },
            { dia: 10, nombre: "🌿 Plántula", descripcion: "Primeras hojas." },
            { dia: 20, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes." },
            { dia: 30, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!" }
        ]
    },
    albahaca: {
        nombre: "Albahaca", tipo: "Hierba aromática", descripcion: "Aroma intenso.",
        ph: { min: 5.8, max: 6.5, ideal: 6.2 },
        temp: { min: 20, max: 28, ideal: 24 },
        "temp-agua": { min: 20, max: 26, ideal: 23 },
        humedad: { min: 50, max: 70, ideal: 60 },
        luz: { min: 500, max: 700, ideal: 600 },
        ciclo: { min: 30, max: 50, promedio: 40 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada." },
            { dia: 12, nombre: "🌿 Plántula", descripcion: "Primeras hojas." },
            { dia: 25, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes." },
            { dia: 38, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!" }
        ]
    },
    espinaca: {
        nombre: "Espinaca", tipo: "Hoja verde", descripcion: "Alta en nutrientes.",
        ph: { min: 6.0, max: 7.0, ideal: 6.5 },
        temp: { min: 10, max: 22, ideal: 18 },
        "temp-agua": { min: 15, max: 22, ideal: 19 },
        humedad: { min: 50, max: 70, ideal: 60 },
        luz: { min: 300, max: 500, ideal: 400 },
        ciclo: { min: 25, max: 40, promedio: 32 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada." },
            { dia: 8, nombre: "🌿 Plántula", descripcion: "Primeras hojas." },
            { dia: 18, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes." },
            { dia: 30, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!" }
        ]
    }
};

// ============================================================
// 2. CONFIGURACIÓN DE SENSORES
// ============================================================

const configuracion = {
    ph: { campo: "PH", nombre: "pH", icono: "fa-flask", unidad: "", decimales: 2 },
    temp: { campo: "Temperatura_Ambiente", nombre: "Temp. Ambiente", icono: "fa-temperature-half", unidad: "°C", decimales: 1 },
    "temp-agua": { campo: "Temperatura_Agua", nombre: "Temp. Agua", icono: "fa-temperature-three-quarters", unidad: "°C", decimales: 1 },
    hum: { campo: "Humedad_Ambiente", nombre: "Humedad", icono: "fa-droplet", unidad: "%", decimales: 1 },
    luz: { campo: "luz", nombre: "Luz", icono: "fa-sun", unidad: " lux", decimales: 0 }
};

// ============================================================
// 3. VARIABLES GLOBALES
// ============================================================

let cultivoSeleccionado = 'lechuga';
let datosActuales = null;
let registrosHistorial = [];
let chartInstance = null;
let isOffline = false;
let lastUpdateTime = null;
let dataTimeout = null;
const DATA_TIMEOUT_MS = 30000;
let chatIniciado = false;
let fechaInicio = null;

// ============================================================
// 4. FUNCIONES DE UTILIDAD
// ============================================================

function getCultivoInfo() {
    return cultivosDB[cultivoSeleccionado] || cultivosDB.lechuga;
}

function getRangoPorEtapa(sensor, dias) {
    const cultivo = getCultivoInfo();
    let sensorKey = sensor === 'hum' ? 'humedad' : sensor;
    let rango = cultivo[sensorKey];
    if (!rango) {
        const defectos = { ph: { min: 5.0, max: 7.0 }, temp: { min: 15, max: 28 }, "temp-agua": { min: 18, max: 26 }, humedad: { min: 40, max: 80 }, luz: { min: 300, max: 800 } };
        rango = defectos[sensorKey] || defectos.ph;
    }
    let etapaActual = cultivo.etapas[0];
    for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
        if (dias >= cultivo.etapas[i].dia) { etapaActual = cultivo.etapas[i]; break; }
    }
    return { ...rango, etapa: etapaActual.nombre };
}

function getEtapaActual(dias) {
    const cultivo = getCultivoInfo();
    let etapa = cultivo.etapas[0];
    for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
        if (dias >= cultivo.etapas[i].dia) { etapa = cultivo.etapas[i]; break; }
    }
    return etapa;
}

function obtenerDiasTranscurridos() {
    if (fechaInicio) {
        const ahora = new Date();
        const inicio = new Date(fechaInicio);
        const diff = ahora - inicio;
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    }
    return 0;
}

function obtenerEstado(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);

    // Detectar sensor defectuoso (temp agua)
    if (sensor === 'temp-agua' && valor === -273.15) {
        return { estado: "danger", texto: "❌ Sensor defectuoso" };
    }

    if (valor === null || isNaN(valor)) {
        return { estado: "warning", texto: "⚠️ Sin datos" };
    }

    const { min, max } = rango;

    if (sensor === 'luz') {
        if (valor < min) return { estado: "warning", texto: "🌑 Poca luz" };
        if (valor > max) return { estado: "danger", texto: "☀️ Exceso de luz" };
        return { estado: "ok", texto: "☀️ Buena luz" };
    }

    if (valor >= min && valor <= max) return { estado: "ok", texto: "✅ Bueno" };
    const margen = (max - min) * 0.20;
    if (valor >= min - margen && valor <= max + margen) return { estado: "warning", texto: "⚠️ Regular" };
    return { estado: "danger", texto: "❌ Crítico" };
}

function formato(valor, sensor) {
    const c = configuracion[sensor];
    if (!Number.isFinite(valor) || valor === -273.15) return "--";
    return valor.toFixed(c.decimales) + c.unidad;
}

// ============================================================
// 5. ANÁLISIS DE SENSORES
// ============================================================

function obtenerEstadisticasHistoricas(sensor) {
    const c = configuracion[sensor];
    const valores = registrosHistorial
        .map(r => Number(r[c.campo]))
        .filter(v => Number.isFinite(v) && v !== -273.15);

    if (valores.length === 0) {
        return { total: 0, promedio: null, minimo: null, maximo: null, desviacion: null, valores: [] };
    }

    const suma = valores.reduce((a, b) => a + b, 0);
    const promedio = suma / valores.length;
    const minimo = Math.min(...valores);
    const maximo = Math.max(...valores);
    const diffCuadradas = valores.map(v => Math.pow(v - promedio, 2));
    const desviacion = Math.sqrt(diffCuadradas.reduce((a, b) => a + b, 0) / valores.length);

    return { total: valores.length, promedio, minimo, maximo, desviacion, valores };
}

function obtenerTendenciaReal(sensor, ventana = 20) {
    const c = configuracion[sensor];
    const valores = registrosHistorial
        .map(r => Number(r[c.campo]))
        .filter(v => Number.isFinite(v) && v !== -273.15);

    if (valores.length < 4) {
        return { tipo: "estable", texto: "No hay suficientes datos históricos.", porcentaje: 0 };
    }

    const recientes = valores.slice(-ventana);
    const anteriores = valores.slice(0, -ventana).slice(-ventana);

    if (recientes.length < 3 || anteriores.length < 3) {
        return { tipo: "estable", texto: "Datos insuficientes para tendencia.", porcentaje: 0 };
    }

    const promedioAnterior = anteriores.reduce((a, b) => a + b, 0) / anteriores.length;
    const promedioReciente = recientes.reduce((a, b) => a + b, 0) / recientes.length;

    if (promedioAnterior === 0) {
        return { tipo: "estable", texto: "Datos insuficientes.", porcentaje: 0 };
    }

    const diferencia = promedioReciente - promedioAnterior;
    const porcentaje = (diferencia / Math.abs(promedioAnterior)) * 100;

    if (Math.abs(porcentaje) < 3) {
        return { tipo: "estable", texto: `📊 Estable (variación del ${porcentaje.toFixed(1)}%).`, porcentaje };
    }

    if (diferencia > 0) {
        return { tipo: "subiendo", texto: `⬆️ Subiendo un ${porcentaje.toFixed(1)}% en las últimas mediciones.`, porcentaje };
    }

    return { tipo: "bajando", texto: `⬇️ Bajando un ${Math.abs(porcentaje).toFixed(1)}% en las últimas mediciones.`, porcentaje };
}

function generarSolucionesPracticas(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const c = configuracion[sensor];
    let soluciones = [];
    let explicacion = "";

    if (!rango || !Number.isFinite(valor) || valor === -273.15) {
        return {
            soluciones: ["⚠️ No hay datos de referencia o sensor defectuoso."],
            explicacion: "Espera a tener más datos o verifica la conexión del sensor."
        };
    }

    const { min, max, ideal, etapa } = rango;

    if (sensor === 'temp-agua' && valor === -273.15) {
        explicacion = `🌊 El sensor de temperatura del agua está defectuoso (${valor.toFixed(1)}°C).`;
        soluciones = [
            "🔌 Verifica la conexión del sensor DS18B20",
            "🔄 Reinicia el ESP32",
            "🧪 Prueba el sensor con otro código de prueba",
            "🛠️ Reemplaza el sensor si sigue dando lecturas erróneas"
        ];
        return { soluciones, explicacion };
    }

    if (sensor === 'luz') {
        if (valor < min) {
            explicacion = `💡 Hay POCA luz (${valor.toFixed(0)} lux) para la etapa ${etapa}.`;
            soluciones = ["💡 Aumenta la intensidad de las luces", "📏 Reduce la distancia entre las luces y las plantas", "⏰ Extiende el fotoperiodo a 12-14 horas"];
        } else if (valor > max) {
            explicacion = `💡 Hay EXCESO de luz (${valor.toFixed(0)} lux) para la etapa ${etapa}.`;
            soluciones = ["📏 Aumenta la distancia de las luces", "🔅 Reduce la intensidad de las luces", "⏰ Reduce el fotoperiodo a 10-12 horas"];
        } else {
            explicacion = `✅ La iluminación (${valor.toFixed(0)} lux) es adecuada.`;
            soluciones = ["👍 Mantén las condiciones de luz actuales"];
        }
    } else if (sensor === 'temp' || sensor === 'temp-agua') {
        const nombreSensor = sensor === 'temp' ? 'Temperatura ambiente' : 'Temperatura del agua';
        if (valor < min) {
            explicacion = `🌡️ La ${nombreSensor} (${valor.toFixed(1)}°C) está FRÍA.`;
            soluciones = ["🔥 Enciende un calefactor", "🪟 Cierra ventanas"];
        } else if (valor > max) {
            explicacion = `🌡️ La ${nombreSensor} (${valor.toFixed(1)}°C) está CALIENTE. ¡ACTÚA!`;
            soluciones = ["💨 Abre ventanas", "🌀 Coloca un ventilador"];
        } else {
            explicacion = `✅ La ${nombreSensor} (${valor.toFixed(1)}°C) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    } else if (sensor === 'hum') {
        if (valor < min) {
            explicacion = `💧 El ambiente está SECO (${valor.toFixed(1)}%).`;
            soluciones = ["💨 Usa un humidificador", "💧 Coloca bandejas con agua"];
        } else if (valor > max) {
            explicacion = `💧 El ambiente está HÚMEDO (${valor.toFixed(1)}%).`;
            soluciones = ["💨 Abre ventanas", "🌀 Usa un ventilador"];
        } else {
            explicacion = `✅ La humedad (${valor.toFixed(1)}%) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    } else if (sensor === 'ph') {
        if (valor < min) {
            explicacion = `🔬 El pH está ÁCIDO (${valor.toFixed(2)}).`;
            soluciones = ["🧪 Añade pH UP", "⏳ Espera 15 minutos y mide"];
        } else if (valor > max) {
            explicacion = `🔬 El pH está ALCALINO (${valor.toFixed(2)}).`;
            soluciones = ["🧪 Añade pH DOWN", "⏳ Espera 15 minutos y mide"];
        } else {
            explicacion = `✅ El pH (${valor.toFixed(2)}) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    }

    soluciones = soluciones.map(s => s.replace(/\${ideal}/g, ideal).replace(/\${min}/g, min).replace(/\${max}/g, max));
    return { soluciones, explicacion };
}

function analizarSensor(sensor, valor) {
    const c = configuracion[sensor];
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const stats = obtenerEstadisticasHistoricas(sensor);
    const tendencia = obtenerTendenciaReal(sensor, 20);
    const estado = obtenerEstado(sensor, valor);
    const soluciones = generarSolucionesPracticas(sensor, valor);

    let significado = "";
    let recomendacion = "";

    if (sensor === 'temp-agua' && valor === -273.15) {
        significado = `🌊 El sensor de temperatura del agua está dando una lectura errónea (-273.15°C). Verifica la conexión.`;
        recomendacion = "🔧 Revisa el sensor DS18B20 o reemplázalo.";
        return { estado, stats, tendencia, anomalia: true, significado, recomendacion, soluciones, totalDatos: stats.total, etapa: rango?.etapa || 'Desconocida' };
    }

    if (!stats.promedio || stats.total < 3) {
        significado = `📊 Valor actual: ${valor.toFixed(c.decimales)}${c.unidad}. Pocos datos históricos (${stats.total} registros).`;
        recomendacion = "Continúa monitoreando.";
        return { estado, stats, tendencia, anomalia: false, significado, recomendacion, soluciones, totalDatos: stats.total };
    }

    const { min, max, ideal, etapa } = rango;

    if (valor < min) {
        significado = `📉 Valor (${valor.toFixed(c.decimales)}${c.unidad}) por DEBAJO del rango para "${etapa}" (${min}-${max}${c.unidad}).`;
        recomendacion = `⚠️ Sube a ${ideal}${c.unidad}.`;
    } else if (valor > max) {
        significado = `📈 Valor (${valor.toFixed(c.decimales)}${c.unidad}) por ENCIMA del rango para "${etapa}" (${min}-${max}${c.unidad}).`;
        recomendacion = `⚠️ Baja a ${ideal}${c.unidad}.`;
    } else {
        significado = `✅ Valor (${valor.toFixed(c.decimales)}${c.unidad}) DENTRO del rango para "${etapa}" (${min}-${max}${c.unidad}).`;
        recomendacion = `👍 Mantén en ${ideal}${c.unidad}.`;
    }

    if (tendencia.porcentaje !== 0 && Math.abs(tendencia.porcentaje) > 3) {
        significado += ` 📊 ${tendencia.texto}`;
    }

    return { estado, stats, tendencia, anomalia: false, significado, recomendacion, soluciones, totalDatos: stats.total, etapa };
}

// ============================================================
// 6. RENDERIZAR SENSORES
// ============================================================

function renderizarSensores() {
    const grid = document.getElementById('sensorGrid');
    if (!grid) return;
    grid.innerHTML = '';

    for (const [key, config] of Object.entries(configuracion)) {
        const card = document.createElement('div');
        card.className = 'sensor-card';
        card.id = `card-${key}`;
        card.innerHTML = `
            <div class="sensor-icon ${key}"><i class="fas ${config.icono}"></i></div>
            <div class="sensor-value" id="sensor-${key}">--</div>
            <div class="sensor-label">${config.nombre}</div>
            <div class="sub sub-warning" id="sensor-${key}-status">Esperando...</div>
            <div class="tocar"><i class="fas fa-hand-pointer"></i> Toca para saber más</div>
        `;
        grid.appendChild(card);
    }

    const bombaCard = document.createElement('div');
    bombaCard.className = 'sensor-card';
    bombaCard.id = 'card-bomba';
    bombaCard.innerHTML = `
        <div class="sensor-icon bomba"><i class="fas fa-power-off" id="bomba-icon"></i></div>
        <div class="sensor-value" id="sensor-bomba">--</div>
        <div class="sensor-label">Bomba</div>
        <div class="sub sub-warning" id="sensor-bomba-status">Esperando...</div>
        <div class="tocar"><i class="fas fa-hand-pointer"></i> Toca para saber más</div>
    `;
    grid.appendChild(bombaCard);
}

// ============================================================
// 7. ACTUALIZAR TARJETAS
// ============================================================

function actualizarTarjeta(sensor, valor) {
    const c = configuracion[sensor];
    const elemento = document.getElementById(`sensor-${sensor}`);
    const status = document.getElementById(`sensor-${sensor}-status`);
    const card = document.getElementById(`card-${sensor}`);
    if (!elemento) return;

    if (isOffline || !Number.isFinite(valor) || valor === -273.15) {
        card?.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
        card?.classList.add("estado-offline");
        status.className = "sub sub-offline";
        elemento.innerHTML = "--";
        status.textContent = "📡 Sin datos";
        return;
    }

    const resultado = obtenerEstado(sensor, valor);
    if (sensor === 'luz') {
        elemento.innerHTML = resultado.texto;
    } else {
        elemento.innerHTML = valor.toFixed(c.decimales) + `<span class="unit">${c.unidad}</span>`;
    }
    status.textContent = resultado.texto;
    status.className = `sub sub-${resultado.estado}`;
    card?.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline");
    card?.classList.add(`estado-${resultado.estado}`);
}

function actualizarTarjetaBomba(valor) {
    const elemento = document.getElementById("sensor-bomba");
    const status = document.getElementById("sensor-bomba-status");
    const card = document.getElementById("card-bomba");
    const icono = document.getElementById("bomba-icon");
    if (!elemento) return;

    if (isOffline || valor === undefined || valor === null) {
        card?.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
        card?.classList.add("estado-offline");
        status.className = "sub sub-offline";
        elemento.textContent = "--";
        status.textContent = "📡 Sin datos";
        return;
    }

    const encendida = valor === true || valor === "true" || valor === 1;
    elemento.textContent = encendida ? "🔴 ON" : "⏸️ OFF";
    status.textContent = encendida ? "✅ Encendida" : "⏸️ Apagada";
    status.className = encendida ? "sub sub-ok" : "sub sub-off";
    card?.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline");
    card?.classList.add(encendida ? "estado-ok" : "estado-off");
    if (icono) icono.style.color = encendida ? "#22c55e" : "#64748b";
}

// ============================================================
// 8. PANEL DE CRECIMIENTO
// ============================================================

function actualizarPanelCrecimiento() {
    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));

    const el = (id) => document.getElementById(id);
    if (el('etapaIcono')) el('etapaIcono').textContent = etapaActual.nombre.split(' ')[0] || '🌱';
    if (el('etapaNombre')) el('etapaNombre').textContent = etapaActual.nombre;
    if (el('etapaDia')) el('etapaDia').textContent = `Día ${dias}`;
    if (el('etapaDesc')) el('etapaDesc').textContent = etapaActual.descripcion || '';
    if (el('progresoPorcentaje')) el('progresoPorcentaje').textContent = `${porcentaje}%`;
    const barra = el('progresoBarra');
    if (barra) { barra.style.width = `${porcentaje}%`; barra.classList.toggle('offline', isOffline); }
    if (el('diasTranscurridos')) el('diasTranscurridos').textContent = dias;
    if (el('diasTotales')) el('diasTotales').textContent = cultivo.ciclo.promedio;
}

// ============================================================
// 9. TABLA
// ============================================================

function actualizarTabla() {
    const tbody = document.getElementById("tabla-body");
    if (!registrosHistorial.length) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">📭 No hay datos históricos.</td></tr>`;
        return;
    }
    let html = "";
    registrosHistorial.slice().reverse().slice(0, 30).forEach(r => {
        const ph = Number(r.PH), temp = Number(r.Temperatura_Ambiente);
        const tempAgua = Number(r.Temperatura_Agua), hum = Number(r.Humedad_Ambiente);
        const luz = Number(r.luz), bombaOn = r.bomba === true || r.bomba === "true" || r.bomba === 1;
        let fecha = r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : "--";
        
        let tempAguaDisplay = "--";
        let tempAguaClass = "";
        if (Number.isFinite(tempAgua)) {
            if (tempAgua === -273.15) {
                tempAguaDisplay = "❌ Defectuoso";
                tempAguaClass = "td-danger";
            } else {
                tempAguaDisplay = tempAgua.toFixed(1) + "°C";
            }
        }
        
        const estados = [
            obtenerEstado("ph", ph).estado,
            obtenerEstado("temp", temp).estado,
            obtenerEstado("temp-agua", tempAgua).estado,
            obtenerEstado("hum", hum).estado,
            obtenerEstado("luz", luz).estado
        ];
        let estadoTexto = "✅ Normal", estadoClase = "td-ok";
        if (estados.includes("danger")) { estadoTexto = "❌ Revisar"; estadoClase = "td-danger"; }
        else if (estados.includes("warning")) { estadoTexto = "⚠️ Atención"; estadoClase = "td-warning"; }
        if (isOffline) { estadoTexto = "📡 Sin datos"; estadoClase = "td-danger"; }

        html += `<tr>
            <td style="color:#64748b;font-size:12px;">${fecha}</td>
            <td>${Number.isFinite(ph) ? ph.toFixed(2) : "--"}</td>
            <td>${Number.isFinite(temp) ? temp.toFixed(1)+"°C" : "--"}</td>
            <td class="${tempAguaClass}">${tempAguaDisplay}</td>
            <td>${Number.isFinite(hum) ? hum.toFixed(1)+"%" : "--"}</td>
            <td>${Number.isFinite(luz) ? luz.toFixed(0)+" lux" : "--"}</td>
            <td class="${bombaOn ? 'td-ok' : ''}">${bombaOn ? "🔴 ON" : "⚪ OFF"}</td>
            <td class="${estadoClase}">${estadoTexto}</td>
        </tr>`;
    });
    tbody.innerHTML = html;
}

// ============================================================
// 10. GRÁFICA
// ============================================================

function actualizarGrafica() {
    const ultimos = registrosHistorial.slice(-40);
    if (!ultimos.length) return;
    const labels = ultimos.map(r => r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : "");
    const datasets = [
        { label: "pH", data: ultimos.map(r => Number(r.PH) || null), borderColor: "#a78bfa", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Temp. ambiente °C", data: ultimos.map(r => Number(r.Temperatura_Ambiente) || null), borderColor: "#fb923c", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Temp. agua °C", data: ultimos.map(r => Number(r.Temperatura_Agua) || null), borderColor: "#2dd4bf", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Humedad %", data: ultimos.map(r => Number(r.Humedad_Ambiente) || null), borderColor: "#38bdf8", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Luz lux", data: ultimos.map(r => Number(r.luz) || null), borderColor: "#facc15", tension: .3, pointRadius: 2, borderWidth: 2 }
    ];
    const canvas = document.getElementById("grafica");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
        type: "line",
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: "#94a3b8", boxWidth: 12, padding: 12, font: { size: 11 } } } },
            scales: {
                y: { grid: { color: "rgba(255,255,255,.04)" }, ticks: { color: "#64748b", font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: "#64748b", maxTicksLimit: 8, autoSkip: true, font: { size: 9 } } }
            }
        }
    });
}

// ============================================================
// 11. ESTADO GENERAL
// ============================================================

function actualizarEstadoGeneral() {
    const alerta = document.getElementById("alertaBox");
    if (!datosActuales || !registrosHistorial.length) {
        alerta.className = "alerta-box loading";
        alerta.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>Esperando datos del sistema...</span>`;
        return;
    }
    const cultivo = getCultivoInfo();
    const totalRegistros = registrosHistorial.length;
    const etapaActual = getEtapaActual(obtenerDiasTranscurridos());

    if (isOffline) {
        alerta.className = "alerta-box offline";
        alerta.innerHTML = `
            <i class="fas fa-microchip"></i>
            <span>
                <strong>📡 ESP32 SIN TRANSMITIR DATOS</strong>
                <span style="color:#94a3b8;display:block;font-size:13px;margin-top:4px;">
                    El sistema sigue funcionando de forma autónoma.
                    <span style="color:#fcd34d;display:inline-block;margin-top:4px;padding:2px 10px;background:rgba(245,158,11,0.15);border-radius:12px;">🤖 MODO AUTÓNOMO ACTIVO</span>
                </span>
                <span style="color:#64748b;display:block;font-size:12px;margin-top:4px;">📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre}</span>
            </span>
        `;
        return;
    }

    let problemas = [], advertencias = [];
    for (const sensor in configuracion) {
        const valor = Number(datosActuales[configuracion[sensor].campo]);
        if (!Number.isFinite(valor)) continue;
        const estado = obtenerEstado(sensor, valor);
        if (estado.estado === "danger") problemas.push(configuracion[sensor].nombre);
        else if (estado.estado === "warning") advertencias.push(configuracion[sensor].nombre);
    }
    let nivel = "success", icono = "✅", mensaje = `${cultivo.nombre} en óptimas condiciones.`;
    if (problemas.length > 0) { nivel = "danger"; icono = "🚨"; mensaje = `${problemas.length} problema(s): ${problemas.join(", ")}. ¡ACTÚA!`; }
    else if (advertencias.length > 0) { nivel = "loading"; icono = "⚠️"; mensaje = `${advertencias.length} aviso(s): ${advertencias.join(", ")}.`; }
    alerta.className = `alerta-box ${nivel}`;
    alerta.innerHTML = `
        <i class="fas ${icono === '🚨' ? 'fa-triangle-exclamation' : icono === '⚠️' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
        <span><strong>${icono} ${mensaje}</strong> 📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre}</span>
    `;
}

// ============================================================
// 12. CONEXIÓN
// ============================================================

function actualizarEstadoOffline(offline) {
    isOffline = offline;
    const badge = document.getElementById("statusBadge");
    const text = document.getElementById("statusText");
    const icon = document.getElementById("statusIcon");
    
    if (offline) {
        badge.className = "status-badge offline";
        text.textContent = '📡 Sin datos';
        icon.className = 'fas fa-wifi-slash';
    } else {
        badge.className = "status-badge connected";
        text.textContent = '✅ Conectado';
        icon.className = 'fas fa-circle';
    }
    
    if (datosActuales) {
        for (const sensor in configuracion) {
            actualizarTarjeta(sensor, Number(datosActuales[configuracion[sensor].campo]));
        }
        actualizarTarjetaBomba(datosActuales.bomba);
    }
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();
    actualizarAsistente();
}

function reiniciarTimeout() {
    if (dataTimeout) clearTimeout(dataTimeout);
    dataTimeout = setTimeout(() => {
        actualizarEstadoOffline(true);
    }, DATA_TIMEOUT_MS);
}

// ============================================================
// 13. ASISTENTE Y CHAT (COMPLETO)
// ============================================================

const preguntasChip = [
    { id: "ph", texto: "🔬 pH", icono: "fa-flask" },
    { id: "temp", texto: "🌡️ Temp. ambiente", icono: "fa-temperature-half" },
    { id: "temp-agua", texto: "🌊 Temp. agua", icono: "fa-temperature-three-quarters" },
    { id: "hum", texto: "💧 Humedad", icono: "fa-droplet" },
    { id: "luz", texto: "💡 Luz", icono: "fa-sun" },
    { id: "bomba", texto: "🔌 Bomba", icono: "fa-power-off" },
    { id: "resumen", texto: "📊 Resumen general", icono: "fa-clipboard-list" },
    { id: "cosecha", texto: "🌱 ¿Cuándo cosechar?", icono: "fa-calendar-check" },
    { id: "soluciones", texto: "🔧 Todas las soluciones", icono: "fa-tools" },
    { id: "etapa", texto: "🌿 Etapa actual", icono: "fa-seedling" }
];

function actualizarAsistente() {
    const container = document.getElementById("consejosContainer");
    const estadoGeneral = document.getElementById("estado-general");

    if (!datosActuales || !registrosHistorial || !registrosHistorial.length) {
        if (container) container.innerHTML = `<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Analizando datos...</div>`;
        return;
    }

    const cultivo = getCultivoInfo();
    const totalRegistros = registrosHistorial.length;
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const offline = getOffline();
    const lastUpdate = getLastUpdate();

    if (offline) {
        if (estadoGeneral) { estadoGeneral.innerHTML = `📡 SIN DATOS | ${totalRegistros} reg.`; estadoGeneral.style.color = "#ef4444"; }
        if (container) {
            container.innerHTML = `
                <div class="consejo consejo-offline">
                    <div class="consejo-icono"><i class="fas fa-microchip"></i></div>
                    <div class="consejo-contenido">
                        <h4>📡 ESP32 SIN TRANSMITIR DATOS</h4>
                        <p>El sistema sigue funcionando de forma autónoma.</p>
                        <p style="margin-top:8px;color:#fcd34d;"><strong>🤖 MODO AUTÓNOMO ACTIVO</strong></p>
                        <ul>
                            <li>📊 ${totalRegistros} registros históricos</li>
                            <li>🌱 ${etapaActual.nombre} (Día ${dias})</li>
                            <li>⏱️ Última actualización: ${lastUpdate ? lastUpdate.toLocaleTimeString() : '--'}</li>
                        </ul>
                        <p style="margin-top:8px;color:#fca5a5;">🔍 Verifica: conexión WiFi, alimentación y programa del ESP32.</p>
                    </div>
                </div>
            `;
        }
        return;
    }

    let problemas = [], advertencias = [];
    for (const sensor in configuracion) {
        const valor = Number(datosActuales[configuracion[sensor].campo]);
        if (!Number.isFinite(valor) || valor === -273.15) continue;
        const analisis = analizarSensor(sensor, valor);
        if (analisis.estado.estado === "danger") {
            problemas.push({ sensor, analisis, valor });
        } else if (analisis.estado.estado === "warning" || analisis.anomalia) {
            advertencias.push({ sensor, analisis, valor });
        }
    }

    if (estadoGeneral) {
        if (problemas.length) {
            estadoGeneral.innerHTML = `🚨 ${problemas.length} problema(s) | 📊 ${totalRegistros}`;
            estadoGeneral.style.color = "#fca5a5";
            estadoGeneral.style.animation = "pulse-offline 1s infinite";
        } else if (advertencias.length) {
            estadoGeneral.innerHTML = `⚠️ ${advertencias.length} aviso(s) | 📊 ${totalRegistros}`;
            estadoGeneral.style.color = "#fcd34d";
            estadoGeneral.style.animation = "none";
        } else {
            const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
            estadoGeneral.innerHTML = `✅ OK | 📊 ${totalRegistros} | 🌱 ${porcentaje}%`;
            estadoGeneral.style.color = "#86efac";
            estadoGeneral.style.animation = "none";
        }
    }

    if (!container) return;
    let html = "";

    html += `
        <div class="consejo consejo-info">
            <div class="consejo-icono"><i class="fas fa-leaf"></i></div>
            <div class="consejo-contenido">
                <h4>🌱 ${cultivo.nombre} - ${cultivo.tipo}</h4>
                <p>${cultivo.descripcion}</p>
                <p style="margin-top:6px;">📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre} (Día ${dias})</p>
                ${lastUpdate ? `<p style="margin-top:4px;color:#64748b;">⏱️ Última actualización: ${lastUpdate.toLocaleTimeString()}</p>` : ''}
            </div>
        </div>
    `;

    problemas.forEach(item => {
        const c = configuracion[item.sensor];
        const sol = item.analisis.soluciones || { soluciones: [], explicacion: "" };
        const valorMostrar = item.sensor === 'luz' ? item.analisis.estado.texto : formato(item.valor, item.sensor);
        html += `
            <div class="consejo consejo-danger">
                <div class="consejo-icono"><i class="fas ${c.icono}"></i></div>
                <div class="consejo-contenido">
                    <h4>🚨 ${c.nombre} - ¡REQUIERE ACCIÓN INMEDIATA!</h4>
                    <p><strong>Valor actual:</strong> ${valorMostrar}</p>
                    <p>${item.analisis.significado}</p>
                    ${sol.explicacion ? `<p style="margin-top:6px;color:#c4b5fd;">💡 ${sol.explicacion}</p>` : ''}
                    ${sol.soluciones && sol.soluciones.length > 0 ? `
                        <p style="margin-top:8px;color:#fcd34d;"><strong>🔧 SOLUCIONES:</strong></p>
                        <ul>
                            ${sol.soluciones.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `;
    });

    advertencias.forEach(item => {
        const c = configuracion[item.sensor];
        const sol = item.analisis.soluciones || { soluciones: [], explicacion: "" };
        const valorMostrar = item.sensor === 'luz' ? item.analisis.estado.texto : formato(item.valor, item.sensor);
        html += `
            <div class="consejo consejo-warning">
                <div class="consejo-icono"><i class="fas ${c.icono}"></i></div>
                <div class="consejo-contenido">
                    <h4>⚠️ ${c.nombre} - Presta atención</h4>
                    <p><strong>Valor actual:</strong> ${valorMostrar}</p>
                    <p>${item.analisis.tendencia.texto}</p>
                    ${sol.soluciones && sol.soluciones.length > 0 ? `
                        <p style="margin-top:8px;color:#fcd34d;"><strong>🔧 Recomendaciones:</strong></p>
                        <ul>
                            ${sol.soluciones.slice(0, 4).map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            </div>
        `;
    });

    if (!problemas.length && !advertencias.length) {
        html += `
            <div class="consejo consejo-ok">
                <div class="consejo-icono"><i class="fas fa-circle-check"></i></div>
                <div class="consejo-contenido">
                    <h4>✅ Todo en orden</h4>
                    <p>${cultivo.nombre} está en condiciones óptimas para ${etapaActual.nombre}.</p>
                    <ul>
                        <li>📊 ${totalRegistros} registros analizados</li>
                        <li>🌱 ${etapaActual.nombre} (Día ${dias})</li>
                        <li>📈 ${Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100))}% completado</li>
                    </ul>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ============================================================
// 14. INICIAR CHAT
// ============================================================

function iniciarChat() {
    if (chatIniciado) return;
    chatIniciado = true;

    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const offline = getOffline();
    const lastUpdate = getLastUpdate();

    let mensajeInicial =
        `🌱 ¡Hola! Soy tu asistente de ${cultivo.nombre}.\n\n` +
        `📅 Día ${dias} - Etapa: ${etapaActual.nombre}\n` +
        `${etapaActual.descripcion || 'Cultivo en crecimiento'}\n\n` +
        `💡 Elige una pregunta o toca un sensor para ver análisis con soluciones adaptadas a tu etapa.\n` +
        `📌 Puedes cambiar de etapa usando los botones arriba (vista previa antes de aplicar).`;

    if (offline) {
        mensajeInicial += 
            `\n\n📡 <strong>⚠️ ESP32 SIN TRANSMITIR DATOS</strong>\n` +
            `🤖 El sistema sigue funcionando de forma autónoma.\n` +
            `⏳ Última actualización: ${lastUpdate ? lastUpdate.toLocaleTimeString() : '--'}`;
    }

    agregarMensaje(mensajeInicial, "bot");
    renderizarChips();
}

function renderizarChips() {
    const cont = document.getElementById("chatChips");
    if (!cont) return;

    const offline = getOffline();
    let hayUrgencia = false;
    if (datosActuales && !offline) {
        for (const sensor in configuracion) {
            const valor = Number(datosActuales[configuracion[sensor].campo]);
            if (Number.isFinite(valor) && valor !== -273.15) {
                const estado = obtenerEstado(sensor, valor);
                if (estado.estado === "danger") { hayUrgencia = true; break; }
            }
        }
    }

    let html = preguntasChip.map(p => `
        <button class="chip ${offline ? 'chip-offline' : ''} ${hayUrgencia && (p.id === 'soluciones' || p.id === 'resumen') ? 'chip-urgente' : ''}" onclick="window.preguntar('${p.id}')" ${offline ? 'disabled' : ''}>
            <i class="fas ${p.icono}"></i> ${p.texto}
        </button>
    `).join("");

    html += `<button class="chip chip-reset" onclick="window.preguntar('reiniciar')"><i class="fas fa-rotate"></i> Reiniciar chat</button>`;
    cont.innerHTML = html;
}

function agregarMensaje(texto, tipo) {
    const cont = document.getElementById("chatMensajes");
    if (!cont) return;
    const burbuja = document.createElement("div");
    burbuja.className = `chat-bubble ${tipo}`;
    burbuja.innerHTML = texto;
    cont.appendChild(burbuja);
    cont.scrollTop = cont.scrollHeight;
}

function generarSolucionesCompletas() {
    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    let mensaje = `🔧 <strong>SOLUCIONES para ${cultivo.nombre}</strong>\n\n📅 Día ${dias} - ${etapaActual.nombre}\n📊 ${registrosHistorial.length} registros\n\n`;

    if (getOffline()) mensaje += `📡 <strong>⚠️ ESP32 SIN DATOS EN TIEMPO REAL</strong>\n\n`;

    for (const sensor in configuracion) {
        const valor = Number(datosActuales[configuracion[sensor].campo]);
        if (!Number.isFinite(valor) || valor === -273.15) continue;
        const analisis = analizarSensor(sensor, valor);
        const c = configuracion[sensor];
        const sol = analisis.soluciones || { soluciones: [], explicacion: "" };

        mensaje += `<strong>${c.nombre}:</strong> `;
        if (sensor === 'luz') mensaje += `${analisis.estado.texto}\n`;
        else mensaje += `${formato(valor, sensor)} (${analisis.estado.texto})\n`;
        if (sol.explicacion) mensaje += `💡 ${sol.explicacion}\n`;
        if (sol.soluciones && sol.soluciones.length > 0) mensaje += `🔹 ${sol.soluciones.join('\n🔹 ')}\n`;
        mensaje += `📊 Tendencia: ${analisis.tendencia.texto}\n\n`;
    }
    return mensaje;
}

// ============================================================
// 15. FUNCIÓN PREGUNTAR (EXPUESTA GLOBAL)
// ============================================================

window.preguntar = function(id) {
    if (id === "reiniciar") {
        document.getElementById("chatMensajes").innerHTML = "";
        chatIniciado = false;
        iniciarChat();
        return;
    }

    if (!datosActuales || !registrosHistorial || !registrosHistorial.length) {
        const p = preguntasChip.find(x => x.id === id);
        if (p) agregarMensaje(p.texto, "user");
        agregarMensaje("⏳ Esperando datos... inténtalo en unos segundos.", "bot");
        return;
    }

    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const offline = getOffline();
    const lastUpdate = getLastUpdate();

    // ===== MODO OFFLINE =====
    if (offline) {
        if (id === "resumen") {
            agregarMensaje("📊 Dame un resumen general", "user");
            let mensaje = `📊 <strong>RESUMEN (MODO AUTÓNOMO)</strong>\n\n📡 ESP32 SIN DATOS\n📈 ${registrosHistorial.length} registros\n🌱 ${etapaActual.nombre} (Día ${dias})\n⏱️ Última actualización: ${lastUpdate ? lastUpdate.toLocaleTimeString() : '--'}\n\n`;
            for (const sensor in configuracion) {
                const valor = Number(datosActuales[configuracion[sensor].campo]);
                if (!Number.isFinite(valor) || valor === -273.15) continue;
                const analisis = analizarSensor(sensor, valor);
                mensaje += `${configuracion[sensor].nombre}: ${sensor === 'luz' ? analisis.estado.texto : formato(valor, sensor)} (${analisis.estado.texto})\n`;
            }
            mensaje += `\n🔍 Verifica la conexión del ESP32.`;
            agregarMensaje(mensaje, "bot");
            return;
        }

        if (id === "cosecha") {
            agregarMensaje("🌱 ¿Cuándo estará listo?", "user");
            const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
            let mensaje = `🌱 <strong>Análisis de COSECHA</strong>\n\n📅 ${dias} días | 📈 ${porcentaje}% completado\n🌿 ${etapaActual.nombre}\n\n📡 Modo autónomo activo.\n`;
            if (porcentaje >= 100) mensaje += `✅ ¡LISTO PARA COSECHAR!`;
            else if (porcentaje > 80) mensaje += `🔜 Casi listo.`;
            else mensaje += `🌱 Sigue cuidando las plantas.`;
            agregarMensaje(mensaje, "bot");
            return;
        }

        if (id === "soluciones") {
            agregarMensaje("🔧 Dame todas las soluciones", "user");
            agregarMensaje(generarSolucionesCompletas(), "bot");
            return;
        }

        const c = configuracion[id];
        if (c) {
            const p = preguntasChip.find(x => x.id === id);
            if (p) agregarMensaje(p.texto, "user");
            const valor = Number(datosActuales[c.campo]);
            if (!Number.isFinite(valor) || valor === -273.15) {
                agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot");
                return;
            }
            const analisis = analizarSensor(id, valor);
            let mensaje = `📡 <strong>MODO AUTÓNOMO</strong>\n\n`;
            mensaje += `<strong>${c.nombre}:</strong> ${sensor === 'luz' ? analisis.estado.texto : formato(valor, id)} (${analisis.estado.texto})\n\n`;
            mensaje += `📡 ESP32 no está transmitiendo datos nuevos.\n🤖 El sistema sigue funcionando de forma autónoma.`;
            agregarMensaje(mensaje, "bot");
            return;
        }

        if (id === "bomba") {
            agregarMensaje("🔌 ¿Cómo está la bomba?", "user");
            const valor = datosActuales.bomba === true || datosActuales.bomba === "true" || datosActuales.bomba === 1;
            let mensaje = `📡 <strong>MODO AUTÓNOMO</strong>\n\n`;
            mensaje += valor ? "✅ La bomba está ENCENDIDA (último estado conocido)." : "⏸️ La bomba está APAGADA (último estado conocido).";
            mensaje += "\n\n🤖 El sistema sigue su ciclo programado.";
            agregarMensaje(mensaje, "bot");
            return;
        }

        if (id === "etapa") {
            agregarMensaje("🌿 ¿En qué etapa estoy?", "user");
            let mensaje = `🌿 <strong>Etapa actual</strong>\n\n📅 Día ${dias}\n🌱 ${etapaActual.nombre}\n${etapaActual.descripcion || ''}\n\n📡 Modo autónomo activo.\n\n📋 <strong>Todas las etapas:</strong>\n`;
            cultivo.etapas.forEach(e => mensaje += `${e.nombre === etapaActual.nombre ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`);
            agregarMensaje(mensaje, "bot");
            return;
        }

        agregarMensaje("📡 El sistema está en MODO AUTÓNOMO.", "bot");
        return;
    }

    // ===== MODO NORMAL =====
    if (id === "resumen") {
        agregarMensaje("📊 Dame un resumen general", "user");
        const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
        let mensaje = `📊 <strong>RESUMEN de ${cultivo.nombre}</strong>\n\n📈 ${registrosHistorial.length} registros\n🌱 ${etapaActual.nombre} (Día ${dias})\n📈 ${porcentaje}% completado\n⏱️ ${lastUpdate ? lastUpdate.toLocaleTimeString() : '--'}\n\n`;
        for (const sensor in configuracion) {
            const valor = Number(datosActuales[configuracion[sensor].campo]);
            if (!Number.isFinite(valor) || valor === -273.15) continue;
            const analisis = analizarSensor(sensor, valor);
            mensaje += `${configuracion[sensor].nombre}: ${sensor === 'luz' ? analisis.estado.texto : formato(valor, sensor)} (${analisis.estado.texto})\n`;
        }
        mensaje += `\n💡 Los rangos se ajustan según tu etapa.`;
        agregarMensaje(mensaje, "bot");
        return;
    }

    if (id === "cosecha") {
        agregarMensaje("🌱 ¿Cuándo estará listo?", "user");
        const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
        let mensaje = `🌱 <strong>Análisis de COSECHA</strong>\n\n📅 ${dias} días | 📈 ${porcentaje}% completado\n🌿 ${etapaActual.nombre}\n\n`;
        if (porcentaje >= 100) mensaje += `✅ ¡LISTO PARA COSECHAR!`;
        else if (porcentaje > 80) mensaje += `🔜 Casi listo.`;
        else mensaje += `🌱 Sigue cuidando las plantas.`;
        agregarMensaje(mensaje, "bot");
        return;
    }

    if (id === "etapa") {
        agregarMensaje("🌿 ¿En qué etapa estoy?", "user");
        let mensaje = `🌿 <strong>Etapa actual</strong>\n\n📅 Día ${dias}\n🌱 ${etapaActual.nombre}\n${etapaActual.descripcion || ''}\n\n📋 <strong>Todas las etapas:</strong>\n`;
        cultivo.etapas.forEach(e => mensaje += `${e.nombre === etapaActual.nombre ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`);
        mensaje += `\n💡 Puedes cambiar de etapa con los botones en el panel de progreso.`;
        agregarMensaje(mensaje, "bot");
        return;
    }

    if (id === "soluciones") {
        agregarMensaje("🔧 Dame todas las soluciones", "user");
        agregarMensaje(generarSolucionesCompletas(), "bot");
        return;
    }

    if (id === "bomba") {
        agregarMensaje("🔌 ¿Cómo está la bomba?", "user");
        const valor = datosActuales.bomba === true || datosActuales.bomba === "true" || datosActuales.bomba === 1;
        agregarMensaje(valor ? "✅ La bomba está ENCENDIDA." : "⏸️ La bomba está APAGADA.", "bot");
        return;
    }

    const c = configuracion[id];
    if (!c) { agregarMensaje("❓ No entendí la pregunta.", "bot"); return; }

    const p = preguntasChip.find(x => x.id === id);
    const valor = Number(datosActuales[c.campo]);
    if (p) agregarMensaje(p.texto, "user");

    if (!Number.isFinite(valor) || valor === -273.15) {
        if (id === 'temp-agua' && valor === -273.15) {
            agregarMensaje(`🌊 El sensor de temperatura del agua está defectuoso (-273.15°C).\n\n🔧 Verifica la conexión del sensor DS18B20, reinicia el ESP32 o reemplázalo.`, "bot");
        } else {
            agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot");
        }
        return;
    }

    const analisis = analizarSensor(id, valor);
    const sol = analisis.soluciones || { soluciones: [], explicacion: "" };

    let mensaje = `<strong>${c.nombre}:</strong> `;
    if (id === 'luz') mensaje += `${analisis.estado.texto}\n\n`;
    else mensaje += `${formato(valor, id)} (${analisis.estado.texto})\n\n`;
    mensaje += `📊 ${analisis.significado}\n\n`;
    mensaje += `📈 Tendencia: ${analisis.tendencia.texto}\n\n`;

    if (sol.soluciones && sol.soluciones.length > 0) {
        mensaje += `🔧 <strong>SOLUCIONES:</strong>\n`;
        mensaje += sol.soluciones.map(s => `• ${s}`).join('\n');
        if (sol.explicacion) mensaje += `\n\n💡 ${sol.explicacion}`;
    } else {
        mensaje += `✅ Todo en orden. Sigue así.`;
    }

    agregarMensaje(mensaje, "bot");
};

// Exponer funciones globales
window.preguntar = window.preguntar;

// ============================================================
// 16. FIREBASE - VALOR ACTUAL
// ============================================================

onValue(valorActualRef, snapshot => {
    const datos = snapshot.val();
    if (!datos) return;
    datosActuales = datos;
    lastUpdateTime = new Date();
    if (isOffline) actualizarEstadoOffline(false);
    reiniciarTimeout();
    for (const sensor in configuracion) {
        actualizarTarjeta(sensor, Number(datos[configuracion[sensor].campo]));
    }
    actualizarTarjetaBomba(datos.bomba);
    actualizarEstadoGeneral();
    actualizarAsistente();
    console.log("📊 Datos recibidos:", {
        pH: datos.PH, temp: datos.Temperatura_Ambiente,
        tempAgua: datos.Temperatura_Agua, humedad: datos.Humedad_Ambiente,
        luz: datos.luz, bomba: datos.bomba
    });
}, error => console.error("Firebase error:", error));

// ============================================================
// 17. FIREBASE - HISTORIAL
// ============================================================

onValue(historialRef, snapshot => {
    const data = snapshot.val();
    if (!data) { registrosHistorial = []; return; }
    registrosHistorial = Object.entries(data).map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    document.getElementById("contador-registros").textContent = registrosHistorial.length;
    actualizarTabla();
    actualizarGrafica();
    actualizarEstadoGeneral();
    actualizarAsistente();
}, error => console.error("Firebase error (Historial):", error));

// ============================================================
// 18. SELECTOR DE CULTIVO
// ============================================================

document.getElementById('selectorCultivo').addEventListener('change', function() {
    cultivoSeleccionado = this.value;
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();
    actualizarAsistente();
    if (datosActuales) {
        for (const sensor in configuracion) {
            actualizarTarjeta(sensor, Number(datosActuales[configuracion[sensor].campo]));
        }
        actualizarTarjetaBomba(datosActuales.bomba);
    }
    document.getElementById("chatMensajes").innerHTML = "";
    chatIniciado = false;
    iniciarChat();
});

// ============================================================
// 19. INICIALIZACIÓN
// ============================================================

// Cargar fecha de siembra
const fechaGuardada = localStorage.getItem('fechaSiembra');
const fechaPanel = document.getElementById('fechaSiembraPanel');
if (fechaGuardada) {
    fechaPanel.value = fechaGuardada;
    fechaInicio = fechaGuardada;
} else {
    const hoy = new Date();
    const fechaStr = hoy.toISOString().split('T')[0];
    fechaPanel.value = fechaStr;
    fechaInicio = fechaStr;
    localStorage.setItem('fechaSiembra', fechaStr);
}

// Eventos de fecha
fechaPanel.addEventListener('change', function() {
    if (isOffline) return;
    fechaInicio = this.value;
    localStorage.setItem('fechaSiembra', this.value);
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();
    actualizarAsistente();
});

document.getElementById('btnHoy').addEventListener('click', function() {
    if (isOffline) return;
    const hoy = new Date();
    const fechaStr = hoy.toISOString().split('T')[0];
    fechaPanel.value = fechaStr;
    fechaInicio = fechaStr;
    localStorage.setItem('fechaSiembra', fechaStr);
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();
    actualizarAsistente();
});

document.getElementById('btnSemana').addEventListener('click', function() {
    if (isOffline) return;
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 7);
    const fechaStr = hoy.toISOString().split('T')[0];
    fechaPanel.value = fechaStr;
    fechaInicio = fechaStr;
    localStorage.setItem('fechaSiembra', fechaStr);
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();
    actualizarAsistente();
});

// Renderizar e iniciar
renderizarSensores();
actualizarPanelCrecimiento();
reiniciarTimeout();
setTimeout(() => { iniciarChat(); }, 500);

console.log("🚀 Dashboard Aeroponia UTS - Versión completa con chat integrado");
console.log("✅ Firebase conectado y esperando datos...");
console.log("🌊 Temperatura agua -273.15°C se detecta como sensor defectuoso");