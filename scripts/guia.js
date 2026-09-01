// ============================================================
// GUÍA INTERACTIVA - VERSIÓN MEJORADA
// ============================================================

const guiaPasos = [
    {
        titulo: "Bienvenido al Dashboard",
        texto: "Esta guía te enseña rápidamente cómo utilizar los controles principales del sistema. Puedes cerrarla en cualquier momento.",
        icono: "fa-seedling",
        objetivo: null,
        lista: [
            ["fa-circle-info", "La guía no modifica ninguna configuración."],
            ["fa-hand-pointer", "Pulsa «Siguiente» para continuar."],
            ["fa-xmark", "Pulsa la X o toca fuera para cerrar."]
        ]
    },
    {
        titulo: "1. Selecciona el cultivo",
        texto: "Aquí eliges qué cultivo estás monitoreando. Al cambiarlo, el sistema adapta los rangos y etapas automáticamente.",
        icono: "fa-leaf",
        objetivo: "selectorCultivo",
        lista: [
            ["fa-list", "Elige entre Lechuga, Fresa, Tomate, Cilantro, Albahaca o Espinaca."],
            ["fa-circle-info", "El cambio es local y no afecta la configuración del ESP32."]
        ]
    },
    {
        titulo: "2. Progreso del cultivo",
        texto: "Muestra el día actual, la etapa en la que se encuentra el cultivo y el porcentaje de avance del ciclo.",
        icono: "fa-chart-simple",
        objetivo: "panelCrecimiento",
        lista: [
            ["fa-calendar-day", "La fecha de inicio determina el día del cultivo."],
            ["fa-seedling", "Las etapas cambian automáticamente según los días."],
            ["fa-chart-line", "La barra muestra el progreso estimado del ciclo."]
        ]
    },
    {
        titulo: "3. Botones de etapa",
        texto: "Selecciona una etapa para PREVISUALIZAR cómo quedaría el cultivo. Todavía no aplica el cambio.",
        icono: "fa-list-check",
        objetivo: "selectorEtapas",
        lista: [
            ["fa-eye", "Al tocar una etapa, se muestra como vista previa."],
            ["fa-clock", "Aparece un aviso indicando el cambio pendiente."],
            ["fa-triangle-exclamation", "Mientras sea vista previa, no se guarda el cambio."]
        ]
    },
    {
        titulo: "4. Aplicar o cancelar",
        texto: "Después de seleccionar una etapa, usa estos botones para confirmar o descartar la vista previa.",
        icono: "fa-check-double",
        objetivo: "panel-acciones",
        lista: [
            ["fa-check", "APLICAR CAMBIO: confirma la nueva etapa."],
            ["fa-xmark", "CANCELAR: vuelve a la etapa actual."],
            ["fa-circle-info", "Si no hay vista previa, los botones están desactivados."]
        ]
    },
    {
        titulo: "5. Día 0 — Reiniciar cultivo",
        texto: "Reinicia el conteo del cultivo al Día 0. La fecha de inicio pasa a ser hoy.",
        icono: "fa-rotate-left",
        objetivo: "btnDia0",
        lista: [
            ["fa-triangle-exclamation", "Te pedirá confirmación antes de reiniciar."],
            ["fa-calendar-day", "La fecha de inicio pasa a ser hoy."],
            ["fa-seedling", "El progreso vuelve a comenzar desde Germinación."]
        ]
    },
    {
        titulo: "6. Fecha de inicio",
        texto: "Puedes establecer manualmente desde qué fecha comenzó el cultivo. El día y la etapa se recalcularán automáticamente.",
        icono: "fa-calendar-days",
        objetivo: "panel-fecha-input",
        lista: [
            ["fa-calendar-check", "HOY: establece la fecha actual."],
            ["fa-clock", "-7 DÍAS: coloca el inicio una semana atrás."],
            ["fa-keyboard", "También puedes seleccionar una fecha manualmente."]
        ]
    },
    {
        titulo: "7. Sensores",
        texto: "Toca cualquier tarjeta para abrir un análisis detallado con el valor actual, rango recomendado, tendencia y soluciones prácticas.",
        icono: "fa-microchip",
        objetivo: "sensores",
        lista: [
            ["fa-flask", "pH: mide la acidez de la solución."],
            ["fa-temperature-half", "Temperatura ambiente y del agua."],
            ["fa-droplet", "Humedad del ambiente."],
            ["fa-sun", "Luz: intensidad lumínica."],
            ["fa-power-off", "Estado de la bomba de agua."]
        ]
    },
    {
        titulo: "8. Gráfica e historial",
        texto: "Revisa cómo han cambiado los sensores a lo largo del tiempo y consulta todas las mediciones almacenadas.",
        icono: "fa-chart-line",
        objetivo: "grafica-contenido",
        lista: [
            ["fa-chart-line", "Evolución de los sensores en el tiempo."],
            ["fa-clock-rotate-left", "Historial completo de registros."],
            ["fa-chevron-down", "Toca los encabezados para abrir o cerrar cada sección."]
        ]
    },
    {
        titulo: "9. Asistente del sistema",
        texto: "El asistente analiza los valores y te ofrece recomendaciones prácticas. También puedes usar las preguntas rápidas.",
        icono: "fa-robot",
        objetivo: "ayuda-contenido",
        lista: [
            ["fa-comments", "Usa las preguntas rápidas para consultar un sensor."],
            ["fa-wrench", "«Todas las soluciones» reúne todas las acciones recomendadas."],
            ["fa-rotate", "«Reiniciar» reinicia la conversación, no el cultivo."]
        ]
    },
    {
        titulo: "¡Listo!",
        texto: "Ya conoces todos los controles principales. Puedes volver a abrir esta guía en cualquier momento pulsando el botón «Guía» en la parte superior.",
        icono: "fa-circle-check",
        objetivo: null,
        lista: [
            ["fa-seedling", "Selecciona tu cultivo favorito."],
            ["fa-calendar", "Comprueba la fecha y etapa."],
            ["fa-microchip", "Revisa los sensores regularmente."],
            ["fa-robot", "Consulta al asistente cuando necesites ayuda."]
        ]
    }
];

let guiaActiva = false;
let guiaIndice = 0;

// ============================================================
// FUNCIONES MEJORADAS
// ============================================================

function limpiarObjetivoGuia() {
    document.querySelectorAll(".guia-target").forEach(el => el.classList.remove("guia-target"));
}

function actualizarBlurGuia(rect) {
    const zonas = {
        top: document.getElementById("guiaBlurTop"),
        bottom: document.getElementById("guiaBlurBottom"),
        left: document.getElementById("guiaBlurLeft"),
        right: document.getElementById("guiaBlurRight")
    };

    if (!zonas.top || !zonas.bottom || !zonas.left || !zonas.right) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // Si no hay rect, ocultar todo el blur
    if (!rect) {
        zonas.top.style.cssText = `display:none;`;
        zonas.bottom.style.cssText = "display:none;";
        zonas.left.style.cssText = "display:none;";
        zonas.right.style.cssText = "display:none;";
        return;
    }

    // Hacer el blur más sutil para que se vean los datos
    const pad = 20;
    const l = Math.max(0, Math.min(w, rect.left - pad));
    const t = Math.max(0, Math.min(h, rect.top - pad));
    const r = Math.min(w, rect.right + pad);
    const b = Math.min(h, rect.bottom + pad);

    zonas.top.style.cssText = `display:block;left:0;top:0;width:${w}px;height:${t}px;`;
    zonas.bottom.style.cssText = `display:block;left:0;top:${b}px;width:${w}px;height:${Math.max(0, h-b)}px;`;
    zonas.left.style.cssText = `display:block;left:0;top:${t}px;width:${l}px;height:${Math.max(0, b-t)}px;`;
    zonas.right.style.cssText = `display:block;left:${r}px;top:${t}px;width:${Math.max(0, w-r)}px;height:${Math.max(0, b-t)}px;`;
}

function cerrarGuia() {
    guiaActiva = false;
    limpiarObjetivoGuia();
    const overlay = document.getElementById("guiaOverlay");
    const spotlight = document.getElementById("guiaSpotlight");
    overlay.classList.remove("visible");
    spotlight.classList.remove("visible");
    actualizarBlurGuia(null);
    document.body.classList.remove("guia-activa");
    localStorage.setItem("guiaAeroponiaVista", "1");
}

function posicionarGuiaCard(rect) {
    const card = document.getElementById("guiaCard");
    if (!card) return;

    const margin = 12;
    const ancho = Math.min(480, window.innerWidth - 24);
    const alto = Math.min(card.scrollHeight || 400, window.innerHeight - 24);

    card.style.width = `${ancho}px`;
    card.style.maxHeight = `${window.innerHeight - 24}px`;

    if (!rect) {
        // Centrar en la pantalla
        card.style.left = `${(window.innerWidth - ancho) / 2}px`;
        card.style.top = `${Math.max(12, (window.innerHeight - alto) / 2)}px`;
        return;
    }

    // Posicionar la tarjeta al lado del objetivo
    let left = rect.left + rect.width + 16;
    let top = rect.top;

    // Si no cabe a la derecha, poner a la izquierda
    if (left + ancho > window.innerWidth - margin) {
        left = rect.left - ancho - 16;
    }

    // Si no cabe a la izquierda, poner debajo
    if (left < margin) {
        left = Math.max(margin, (window.innerWidth - ancho) / 2);
        top = rect.bottom + 12;
    }

    // Ajustar verticalmente
    if (top + alto > window.innerHeight - margin) {
        top = rect.top - alto - 12;
    }
    if (top < margin) {
        top = Math.max(margin, (window.innerHeight - alto) / 2);
    }

    // Asegurar que no se salga de la pantalla
    if (left + ancho > window.innerWidth - margin) {
        left = window.innerWidth - ancho - margin;
    }
    if (left < margin) left = margin;

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
}

function mostrarPasoGuia(indice) {
    guiaIndice = Math.max(0, Math.min(indice, guiaPasos.length - 1));

    const paso = guiaPasos[guiaIndice];
    const overlay = document.getElementById("guiaOverlay");
    const spotlight = document.getElementById("guiaSpotlight");
    const pasoTexto = document.getElementById("guiaPaso");
    const icono = document.getElementById("guiaIcono");
    const titulo = document.getElementById("guiaTitulo");
    const textoGuia = document.getElementById("guiaTexto");
    const lista = document.getElementById("guiaLista");
    const progreso = document.getElementById("guiaProgreso");
    const anterior = document.getElementById("guiaAnterior");
    const siguiente = document.getElementById("guiaSiguiente");

    limpiarObjetivoGuia();

    pasoTexto.textContent = guiaIndice === 0 ? "BIENVENIDO" : `PASO ${guiaIndice} DE ${guiaPasos.length - 2}`;
    icono.innerHTML = `<i class="fas ${paso.icono}"></i>`;
    titulo.textContent = paso.titulo;
    textoGuia.textContent = paso.texto;

    lista.innerHTML = paso.lista.map(item => `
        <div class="guia-item">
            <i class="fas ${item[0]}"></i>
            <span>${item[1]}</span>
        </div>
    `).join("");

    progreso.innerHTML = guiaPasos.map((_, i) =>
        `<span class="guia-dot ${i === guiaIndice ? "activo" : ""}"></span>`
    ).join("");

    anterior.style.display = guiaIndice > 0 ? "inline-flex" : "none";

    const esUltimo = guiaIndice === guiaPasos.length - 1;
    siguiente.innerHTML = esUltimo
        ? `Terminar <i class="fas fa-check"></i>`
        : (guiaIndice === 0
            ? `Comenzar <i class="fas fa-arrow-right"></i>`
            : `Siguiente <i class="fas fa-arrow-right"></i>`);

    overlay.classList.add("visible");
    document.body.classList.add("guia-activa");

    // Inicialmente sin blur
    actualizarBlurGuia(null);

    // Pequeño retraso para que se renderice
    setTimeout(() => {
        const objetivoId = paso.objetivo;
        let objetivo = null;

        if (objetivoId) {
            objetivo = document.getElementById(objetivoId);
            if (!objetivo && objetivoId === "panel-acciones") {
                objetivo = document.querySelector(".panel-acciones");
            }
            if (!objetivo && objetivoId === "panel-fecha-input") {
                objetivo = document.querySelector(".panel-fecha-input");
            }
            if (!objetivo && objetivoId === "sensores") {
                objetivo = document.querySelector("#sensores");
            }
        }

        if (objetivo) {
            objetivo.classList.add("guia-target");
            objetivo.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
                const r = objetivo.getBoundingClientRect();
                const pad = 6;
                
                // Spotlight más sutil
                spotlight.style.left = `${Math.max(0, r.left - pad)}px`;
                spotlight.style.top = `${Math.max(0, r.top - pad)}px`;
                spotlight.style.width = `${Math.min(window.innerWidth, r.width + pad * 2)}px`;
                spotlight.style.height = `${Math.min(window.innerHeight, r.height + pad * 2)}px`;
                
                // Blur más suave (menos opaco)
                actualizarBlurGuia(r);
                spotlight.classList.add("visible");
                posicionarGuiaCard(r);
            }, 200);
        } else {
            spotlight.classList.remove("visible");
            actualizarBlurGuia(null);
            posicionarGuiaCard(null);
        }
    }, 150);
}

function abrirGuia(desdeInicio = false) {
    guiaActiva = true;
    mostrarPasoGuia(desdeInicio ? 0 : 0);
}

// ============================================================
// INICIALIZACIÓN DE EVENTOS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    const btnGuia = document.getElementById("btnGuia");
    const btnCerrar = document.getElementById("guiaCerrar");
    const btnAnterior = document.getElementById("guiaAnterior");
    const btnSiguiente = document.getElementById("guiaSiguiente");
    const overlay = document.getElementById("guiaOverlay");

    if (btnGuia) {
        btnGuia.addEventListener("click", (e) => {
            e.preventDefault();
            abrirGuia(true);
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener("click", cerrarGuia);
    }

    if (btnAnterior) {
        btnAnterior.addEventListener("click", () => {
            if (guiaIndice > 0) mostrarPasoGuia(guiaIndice - 1);
        });
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener("click", () => {
            if (guiaIndice >= guiaPasos.length - 1) {
                cerrarGuia();
            } else {
                mostrarPasoGuia(guiaIndice + 1);
            }
        });
    }

    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target.id === "guiaOverlay" || e.target.closest(".guia-blur-zone")) {
                cerrarGuia();
            }
        });
    }

    // Cerrar con tecla ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && guiaActiva) {
            cerrarGuia();
        }
    });

    // Redimensionar
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (guiaActiva) mostrarPasoGuia(guiaIndice);
        }, 200);
    });

    // Mostrar guía si es primera visita (solo si no se ha visto)
    if (!localStorage.getItem("guiaAeroponiaVista")) {
        setTimeout(() => abrirGuia(true), 800);
    }
});

// Exponer globalmente para uso en HTML
window.abrirGuia = abrirGuia;
window.cerrarGuia = cerrarGuia;