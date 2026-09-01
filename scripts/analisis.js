// ============================================================
// ANÁLISIS, TENDENCIAS Y SOLUCIONES
// ============================================================

import { 
    getRegistrosHistorial, 
    getRangoPorEtapa, 
    obtenerDiasTranscurridos,
    formato,
    configuracion 
} from './utils.js';

export function obtenerEstadisticasHistoricas(sensor) {
    const c = configuracion[sensor];
    const registros = getRegistrosHistorial();
    const valores = registros
        .map(r => Number(r[c.campo]))
        .filter(v => Number.isFinite(v));

    if (valores.length === 0) {
        return { total: 0, promedio: null, minimo: null, maximo: null, desviacion: null, valores: [] };
    }

    const suma = valores.reduce((a, b) => a + b, 0);
    const promedio = suma / valores.length;
    const minimo = Math.min(...valores);
    const maximo = Math.max(...valores);
    const diffCuadradas = valores.map(v => Math.pow(v - promedio, 2));
    const desviacion = Math.sqrt(diffCuadradas.reduce((a, b) => a + b, 0) / valores.length);

    return { total: valores.length, promedio, minimo, maximo, desviacion, valores };
}

export function obtenerTendenciaReal(sensor, ventana = 20) {
    const c = configuracion[sensor];
    const registros = getRegistrosHistorial();
    const valores = registros
        .map(r => Number(r[c.campo]))
        .filter(v => Number.isFinite(v));

    if (valores.length < 4) {
        return { tipo: "estable", texto: "No hay suficientes datos históricos.", porcentaje: 0 };
    }

    const recientes = valores.slice(-ventana);
    const anteriores = valores.slice(0, -ventana).slice(-ventana);

    if (recientes.length < 3 || anteriores.length < 3) {
        return { tipo: "estable", texto: "Datos insuficientes para tendencia.", porcentaje: 0 };
    }

    const promedioAnterior = anteriores.reduce((a, b) => a + b, 0) / anteriores.length;
    const promedioReciente = recientes.reduce((a, b) => a + b, 0) / recientes.length;

    if (promedioAnterior === 0) {
        return { tipo: "estable", texto: "Datos insuficientes.", porcentaje: 0 };
    }

    const diferencia = promedioReciente - promedioAnterior;
    const porcentaje = (diferencia / Math.abs(promedioAnterior)) * 100;

    if (Math.abs(porcentaje) < 3) {
        return { tipo: "estable", texto: `📊 Estable (variación del ${porcentaje.toFixed(1)}%).`, porcentaje };
    }

    if (diferencia > 0) {
        return { tipo: "subiendo", texto: `⬆️ Subiendo un ${porcentaje.toFixed(1)}% en las últimas mediciones.`, porcentaje };
    }

    return { tipo: "bajando", texto: `⬇️ Bajando un ${Math.abs(porcentaje).toFixed(1)}% en las últimas mediciones.`, porcentaje };
}

export function detectarAnomaliaConHistorial(sensor, valorActual) {
    const stats = obtenerEstadisticasHistoricas(sensor);

    if (!stats.promedio || stats.desviacion === null || stats.total < 10) {
        return { esAnomalia: false, texto: "ℹ️ Necesito al menos 10 registros para detectar anomalías." };
    }

    const limiteSuperior = stats.promedio + (stats.desviacion * 2.5);
    const limiteInferior = stats.promedio - (stats.desviacion * 2.5);

    if (valorActual > limiteSuperior || valorActual < limiteInferior) {
        return {
            esAnomalia: true,
            texto: `🚨 ¡VALOR ANÓMALO! Normalmente está entre ${stats.minimo.toFixed(2)} y ${stats.maximo.toFixed(2)}.`
        };
    }

    return { esAnomalia: false, texto: `✅ Valor dentro del rango histórico normal.` };
}

export function generarSolucionesPracticas(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const c = configuracion[sensor];
    let soluciones = [];
    let explicacion = "";

    if (!rango || !Number.isFinite(valor)) {
        return {
            soluciones: ["⚠️ No hay datos de referencia."],
            explicacion: "Espera a tener más datos."
        };
    }

    const { min, max, ideal, etapa } = rango;

    if (sensor === 'luz') {
        if (valor < min) {
            explicacion = `💡 Hay POCA luz (${valor.toFixed(0)} lux) para la etapa ${etapa}.`;
            soluciones = [
                "💡 Aumenta la intensidad de las luces",
                "📏 Reduce la distancia entre las luces y las plantas",
                "⏰ Extiende el fotoperiodo a 12-14 horas"
            ];
        } else if (valor > max) {
            explicacion = `💡 Hay EXCESO de luz (${valor.toFixed(0)} lux) para la etapa ${etapa}.`;
            soluciones = [
                "📏 Aumenta la distancia de las luces",
                "🔅 Reduce la intensidad de las luces",
                "⏰ Reduce el fotoperiodo a 10-12 horas"
            ];
        } else {
            explicacion = `✅ La iluminación (${valor.toFixed(0)} lux) es adecuada.`;
            soluciones = ["👍 Mantén las condiciones de luz actuales"];
        }
    } else if (sensor === 'temp') {
        if (valor < min) {
            explicacion = `🌡️ La temperatura (${valor.toFixed(1)}°C) está FRÍA.`;
            soluciones = ["🔥 Enciende un calefactor", "🪟 Cierra ventanas"];
        } else if (valor > max) {
            explicacion = `🌡️ La temperatura (${valor.toFixed(1)}°C) está CALIENTE. ¡ACTÚA!`;
            soluciones = ["💨 Abre ventanas", "🌀 Coloca un ventilador"];
        } else {
            explicacion = `✅ La temperatura (${valor.toFixed(1)}°C) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    } else if (sensor === 'hum') {
        if (valor < min) {
            explicacion = `💧 El ambiente está SECO (${valor.toFixed(1)}%).`;
            soluciones = ["💨 Usa un humidificador", "💧 Coloca bandejas con agua"];
        } else if (valor > max) {
            explicacion = `💧 El ambiente está HÚMEDO (${valor.toFixed(1)}%).`;
            soluciones = ["💨 Abre ventanas", "🌀 Usa un ventilador"];
        } else {
            explicacion = `✅ La humedad (${valor.toFixed(1)}%) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    } else if (sensor === 'ph') {
        if (valor < min) {
            explicacion = `🔬 El pH está ÁCIDO (${valor.toFixed(2)}).`;
            soluciones = ["🧪 Añade pH UP", "⏳ Espera 15 minutos y mide"];
        } else if (valor > max) {
            explicacion = `🔬 El pH está ALCALINO (${valor.toFixed(2)}).`;
            soluciones = ["🧪 Añade pH DOWN", "⏳ Espera 15 minutos y mide"];
        } else {
            explicacion = `✅ El pH (${valor.toFixed(2)}) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    } else if (sensor === 'temp-agua') {
        if (valor < min) {
            explicacion = `🌊 El agua está FRÍA (${valor.toFixed(1)}°C).`;
            soluciones = ["🔥 Usa un calentador de acuario"];
        } else if (valor > max) {
            explicacion = `🌊 El agua está CALIENTE (${valor.toFixed(1)}°C). ¡URGENTE!`;
            soluciones = ["🧊 Pon botellas con agua congelada"];
        } else {
            explicacion = `✅ El agua (${valor.toFixed(1)}°C) está ideal.`;
            soluciones = ["👍 Mantén la temperatura estable"];
        }
    }

    return { soluciones, explicacion };
}

export function analizarSensor(sensor, valor) {
    const c = configuracion[sensor];
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const stats = obtenerEstadisticasHistoricas(sensor);
    const tendencia = obtenerTendenciaReal(sensor, 20);
    const anomalia = detectarAnomaliaConHistorial(sensor, valor);
    const estado = require('./utils.js').obtenerEstado(sensor, valor);
    const soluciones = generarSolucionesPracticas(sensor, valor);

    let significado = "";
    let recomendacion = "";

    if (!stats.promedio || stats.total < 3) {
        significado = `📊 Valor actual: ${valor.toFixed(c.decimales)}${c.unidad}. Aún tengo pocos datos históricos (${stats.total} registros).`;
        recomendacion = "Continúa monitoreando. En unos días podré darte análisis más precisos.";
        return { estado, stats, tendencia, anomalia: anomalia.esAnomalia, significado, recomendacion, soluciones, totalDatos: stats.total };
    }

    const { min, max, ideal, etapa } = rango;

    if (valor < min) {
        significado = `📉 El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está por DEBAJO del rango para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
        recomendacion = `⚠️ Necesitas SUBIR este valor. El valor ideal es ${ideal}${c.unidad}.`;
    } else if (valor > max) {
        significado = `📈 El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está por ENCIMA del rango para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
        recomendacion = `⚠️ Necesitas BAJAR este valor. El valor ideal es ${ideal}${c.unidad}.`;
    } else {
        significado = `✅ El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está DENTRO del rango para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
        recomendacion = `👍 Mantén las condiciones actuales. El valor ideal es ${ideal}${c.unidad}.`;
    }

    if (tendencia.porcentaje !== 0 && Math.abs(tendencia.porcentaje) > 3) {
        significado += ` 📊 ${tendencia.texto}`;
    }

    if (anomalia.esAnomalia) {
        significado += ` ${anomalia.texto}`;
    }

    return { estado, stats, tendencia, anomalia: anomalia.esAnomalia, significado, recomendacion, soluciones, totalDatos: stats.total, etapa };
}