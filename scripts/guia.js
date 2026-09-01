// ============================================================
// GUÍA INTERACTIVA - VERSIÓN SIMPLIFICADA Y FUNCIONAL
// ============================================================

const guiaPasos = [
    {
        titulo: "🌱 Bienvenido al Dashboard",
        texto: "Esta guía te muestra los controles principales del sistema. Puedes cerrarla en cualquier momento.",
        icono: "fa-seedling",
        lista: [
            ["👆", "Toca «Siguiente» para avanzar"],
            ["❌", "Toca la X para cerrar"]
        ]
    },
    {
        titulo: "📋 Selecciona el cultivo",
        texto: "Elige qué cultivo estás monitoreando. Los rangos y etapas se adaptan automáticamente.",
        icono: "fa-leaf",
        lista: [
            ["🥬", "Lechuga - Fresa - Tomate"],
            ["🌿", "Cilantro - Albahaca - Espinaca"],
            ["ℹ️", "El cambio es local y no afecta al ESP32"]
        ]
    },
    {
        titulo: "📈 Progreso del cultivo",
        texto: "Muestra el día actual, la etapa y el porcentaje de avance del ciclo.",
        icono: "fa-chart-simple",
        lista: [
            ["📅", "La fecha de inicio determina el día"],
            ["🌱", "Las etapas cambian automáticamente"],
            ["📊", "La barra muestra el progreso"]
        ]
    },
    {
        titulo: "🎯 Botones de etapa",
        texto: "Selecciona una etapa para PREVISUALIZAR cómo quedaría el cultivo.",
        icono: "fa-list-check",
        lista: [
            ["👁️", "Vista previa antes de aplicar"],
            ["⏳", "Aparece un aviso de cambio pendiente"],
            ["⚠️", "Todavía no se guarda el cambio"]
        ]
    },
    {
        titulo: "✅ Aplicar o cancelar",
        texto: "Confirma o descarta la vista previa de la etapa seleccionada.",
        icono: "fa-check-double",
        lista: [
            ["✅", "APLICAR: confirma el cambio"],
            ["❌", "CANCELAR: vuelve a la etapa actual"],
            ["ℹ️", "Los botones se activan solo con vista previa"]
        ]
    },
    {
        titulo: "🔄 Día 0 — Reiniciar",
        texto: "Reinicia el cultivo al Día 0. La fecha de inicio pasa a ser hoy.",
        icono: "fa-rotate-left",
        lista: [
            ["⚠️", "Te pedirá confirmación"],
            ["📅", "La fecha de inicio es hoy"],
            ["🌱", "Vuelve a Germinación"]
        ]
    },
    {
        titulo: "📅 Fecha de inicio",
        texto: "Cambia manualmente la fecha de inicio. El día y la etapa se recalculan.",
        icono: "fa-calendar-days",
        lista: [
            ["📅", "HOY: establece la fecha actual"],
            ["⏪", "-7 DÍAS: una semana atrás"],
            ["✏️", "También puedes seleccionar una fecha"]
        ]
    },
    {
        titulo: "📊 Sensores",
        texto: "Toca cualquier tarjeta para ver un análisis detallado con soluciones prácticas.",
        icono: "fa-microchip",
        lista: [
            ["🧪", "pH: acidez de la solución"],
            ["🌡️", "Temperatura ambiente y del agua"],
            ["💧", "Humedad del ambiente"],
            ["☀️", "Luz: intensidad lumínica"],
            ["🔌", "Estado de la bomba"]
        ]
    },
    {
        titulo: "📈 Gráfica e historial",
        texto: "Revisa la evolución de los sensores y consulta todas las mediciones.",
        icono: "fa-chart-line",
        lista: [
            ["📈", "Evolución en el tiempo"],
            ["📋", "Historial completo"],
            ["👇", "Toca los encabezados para abrir/cerrar"]
        ]
    },
    {
        titulo: "🤖 Asistente del sistema",
        texto: "El asistente analiza los valores y te da recomendaciones prácticas.",
        icono: "fa-robot",
        lista: [
            ["💬", "Usa las preguntas rápidas"],
            ["🔧", "«Todas las soluciones» reúne acciones"],
            ["🔄", "«Reiniciar» reinicia la conversación"]
        ]
    },
    {
        titulo: "🎉 ¡Listo!",
        texto: "Ya conoces todos los controles. Puedes volver a abrir esta guía con el botón «Guía».",
        icono: "fa-circle-check",
        lista: [
            ["🌱", "Selecciona tu cultivo"],
            ["📊", "Revisa los sensores"],
            ["🤖", "Consulta al asistente"]
        ]
    }
];

let guiaActiva = false;
let guiaIndice = 0;

// ============================================================
// FUNCIONES
// ============================================================

function cerrarGuia() {
    guiaActiva = false;
    const overlay = document.getElementById("guiaOverlay");
    if (overlay) {
        overlay.classList.remove("visible");
    }
    document.body.classList.remove("guia-activa");
    // Guardar que ya se vio
    localStorage.setItem('guiaAeroponiaVista', '1');
}

function mostrarPaso(indice) {
    guiaIndice = Math.max(0, Math.min(indice, guiaPasos.length - 1));
    const paso = guiaPasos[guiaIndice];

    // Actualizar elementos
    document.getElementById("guiaPaso").textContent = 
        guiaIndice === 0 ? "BIENVENIDO" : `PASO ${guiaIndice} DE ${guiaPasos.length - 2}`;
    
    document.getElementById("guiaIcono").innerHTML = `<i class="fas ${paso.icono}"></i>`;
    document.getElementById("guiaTitulo").textContent = paso.titulo;
    document.getElementById("guiaTexto").textContent = paso.texto;

    // Lista de items
    const lista = document.getElementById("guiaLista");
    lista.innerHTML = paso.lista.map(item => `
        <div class="guia-item">
            <span>${item[0]}</span>
            <span>${item[1]}</span>
        </div>
    `).join("");

    // Progreso
    const progreso = document.getElementById("guiaProgreso");
    progreso.innerHTML = guiaPasos.map((_, i) =>
        `<span class="guia-dot ${i === guiaIndice ? "activo" : ""}"></span>`
    ).join("");

    // Botones
    document.getElementById("guiaAnterior").style.display = guiaIndice > 0 ? "inline-flex" : "none";

    const esUltimo = guiaIndice === guiaPasos.length - 1;
    const siguiente = document.getElementById("guiaSiguiente");
    siguiente.innerHTML = esUltimo
        ? `Terminar <i class="fas fa-check"></i>`
        : (guiaIndice === 0
            ? `Comenzar <i class="fas fa-arrow-right"></i>`
            : `Siguiente <i class="fas fa-arrow-right"></i>`);

    // Mostrar overlay
    const overlay = document.getElementById("guiaOverlay");
    overlay.classList.add("visible");
    guiaActiva = true;
    document.body.classList.add("guia-activa");
}

function abrirGuia(desdeInicio = false) {
    mostrarPaso(desdeInicio ? 0 : 0);
}

// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Botón para abrir guía
    document.getElementById("btnGuia")?.addEventListener("click", (e) => {
        e.preventDefault();
        abrirGuia(true);
    });

    // Cerrar con X
    document.getElementById("guiaCerrar")?.addEventListener("click", cerrarGuia);

    // Botón anterior
    document.getElementById("guiaAnterior")?.addEventListener("click", () => {
        if (guiaIndice > 0) mostrarPaso(guiaIndice - 1);
    });

    // Botón siguiente
    document.getElementById("guiaSiguiente")?.addEventListener("click", () => {
        if (guiaIndice >= guiaPasos.length - 1) {
            cerrarGuia();
        } else {
            mostrarPaso(guiaIndice + 1);
        }
    });

    // Cerrar al tocar fuera (solo el overlay, no la tarjeta)
    document.getElementById("guiaOverlay")?.addEventListener("click", (e) => {
        if (e.target === document.getElementById("guiaOverlay")) {
            cerrarGuia();
        }
    });

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && guiaActiva) cerrarGuia();
    });

    // Mostrar guía solo si es primera vez
    if (!localStorage.getItem('guiaAeroponiaVista')) {
        setTimeout(() => abrirGuia(true), 600);
    }
});

// Exponer globalmente
window.abrirGuia = abrirGuia;
window.cerrarGuia = cerrarGuia;