// ============================================================
// BASE DE DATOS DE CULTIVOS
// ============================================================

export const cultivosDB = {
    lechuga: {
        nombre: "Lechuga",
        tipo: "Hoja verde",
        descripcion: "Cultivo de rápido crecimiento.",
        ph: { min: 5.5, max: 6.5, ideal: 6.0 },
        temp: { min: 15, max: 24, ideal: 20 },
        "temp-agua": { min: 18, max: 24, ideal: 21 },
        humedad: { min: 50, max: 70, ideal: 60 },
        luz: { min: 400, max: 600, ideal: 500 },
        ciclo: { min: 30, max: 45, promedio: 38 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 7, nombre: "🌿 Plántula" },
            { dia: 14, nombre: "🌱 Crecimiento" },
            { dia: 25, nombre: "🌿 Desarrollo" },
            { dia: 35, nombre: "✅ Cosecha" }
        ]
    },
    fresa: {
        nombre: "Fresa",
        tipo: "Fruto",
        descripcion: "Cultivo de alto valor comercial.",
        ph: { min: 5.5, max: 6.2, ideal: 5.8 },
        temp: { min: 15, max: 26, ideal: 22 },
        "temp-agua": { min: 18, max: 24, ideal: 21 },
        humedad: { min: 65, max: 75, ideal: 70 },
        luz: { min: 500, max: 700, ideal: 600 },
        ciclo: { min: 60, max: 90, promedio: 75 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 15, nombre: "🌿 Plántula" },
            { dia: 30, nombre: "🌱 Crecimiento" },
            { dia: 50, nombre: "🌿 Floración" },
            { dia: 70, nombre: "🍓 Cosecha" }
        ]
    },
    tomate: {
        nombre: "Tomate cherry",
        tipo: "Fruto",
        descripcion: "Cultivo de gran demanda.",
        ph: { min: 5.8, max: 6.5, ideal: 6.2 },
        temp: { min: 18, max: 28, ideal: 25 },
        "temp-agua": { min: 18, max: 24, ideal: 22 },
        humedad: { min: 60, max: 70, ideal: 65 },
        luz: { min: 600, max: 800, ideal: 700 },
        ciclo: { min: 70, max: 100, promedio: 85 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 20, nombre: "🌿 Plántula" },
            { dia: 40, nombre: "🌱 Crecimiento" },
            { dia: 60, nombre: "🌿 Floración" },
            { dia: 80, nombre: "🍅 Cosecha" }
        ]
    },
    cilantro: {
        nombre: "Cilantro",
        tipo: "Hierba aromática",
        descripcion: "Ciclo corto y alta rotación.",
        ph: { min: 6.0, max: 6.8, ideal: 6.4 },
        temp: { min: 15, max: 25, ideal: 20 },
        "temp-agua": { min: 15, max: 22, ideal: 19 },
        humedad: { min: 40, max: 60, ideal: 50 },
        luz: { min: 300, max: 500, ideal: 400 },
        ciclo: { min: 25, max: 40, promedio: 32 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 10, nombre: "🌿 Plántula" },
            { dia: 20, nombre: "🌱 Crecimiento" },
            { dia: 30, nombre: "🌿 Cosecha" }
        ]
    },
    albahaca: {
        nombre: "Albahaca",
        tipo: "Hierba aromática",
        descripcion: "Aroma intenso. Crece muy bien en aeroponía.",
        ph: { min: 5.8, max: 6.5, ideal: 6.2 },
        temp: { min: 20, max: 28, ideal: 24 },
        "temp-agua": { min: 20, max: 26, ideal: 23 },
        humedad: { min: 50, max: 70, ideal: 60 },
        luz: { min: 500, max: 700, ideal: 600 },
        ciclo: { min: 30, max: 50, promedio: 40 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 12, nombre: "🌿 Plántula" },
            { dia: 25, nombre: "🌱 Crecimiento" },
            { dia: 38, nombre: "🌿 Cosecha" }
        ]
    },
    espinaca: {
        nombre: "Espinaca",
        tipo: "Hoja verde",
        descripcion: "Alta en nutrientes y de crecimiento rápido.",
        ph: { min: 6.0, max: 7.0, ideal: 6.5 },
        temp: { min: 10, max: 22, ideal: 18 },
        "temp-agua": { min: 15, max: 22, ideal: 19 },
        humedad: { min: 50, max: 70, ideal: 60 },
        luz: { min: 300, max: 500, ideal: 400 },
        ciclo: { min: 25, max: 40, promedio: 32 },
        etapas: [
            { dia: 0, nombre: "🌱 Germinación" },
            { dia: 8, nombre: "🌿 Plántula" },
            { dia: 18, nombre: "🌱 Crecimiento" },
            { dia: 30, nombre: "🌿 Cosecha" }
        ]
    }
};