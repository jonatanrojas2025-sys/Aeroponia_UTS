// ============================================================
// SENSORES - RENDERIZADO Y ACTUALIZACIÓN
// ============================================================

import { configuracion } from './config.js';
import { 
    getOffline, 
    getDatosActuales,
    obtenerEstado,
    formato 
} from './utils.js';

let sensorAbierto = null;

// ============================================================
// RENDERIZAR SENSORES
// ============================================================

export function renderizarSensores() {
    const grid = document.getElementById('sensorGrid');
    if (!grid) return;

    grid.innerHTML = '';

    // Crear tarjetas para sensores
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

    // Tarjeta de bomba (especial)
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
// ACTUALIZAR TARJETA DE SENSOR
// ============================================================

export function actualizarTarjeta(sensor, valor) {
    const c = configuracion[sensor];
    const elemento = document.getElementById(`sensor-${sensor}`);
    const status = document.getElementById(`sensor-${sensor}-status`);
    const card = document.getElementById(`card-${sensor}`);

    if (!elemento) return;

    const offline = getOffline();

    if (offline || !Number.isFinite(valor) || valor === -273.15) {
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

// ============================================================
// ACTUALIZAR TARJETA DE BOMBA
// ============================================================

export function actualizarTarjetaBomba(valor) {
    const elemento = document.getElementById("sensor-bomba");
    const status = document.getElementById("sensor-bomba-status");
    const card = document.getElementById("card-bomba");
    const icono = document.getElementById("bomba-icon");

    if (!elemento) return;

    const offline = getOffline();

    if (offline || valor === undefined || valor === null) {
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
// ABRIR DETALLE DEL SENSOR
// ============================================================

window.abrirDetalle = function(sensor) {
    const detalle = document.getElementById("sensor-detail");
    if (sensorAbierto === sensor) {
        detalle.classList.remove("visible");
        sensorAbierto = null;
        return;
    }
    sensorAbierto = sensor;
    detalle.classList.add("visible");
    // Aquí iría la lógica para mostrar el detalle
};