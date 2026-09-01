// CONFIGURACIÓN DE SENSORES
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