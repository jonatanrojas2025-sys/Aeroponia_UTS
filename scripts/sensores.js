// ============================================================
// SENSORES - TARJETAS Y DETALLES
// ============================================================

import { 
    getDatosActuales,
    getRegistrosHistorial,
    getOffline,
    formato,
    obtenerEstado,
    configuracion,
    getCultivoInfo,
    obtenerDiasTranscurridos,
    getRangoPorEtapa
} from './utils.js';

import { analizarSensor, generarSolucionesPracticas } from './analisis.js';

let sensorAbierto = null;

export function renderizarSensores() {
    const grid = document.querySelector('.sensor-grid');
    if (!grid) return;

    // Limpiar grid manteniendo el detalle
    const detail = document.getElementById('sensor-detail');
    grid.innerHTML = '';

    // Crear tarjetas
    for (const [key, config] of Object.entries(configuracion)) {
        const card = document.createElement('div');
        card.className = 'sensor-card';
        card.id = `card-${key}`;
        card.onclick = () => abrirDetalle(key);

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
    bombaCard.onclick = () => abrirDetalle('bomba');

    bombaCard.innerHTML = `
        <div class="sensor-icon bomba"><i class="fas fa-power-off" id="bomba-icon"></i></div>
        <div class="sensor-value" id="sensor-bomba">--</div>
        <div class="sensor-label">Bomba</div>
        <div class="sub sub-warning" id="sensor-bomba-status">Esperando...</div>
        <div class="tocar"><i class="fas fa-hand-pointer"></i> Toca para saber más</div>
    `;

    grid.appendChild(bombaCard);

    // Detalle
    const detailDiv = document.createElement('div');
    detailDiv.className = 'sensor-detail';
    detailDiv.id = 'sensor-detail';
    detailDiv.innerHTML = `
        <div class="detalle-titulo" id="detalle-titulo">
            <i class="fas fa-chart-simple"></i> Análisis del sensor
        </div>
        <div class="detalle-grid" id="detalle-metricas"></div>
        <div class="detalle-bloque" id="detalle-significado">
            <h4><i class="fas fa-circle-info"></i> ¿Qué significa esto?</h4>
            <p id="detalle-significado-text"></p>
        </div>
        <div class="detalle-bloque" id="detalle-tendencia">
            <h4><i class="fas fa-chart-line"></i> Comportamiento reciente</h4>
            <p id="detalle-tendencia-text"></p>
        </div>
        <div class="detalle-bloque soluciones" id="detalle-soluciones">
            <h4><i class="fas fa-tools"></i> 🔧 Soluciones prácticas</h4>
            <div id="detalle-soluciones-text"></div>
        </div>
        <div class="detalle-bloque recomendacion" id="detalle-recomendacion">
            <h4><i class="fas fa-lightbulb"></i> Recomendación</h4>
            <p id="detalle-recomendacion-text"></p>
        </div>
    `;

    grid.appendChild(detailDiv);
}

export function actualizarTarjeta(sensor, valor) {
    const c = configuracion[sensor];
    const elemento = document.getElementById(`sensor-${sensor}`);
    const status = document.getElementById(`sensor-${sensor}-status`);
    const card = document.getElementById(`card-${sensor}`);

    if (!elemento) return;

    const offline = getOffline();

    if (offline) {
        card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
        card.classList.add("estado-offline");
        status.className = "sub sub-offline";
        if (sensor === 'luz') {
            elemento.innerHTML = "📡 Sin datos";
        } else {
            elemento.innerHTML = "--";
        }
        status.textContent = "📡 Sin datos";
        return;
    }

    if (!Number.isFinite(valor)) {
        elemento.textContent = "--";
        status.textContent = "⚠️ Esperando...";
        status.className = "sub sub-warning";
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

export function actualizarTarjetaBomba(valor) {
    const elemento = document.getElementById("sensor-bomba");
    const status = document.getElementById("sensor-bomba-status");
    const card = document.getElementById("card-bomba");
    const icono = document.getElementById("bomba-icon");

    if (!elemento) return;

    const offline = getOffline();

    if (offline) {
        card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
        card.classList.add("estado-offline");
        status.className = "sub sub-offline";
        status.textContent = "📡 Sin datos";
        elemento.textContent = "--";
        return;
    }

    if (valor === undefined || valor === null) {
        elemento.textContent = "--";
        status.textContent = "⚠️ Esperando...";
        status.className = "sub sub-warning";
        return;
    }

    const encendida = valor === true || valor === "true";
    elemento.textContent = encendida ? "🔴 ON" : "⏸️ OFF";
    status.textContent = encendida ? "✅ Encendida" : "⏸️ Apagada";
    status.className = encendida ? "sub sub-ok" : "sub sub-off";

    card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline");
    card.classList.add(encendida ? "estado-ok" : "estado-off");

    if (icono) {
        icono.style.color = encendida ? "#22c55e" : "#64748b";
    }
}

// ===== DETALLE DEL SENSOR =====

export function abrirDetalle(sensor) {
    const detalle = document.getElementById("sensor-detail");

    if (sensorAbierto === sensor) {
        detalle.classList.remove("visible");
        sensorAbierto = null;
        return;
    }

    sensorAbierto = sensor;
    detalle.classList.add("visible");
    actualizarDetalle(sensor);

    setTimeout(() => {
        detalle.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
}

export function actualizarDetalle(sensor) {
    if (sensor === "bomba") {
        actualizarDetalleBomba();
        return;
    }

    const datos = getDatosActuales();
    const registros = getRegistrosHistorial();
    if (!datos || !registros.length) return;

    const c = configuracion[sensor];
    const valor = Number(datos[c.campo]);
    if (!Number.isFinite(valor)) return;

    const analisis = analizarSensor(sensor, valor);
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const offline = getOffline();
    const cultivo = getCultivoInfo();

    document.getElementById("detalle-titulo").innerHTML = `
        <i class="fas ${c.icono}"></i>
        Análisis de ${c.nombre} (${cultivo.nombre} - ${analisis.etapa || 'Inicio'})
        ${offline ? ' <span style="color:#ef4444;font-size:14px;">📡 OFF</span>' : ''}
    `;

    document.getElementById("detalle-metricas").innerHTML = `
        <div class="dato-mini">
            <span>Actual</span>
            <strong style="color: ${offline ? '#ef4444' : analisis.estado.estado === 'ok' ? '#86efac' : analisis.estado.estado === 'warning' ? '#fcd34d' : '#fca5a5'}">
                ${offline ? '📡 Sin datos' : (sensor === 'luz' ? analisis.estado.texto : formato(valor, sensor))}
            </strong>
        </div>
        <div class="dato-mini">
            <span>Rango (${analisis.etapa || 'Inicio'})</span>
            <strong>${rango ? `${rango.min} - ${rango.max} ${rango.unidad}` : 'N/A'}</strong>
        </div>
        <div class="dato-mini">
            <span>Ideal</span>
            <strong>${rango ? `${rango.ideal} ${rango.unidad}` : 'N/A'}</strong>
        </div>
        <div class="dato-mini">
            <span>Registros</span>
            <strong>${offline ? '📡 SIN ACT' : analisis.totalDatos}</strong>
        </div>
    `;

    if (offline) {
        document.getElementById("detalle-significado-text").textContent = 
            "⚠️ El ESP32 no está enviando datos. El sistema sigue funcionando de forma autónoma.";
        document.getElementById("detalle-tendencia-text").textContent = "📡 No hay datos nuevos.";
        document.getElementById("detalle-soluciones-text").innerHTML = 
            `<p style="color: #fca5a5;">⚠️ Revisa la conexión del ESP32.</p>
            <p style="color: #fcd34d;">🤖 El sistema sigue funcionando de forma autónoma.</p>`;
        document.getElementById("detalle-recomendacion-text").textContent = 
            "Revisa la conexión del ESP32.";
        return;
    }

    document.getElementById("detalle-significado-text").textContent = analisis.significado;
    document.getElementById("detalle-tendencia-text").textContent = analisis.tendencia.texto;

    const solucionesDiv = document.getElementById("detalle-soluciones-text");
    if (analisis.soluciones && analisis.soluciones.soluciones.length > 0) {
        let solucionesHtml = `<p style="color: #c4b5fd; margin-bottom: 8px;">${analisis.soluciones.explicacion}</p><ul>`;
        analisis.soluciones.soluciones.forEach(s => {
            const esUrgente = s.includes('¡ACTÚA RÁPIDO!') || s.includes('¡URGENTE!');
            solucionesHtml += `<li class="${esUrgente ? 'urgente' : ''}">${s}</li>`;
        });
        solucionesHtml += `</ul>`;
        solucionesDiv.innerHTML = solucionesHtml;
    } else {
        solucionesDiv.innerHTML = `<p>No hay soluciones específicas.</p>`;
    }

    document.getElementById("detalle-recomendacion-text").textContent = analisis.recomendacion;
}

function actualizarDetalleBomba() {
    const datos = getDatosActuales();
    const registros = getRegistrosHistorial();
    if (!datos || !registros.length) return;

    const valor = datos.bomba === true || datos.bomba === "true";
    const offline = getOffline();

    if (offline) {
        document.getElementById("detalle-titulo").innerHTML = `
            <i class="fas fa-power-off"></i> Análisis de la Bomba 📡 OFF
        `;
        document.getElementById("detalle-metricas").innerHTML = `
            <div class="dato-mini">
                <span>Estado</span>
                <strong style="color:#ef4444;">📡 Sin datos</strong>
            </div>
            <div class="dato-mini">
                <span>Último estado</span>
                <strong>${valor ? "✅ Encendida" : "⏸️ Apagada"}</strong>
            </div>
        `;
        document.getElementById("detalle-significado-text").textContent = "⚠️ Sin datos del ESP32.";
        document.getElementById("detalle-tendencia-text").textContent = "📡 No hay datos nuevos.";
        document.getElementById("detalle-soluciones-text").innerHTML = 
            `<p style="color: #fca5a5;">⚠️ Revisa la conexión del ESP32.</p>
            <p style="color: #fcd34d;">🤖 El sistema sigue funcionando de forma autónoma.</p>`;
        document.getElementById("detalle-recomendacion-text").textContent = "Revisa la conexión.";
        return;
    }

    const recientes = registros.slice(-20);
    const estados = recientes.map(r => r.bomba === true || r.bomba === "true");
    const encendidos = estados.filter(e => e).length;
    const porcentajeEncendida = recientes.length ? ((encendidos / recientes.length) * 100).toFixed(0) : 0;
    let ciclos = 0;
    for (let i = 1; i < estados.length; i++) {
        if (estados[i] !== estados[i - 1]) ciclos++;
    }

    document.getElementById("detalle-titulo").innerHTML = `
        <i class="fas fa-power-off"></i> Análisis de la Bomba
    `;

    document.getElementById("detalle-metricas").innerHTML = `
        <div class="dato-mini">
            <span>Estado</span>
            <strong>${valor ? "✅ Encendida" : "⏸️ Apagada"}</strong>
        </div>
        <div class="dato-mini">
            <span>Tiempo encendida</span>
            <strong>${porcentajeEncendida}%</strong>
        </div>
        <div class="dato-mini">
            <span>Cambios recientes</span>
            <strong>${ciclos}</strong>
        </div>
    `;

    document.getElementById("detalle-significado-text").textContent =
        valor ? "La bomba está encendida, realizando el ciclo de aspersión." :
        "La bomba está apagada, en espera del próximo ciclo.";

    document.getElementById("detalle-tendencia-text").textContent =
        `En las últimas ${recientes.length} mediciones, la bomba estuvo encendida un ${porcentajeEncendida}% del tiempo.`;

    const solucionesDiv = document.getElementById("detalle-soluciones-text");
    let solucionesHtml = `<p style="color: #c4b5fd; margin-bottom: 8px;">🔧 La bomba es el corazón del sistema.</p><ul>`;
    if (!valor) {
        solucionesHtml += `
            <li>🔌 Verifica que la bomba esté conectada</li>
            <li>🔄 Revisa que el relé esté funcionando</li>
            <li>💧 Comprueba el nivel de agua</li>
        `;
    } else {
        solucionesHtml += `
            <li>✅ La bomba está funcionando correctamente</li>
            <li>💧 Mantén el ciclo de aspersión regular</li>
        `;
    }
    solucionesHtml += `</ul>`;
    solucionesDiv.innerHTML = solucionesHtml;

    document.getElementById("detalle-recomendacion-text").textContent =
        "Si la bomba no cambia de estado durante más de 1 hora, verifica la conexión del relé.";
}

export function actualizarDetalleAbierto() {
    if (sensorAbierto) {
        actualizarDetalle(sensorAbierto);
    }
}

// Exponer globalmente para onclick en HTML
window.abrirDetalle = abrirDetalle;