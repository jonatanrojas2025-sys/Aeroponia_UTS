// ============================================================
// GUÍA INTERACTIVA
// ============================================================

const guiaPasos = [
    {
        titulo: "Bienvenido al Dashboard",
        texto: "Esta guía te enseña rápidamente cómo utilizar los controles principales del sistema.",
        icono: "fa-seedling",
        objetivo: null,
        lista: [
            ["fa-circle-info", "La guía no modifica ninguna configuración."],
            ["fa-hand-pointer", "Pulsa «Siguiente» para conocer cada control."]
        ]
    },
    {
        titulo: "Selecciona el cultivo",
        texto: "Usa este selector para elegir qué cultivo quieres consultar.",
        icono: "fa-leaf",
        objetivo: "selectorCultivo",
        lista: [
            ["fa-list", "Elige entre varios cultivos."],
            ["fa-circle-info", "El cambio es local."]
        ]
    },
    {
        titulo: "Progreso del cultivo",
        texto: "Aquí puedes ver el día actual y la etapa del cultivo.",
        icono: "fa-chart-simple",
        objetivo: "panelCrecimiento",
        lista: [
            ["fa-calendar-day", "La fecha de inicio determina el día."],
            ["fa-seedling", "Las etapas cambian según los días."]
        ]
    },
    {
        titulo: "Botones de etapa",
        texto: "Selecciona una etapa para PREVISUALIZAR cómo quedaría el cultivo.",
        icono: "fa-list-check",
        objetivo: "selectorEtapas",
        lista: [
            ["fa-eye", "Al tocar una etapa, aparece como vista previa."],
            ["fa-clock", "Se muestra un aviso de cambio pendiente."]
        ]
    },
    {
        titulo: "Aplicar o cancelar",
        texto: "«Aplicar cambio» confirma la nueva etapa; «Cancelar» elimina la vista previa.",
        icono: "fa-check-double",
        objetivo: "panel-acciones",
        lista: [
            ["fa-check", "APLICAR CAMBIO: confirma la etapa."],
            ["fa-xmark", "CANCELAR: vuelve a la etapa actual."]
        ]
    },
    {
        titulo: "Día 0 — Reiniciar cultivo",
        texto: "Reinicia el conteo del cultivo al Día 0.",
        icono: "fa-rotate-left",
        objetivo: "btnDia0",
        lista: [
            ["fa-triangle-exclamation", "Te pedirá confirmación."],
            ["fa-calendar-day", "La fecha de inicio pasa a ser hoy."]
        ]
    },
    {
        titulo: "Fecha de inicio",
        texto: "Establece manualmente desde qué fecha comenzó el cultivo.",
        icono: "fa-calendar-days",
        objetivo: "panel-fecha-input",
        lista: [
            ["fa-calendar-check", "HOY: fecha actual."],
            ["fa-clock", "-7 DÍAS: una semana atrás."]
        ]
    },
    {
        titulo: "Sensores",
        texto: "Toca cualquier tarjeta para abrir un análisis detallado.",
        icono: "fa-microchip",
        objetivo: "sensores",
        lista: [
            ["fa-flask", "pH"],
            ["fa-temperature-half", "Temperaturas"],
            ["fa-droplet", "Humedad"],
            ["fa-sun", "Luz"],
            ["fa-power-off", "Bomba"]
        ]
    },
    {
        titulo: "Gráfica e historial",
        texto: "Revisa cómo han cambiado los sensores y consulta las mediciones.",
        icono: "fa-chart-line",
        objetivo: "grafica-contenido",
        lista: [
            ["fa-chart-line", "Evolución de los sensores."],
            ["fa-clock-rotate-left", "Historial de registros."]
        ]
    },
    {
        titulo: "Asistente del sistema",
        texto: "El asistente analiza los valores y te ofrece recomendaciones.",
        icono: "fa-robot",
        objetivo: "ayuda-contenido",
        lista: [
            ["fa-comments", "Usa las preguntas rápidas."],
            ["fa-wrench", "«Todas las soluciones» reúne acciones."]
        ]
    },
    {
        titulo: "¡Listo!",
        texto: "Ya conoces los controles principales. Pulsa «Guía» en cualquier momento para volver a verla.",
        icono: "fa-circle-check",
        objetivo: null,
        lista: [
            ["fa-seedling", "Selecciona tu cultivo."],
            ["fa-calendar", "Comprueba la fecha y etapa."],
            ["fa-microchip", "Revisa los sensores."]
        ]
    }
];

let guiaActiva = false;
let guiaIndice = 0;

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

    if (!rect) {
        zonas.top.style.cssText = `left:0;top:0;width:${w}px;height:${h}px;`;
        zonas.bottom.style.cssText = "display:none;";
        zonas.left.style.cssText = "display:none;";
        zonas.right.style.cssText = "display:none;";
        return;
    }

    const l = Math.max(0, Math.min(w, rect.left));
    const t = Math.max(0, Math.min(h, rect.top));
    const r = Math.max(0, Math.min(w, rect.right));
    const b = Math.max(0, Math.min(h, rect.bottom));

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

    const margin = 18;
    const ancho = Math.min(520, window.innerWidth - 32);
    const alto = Math.min(card.offsetHeight || 430, window.innerHeight - 32);

    card.style.width = `${ancho}px`;

    if (!rect) {
        card.style.left = `${(window.innerWidth - ancho) / 2}px`;
        card.style.top = `${Math.max(16, (window.innerHeight - alto) / 2)}px`;
        return;
    }

    let left = rect.left;
    let top = rect.bottom + 18;

    if (top + alto > window.innerHeight - margin) {
        top = rect.top - alto - 18;
    }

    if (top < margin) {
        top = Math.max(margin, (window.innerHeight - alto) / 2);
    }

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
    actualizarBlurGuia(null);

    requestAnimationFrame(() => {
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
                const pad = 7;
                spotlight.style.left = `${Math.max(0, r.left - pad)}px`;
                spotlight.style.top = `${Math.max(0, r.top - pad)}px`;
                spotlight.style.width = `${Math.min(window.innerWidth, r.width + pad * 2)}px`;
                spotlight.style.height = `${Math.min(window.innerHeight, r.height + pad * 2)}px`;
                actualizarBlurGuia(r);
                spotlight.classList.add("visible");
                posicionarGuiaCard(r);
            }, 180);
        } else {
            spotlight.classList.remove("visible");
            actualizarBlurGuia(null);
            posicionarGuiaCard(null);
        }
    });
}

function abrirGuia(desdeInicio = false) {
    guiaActiva = true;
    mostrarPasoGuia(desdeInicio ? 0 : 0);
}

// Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("btnGuia").addEventListener("click", () => abrirGuia());
    document.getElementById("guiaCerrar").addEventListener("click", cerrarGuia);
    document.getElementById("guiaAnterior").addEventListener("click", () => {
        if (guiaIndice > 0) mostrarPasoGuia(guiaIndice - 1);
    });
    document.getElementById("guiaSiguiente").addEventListener("click", () => {
        if (guiaIndice >= guiaPasos.length - 1) {
            cerrarGuia();
        } else {
            mostrarPasoGuia(guiaIndice + 1);
        }
    });
    document.getElementById("guiaOverlay").addEventListener("click", (e) => {
        if (e.target.id === "guiaOverlay") cerrarGuia();
    });

    window.addEventListener("resize", () => {
        if (guiaActiva) mostrarPasoGuia(guiaIndice);
    });

    // Mostrar guía si es primera visita
    if (!localStorage.getItem("guiaAeroponiaVista")) {
        setTimeout(() => abrirGuia(true), 650);
    }
});

// Exponer globalmente
window.abrirGuia = abrirGuia;
window.cerrarGuia = cerrarGuia;