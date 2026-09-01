// ============================================================
// ASISTENTE - CHAT Y RECOMENDACIONES
// ============================================================

import {
    getDatosActuales,
    getRegistrosHistorial,
    getCultivoInfo,
    getOffline,
    getLastUpdate,
    obtenerDiasTranscurridos,
    getEtapaActual,
    configuracion,
    formato,
    obtenerEstado
} from './utils.js';

import { analizarSensor, generarSolucionesPracticas } from './analisis.js';

let chatIniciado = false;

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

// ============================================================
// ACTUALIZAR ASISTENTE (CONSEJOS)
// ============================================================

export function actualizarAsistente() {
    const container = document.getElementById("consejosContainer");
    const estadoGeneral = document.getElementById("estado-general");

    const datos = getDatosActuales();
    const registros = getRegistrosHistorial();

    if (!datos || !registros || !registros.length) {
        container.innerHTML = `<div class="text-center"><i class="fas fa-spinner fa-spin"></i> Analizando datos...</div>`;
        return;
    }

    const cultivo = getCultivoInfo();
    const totalRegistros = registros.length;
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const offline = getOffline();
    const lastUpdate = getLastUpdate();

    if (offline) {
        estadoGeneral.innerHTML = `📡 SIN DATOS | ${totalRegistros} reg.`;
        estadoGeneral.style.color = "#ef4444";

        container.innerHTML = `
            <div class="consejo consejo-offline">
                <div class="consejo-icono"><i class="fas fa-microchip"></i></div>
                <div class="consejo-contenido">
                    <h4>📡 ESP32 SIN TRANSMITIR DATOS</h4>
                    <p>El sistema sigue funcionando de forma autónoma.</p>
                    <p style="margin-top: 8px; color: #fcd34d;"><strong>🤖 MODO AUTÓNOMO ACTIVO</strong></p>
                    <ul>
                        <li>📊 ${totalRegistros} registros históricos</li>
                        <li>🌱 ${etapaActual.nombre} (Día ${dias})</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }

    let problemas = [];
    let advertencias = [];

    for (const sensor in configuracion) {
        const valor = Number(datos[configuracion[sensor].campo]);
        if (!Number.isFinite(valor) || valor === -273.15) continue;

        const analisis = analizarSensor(sensor, valor);
        if (analisis.estado.estado === "danger") {
            problemas.push({ sensor, analisis });
        } else if (analisis.estado.estado === "warning" || analisis.anomalia) {
            advertencias.push({ sensor, analisis });
        }
    }

    if (problemas.length) {
        estadoGeneral.innerHTML = `🚨 ${problemas.length} problema(s) | 📊 ${totalRegistros}`;
        estadoGeneral.style.color = "#fca5a5";
    } else if (advertencias.length) {
        estadoGeneral.innerHTML = `⚠️ ${advertencias.length} aviso(s) | 📊 ${totalRegistros}`;
        estadoGeneral.style.color = "#fcd34d";
    } else {
        const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
        estadoGeneral.innerHTML = `✅ OK | 📊 ${totalRegistros} | 🌱 ${porcentaje}%`;
        estadoGeneral.style.color = "#86efac";
    }

    let html = "";

    html += `
        <div class="consejo consejo-info">
            <div class="consejo-icono"><i class="fas fa-leaf"></i></div>
            <div class="consejo-contenido">
                <h4>🌱 ${cultivo.nombre} - ${cultivo.tipo}</h4>
                <p>${cultivo.descripcion}</p>
                <p style="margin-top:6px;">📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre} (Día ${dias})</p>
                ${lastUpdate ? `<p style="margin-top:4px; color:#64748b;">⏱️ Última actualización: ${lastUpdate.toLocaleTimeString()}</p>` : ''}
            </div>
        </div>
    `;

    problemas.forEach(item => {
        const c = configuracion[item.sensor];
        const sol = item.analisis.soluciones || { soluciones: [], explicacion: "" };
        const valor = Number(datos[c.campo]);
        const valorMostrar = sensor === 'luz' ? item.analisis.estado.texto : formato(valor, item.sensor);
        
        html += `
            <div class="consejo consejo-danger">
                <div class="consejo-icono"><i class="fas ${c.icono}"></i></div>
                <div class="consejo-contenido">
                    <h4>🚨 ${c.nombre} - ¡REQUIERE ACCIÓN!</h4>
                    <p><strong>Valor actual:</strong> ${valorMostrar}</p>
                    <p>${item.analisis.significado}</p>
                    ${sol.soluciones && sol.soluciones.length > 0 ? `
                        <p style="margin-top:8px; color:#fcd34d;"><strong>🔧 SOLUCIONES:</strong></p>
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
        const valor = Number(datos[c.campo]);
        const valorMostrar = sensor === 'luz' ? item.analisis.estado.texto : formato(valor, item.sensor);
        
        html += `
            <div class="consejo consejo-warning">
                <div class="consejo-icono"><i class="fas ${c.icono}"></i></div>
                <div class="consejo-contenido">
                    <h4>⚠️ ${c.nombre}</h4>
                    <p><strong>Valor actual:</strong> ${valorMostrar}</p>
                    <p>${item.analisis.tendencia.texto}</p>
                    ${sol.soluciones && sol.soluciones.length > 0 ? `
                        <p style="margin-top:8px; color:#fcd34d;"><strong>🔧 Soluciones:</strong></p>
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
                    <p>${cultivo.nombre} está en condiciones óptimas.</p>
                    <ul>
                        <li>📊 ${totalRegistros} registros históricos</li>
                        <li>🌱 ${etapaActual.nombre} (Día ${dias})</li>
                    </ul>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    iniciarChat();
}

// ============================================================
// INICIAR CHAT
// ============================================================

export function iniciarChat() {
    if (chatIniciado) return;
    chatIniciado = true;

    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const offline = getOffline();

    let mensajeInicial =
        `🌱 ¡Hola! Soy tu asistente de ${cultivo.nombre}.\n\n` +
        `📅 Día ${dias} - Etapa: ${etapaActual.nombre}\n` +
        `${etapaActual.descripcion || 'Cultivo en crecimiento'}\n\n` +
        `💡 Elige una pregunta o toca un sensor para ver análisis con soluciones adaptadas a tu etapa.\n` +
        `📌 Puedes cambiar de etapa usando los botones arriba (vista previa antes de aplicar).`;

    if (offline) {
        mensajeInicial += 
            `\n\n📡 <strong>ESP32 SIN TRANSMITIR DATOS</strong>\n` +
            `🤖 El sistema sigue funcionando de forma autónoma. Los datos son los últimos recibidos.\n` +
            `⏳ Última actualización: ${getLastUpdate() ? getLastUpdate().toLocaleTimeString() : '--'}`;
    }

    agregarMensaje(mensajeInicial, "bot");
    renderizarChips();
}

// ============================================================
// RENDERIZAR CHIPS (BOTONES DE PREGUNTAS)
// ============================================================

export function renderizarChips() {
    const cont = document.getElementById("chatChips");
    if (!cont) return;

    const offline = getOffline();

    let hayUrgencia = false;
    const datos = getDatosActuales();
    if (datos && !offline) {
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            if (Number.isFinite(valor) && valor !== -273.15) {
                const estado = obtenerEstado(sensor, valor);
                if (estado.estado === "danger") {
                    hayUrgencia = true;
                    break;
                }
            }
        }
    }

    let html = preguntasChip.map(p => `
        <button class="chip ${offline ? 'chip-offline' : ''} ${hayUrgencia && (p.id === 'soluciones' || p.id === 'resumen') ? 'chip-urgente' : ''}" onclick="window.preguntar('${p.id}')" ${offline ? 'disabled' : ''}>
            <i class="fas ${p.icono}"></i> ${p.texto}
        </button>
    `).join("");

    html += `
        <button class="chip chip-reset" onclick="window.preguntar('reiniciar')">
            <i class="fas fa-rotate"></i> Reiniciar
        </button>
    `;

    cont.innerHTML = html;
}

// ============================================================
// AGREGAR MENSAJE AL CHAT
// ============================================================

function agregarMensaje(texto, tipo) {
    const cont = document.getElementById("chatMensajes");
    if (!cont) return;

    const burbuja = document.createElement("div");
    burbuja.className = `chat-bubble ${tipo}`;
    burbuja.innerHTML = texto;
    cont.appendChild(burbuja);
    cont.scrollTop = cont.scrollHeight;
}

// ============================================================
// GENERAR SOLUCIONES COMPLETAS
// ============================================================

function generarSolucionesCompletas() {
    const datos = getDatosActuales();
    const cultivo = getCultivoInfo();
    let mensaje = `🔧 <strong>SOLUCIONES para ${cultivo.nombre}</strong>\n\n`;

    if (getOffline()) {
        mensaje += `📡 <strong>ESP32 SIN DATOS</strong>\n\n`;
    }

    for (const sensor in configuracion) {
        const valor = Number(datos[configuracion[sensor].campo]);
        if (!Number.isFinite(valor) || valor === -273.15) continue;

        const analisis = analizarSensor(sensor, valor);
        const c = configuracion[sensor];
        const sol = analisis.soluciones || { soluciones: [], explicacion: "" };

        mensaje += `<strong>${c.nombre}:</strong> `;
        if (sensor === 'luz') {
            mensaje += `${analisis.estado.texto}\n`;
        } else {
            mensaje += `${formato(valor, sensor)} (${analisis.estado.texto})\n`;
        }
        if (sol.explicacion) {
            mensaje += `${sol.explicacion}\n`;
        }
        if (sol.soluciones && sol.soluciones.length > 0) {
            mensaje += `🔹 ${sol.soluciones.join('\n🔹 ')}\n`;
        }
        mensaje += `\n`;
    }

    return mensaje;
}

// ============================================================
// FUNCIÓN PRINCIPAL PARA PREGUNTAR (EXPUESTA GLOBAL)
// ============================================================

window.preguntar = function(id) {
    if (id === "reiniciar") {
        document.getElementById("chatMensajes").innerHTML = "";
        chatIniciado = false;
        iniciarChat();
        return;
    }

    const datos = getDatosActuales();
    const registros = getRegistrosHistorial();

    if (!datos || !registros || !registros.length) {
        const p = preguntasChip.find(x => x.id === id);
        if (p) agregarMensaje(p.texto, "user");
        agregarMensaje("⏳ Esperando datos... inténtalo en unos segundos.", "bot");
        return;
    }

    const cultivo = getCultivoInfo();
    const dias = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(dias);
    const offline = getOffline();

    // ===== MODO OFFLINE =====
    if (offline) {
        if (id === "resumen") {
            agregarMensaje("📊 Dame un resumen general", "user");
            let mensaje =
                `📊 <strong>RESUMEN (MODO AUTÓNOMO)</strong>\n\n` +
                `📡 ESP32 SIN DATOS\n` +
                `📈 ${registros.length} registros\n` +
                `🌱 ${etapaActual.nombre} (Día ${dias})\n\n`;
            for (const sensor in configuracion) {
                const valor = Number(datos[configuracion[sensor].campo]);
                if (!Number.isFinite(valor) || valor === -273.15) continue;
                const analisis = analizarSensor(sensor, valor);
                if (sensor === 'luz') {
                    mensaje += `${configuracion[sensor].nombre}: ${analisis.estado.texto}\n`;
                } else {
                    mensaje += `${configuracion[sensor].nombre}: ${formato(valor, sensor)} (${analisis.estado.texto})\n`;
                }
            }
            mensaje += `\n⏱️ Última actualización: ${getLastUpdate() ? getLastUpdate().toLocaleTimeString() : '--'}`;
            agregarMensaje(mensaje, "bot");
            return;
        }

        if (id === "cosecha") {
            agregarMensaje("🌱 ¿Cuándo estará listo?", "user");
            const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
            let mensaje = `🌱 <strong>Análisis de COSECHA</strong>\n\n`;
            mensaje += `📅 ${dias} días | 📈 ${porcentaje}% completado\n`;
            mensaje += `🌿 ${etapaActual.nombre}\n\n📡 Modo autónomo activo.\n`;
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
            const valor = Number(datos[c.campo]);
            if (!Number.isFinite(valor) || valor === -273.15) {
                agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot");
                return;
            }
            const analisis = analizarSensor(id, valor);
            let mensaje = `📡 <strong>MODO AUTÓNOMO</strong>\n\n`;
            mensaje += `<strong>${c.nombre}:</strong> `;
            if (id === 'luz') {
                mensaje += `${analisis.estado.texto}\n\n`;
            } else {
                mensaje += `${formato(valor, id)} (${analisis.estado.texto})\n\n`;
            }
            mensaje += `📊 Último valor registrado: ${formato(valor, id)}\n`;
            mensaje += `📡 ESP32 no está transmitiendo datos nuevos.\n`;
            mensaje += `🤖 El sistema sigue funcionando de forma autónoma.`;
            agregarMensaje(mensaje, "bot");
            return;
        }

        if (id === "bomba") {
            agregarMensaje("🔌 ¿Cómo está la bomba?", "user");
            const valor = datos.bomba === true || datos.bomba === "true" || datos.bomba === 1;
            let mensaje = `📡 <strong>MODO AUTÓNOMO</strong>\n\n`;
            mensaje += valor ? 
                "✅ La bomba está ENCENDIDA (último estado conocido)." :
                "⏸️ La bomba está APAGADA (último estado conocido).";
            mensaje += "\n\n🤖 El sistema sigue su ciclo programado.";
            agregarMensaje(mensaje, "bot");
            return;
        }

        if (id === "etapa") {
            agregarMensaje("🌿 ¿En qué etapa estoy?", "user");
            let mensaje = `🌿 <strong>Etapa actual</strong>\n\n📅 Día ${dias}\n🌱 ${etapaActual.nombre}\n\n📡 Modo autónomo activo.\n\n📋 <strong>Todas las etapas:</strong>\n`;
            cultivo.etapas.forEach(e => {
                const esActual = e.nombre === etapaActual.nombre;
                mensaje += `${esActual ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`;
            });
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
        let mensaje =
            `📊 <strong>RESUMEN de ${cultivo.nombre}</strong>\n\n📈 ${registros.length} registros\n🌱 ${etapaActual.nombre} (Día ${dias})\n📈 ${porcentaje}% completado\n\n`;
        for (const sensor in configuracion) {
            const valor = Number(datos[configuracion[sensor].campo]);
            if (!Number.isFinite(valor) || valor === -273.15) continue;
            const analisis = analizarSensor(sensor, valor);
            if (sensor === 'luz') {
                mensaje += `${configuracion[sensor].nombre}: ${analisis.estado.texto}\n`;
            } else {
                mensaje += `${configuracion[sensor].nombre}: ${formato(valor, sensor)} (${analisis.estado.texto})\n`;
            }
        }
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
        cultivo.etapas.forEach(e => {
            const esActual = e.nombre === etapaActual.nombre;
            mensaje += `${esActual ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`;
        });
        mensaje += `\n💡 Puedes cambiar de etapa usando los botones en el panel de progreso.`;
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
        const valor = datos.bomba === true || datos.bomba === "true" || datos.bomba === 1;
        const mensaje = valor ?
            "✅ La bomba está ENCENDIDA. El sistema está pulverizando solución nutritiva." :
            "⏸️ La bomba está APAGADA. Esperando el próximo ciclo.";
        agregarMensaje(mensaje, "bot");
        return;
    }

    const c = configuracion[id];
    if (!c) {
        agregarMensaje("❓ No entendí la pregunta. Elige una de las opciones.", "bot");
        return;
    }

    const p = preguntasChip.find(x => x.id === id);
    const valor = Number(datos[c.campo]);

    if (p) agregarMensaje(p.texto, "user");

    if (!Number.isFinite(valor) || valor === -273.15) {
        agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot");
        return;
    }

    const analisis = analizarSensor(id, valor);
    const sol = analisis.soluciones || { soluciones: [], explicacion: "" };

    let mensaje = `<strong>${c.nombre}:</strong> `;
    if (id === 'luz') {
        mensaje += `${analisis.estado.texto}\n\n`;
    } else {
        mensaje += `${formato(valor, id)} (${analisis.estado.texto})\n\n`;
    }
    mensaje += analisis.significado + "\n\n";

    if (sol.soluciones && sol.soluciones.length > 0) {
        mensaje += `🔧 <strong>SOLUCIONES:</strong>\n`;
        mensaje += sol.soluciones.map(s => `• ${s}`).join('\n');
    } else {
        mensaje += `✅ Todo en orden.`;
    }

    agregarMensaje(mensaje, "bot");
};

// Exponer funciones globales
window.preguntar = window.preguntar;