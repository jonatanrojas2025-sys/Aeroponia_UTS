// ============================================================
// APP - PUNTO DE ENTRADA PRINCIPAL (VERSIÓN CORREGIDA)
// ============================================================

import {
    valorActualRef,
    historialRef,
    onValue
} from './firebase-config.js';

// ============================================================
// 1. BASE DE DATOS DE CULTIVOS (COMPLETA)
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
        nombre: "Fresa",
        tipo: "Fruto",
        descripcion: "Cultivo de alto valor comercial.",
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
        nombre: "Tomate cherry",
        tipo: "Fruto",
        descripcion: "Cultivo de gran demanda.",
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
        nombre: "Cilantro",
        tipo: "Hierba aromática",
        descripcion: "Ciclo corto y alta rotación.",
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
        nombre: "Albahaca",
        tipo: "Hierba aromática",
        descripcion: "Aroma intenso. Crece muy bien en aeroponía.",
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
        nombre: "Espinaca",
        tipo: "Hoja verde",
        descripcion: "Alta en nutrientes y de crecimiento rápido.",
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
    ph: {
        campo: "PH",
        nombre: "pH",
        icono: "fa-flask",
        unidad: "",
        decimales: 2,
        tieneRango: true
    },
    temp: {
        campo: "Temperatura_Ambiente",
        nombre: "Temp. Ambiente",
        icono: "fa-temperature-half",
        unidad: "°C",
        decimales: 1,
        tieneRango: true
    },
    "temp-agua": {
        campo: "Temperatura_Agua",
        nombre: "Temp. Agua",
        icono: "fa-temperature-three-quarters",
        unidad: "°C",
        decimales: 1,
        tieneRango: true
    },
    hum: {
        campo: "Humedad_Ambiente",
        nombre: "Humedad",
        icono: "fa-droplet",
        unidad: "%",
        decimales: 1,
        tieneRango: true
    },
    luz: {
        campo: "luz",
        nombre: "Luz",
        icono: "fa-sun",
        unidad: " lux",
        decimales: 0,
        tieneRango: true
    }
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

// ============================================================
// 4. FUNCIONES DE UTILIDAD (CON VALORES POR DEFECTO)
// ============================================================

function getCultivoInfo() {
    return cultivosDB[cultivoSeleccionado] || cultivosDB.lechuga;
}

function getRangoPorEtapa(sensor, dias) {
    const cultivo = getCultivoInfo();
    
    // VALORES POR DEFECTO (por si falta el sensor en el cultivo)
    const valoresPorDefecto = {
        ph: { min: 5.0, max: 7.0, ideal: 6.0 },
        temp: { min: 15, max: 28, ideal: 22 },
        "temp-agua": { min: 18, max: 26, ideal: 22 },
        humedad: { min: 40, max: 80, ideal: 60 },
        luz: { min: 300, max: 800, ideal: 500 }
    };
    
    // Si el sensor es "hum", buscar como "humedad" en el cultivo
    let sensorKey = sensor;
    if (sensor === 'hum') sensorKey = 'humedad';
    
    // Buscar en el cultivo
    let rango = cultivo[sensorKey];
    
    // Si no existe, usar valores por defecto
    if (!rango) {
        rango = valoresPorDefecto[sensorKey] || valoresPorDefecto.ph;
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

function obtenerDiasTranscurridos() {
    // Por ahora, siempre devuelve 0 (día de siembra)
    // Puedes modificar esto para usar la fecha de Firebase si la tienes
    return 0;
}

function getEtapaActual(dias) {
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

function obtenerEstado(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);

    // Si el valor no es válido
    if (valor === null || valor === undefined || isNaN(valor) || valor === -273.1) {
        return { estado: "warning", texto: "⚠️ Sin datos" };
    }

    // Asegurarse de que rango existe
    if (!rango || typeof rango.min !== 'number' || typeof rango.max !== 'number') {
        return { estado: "warning", texto: "⚠️ Sin rango" };
    }

    const { min, max } = rango;

    // Sensor de luz (comportamiento especial)
    if (sensor === 'luz') {
        if (valor < min) return { estado: "warning", texto: "🌑 Poca luz" };
        if (valor > max) return { estado: "danger", texto: "☀️ Exceso de luz" };
        return { estado: "ok", texto: "☀️ Buena luz" };
    }

    // Sensor de temperatura (valores críticos)
    if (sensor === 'temp' || sensor === 'temp-agua') {
        if (valor < -100 || valor > 100) {
            return { estado: "danger", texto: "❌ Sensor defectuoso" };
        }
    }

    // Evaluación normal
    if (valor >= min && valor <= max) {
        return { estado: "ok", texto: "✅ Bueno" };
    }

    const margen = (max - min) * 0.20;
    if (valor >= min - margen && valor <= max + margen) {
        return { estado: "warning", texto: "⚠️ Regular" };
    }

    return { estado: "danger", texto: "❌ Crítico" };
}

function formato(valor, sensor) {
    const c = configuracion[sensor];
    if (!Number.isFinite(valor) || valor === -273.1) return "--";
    return valor.toFixed(c.decimales) + c.unidad;
}

// ============================================================
// 5. RENDERIZAR SENSORES
// ============================================================

function renderizarSensores() {
    const grid = document.getElementById('sensorGrid');
    if (!grid) return;

    grid.innerHTML = '';

    // Crear tarjetas para sensores con rango
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

    // Tarjeta de bomba (especial - no tiene rango)
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
// 6. ACTUALIZAR TARJETAS
// ============================================================

function actualizarTarjeta(sensor, valor) {
    const c = configuracion[sensor];
    const elemento = document.getElementById(`sensor-${sensor}`);
    const status = document.getElementById(`sensor-${sensor}-status`);
    const card = document.getElementById(`card-${sensor}`);

    if (!elemento) return;

    // Si está offline o el valor no es válido
    if (isOffline || !Number.isFinite(valor) || valor === -273.1) {
        card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
        card.classList.add("estado-offline");
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

    card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline");
    card.classList.add(`estado-${resultado.estado}`);
}

function actualizarTarjetaBomba(valor) {
    const elemento = document.getElementById("sensor-bomba");
    const status = document.getElementById("sensor-bomba-status");
    const card = document.getElementById("card-bomba");
    const icono = document.getElementById("bomba-icon");

    if (!elemento) return;

    if (isOffline || valor === undefined || valor === null) {
        card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
        card.classList.add("estado-offline");
        status.className = "sub sub-offline";
        status.textContent = "📡 Sin datos";
        elemento.textContent = "--";
        return;
    }

    const encendida = valor === true || valor === "true" || valor === 1;
    elemento.textContent = encendida ? "🔴 ON" : "⏸️ OFF";
    status.textContent = encendida ? "✅ Encendida" : "⏸️ Apagada";
    status.className = encendida ? "sub sub-ok" : "sub sub-off";

    card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline");
    card.classList.add(encendida ? "estado-ok" : "estado-off");

    if (icono) {
        icono.style.color = encendida ? "#22c55e" : "#64748b";
    }
}

// ============================================================
// 7. ACTUALIZAR PANEL DE CRECIMIENTO
// ============================================================

function actualizarPanelCrecimiento() {
    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));

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
        barra.classList.toggle('offline', isOffline);
    }
    
    const diasTranscurridos = document.getElementById('diasTranscurridos');
    if (diasTranscurridos) diasTranscurridos.textContent = dias;

    const diasTotales = document.getElementById('diasTotales');
    if (diasTotales) diasTotales.textContent = cultivo.ciclo.promedio;
}

// ============================================================
// 8. ACTUALIZAR TABLA
// ============================================================

function actualizarTabla() {
    const tbody = document.getElementById("tabla-body");

    if (!registrosHistorial.length) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center">📭 No hay datos históricos.</td></tr>`;
        return;
    }

    let html = "";
    registrosHistorial.slice().reverse().slice(0, 30).forEach(r => {
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

        if (isOffline) {
            estadoTexto = "📡 Sin datos";
            estadoClase = "td-danger";
        }

        html += `
            <tr>
                <td style="color:#64748b; font-size:12px;">${fecha}</td>
                <td>${Number.isFinite(ph) && ph !== -273.1 ? ph.toFixed(2) : "--"}</td>
                <td>${Number.isFinite(temp) && temp !== -273.1 ? temp.toFixed(1)+"°C" : "--"}</td>
                <td>${Number.isFinite(tempAgua) && tempAgua !== -273.1 ? tempAgua.toFixed(1)+"°C" : "--"}</td>
                <td>${Number.isFinite(hum) && hum !== -273.1 ? hum.toFixed(1)+"%" : "--"}</td>
                <td>${Number.isFinite(luz) && luz !== -273.1 ? luz.toFixed(0)+" lux" : "--"}</td>
                <td class="${bombaOn ? 'td-ok' : ''}">${bombaOn ? "🔴 ON" : "⚪ OFF"}</td>
                <td class="${estadoClase}">${estadoTexto}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// ============================================================
// 9. ACTUALIZAR GRÁFICA
// ============================================================

function actualizarGrafica() {
    const ultimos = registrosHistorial.slice(-40);
    if (!ultimos.length) return;

    const labels = ultimos.map(r => r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : "");

    const datasets = [
        { label: "pH", data: ultimos.map(r => Number(r.PH) || null), borderColor: "#a78bfa",
            backgroundColor: "rgba(167,139,250,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Temp. ambiente °C", data: ultimos.map(r => Number(r.Temperatura_Ambiente) || null),
            borderColor: "#fb923c", backgroundColor: "rgba(251,146,60,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Temp. agua °C", data: ultimos.map(r => Number(r.Temperatura_Agua) || null),
            borderColor: "#2dd4bf", backgroundColor: "rgba(45,212,191,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Humedad %", data: ultimos.map(r => Number(r.Humedad_Ambiente) || null),
            borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Luz lux", data: ultimos.map(r => Number(r.luz) || null), borderColor: "#facc15",
            backgroundColor: "rgba(250,204,21,.08)", tension: .3, pointRadius: 2, borderWidth: 2 }
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
            interaction: { mode: "index", intersect: false },
            plugins: {
                legend: {
                    labels: { color: "#94a3b8", boxWidth: 12, padding: 12, font: { size: 11 } }
                }
            },
            scales: {
                y: { grid: { color: "rgba(255,255,255,.04)" }, ticks: { color: "#64748b", font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: "#64748b", maxTicksLimit: 8, autoSkip: true,
                        font: { size: 9 } } }
            }
        }
    });
}

// ============================================================
// 10. ACTUALIZAR ESTADO GENERAL
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
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);

    if (isOffline) {
        alerta.className = "alerta-box offline";
        alerta.innerHTML = `
            <i class="fas fa-microchip"></i>
            <span>
                <strong>📡 ESP32 SIN TRANSMITIR DATOS</strong>
                <span style="color:#94a3b8; display:block; font-size:13px; margin-top:4px;">
                    El sistema sigue funcionando de forma autónoma.
                    <span style="color:#fcd34d; display:inline-block; margin-top:4px; padding:2px 10px; background:rgba(245,158,11,0.15); border-radius:12px;">
                        🤖 MODO AUTÓNOMO ACTIVO
                    </span>
                </span>
                <span style="color:#64748b; display:block; font-size:12px; margin-top:4px;">
                    📊 ${totalRegistros} registros históricos | 🌱 ${etapaActual.nombre}
                </span>
            </span>
        `;
        return;
    }

    let problemas = [];
    let advertencias = [];

    for (const sensor in configuracion) {
        const valor = Number(datosActuales[configuracion[sensor].campo]);
        if (!Number.isFinite(valor) || valor === -273.1) continue;

        const estado = obtenerEstado(sensor, valor);
        if (estado.estado === "danger") {
            problemas.push(configuracion[sensor].nombre);
        } else if (estado.estado === "warning") {
            advertencias.push(configuracion[sensor].nombre);
        }
    }

    let nivel = "success";
    let icono = "✅";
    let mensaje = `${cultivo.nombre} en óptimas condiciones.`;

    if (problemas.length > 0) {
        nivel = "danger";
        icono = "🚨";
        mensaje = `${problemas.length} problema(s): ${problemas.join(", ")}. ¡ACTÚA!`;
    } else if (advertencias.length > 0) {
        nivel = "loading";
        icono = "⚠️";
        mensaje = `${advertencias.length} aviso(s): ${advertencias.join(", ")}.`;
    }

    alerta.className = `alerta-box ${nivel}`;
    alerta.innerHTML = `
        <i class="fas ${icono === '🚨' ? 'fa-triangle-exclamation' : icono === '⚠️' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
        <span>
            <strong>${icono} ${mensaje}</strong>
            📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre} (Día ${dias})
            ${lastUpdateTime ? ` | ⏱️ ${lastUpdateTime.toLocaleTimeString()}` : ''}
        </span>
    `;
}

// ============================================================
// 11. ACTUALIZAR ESTADO DE CONEXIÓN
// ============================================================

function actualizarEstadoOffline(offline) {
    isOffline = offline;
    
    const badge = document.getElementById("statusBadge");
    const text = document.getElementById("statusText");
    const icon = document.getElementById("statusIcon");
    
    if (offline) {
        badge.className = "status-badge offline";
        text.textContent = '📡 Sin datos ESP32';
        icon.className = 'fas fa-wifi-slash';
    } else {
        badge.className = "status-badge connected";
        text.textContent = '✅ Conectado';
        icon.className = 'fas fa-circle';
    }
    
    if (datosActuales) {
        for (const sensor in configuracion) {
            const valor = Number(datosActuales[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
        actualizarTarjetaBomba(datosActuales.bomba);
    }
    
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();
}

function reiniciarTimeout() {
    if (dataTimeout) {
        clearTimeout(dataTimeout);
    }
    
    dataTimeout = setTimeout(() => {
        actualizarEstadoOffline(true);
    }, DATA_TIMEOUT_MS);
}

// ============================================================
// 12. FIREBASE - VALOR ACTUAL
// ============================================================

onValue(valorActualRef, snapshot => {
    const datos = snapshot.val();
    
    if (!datos) return;

    datosActuales = datos;
    lastUpdateTime = new Date();

    if (isOffline) {
        actualizarEstadoOffline(false);
    }

    reiniciarTimeout();

    for (const sensor in configuracion) {
        const campo = configuracion[sensor].campo;
        const valor = Number(datos[campo]);
        actualizarTarjeta(sensor, valor);
    }
    actualizarTarjetaBomba(datos.bomba);

    actualizarEstadoGeneral();

    console.log("📊 Datos recibidos:", {
        pH: datos.PH,
        temp: datos.Temperatura_Ambiente,
        tempAgua: datos.Temperatura_Agua,
        humedad: datos.Humedad_Ambiente,
        luz: datos.luz,
        bomba: datos.bomba
    });

}, error => {
    console.error("Firebase error (ValorActual):", error);
});

// ============================================================
// 13. FIREBASE - HISTORIAL
// ============================================================

onValue(historialRef, snapshot => {
    const data = snapshot.val();
    if (!data) {
        registrosHistorial = [];
        return;
    }

    registrosHistorial = Object.entries(data)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    document.getElementById("contador-registros").textContent = registrosHistorial.length;
    actualizarTabla();
    actualizarGrafica();
    actualizarEstadoGeneral();

}, error => {
    console.error("Firebase error (Historial):", error);
});

// ============================================================
// 14. SELECTOR DE CULTIVO
// ============================================================

document.getElementById('selectorCultivo').addEventListener('change', function() {
    cultivoSeleccionado = this.value;
    actualizarPanelCrecimiento();
    actualizarEstadoGeneral();

    if (datosActuales) {
        for (const sensor in configuracion) {
            const valor = Number(datosActuales[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
        actualizarTarjetaBomba(datosActuales.bomba);
    }
});

// ============================================================
// 15. INICIALIZACIÓN FINAL
// ============================================================

renderizarSensores();
actualizarPanelCrecimiento();
reiniciarTimeout();

console.log("🚀 Dashboard Aeroponia UTS - Versión corregida");
console.log("✅ Firebase conectado y esperando datos...");