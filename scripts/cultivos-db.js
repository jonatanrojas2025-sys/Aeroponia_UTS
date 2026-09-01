// ============================================================
// BASE DE DATOS DE CULTIVOS
// ============================================================

export const cultivosDB = {
    lechuga: {
        nombre: "Lechuga",
        tipo: "Hoja verde",
        descripcion: "Cultivo de rápido crecimiento, ideal para principiantes.",
        ph: { min: 5.5, max: 6.5, ideal: 6.0, unidad: "" },
        temp: { min: 15, max: 24, ideal: 20, unidad: "°C" },
        "temp-agua": { min: 18, max: 24, ideal: 21, unidad: "°C" },
        humedad: { min: 50, max: 70, ideal: 60, unidad: "%" },
        luz: { min: 400, max: 600, ideal: 500, unidad: " lux" },
        ciclo: { min: 30, max: 45, promedio: 38 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada, sin luz directa.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 18, max: 22, ideal: 20 },
                    humedad: { min: 70, max: 90, ideal: 80 } } },
            { dia: 7, nombre: "🌿 Plántula", descripcion: "Primeras hojas, luz suave.",
                ajustes: { luz: { min: 200, max: 400, ideal: 300 }, temp: { min: 18, max: 24, ideal: 21 },
                    humedad: { min: 60, max: 80, ideal: 70 } } },
            { dia: 14, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 400, max: 600, ideal: 500 }, temp: { min: 20, max: 26, ideal: 23 },
                    humedad: { min: 50, max: 70, ideal: 60 } } },
            { dia: 25, nombre: "🌿 Desarrollo", descripcion: "Planta grande, lista para cosechar.",
                ajustes: { luz: { min: 500, max: 700, ideal: 600 }, temp: { min: 18, max: 24, ideal: 21 },
                    humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 35, nombre: "✅ Cosecha", descripcion: "¡Lista para cortar!",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 15, max: 20, ideal: 18 },
                    humedad: { min: 40, max: 60, ideal: 50 } } }
        ]
    },
    fresa: {
        nombre: "Fresa",
        tipo: "Fruto",
        descripcion: "Cultivo de alto valor comercial.",
        ph: { min: 5.5, max: 6.2, ideal: 5.8, unidad: "" },
        temp: { min: 15, max: 26, ideal: 22, unidad: "°C" },
        "temp-agua": { min: 18, max: 24, ideal: 21, unidad: "°C" },
        humedad: { min: 65, max: 75, ideal: 70, unidad: "%" },
        luz: { min: 500, max: 700, ideal: 600, unidad: " lux" },
        ciclo: { min: 60, max: 90, promedio: 75 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada, sin luz directa.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 18, max: 22, ideal: 20 },
                    humedad: { min: 70, max: 90, ideal: 80 } } },
            { dia: 15, nombre: "🌿 Plántula", descripcion: "Primeras hojas, luz suave.",
                ajustes: { luz: { min: 200, max: 400, ideal: 300 }, temp: { min: 18, max: 24, ideal: 21 },
                    humedad: { min: 65, max: 80, ideal: 72 } } },
            { dia: 30, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 500, max: 700, ideal: 600 }, temp: { min: 20, max: 26, ideal: 23 },
                    humedad: { min: 60, max: 75, ideal: 68 } } },
            { dia: 50, nombre: "🌿 Floración", descripcion: "Aparecen flores, poliniza.",
                ajustes: { luz: { min: 600, max: 800, ideal: 700 }, temp: { min: 18, max: 24, ideal: 21 },
                    humedad: { min: 55, max: 70, ideal: 62 } } },
            { dia: 70, nombre: "🍓 Cosecha", descripcion: "¡Fresas rojas y dulces!",
                ajustes: { luz: { min: 400, max: 600, ideal: 500 }, temp: { min: 15, max: 22, ideal: 18 },
                    humedad: { min: 50, max: 65, ideal: 58 } } }
        ]
    },
    tomate: {
        nombre: "Tomate cherry",
        tipo: "Fruto",
        descripcion: "Cultivo de gran demanda.",
        ph: { min: 5.8, max: 6.5, ideal: 6.2, unidad: "" },
        temp: { min: 18, max: 28, ideal: 25, unidad: "°C" },
        "temp-agua": { min: 18, max: 24, ideal: 22, unidad: "°C" },
        humedad: { min: 60, max: 70, ideal: 65, unidad: "%" },
        luz: { min: 600, max: 800, ideal: 700, unidad: " lux" },
        ciclo: { min: 70, max: 100, promedio: 85 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada, sin luz directa.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 20, max: 25, ideal: 22 },
                    humedad: { min: 70, max: 90, ideal: 80 } } },
            { dia: 20, nombre: "🌿 Plántula", descripcion: "Primeras hojas, luz suave.",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 20, max: 26, ideal: 23 },
                    humedad: { min: 60, max: 80, ideal: 70 } } },
            { dia: 40, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 600, max: 800, ideal: 700 }, temp: { min: 22, max: 28, ideal: 25 },
                    humedad: { min: 55, max: 70, ideal: 62 } } },
            { dia: 60, nombre: "🌿 Floración", descripcion: "Aparecen flores, poliniza.",
                ajustes: { luz: { min: 700, max: 900, ideal: 800 }, temp: { min: 20, max: 26, ideal: 23 },
                    humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 80, nombre: "🍅 Cosecha", descripcion: "¡Tomates rojos y firmes!",
                ajustes: { luz: { min: 500, max: 700, ideal: 600 }, temp: { min: 18, max: 24, ideal: 21 },
                    humedad: { min: 45, max: 60, ideal: 52 } } }
        ]
    },
    cilantro: {
        nombre: "Cilantro",
        tipo: "Hierba aromática",
        descripcion: "Ciclo corto y alta rotación.",
        ph: { min: 6.0, max: 6.8, ideal: 6.4, unidad: "" },
        temp: { min: 15, max: 25, ideal: 20, unidad: "°C" },
        "temp-agua": { min: 15, max: 22, ideal: 19, unidad: "°C" },
        humedad: { min: 40, max: 60, ideal: 50, unidad: "%" },
        luz: { min: 300, max: 500, ideal: 400, unidad: " lux" },
        ciclo: { min: 25, max: 40, promedio: 32 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 15, max: 20, ideal: 18 },
                    humedad: { min: 60, max: 80, ideal: 70 } } },
            { dia: 10, nombre: "🌿 Plántula", descripcion: "Primeras hojas.",
                ajustes: { luz: { min: 200, max: 350, ideal: 280 }, temp: { min: 18, max: 22, ideal: 20 },
                    humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 20, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 18, max: 24, ideal: 21 },
                    humedad: { min: 40, max: 55, ideal: 48 } } },
            { dia: 30, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!",
                ajustes: { luz: { min: 200, max: 400, ideal: 300 }, temp: { min: 15, max: 20, ideal: 18 },
                    humedad: { min: 35, max: 50, ideal: 42 } } }
        ]
    },
    albahaca: {
        nombre: "Albahaca",
        tipo: "Hierba aromática",
        descripcion: "Aroma intenso. Crece muy bien en aeroponía.",
        ph: { min: 5.8, max: 6.5, ideal: 6.2, unidad: "" },
        temp: { min: 20, max: 28, ideal: 24, unidad: "°C" },
        "temp-agua": { min: 20, max: 26, ideal: 23, unidad: "°C" },
        humedad: { min: 50, max: 70, ideal: 60, unidad: "%" },
        luz: { min: 500, max: 700, ideal: 600, unidad: " lux" },
        ciclo: { min: 30, max: 50, promedio: 40 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 22, max: 26, ideal: 24 },
                    humedad: { min: 65, max: 85, ideal: 75 } } },
            { dia: 12, nombre: "🌿 Plántula", descripcion: "Primeras hojas.",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 22, max: 27, ideal: 24 },
                    humedad: { min: 55, max: 70, ideal: 62 } } },
            { dia: 25, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 500, max: 700, ideal: 600 }, temp: { min: 24, max: 28, ideal: 26 },
                    humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 38, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!",
                ajustes: { luz: { min: 400, max: 600, ideal: 500 }, temp: { min: 20, max: 25, ideal: 22 },
                    humedad: { min: 40, max: 55, ideal: 48 } } }
        ]
    },
    espinaca: {
        nombre: "Espinaca",
        tipo: "Hoja verde",
        descripcion: "Alta en nutrientes y de crecimiento rápido.",
        ph: { min: 6.0, max: 7.0, ideal: 6.5, unidad: "" },
        temp: { min: 10, max: 22, ideal: 18, unidad: "°C" },
        "temp-agua": { min: 15, max: 22, ideal: 19, unidad: "°C" },
        humedad: { min: 50, max: 70, ideal: 60, unidad: "%" },
        luz: { min: 300, max: 500, ideal: 400, unidad: " lux" },
        ciclo: { min: 25, max: 40, promedio: 32 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación", descripcion: "Semilla hidratada.",
                ajustes: { luz: { min: 0, max: 100, ideal: 50 }, temp: { min: 12, max: 18, ideal: 15 },
                    humedad: { min: 65, max: 85, ideal: 75 } } },
            { dia: 8, nombre: "🌿 Plántula", descripcion: "Primeras hojas.",
                ajustes: { luz: { min: 200, max: 350, ideal: 280 }, temp: { min: 14, max: 20, ideal: 17 },
                    humedad: { min: 55, max: 70, ideal: 62 } } },
            { dia: 18, nombre: "🌱 Crecimiento", descripcion: "Aumenta luz y nutrientes.",
                ajustes: { luz: { min: 300, max: 500, ideal: 400 }, temp: { min: 14, max: 22, ideal: 18 },
                    humedad: { min: 50, max: 65, ideal: 58 } } },
            { dia: 30, nombre: "🌿 Cosecha", descripcion: "¡Listo para cortar!",
                ajustes: { luz: { min: 200, max: 400, ideal: 300 }, temp: { min: 10, max: 18, ideal: 14 },
                    humedad: { min: 40, max: 55, ideal: 48 } } }
        ]
    }
};

// ============================================================
// RANGOS POR DEFECTO
// ============================================================

export const rangosPorDefecto = {
    ph: { min: 5.0, max: 7.0, ideal: 6.0, unidad: "" },
    temp: { min: 15, max: 28, ideal: 22, unidad: "°C" },
    "temp-agua": { min: 18, max: 26, ideal: 22, unidad: "°C" },
    hum: { min: 40, max: 80, ideal: 60, unidad: "%" },
    luz: { min: 300, max: 800, ideal: 500, unidad: " lux" }
};

// ============================================================
// CONFIGURACIÓN DE SENSORES
// ============================================================

export const configuracion = {
    ph: {
        campo: "PH",
        nombre: "pH",
        icono: "fa-flask",
        unidad: "",
        decimales: 2,
        descripcion: "El pH indica qué tan ácida o alcalina es la solución nutritiva.",
        cualitativo: false
    },
    temp: {
        campo: "Temperatura_Ambiente",
        nombre: "Temperatura ambiente",
        icono: "fa-temperature-half",
        unidad: "°C",
        decimales: 1,
        descripcion: "La temperatura ambiente influye directamente en el crecimiento.",
        cualitativo: false
    },
    "temp-agua": {
        campo: "Temperatura_Agua",
        nombre: "Temperatura del agua",
        icono: "fa-temperature-three-quarters",
        unidad: "°C",
        decimales: 1,
        descripcion: "La temperatura del agua influye en la disponibilidad de oxígeno.",
        cualitativo: false
    },
    hum: {
        campo: "Humedad_Ambiente",
        nombre: "Humedad",
        icono: "fa-droplet",
        unidad: "%",
        decimales: 1,
        descripcion: "La humedad indica la cantidad de vapor de agua en el ambiente.",
        cualitativo: false
    },
    luz: {
        campo: "luz",
        nombre: "Luz",
        icono: "fa-sun",
        unidad: " lux",
        decimales: 0,
        descripcion: "La iluminación proporciona la energía para la fotosíntesis.",
        cualitativo: true
    }
};