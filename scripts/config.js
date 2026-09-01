// ============================================================
// CONFIGURACIÓN CENTRAL
// ============================================================

// Configuración de sensores (mapeo de campos de Firebase)
export const configuracion = {
    ph: {
        campo: "PH",
        nombre: "pH",
        icono: "fa-flask",
        unidad: "",
        decimales: 2
    },
    temp: {
        campo: "Temperatura_Ambiente",
        nombre: "Temp. Ambiente",
        icono: "fa-temperature-half",
        unidad: "°C",
        decimales: 1
    },
    "temp-agua": {
        campo: "Temperatura_Agua",
        nombre: "Temp. Agua",
        icono: "fa-temperature-three-quarters",
        unidad: "°C",
        decimales: 1
    },
    hum: {
        campo: "Humedad_Ambiente",
        nombre: "Humedad",
        icono: "fa-droplet",
        unidad: "%",
        decimales: 1
    },
    luz: {
        campo: "luz",
        nombre: "Luz",
        icono: "fa-sun",
        unidad: " lux",
        decimales: 0
    }
};

// ============================================================
// CONFIGURACIÓN DE ALARMAS
// ============================================================

export const configuracionAlarmas = {
    ph: {
        nombre: "pH",
        criticoMin: 5.0,
        criticoMax: 7.5,
        alertaMin: 5.5,
        alertaMax: 6.5,
        mensajeBajo: "🔴 ¡pH DEMASIADO ÁCIDO! Añade pH UP",
        mensajeAlto: "🔴 ¡pH DEMASIADO ALCALINO! Añade pH DOWN",
        mensajeAlerta: "⚠️ pH fuera del rango óptimo",
        mensajeOk: "✅ pH en rango óptimo",
        acciones: {
            bajo: "Añade solución de pH UP (5ml por cada 10L), espera 15 min y mide de nuevo.",
            alto: "Añade solución de pH DOWN (5ml por cada 10L), espera 15 min y mide de nuevo."
        }
    },
    temp: {
        nombre: "Temperatura",
        criticoMin: 10,
        criticoMax: 35,
        alertaMin: 15,
        alertaMax: 28,
        mensajeBajo: "🔴 ¡TEMPERATURA DEMASIADO BAJA! Activa calefactor",
        mensajeAlto: "🔴 ¡TEMPERATURA DEMASIADO ALTA! Activa ventilación",
        mensajeAlerta: "⚠️ Temperatura fuera del rango óptimo",
        mensajeOk: "✅ Temperatura en rango óptimo",
        acciones: {
            bajo: "Activa el calefactor o cierra ventanas. Revisa aislamiento.",
            alto: "Activa ventiladores o abre ventanas. Moja el piso para bajar temperatura."
        }
    },
    humedad: {
        nombre: "Humedad",
        criticoMin: 20,
        criticoMax: 90,
        alertaMin: 40,
        alertaMax: 80,
        mensajeBajo: "🔴 ¡AMBIENTE DEMASIADO SECO! Activa humidificador",
        mensajeAlto: "🔴 ¡AMBIENTE DEMASIADO HÚMEDO! Activa deshumidificador",
        mensajeAlerta: "⚠️ Humedad fuera del rango óptimo",
        mensajeOk: "✅ Humedad en rango óptimo",
        acciones: {
            bajo: "Activa el humidificador o coloca bandejas con agua cerca.",
            alto: "Activa el deshumidificador o aumenta la ventilación."
        }
    },
    luz: {
        nombre: "Luz",
        criticoMin: 100,
        criticoMax: 1000,
        alertaMin: 300,
        alertaMax: 800,
        mensajeBajo: "🔴 ¡POCA LUZ! Aumenta intensidad o extiende fotoperiodo",
        mensajeAlto: "🔴 ¡EXCESO DE LUZ! Reduce intensidad o acorta fotoperiodo",
        mensajeAlerta: "⚠️ Luz fuera del rango óptimo",
        mensajeOk: "✅ Luz en rango óptimo",
        acciones: {
            bajo: "Aumenta la intensidad de las luces o extiende el fotoperiodo 2 horas.",
            alto: "Reduce la intensidad de las luces o acorta el fotoperiodo 2 horas."
        }
    }
};

// Constantes
export const DATA_TIMEOUT_MS = 30000;
export const RANGOS_POR_DEFECTO = {
    ph: { min: 5.0, max: 7.0, ideal: 6.0 },
    temp: { min: 15, max: 28, ideal: 22 },
    "temp-agua": { min: 18, max: 26, ideal: 22 },
    humedad: { min: 40, max: 80, ideal: 60 },
    luz: { min: 300, max: 800, ideal: 500 }
};