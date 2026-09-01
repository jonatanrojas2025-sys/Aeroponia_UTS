// ============================================================
// ANÁLISIS, TENDENCIAS Y SOLUCIONES
// ============================================================

import { 
    getRegistrosHistorial, 
    getRangoPorEtapa, 
    obtenerDiasTranscurridos,
    formato,
    configuracion,
    obtenerEstado
} from './utils.js';

// ============================================================
// ESTADÍSTICAS HISTÓRICAS
// ============================================================

export function obtenerEstadisticasHistoricas(sensor) {
    const c = configuracion[sensor];
    const registros = getRegistrosHistorial();
    const valores = registros
        .map(r => Number(r[c.campo]))
        .filter(v => Number.isFinite(v) && v !== -273.15);

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

// ============================================================
// TENDENCIA
// ============================================================

export function obtenerTendenciaReal(sensor, ventana = 20) {
    const c = configuracion[sensor];
    const registros = getRegistrosHistorial();
    const valores = registros
        .map(r => Number(r[c.campo]))
        .filter(v => Number.isFinite(v) && v !== -273.15);

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

// ============================================================
// DETECTAR ANOMALÍAS
// ============================================================

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

// ============================================================
// GENERAR SOLUCIONES PRÁCTICAS
// ============================================================

export function generarSolucionesPracticas(sensor, valor) {
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const c = configuracion[sensor];
    let soluciones = [];
    let explicacion = "";

    if (!rango || !Number.isFinite(valor) || valor === -273.15) {
        return {
            soluciones: ["⚠️ No hay datos de referencia o sensor defectuoso."],
            explicacion: "Espera a tener más datos o verifica la conexión del sensor."
        };
    }

    const { min, max, ideal, etapa } = rango;

    // SENSOR DEFECTUOSO (Temperatura agua)
    if (sensor === 'temp-agua' && valor < -100) {
        explicacion = `🌊 El sensor de temperatura del agua parece estar defectuoso (${valor.toFixed(1)}°C).`;
        soluciones = [
            "🔌 Verifica la conexión del sensor DS18B20",
            "🔄 Reinicia el ESP32",
            "🧪 Prueba el sensor con otro código de prueba",
            "🛠️ Reemplaza el sensor si sigue dando lecturas erróneas"
        ];
        return { soluciones, explicacion };
    }

    // LUZ
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
    }

    // TEMPERATURA (Ambiente y Agua)
    else if (sensor === 'temp' || sensor === 'temp-agua') {
        const nombreSensor = sensor === 'temp' ? 'Temperatura ambiente' : 'Temperatura del agua';
        if (valor < min) {
            explicacion = `🌡️ La ${nombreSensor} (${valor.toFixed(1)}°C) está FRÍA.`;
            soluciones = ["🔥 Enciende un calefactor", "🪟 Cierra ventanas", "📦 Aísla el sistema"];
        } else if (valor > max) {
            explicacion = `🌡️ La ${nombreSensor} (${valor.toFixed(1)}°C) está CALIENTE. ¡ACTÚA!`;
            soluciones = ["💨 Abre ventanas", "🌀 Coloca un ventilador", "🧊 Moja el piso alrededor"];
        } else {
            explicacion = `✅ La ${nombreSensor} (${valor.toFixed(1)}°C) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    }

    // HUMEDAD
    else if (sensor === 'hum') {
        if (valor < min) {
            explicacion = `💧 El ambiente está SECO (${valor.toFixed(1)}%).`;
            soluciones = ["💨 Usa un humidificador", "💧 Coloca bandejas con agua", "🌿 Agrupa las plantas"];
        } else if (valor > max) {
            explicacion = `💧 El ambiente está HÚMEDO (${valor.toFixed(1)}%).`;
            soluciones = ["💨 Abre ventanas", "🌀 Usa un ventilador", "🧊 Deshumidificador"];
        } else {
            explicacion = `✅ La humedad (${valor.toFixed(1)}%) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    }

    // pH
    else if (sensor === 'ph') {
        if (valor < min) {
            explicacion = `🔬 El pH está ÁCIDO (${valor.toFixed(2)}).`;
            soluciones = ["🧪 Añade pH UP", "⏳ Espera 15 minutos y mide", "🔄 Repite hasta llegar a pH ${ideal}"];
        } else if (valor > max) {
            explicacion = `🔬 El pH está ALCALINO (${valor.toFixed(2)}).`;
            soluciones = ["🧪 Añade pH DOWN", "⏳ Espera 15 minutos y mide", "🔄 Repite hasta llegar a pH ${ideal}"];
        } else {
            explicacion = `✅ El pH (${valor.toFixed(2)}) es ideal.`;
            soluciones = ["👍 Mantén las condiciones actuales"];
        }
    }

    soluciones = soluciones.map(s => s.replace(/\${ideal}/g, ideal).replace(/\${min}/g, min).replace(/\${max}/g, max));

    return { soluciones, explicacion };
}

// ============================================================
// ANALIZAR SENSOR (FUNCIÓN PRINCIPAL)
// ============================================================

export function analizarSensor(sensor, valor) {
    const c = configuracion[sensor];
    const dias = obtenerDiasTranscurridos();
    const rango = getRangoPorEtapa(sensor, dias);
    const stats = obtenerEstadisticasHistoricas(sensor);
    const tendencia = obtenerTendenciaReal(sensor, 20);
    const anomalia = detectarAnomaliaConHistorial(sensor, valor);
    const estado = obtenerEstado(sensor, valor);
    const soluciones = generarSolucionesPracticas(sensor, valor);

    let significado = "";
    let recomendacion = "";

    // SENSOR DEFECTUOSO
    if (sensor === 'temp-agua' && valor < -100) {
        significado = `🌊 El sensor de temperatura del agua está dando una lectura errónea (${valor.toFixed(1)}°C). Esto indica que el sensor DS18B20 no está funcionando correctamente.`;
        recomendacion = "🔧 Verifica la conexión del sensor, reinicia el ESP32 o reemplaza el sensor si el problema persiste.";
        return { estado, stats, tendencia, anomalia: true, significado, recomendacion, soluciones, totalDatos: stats.total, etapa: rango?.etapa || 'Desconocida' };
    }

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