// ============================================================
// APP - VERSIÓN COMPLETA CON DETECCIÓN DE SENSOR DEFECTUOSO
// ============================================================

import { valorActualRef, historialRef, onValue } from './firebase-config.js';

// ============================================================
// 1. BASE DE DATOS DE CULTIVOS
// ============================================================

const cultivosDB = {
    lechuga: {
        nombre: "Lechuga",
        tipo: "Hoja verde",
        descripcion: "Cultivo de rápido crecimiento.",
        ph: { min: 5.5, max: 6.5, ideal: 6.0 },
        temp: { min: 15, max: 24, ideal: 20 },
        "temp-agua": { min: 18, max: 24, ideal: 21 },
        humedad: { min: 50, max: 70, ideal: 60 },
        luz: { min: 400, max: 600, ideal: 500 },
        ciclo: { min: 30, max: 45, promedio: 38 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 7, nombre: "🌿 Plántula" },
            { dia: 14, nombre: "🌱 Crecimiento" },
            { dia: 25, nombre: "🌿 Desarrollo" },
            { dia: 35, nombre: "✅ Cosecha" }
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
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 15, nombre: "🌿 Plántula" },
            { dia: 30, nombre: "🌱 Crecimiento" },
            { dia: 50, nombre: "🌿 Floración" },
            { dia: 70, nombre: "🍓 Cosecha" }
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
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 20, nombre: "🌿 Plántula" },
            { dia: 40, nombre: "🌱 Crecimiento" },
            { dia: 60, nombre: "🌿 Floración" },
            { dia: 80, nombre: "🍅 Cosecha" }
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
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 10, nombre: "🌿 Plántula" },
            { dia: 20, nombre: "🌱 Crecimiento" },
            { dia: 30, nombre: "🌿 Cosecha" }
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
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 12, nombre: "🌿 Plántula" },
            { dia: 25, nombre: "🌱 Crecimiento" },
            { dia: 38, nombre: "🌿 Cosecha" }
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
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 8, nombre: "🌿 Plántula" },
            { dia: 18, nombre: "🌱 Crecimiento" },
            { dia: 30, nombre: "🌿 Cosecha" }
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

// ===== FUNCIÓN CORREGIDA: DETECTA -273.15 =====
function obtenerEstado(sensor, valor) {
    const dias = 0;
    const rango = getRangoPorEtapa(sensor, dias);
    
    // DETECTAR SENSOR DEFECTUOSO (TEMP AGUA)
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
    if (valor === null || !Number.isFinite(valor)) return "--";
    return valor.toFixed(c.decimales) + c.unidad;
}

// ============================================================
// 5. RENDERIZAR SENSORES
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

    // Bomba
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
// 6. ACTUALIZAR TARJETAS (CORREGIDO)
// ============================================================

function actualizarTarjeta(sensor, valor) {
    const c = configuracion[sensor];
    const elemento = document.getElementById(`sensor-${sensor}`);
    const status = document.getElementById(`sensor-${sensor}-status`);
    const card = document.getElementById(`card-${sensor}`);
    if (!elemento) return;

    // PERMITIR -273.15 PARA DETECTAR SENSOR DEFECTUOSO
    if (isOffline || valor === null || !Number.isFinite(valor)) {
        card?.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
        card?.classList.add("estado-offline");
        status.className = "sub sub-offline";
        elemento.innerHTML = "--";
        status.textContent = "📡 Sin datos";
        return;
    }

    const resultado = obtenerEstado(sensor, valor);
    
    // MOSTRAR -273.15 COMO "SENSOR DEFECTUOSO"
    if (sensor === 'temp-agua' && valor === -273.15) {
        elemento.innerHTML = "-273.15°C";
        status.textContent = "❌ Sensor defectuoso";
        status.className = "sub sub-danger";
        card?.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline");
        card?.classList.add("estado-danger");
        return;
    }
    
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
// 7. PANEL DE CRECIMIENTO
// ============================================================

function actualizarPanelCrecimiento() {
    const cultivo = getCultivoInfo();
    const dias = 0;
    const etapaActual = getEtapaActual(dias);
    const porcentaje = 0;

    const el = (id) => document.getElementById(id);
    if (el('etapaIcono')) el('etapaIcono').textContent = etapaActual.nombre.split(' ')[0] || '🌱';
    if (el('etapaNombre')) el('etapaNombre').textContent = etapaActual.nombre;
    if (el('etapaDia')) el('etapaDia').textContent = `Día ${dias}`;
    if (el('progresoPorcentaje')) el('progresoPorcentaje').textContent = `${porcentaje}%`;
    const barra = el('progresoBarra');
    if (barra) { barra.style.width = `${porcentaje}%`; barra.classList.toggle('offline', isOffline); }
    if (el('diasTranscurridos')) el('diasTranscurridos').textContent = dias;
    if (el('diasTotales')) el('diasTotales').textContent = cultivo.ciclo.promedio;
}

// ============================================================
// 8. TABLA (CORREGIDA)
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
        
        // DETECTAR TEMP AGUA DEFECTUOSA EN TABLA
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
// 9. GRÁFICA
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
// 10. ESTADO GENERAL
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
    const etapaActual = getEtapaActual(0);

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
// 11. CONEXIÓN (CORREGIDO)
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
}

function reiniciarTimeout() {
    if (dataTimeout) clearTimeout(dataTimeout);
    dataTimeout = setTimeout(() => {
        actualizarEstadoOffline(true);
    }, DATA_TIMEOUT_MS);
}

// ============================================================
// 12. CHAT
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
    { id: "soluciones", texto: "🔧 Soluciones", icono: "fa-tools" },
    { id: "etapa", texto: "🌿 Etapa actual", icono: "fa-seedling" }
];

function iniciarChat() {
    if (chatIniciado) return;
    chatIniciado = true;
    const cultivo = getCultivoInfo();
    const etapaActual = getEtapaActual(0);
    const mensaje = `🌱 ¡Hola! Soy tu asistente de ${cultivo.nombre}.\n\n📅 Etapa: ${etapaActual.nombre}\n\n💡 Elige una pregunta.`;
    agregarMensaje(mensaje, "bot");
    renderizarChips();
}

function renderizarChips() {
    const cont = document.getElementById("chatChips");
    if (!cont) return;
    cont.innerHTML = preguntasChip.map(p => `
        <button class="chip" onclick="window.preguntar('${p.id}')">
            <i class="fas ${p.icono}"></i> ${p.texto}
        </button>
    `).join("") + `
        <button class="chip chip-reset" onclick="window.preguntar('reiniciar')">
            <i class="fas fa-rotate"></i> Reiniciar
        </button>
    `;
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

window.preguntar = function(id) {
    if (id === "reiniciar") {
        document.getElementById("chatMensajes").innerHTML = "";
        chatIniciado = false;
        iniciarChat();
        return;
    }
    const datos = datosActuales;
    if (!datos) { agregarMensaje("⏳ Esperando datos...", "bot"); return; }
    
    if (id === "resumen") {
        agregarMensaje("📊 Dame un resumen general", "user");
        let msg = `📊 <strong>RESUMEN</strong>\n\n`;
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            if (!Number.isFinite(valor)) continue;
            const estado = obtenerEstado(sensor, valor);
            msg += `${configuracion[sensor].nombre}: ${formato(valor, sensor)} (${estado.texto})\n`;
        }
        agregarMensaje(msg, "bot");
        return;
    }
    
    if (id === "cosecha") {
        agregarMensaje("🌱 ¿Cuándo estará listo?", "user");
        const cultivo = getCultivoInfo();
        const msg = `🌱 <strong>Análisis de COSECHA</strong>\n\n🌿 ${getEtapaActual(0).nombre}\n\n🌱 Sigue cuidando las plantas.`;
        agregarMensaje(msg, "bot");
        return;
    }
    
    if (id === "etapa") {
        agregarMensaje("🌿 ¿En qué etapa estoy?", "user");
        const cultivo = getCultivoInfo();
        const etapa = getEtapaActual(0);
        let msg = `🌿 <strong>Etapa actual</strong>\n\n🌱 ${etapa.nombre}\n\n📋 <strong>Todas las etapas:</strong>\n`;
        cultivo.etapas.forEach(e => {
            msg += `${e.nombre === etapa.nombre ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`;
        });
        agregarMensaje(msg, "bot");
        return;
    }
    
    if (id === "bomba") {
        agregarMensaje("🔌 ¿Cómo está la bomba?", "user");
        const valor = datos.bomba === true || datos.bomba === "true" || datos.bomba === 1;
        agregarMensaje(valor ? "✅ La bomba está ENCENDIDA." : "⏸️ La bomba está APAGADA.", "bot");
        return;
    }
    
    const c = configuracion[id];
    if (!c) { agregarMensaje("❓ No entendí la pregunta.", "bot"); return; }
    const p = preguntasChip.find(x => x.id === id);
    if (p) agregarMensaje(p.texto, "user");
    const valor = Number(datos[c.campo]);
    if (!Number.isFinite(valor)) {
        agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot");
        return;
    }
    const estado = obtenerEstado(id, valor);
    const msg = `<strong>${c.nombre}:</strong> ${formato(valor, id)} (${estado.texto})`;
    agregarMensaje(msg, "bot");
};

// ============================================================
// 13. FIREBASE - VALOR ACTUAL
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
    console.log("📊 Datos recibidos:", {
        pH: datos.PH, temp: datos.Temperatura_Ambiente,
        tempAgua: datos.Temperatura_Agua, humedad: datos.Humedad_Ambiente,
        luz: datos.luz, bomba: datos.bomba
    });
}, error => console.error("Firebase error:", error));

// ============================================================
// 14. FIREBASE - HISTORIAL
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
}, error => console.error("Firebase error (Historial):", error));

// ============================================================
// 15. SELECTOR DE CULTIVO
// ============================================================

document.getElementById('selectorCultivo').addEventListener('change', function() {
    cultivoSeleccionado = this.value;
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();
    if (datosActuales) {
        for (const sensor in configuracion) {
            actualizarTarjeta(sensor, Number(datosActuales[configuracion[sensor].campo]));
        }
        actualizarTarjetaBomba(datosActuales.bomba);
    }
});

// ============================================================
// 16. INICIALIZACIÓN
// ============================================================

renderizarSensores();
actualizarPanelCrecimiento();
reiniciarTimeout();
setTimeout(() => { iniciarChat(); }, 500);

console.log("🚀 Dashboard Aeroponia UTS - Versión completa con detección de sensor defectuoso");
console.log("✅ Firebase conectado y esperando datos...");
console.log("🌊 Si la temperatura del agua es -273.15°C, se mostrará como 'Sensor defectuoso'");