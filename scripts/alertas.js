// ============================================================
// SISTEMA DE ALARMAS Y ALERTAS
// ============================================================

import { configuracionAlarmas } from './config.js';
import { getCultivoInfo } from './utils.js';

// Historial de alarmas
export let historialAlarmas = [];
let notificacionSonido = false;

// ============================================================
// EVALUAR UN SENSOR
// ============================================================

export function evaluarSensor(sensor, valor) {
    const config = configuracionAlarmas[sensor];
    if (!config || !Number.isFinite(valor)) return null;

    let estado = "ok";
    let mensaje = config.mensajeOk;
    let nivel = "info";

    if (valor < config.criticoMin || valor > config.criticoMax) {
        estado = "critico";
        nivel = "danger";
        mensaje = valor < config.criticoMin ? config.mensajeBajo : config.mensajeAlto;
    } else if (valor < config.alertaMin || valor > config.alertaMax) {
        estado = "alerta";
        nivel = "warning";
        mensaje = config.mensajeAlerta;
    }

    return { estado, mensaje, nivel, valor, sensor, timestamp: new Date() };
}

// ============================================================
// OBTENER RECOMENDACIÓN PARA UN SENSOR
// ============================================================

export function recomendarAccion(sensor, valor) {
    const config = configuracionAlarmas[sensor];
    if (!config) return "Revisar configuración del sensor.";

    if (valor < config.alertaMin) return config.acciones.bajo;
    if (valor > config.alertaMax) return config.acciones.alto;
    return "Todo en orden, solo monitorear.";
}

// ============================================================
// PROCESAR TODOS LOS SENSORES
// ============================================================

export function procesarAlarmas(datosActuales, registrosHistorial, lastUpdateTime) {
    if (!datosActuales) return;

    const resultados = [];
    let hayAlarma = false;
    let hayAlerta = false;

    // Mapeo de sensores a campos de Firebase
    const mapaSensores = {
        ph: "PH",
        temp: "Temperatura_Ambiente",
        humedad: "Humedad_Ambiente",
        luz: "luz"
    };

    // Evaluar cada sensor
    for (const sensor in configuracionAlarmas) {
        const campo = mapaSensores[sensor];
        if (!campo) continue;
        const valor = Number(datosActuales[campo]);
        if (!Number.isFinite(valor) || valor === -273.15) continue;

        const resultado = evaluarSensor(sensor, valor);
        if (resultado) {
            resultados.push(resultado);
            if (resultado.estado === "critico") hayAlarma = true;
            if (resultado.estado === "alerta") hayAlerta = true;
        }
    }

    // Guardar en historial si hay alarma o alerta
    if (hayAlarma || hayAlerta) {
        const registro = {
            timestamp: new Date(),
            resultados,
            nivel: hayAlarma ? "danger" : "warning",
            mensaje: hayAlarma ? "🚨 ¡ALARMA ACTIVA!" : "⚠️ Atención necesaria"
        };
        historialAlarmas.unshift(registro);
        if (historialAlarmas.length > 50) historialAlarmas.pop();

        // Mostrar alerta visual
        mostrarAlertaVisual(registro);
        
        // Reproducir sonido si hay alarma
        if (hayAlarma) {
            reproducirSonidoAlarma();
        }
        
        // Notificación push
        if (hayAlarma) {
            enviarNotificacion(registro);
        }
    }

    // Actualizar UI
    actualizarBadgeEstado(hayAlarma, hayAlerta);
    actualizarPanelAlertas(resultados);
    actualizarHistorialAlarmas();

    return { resultados, hayAlarma, hayAlerta };
}

// ============================================================
// MOSTRAR ALERTA VISUAL
// ============================================================

function mostrarAlertaVisual(registro) {
    const alertaBox = document.getElementById("alertaBox");
    if (!alertaBox) return;

    const hayAlarma = registro.nivel === "danger";
    const icono = hayAlarma ? "🚨" : "⚠️";
    const clase = hayAlarma ? "danger" : "loading";

    alertaBox.className = `alerta-box ${clase}`;
    alertaBox.innerHTML = `
        <i class="fas ${hayAlarma ? 'fa-triangle-exclamation' : 'fa-circle-exclamation'}"></i>
        <span>
            <strong>${icono} ${registro.mensaje}</strong>
            <span style="color:#94a3b8; display:block; font-size:13px; margin-top:4px;">
                ${registro.resultados.map(r => `${r.sensor}: ${r.mensaje}`).join(' | ')}
            </span>
            <span style="color:#64748b; display:block; font-size:11px; margin-top:2px;">
                ⏱️ ${new Date(registro.timestamp).toLocaleTimeString()}
            </span>
        </span>
    `;
}

// ============================================================
// REPRODUCIR SONIDO DE ALARMA
// ============================================================

function reproducirSonidoAlarma() {
    if (notificacionSonido) return;
    notificacionSonido = true;
    
    try {
        // Sonido simple (beep)
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            notificacionSonido = false;
        }, 500);
    } catch(e) {
        console.log("🔇 Sonido no disponible");
        notificacionSonido = false;
    }
}

// ============================================================
// ENVIAR NOTIFICACIÓN PUSH
// ============================================================

function enviarNotificacion(registro) {
    if (Notification.permission === "granted") {
        new Notification("🚨 ALARMA AEROPONIA", {
            body: `Sensor fuera de rango crítico: ${registro.resultados.map(r => r.sensor).join(', ')}`,
            icon: "assets/images/logo-uts.png"
        });
    }
}

// ============================================================
// ACTUALIZAR BADGE DE ESTADO
// ============================================================

function actualizarBadgeEstado(hayAlarma, hayAlerta) {
    const estadoGeneral = document.getElementById("estado-general");
    if (!estadoGeneral) return;

    if (hayAlarma) {
        estadoGeneral.innerHTML = "🚨 ALARMA ACTIVA";
        estadoGeneral.style.color = "#ef4444";
        estadoGeneral.style.animation = "pulse-offline 1s infinite";
    } else if (hayAlerta) {
        estadoGeneral.innerHTML = "⚠️ ATENCIÓN";
        estadoGeneral.style.color = "#fcd34d";
        estadoGeneral.style.animation = "none";
    } else {
        estadoGeneral.innerHTML = "✅ TODO EN ORDEN";
        estadoGeneral.style.color = "#86efac";
        estadoGeneral.style.animation = "none";
    }
}

// ============================================================
// ACTUALIZAR PANEL DE ALERTAS
// ============================================================

function actualizarPanelAlertas(resultados) {
    const container = document.getElementById("consejosContainer");
    if (!container) return;

    const hayProblemas = resultados.some(r => r.estado !== "ok");
    
    if (!hayProblemas) {
        container.innerHTML = `
            <div class="consejo consejo-ok">
                <div class="consejo-icono"><i class="fas fa-circle-check"></i></div>
                <div class="consejo-contenido">
                    <h4>✅ TODO EN ORDEN</h4>
                    <p>Todos los sensores están dentro de los rangos óptimos. ¡Sigue así!</p>
                    <ul>
                        <li>🌱 Cultivo: ${getCultivoInfo().nombre}</li>
                        <li>📡 Última actualización: ${new Date().toLocaleTimeString()}</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }

    let html = '';
    
    const criticos = resultados.filter(r => r.estado === "critico");
    const alertas = resultados.filter(r => r.estado === "alerta");

    if (criticos.length > 0) {
        html += `
            <div class="consejo consejo-danger">
                <div class="consejo-icono"><i class="fas fa-triangle-exclamation"></i></div>
                <div class="consejo-contenido">
                    <h4>🚨 ALARMA CRÍTICA</h4>
                    <ul>
                        ${criticos.map(r => `<li class="urgente"><strong>${r.sensor}:</strong> ${r.mensaje}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    if (alertas.length > 0) {
        html += `
            <div class="consejo consejo-warning">
                <div class="consejo-icono"><i class="fas fa-circle-exclamation"></i></div>
                <div class="consejo-contenido">
                    <h4>⚠️ ATENCIÓN</h4>
                    <ul>
                        ${alertas.map(r => `<li><strong>${r.sensor}:</strong> ${r.mensaje}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    // Recomendaciones
    const todosProblemas = [...criticos, ...alertas];
    if (todosProblemas.length > 0) {
        html += `
            <div class="consejo consejo-info">
                <div class="consejo-icono"><i class="fas fa-lightbulb"></i></div>
                <div class="consejo-contenido">
                    <h4>💡 RECOMENDACIONES</h4>
                    <ul>
                        ${todosProblemas.map(r => `<li>🔧 ${r.sensor}: ${recomendarAccion(r.sensor, r.valor)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ============================================================
// ACTUALIZAR HISTORIAL DE ALARMAS
// ============================================================

export function actualizarHistorialAlarmas() {
    const tbody = document.getElementById("alarmas-body");
    const contador = document.getElementById("contador-alarmas");
    
    if (!tbody) return;
    
    if (historialAlarmas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">✅ Sin alarmas recientes</td></tr>`;
        if (contador) contador.textContent = "0";
        return;
    }
    
    if (contador) contador.textContent = historialAlarmas.length;
    
    let html = "";
    historialAlarmas.slice(0, 20).forEach(registro => {
        const hora = new Date(registro.timestamp).toLocaleTimeString();
        const nivelIcono = registro.nivel === "danger" ? "🚨" : "⚠️";
        const nivelClase = registro.nivel === "danger" ? "td-danger" : "td-warning";
        
        registro.resultados.forEach(r => {
            html += `
                <tr>
                    <td style="font-size:12px; color:#64748b;">${hora}</td>
                    <td class="${nivelClase}">${nivelIcono} ${registro.nivel === "danger" ? "ALARMA" : "ATENCIÓN"}</td>
                    <td><strong>${r.sensor}</strong></td>
                    <td>${r.mensaje}</td>
                    <td>${r.valor.toFixed(1)}</td>
                </tr>
            `;
        });
    });
    
    tbody.innerHTML = html;
}

// ============================================================
// SOLICITAR PERMISO PARA NOTIFICACIONES
// ============================================================

if (Notification.permission === "default") {
    Notification.requestPermission();
}