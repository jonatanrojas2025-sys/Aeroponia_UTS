// =========================================================
        // 1. FIREBASE
        // =========================================================
        import {
            initializeApp
        } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

        import {
            getDatabase,
            ref,
            onValue,
            query,
            orderByKey,
            limitToLast,
            set
        } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDuMehgD-CrrSLW6SIz4OMg7LzDGbY9NTw",
            authDomain: "aeroponia-uts.firebaseapp.com",
            databaseURL: "https://aeroponia-uts-default-rtdb.firebaseio.com",
            projectId: "aeroponia-uts",
            storageBucket: "aeroponia-uts.firebasestorage.app",
            messagingSenderId: "553659066320",
            appId: "1:553659066320:web:2fe4b64c723727c8b67bd5"
        };

        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);

        const valorActualRef = ref(db, "Aeroponia-UTS/Valor_Actual");
        const historialRef = query(
            ref(db, "Aeroponia-UTS/Historial"),
            orderByKey(),
            limitToLast(100)
        );

        // REFERENCIA PARA LA ETAPA (SOLO LECTURA, NO SE ESCRIBE DESDE AQUÍ)
        const etapaConfigRef = ref(db, "Aeroponia-UTS/Config/etapa");

        // =========================================================
        // 2. BASE DE DATOS DE CULTIVOS
        // =========================================================
        const cultivosDB = {
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

        // =========================================================
        // 3. VARIABLES GLOBALES
        // =========================================================
        let cultivoSeleccionado = 'lechuga';
        let datosActuales = null;
        let registrosHistorial = [];
        let sensorAbierto = null;
        let chartInstance = null;
        let chatIniciado = false;
        let fechaInicio = null;
        let cambioPendiente = null;
        let previewEtapa = null;

        // =========================================================
        // ESTADO DE CONEXIÓN POR TIMEOUT
        // =========================================================
        let isOffline = false;
        let offlineStartTime = null;
        let lastUpdateTime = null;
        let offlineTimerInterval = null;
        let dataTimeout = null;
        const DATA_TIMEOUT_MS = 30000;

        function getCultivoInfo() {
            return cultivosDB[cultivoSeleccionado] || cultivosDB.lechuga;
        }

        // =========================================================
        // 4. OBTENER RANGOS SEGÚN ETAPA
        // =========================================================
        function getRangoPorEtapa(sensor, dias) {
            const cultivo = getCultivoInfo();
            let etapaActual = cultivo.etapas[0];
            
            for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
                if (dias >= cultivo.etapas[i].dia) {
                    etapaActual = cultivo.etapas[i];
                    break;
                }
            }

            if (etapaActual.ajustes && etapaActual.ajustes[sensor]) {
                const ajuste = etapaActual.ajustes[sensor];
                return {
                    min: ajuste.min,
                    max: ajuste.max,
                    ideal: ajuste.ideal,
                    unidad: ajuste.unidad || '',
                    etapa: etapaActual.nombre
                };
            }

            const base = cultivo[sensor];
            if (base) {
                return { ...base, etapa: etapaActual.nombre };
            }

            const defecto = rangosPorDefecto[sensor];
            return { ...defecto, etapa: etapaActual.nombre };
        }

        // =========================================================
        // 5. CONFIGURACION DE SENSORES
        // =========================================================
        const configuracion = {
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

        const rangosPorDefecto = {
            ph: { min: 5.0, max: 7.0, ideal: 6.0, unidad: "" },
            temp: { min: 15, max: 28, ideal: 22, unidad: "°C" },
            "temp-agua": { min: 18, max: 26, ideal: 22, unidad: "°C" },
            hum: { min: 40, max: 80, ideal: 60, unidad: "%" },
            luz: { min: 300, max: 800, ideal: 500, unidad: " lux" }
        };

        // Límites físicamente posibles por sensor. Un valor fuera de aquí
        // no es un problema de cultivo, es un sensor dañado/desconectado.
        const LIMITES_FISICOS = {
            ph: { min: 0, max: 14 },
            temp: { min: -20, max: 60 },
            "temp-agua": { min: -5, max: 60 },
            hum: { min: 0, max: 100 },
            luz: { min: 0, max: 100000 }
        };

        function esValorImposible(sensor, valor) {
            const limite = LIMITES_FISICOS[sensor];
            if (!limite || !Number.isFinite(valor)) return false;
            return valor < limite.min || valor > limite.max;
        }

        // =========================================================
        // 6. FUNCIONES DE ANALISIS
        // =========================================================
        function obtenerDiasTranscurridos() {
            if (fechaInicio) {
                const ahora = new Date();
                const inicio = new Date(fechaInicio);
                const diff = ahora - inicio;
                return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
            }
            return 0;
        }

        function obtenerEstadisticasHistoricas(sensor) {
            const c = configuracion[sensor];
            const valores = registrosHistorial
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

        function obtenerTendenciaReal(sensor, ventana = 20) {
            const c = configuracion[sensor];
            const valores = registrosHistorial
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
                return { tipo: "subiendo", texto: `⬆️ Subiendo un ${porcentaje.toFixed(1)}% en las últimas mediciones.`,
                    porcentaje };
            }

            return { tipo: "bajando", texto: `⬇️ Bajando un ${Math.abs(porcentaje).toFixed(1)}% en las últimas mediciones.`,
                porcentaje };
        }

        function detectarAnomaliaConHistorial(sensor, valorActual) {
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

        // =========================================================
        // 7. OBTENER ESTADO (CON RANGOS POR ETAPA)
        // =========================================================
        function obtenerEstado(sensor, valor) {
            const dias = obtenerDiasTranscurridos();
            const rango = getRangoPorEtapa(sensor, dias);
            
            if (valor === null || valor === undefined || isNaN(valor)) {
                return { estado: "warning", texto: "⚠️ Sin datos" };
            }

            if (esValorImposible(sensor, valor)) {
                return { estado: "danger", texto: "🔌 Sensor dañado", esError: true };
            }

            const { min, max } = rango;

            if (sensor === 'luz') {
                if (valor < min) {
                    return { estado: "warning", texto: "🌑 Poca luz" };
                } else if (valor > max) {
                    return { estado: "danger", texto: "☀️ Exceso de luz" };
                } else {
                    return { estado: "ok", texto: "☀️ Buena luz" };
                }
            }

            if (valor >= min && valor <= max) {
                return { estado: "ok", texto: "✅ Bueno" };
            }

            const margen = (max - min) * 0.20;
            if (valor >= min - margen && valor <= max + margen) {
                return { estado: "warning", texto: "⚠️ Regular" };
            }

            return { estado: "danger", texto: "❌ Crítico" };
        }

        function formato(valor, sensor) {
            const c = configuracion[sensor];
            if (!Number.isFinite(valor)) return "--";
            return valor.toFixed(c.decimales) + c.unidad;
        }

        // =========================================================
        // 8. GENERADOR DE SOLUCIONES PRÁCTICAS
        // =========================================================
        function generarSolucionesPracticas(sensor, valor) {
            const dias = obtenerDiasTranscurridos();
            const rango = getRangoPorEtapa(sensor, dias);
            const c = configuracion[sensor];
            let soluciones = [];
            let explicacion = "";

            if (esValorImposible(sensor, valor)) {
                return {
                    soluciones: [
                        "🔌 Revisa que el sensor esté bien conectado",
                        "🔋 Verifica la alimentación eléctrica del sensor",
                        "🧵 Revisa el cableado en busca de daños o falsos contactos",
                        "🔄 Reinicia el módulo/ESP32 si el problema continúa",
                        "🛠️ Si persiste, reemplaza el sensor"
                    ],
                    explicacion: `🔌 El sensor de ${c.nombre.toLowerCase()} está entregando un valor imposible (${valor}${c.unidad}). Esto no es un problema del cultivo, es una falla del sensor.`
                };
            }

            if (!rango || !Number.isFinite(valor)) {
                return {
                    soluciones: ["⚠️ No hay datos de referencia."],
                    explicacion: "Espera a tener más datos."
                };
            }

            const { min, max, ideal, etapa } = rango;

            if (sensor === 'luz') {
                if (valor < min) {
                    explicacion = `💡 Hay POCA luz (${valor.toFixed(0)} lux) para la etapa ${etapa}. Las plantas necesitan más energía.`;
                    soluciones = [
                        "💡 Aumenta la intensidad de las luces",
                        "📏 Reduce la distancia entre las luces y las plantas",
                        "⏰ Extiende el fotoperiodo a 12-14 horas",
                        "☀️ Coloca el sistema cerca de una ventana con luz natural"
                    ];
                } else if (valor > max) {
                    explicacion = `💡 Hay EXCESO de luz (${valor.toFixed(0)} lux) para la etapa ${etapa}. Las plantas pueden quemarse.`;
                    soluciones = [
                        "📏 Aumenta la distancia de las luces",
                        "🔅 Reduce la intensidad de las luces",
                        "⏰ Reduce el fotoperiodo a 10-12 horas",
                        "🌿 Usa malla de sombra si es luz solar"
                    ];
                } else {
                    explicacion = `✅ La iluminación (${valor.toFixed(0)} lux) es adecuada para la etapa ${etapa}.`;
                    soluciones = ["👍 Mantén las condiciones de luz actuales"];
                }
            } else if (sensor === 'temp') {
                if (valor < min) {
                    explicacion = `🌡️ La temperatura (${valor.toFixed(1)}°C) está FRÍA para la etapa ${etapa}.`;
                    soluciones = ["🔥 Enciende un calefactor", "🪟 Cierra ventanas", "📦 Aísla el sistema"];
                } else if (valor > max) {
                    explicacion = `🌡️ La temperatura (${valor.toFixed(1)}°C) está CALIENTE para la etapa ${etapa}. ¡ACTÚA!`;
                    soluciones = ["💨 Abre ventanas", "🌀 Coloca un ventilador", "🧊 Moja el piso alrededor"];
                } else {
                    explicacion = `✅ La temperatura (${valor.toFixed(1)}°C) es ideal para la etapa ${etapa}.`;
                    soluciones = ["👍 Mantén las condiciones actuales"];
                }
            } else if (sensor === 'hum') {
                if (valor < min) {
                    explicacion = `💧 El ambiente está SECO (${valor.toFixed(1)}%) para la etapa ${etapa}.`;
                    soluciones = ["💨 Usa un humidificador", "💧 Coloca bandejas con agua", "🌿 Agrupa las plantas"];
                } else if (valor > max) {
                    explicacion = `💧 El ambiente está HÚMEDO (${valor.toFixed(1)}%) para la etapa ${etapa}.`;
                    soluciones = ["💨 Abre ventanas", "🌀 Usa un ventilador", "🧊 Deshumidificador"];
                } else {
                    explicacion = `✅ La humedad (${valor.toFixed(1)}%) es ideal para la etapa ${etapa}.`;
                    soluciones = ["👍 Mantén las condiciones actuales"];
                }
            } else if (sensor === 'ph') {
                if (valor < min) {
                    explicacion = `🔬 El pH está ÁCIDO (${valor.toFixed(2)}) para la etapa ${etapa}.`;
                    soluciones = ["🧪 Añade pH UP", "⏳ Espera 15 minutos y mide", "🔄 Repite hasta llegar a pH ${ideal}"];
                } else if (valor > max) {
                    explicacion = `🔬 El pH está ALCALINO (${valor.toFixed(2)}) para la etapa ${etapa}.`;
                    soluciones = ["🧪 Añade pH DOWN", "⏳ Espera 15 minutos y mide", "🔄 Repite hasta llegar a pH ${ideal}"];
                } else {
                    explicacion = `✅ El pH (${valor.toFixed(2)}) es ideal para la etapa ${etapa}.`;
                    soluciones = ["👍 Mantén las condiciones actuales"];
                }
            } else if (sensor === 'temp-agua') {
                if (valor < min) {
                    explicacion = `🌊 El agua está FRÍA (${valor.toFixed(1)}°C) para la etapa ${etapa}.`;
                    soluciones = ["🔥 Usa un calentador de acuario", "🌡️ Coloca el depósito en un lugar cálido"];
                } else if (valor > max) {
                    explicacion = `🌊 El agua está CALIENTE (${valor.toFixed(1)}°C) para la etapa ${etapa}. ¡URGENTE!`;
                    soluciones = ["🧊 Pon botellas con agua congelada", "🌡️ Cambia el agua por agua fresca"];
                } else {
                    explicacion = `✅ El agua (${valor.toFixed(1)}°C) está ideal para la etapa ${etapa}.`;
                    soluciones = ["👍 Mantén la temperatura estable"];
                }
            }

            soluciones = soluciones.map(s => s.replace(/\${ideal}/g, ideal).replace(/\${min}/g, min).replace(/\${max}/g, max));

            return { soluciones, explicacion };
        }

        // =========================================================
        // 9. ANALISIS INTELIGENTE DEL SENSOR
        // =========================================================
        function analizarSensor(sensor, valor) {
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

            if (estado.esError) {
                significado = `🔌 El sensor de ${c.nombre.toLowerCase()} está entregando un valor físicamente imposible (${valor}${c.unidad}). No es un problema del cultivo: indica un sensor desconectado, dañado o con falla de lectura.`;
                recomendacion = "🔧 Revisa la conexión, el cableado y la alimentación del sensor. Si el problema persiste, reemplázalo.";
                return { estado, stats, tendencia, anomalia: anomalia.esAnomalia, significado, recomendacion, soluciones,
                    totalDatos: stats.total, etapa: rango ? rango.etapa : undefined };
            }

            if (!stats.promedio || stats.total < 3) {
                significado =
                    `📊 Valor actual: ${valor.toFixed(c.decimales)}${c.unidad}. Aún tengo pocos datos históricos (${stats.total} registros).`;
                recomendacion = "Continúa monitoreando. En unos días podré darte análisis más precisos.";
                return { estado, stats, tendencia, anomalia: anomalia.esAnomalia, significado, recomendacion, soluciones,
                    totalDatos: stats.total };
            }

            const { min, max, ideal, etapa } = rango;

            if (valor < min) {
                significado =
                    `📉 El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está por DEBAJO del rango recomendado para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
                recomendacion =
                    `⚠️ Necesitas SUBIR este valor. El valor ideal es ${ideal}${c.unidad}.`;
            } else if (valor > max) {
                significado =
                    `📈 El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está por ENCIMA del rango recomendado para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
                recomendacion =
                    `⚠️ Necesitas BAJAR este valor. El valor ideal es ${ideal}${c.unidad}.`;
            } else {
                significado =
                    `✅ El valor actual (${valor.toFixed(c.decimales)}${c.unidad}) está DENTRO del rango recomendado para la etapa "${etapa}" (${min} - ${max}${c.unidad}).`;
                recomendacion = `👍 Mantén las condiciones actuales. El valor ideal es ${ideal}${c.unidad}.`;
            }

            if (tendencia.porcentaje !== 0 && Math.abs(tendencia.porcentaje) > 3) {
                significado += ` 📊 ${tendencia.texto}`;
            }

            if (anomalia.esAnomalia) {
                significado += ` ${anomalia.texto}`;
            }

            return { estado, stats, tendencia, anomalia: anomalia.esAnomalia, significado, recomendacion, soluciones,
                totalDatos: stats.total, etapa };
        }

        // =========================================================
        // 10. ACTUALIZAR TARJETAS
        // =========================================================
        function actualizarTarjeta(sensor, valor) {
            const c = configuracion[sensor];
            const elemento = document.getElementById(`sensor-${sensor}`);
            const status = document.getElementById(`sensor-${sensor}-status`);
            const card = document.getElementById(`card-${sensor}`);

            if (!elemento) return;

            if (isOffline) {
                card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "sensor-error");
                card.classList.add("estado-offline");
                status.className = "sub sub-offline";
                if (sensor === 'luz') {
                    elemento.innerHTML = "📡 Sin datos";
                } else {
                    elemento.innerHTML = "--";
                }
                status.textContent = "📡 Sin datos";
                return;
            }

            if (!Number.isFinite(valor)) {
                elemento.textContent = "--";
                status.textContent = "⚠️ Esperando...";
                status.className = "sub sub-warning";
                return;
            }

            const resultado = obtenerEstado(sensor, valor);

            if (resultado.esError) {
                elemento.innerHTML = `<span style="font-size:20px;">⚠️ ERROR</span>`;
            } else if (sensor === 'luz') {
                elemento.innerHTML = resultado.texto;
            } else {
                elemento.innerHTML = valor.toFixed(c.decimales) + `<span class="unit">${c.unidad}</span>`;
            }

            status.textContent = resultado.texto;
            status.className = `sub sub-${resultado.estado}`;

            card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline", "sensor-error");
            card.classList.add(`estado-${resultado.estado}`);
            if (resultado.esError) card.classList.add("sensor-error");
        }

        function actualizarTarjetaBomba(valor) {
            const elemento = document.getElementById("sensor-bomba");
            const status = document.getElementById("sensor-bomba-status");
            const card = document.getElementById("card-bomba");
            const icono = document.getElementById("bomba-icon");

            if (!elemento) return;

            if (isOffline) {
                card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off");
                card.classList.add("estado-offline");
                status.className = "sub sub-offline";
                status.textContent = "📡 Sin datos";
                elemento.textContent = "--";
                return;
            }

            if (valor === undefined || valor === null) {
                elemento.textContent = "--";
                status.textContent = "⚠️ Esperando...";
                status.className = "sub sub-warning";
                return;
            }

            const encendida = valor === true || valor === "true";
            elemento.textContent = encendida ? "🔴 ON" : "⏸️ OFF";
            status.textContent = encendida ? "✅ Encendida" : "⏸️ Apagada";
            status.className = encendida ? "sub sub-ok" : "sub sub-off";

            card.classList.remove("estado-ok", "estado-warning", "estado-danger", "estado-off", "estado-offline");
            card.classList.add(encendida ? "estado-ok" : "estado-off");

            if (icono) {
                icono.style.color = encendida ? "#22c55e" : "#64748b";
            }
        }

        // =========================================================
        // 11. DETALLE DEL SENSOR
        // =========================================================
        window.abrirDetalle = function(sensor) {
            const detalle = document.getElementById("sensor-detail");

            if (sensorAbierto === sensor) {
                detalle.classList.remove("visible");
                sensorAbierto = null;
                return;
            }

            sensorAbierto = sensor;
            detalle.classList.add("visible");
            actualizarDetalle(sensor);

            setTimeout(() => {
                detalle.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 50);
        };

        function actualizarDetalle(sensor) {
            if (sensor === "bomba") {
                actualizarDetalleBomba();
                return;
            }

            if (!datosActuales || !registrosHistorial.length) return;

            const c = configuracion[sensor];
            const valor = Number(datosActuales[c.campo]);
            if (!Number.isFinite(valor)) return;

            const analisis = analizarSensor(sensor, valor);
            const dias = obtenerDiasTranscurridos();
            const rango = getRangoPorEtapa(sensor, dias);

            document.getElementById("detalle-titulo").innerHTML = `
                <i class="fas ${c.icono}"></i>
                Análisis de ${c.nombre} (${getCultivoInfo().nombre} - ${analisis.etapa || 'Inicio'})
                ${isOffline ? ' <span style="color:#ef4444;font-size:14px;">📡 OFF</span>' : ''}
            `;

            document.getElementById("detalle-metricas").innerHTML = `
                <div class="dato-mini">
                    <span>Actual</span>
                    <strong style="color: ${isOffline ? '#ef4444' : analisis.estado.estado === 'ok' ? '#86efac' : analisis.estado.estado === 'warning' ? '#fcd34d' : '#fca5a5'}">
                        ${isOffline ? '📡 Sin datos' : (sensor === 'luz' ? analisis.estado.texto : formato(valor, sensor))}
                    </strong>
                </div>
                <div class="dato-mini">
                    <span>Rango (${analisis.etapa || 'Inicio'})</span>
                    <strong>${rango ? `${rango.min} - ${rango.max} ${rango.unidad}` : 'N/A'}</strong>
                </div>
                <div class="dato-mini">
                    <span>Ideal</span>
                    <strong>${rango ? `${rango.ideal} ${rango.unidad}` : 'N/A'}</strong>
                </div>
                <div class="dato-mini">
                    <span>Registros</span>
                    <strong>${isOffline ? '📡 SIN ACT' : analisis.totalDatos}</strong>
                </div>
            `;

            if (isOffline) {
                document.getElementById("detalle-significado-text").textContent = 
                    "⚠️ El ESP32 no está enviando datos. El sistema aeropónico sigue funcionando de forma autónoma con los últimos parámetros configurados.";
                document.getElementById("detalle-tendencia-text").textContent = 
                    "📡 No hay datos nuevos. Revisa la conexión del ESP32.";
                document.getElementById("detalle-soluciones-text").innerHTML = 
                    `<p style="color: #fca5a5;">⚠️ El ESP32 no está transmitiendo datos. Verifica:</p>
                    <ul>
                        <li>🔌 Conexión WiFi del ESP32</li>
                        <li>📶 Señal de internet en el invernadero</li>
                        <li>🔋 Alimentación del ESP32</li>
                        <li>📡 Conexión a Firebase</li>
                    </ul>
                    <p style="color: #fcd34d; margin-top: 8px;">🤖 El sistema sigue funcionando de forma autónoma.</p>`;
                document.getElementById("detalle-recomendacion-text").textContent = 
                    "Revisa la conexión del ESP32. El sistema no necesita intervención para seguir operando.";
                return;
            }

            document.getElementById("detalle-significado-text").textContent = analisis.significado;
            document.getElementById("detalle-tendencia-text").textContent = analisis.tendencia.texto;

            const solucionesDiv = document.getElementById("detalle-soluciones-text");
            if (analisis.soluciones && analisis.soluciones.soluciones.length > 0) {
                let solucionesHtml =
                `<p style="color: #c4b5fd; margin-bottom: 8px;">${analisis.soluciones.explicacion}</p><ul>`;
                analisis.soluciones.soluciones.forEach(s => {
                    const esUrgente = s.includes('¡ACTÚA RÁPIDO!') || s.includes('¡URGENTE!');
                    solucionesHtml += `<li class="${esUrgente ? 'urgente' : ''}">${s}</li>`;
                });
                solucionesHtml += `</ul>`;
                solucionesDiv.innerHTML = solucionesHtml;
            } else {
                solucionesDiv.innerHTML = `<p>No hay soluciones específicas para este parámetro.</p>`;
            }

            document.getElementById("detalle-recomendacion-text").textContent = analisis.recomendacion;
        }

        function actualizarDetalleBomba() {
            if (!datosActuales || !registrosHistorial.length) return;

            const valor = datosActuales.bomba === true || datosActuales.bomba === "true";

            if (isOffline) {
                document.getElementById("detalle-titulo").innerHTML = `
                    <i class="fas fa-power-off"></i>
                    Análisis de la Bomba 📡 OFF
                `;
                document.getElementById("detalle-metricas").innerHTML = `
                    <div class="dato-mini">
                        <span>Estado</span>
                        <strong style="color:#ef4444;">📡 Sin datos</strong>
                    </div>
                    <div class="dato-mini">
                        <span>Último estado</span>
                        <strong>${valor ? "✅ Encendida" : "⏸️ Apagada"}</strong>
                    </div>
                `;
                document.getElementById("detalle-significado-text").textContent = 
                    "⚠️ El ESP32 no está enviando datos. La bomba opera con el ciclo programado localmente.";
                document.getElementById("detalle-tendencia-text").textContent = 
                    "📡 No hay datos nuevos. Revisa la conexión del ESP32.";
                document.getElementById("detalle-soluciones-text").innerHTML = 
                    `<p style="color: #fca5a5;">⚠️ El ESP32 no está transmitiendo datos. Verifica la conexión.</p>
                    <p style="color: #fcd34d; margin-top: 8px;">🤖 El sistema sigue funcionando de forma autónoma.</p>`;
                document.getElementById("detalle-recomendacion-text").textContent = 
                    "Revisa la conexión del ESP32. El sistema no necesita intervención.";
                return;
            }

            const recientes = registrosHistorial.slice(-20);
            const estados = recientes.map(r => r.bomba === true || r.bomba === "true");
            const encendidos = estados.filter(e => e).length;
            const porcentajeEncendida = recientes.length ? ((encendidos / recientes.length) * 100).toFixed(0) : 0;
            let ciclos = 0;
            for (let i = 1; i < estados.length; i++) {
                if (estados[i] !== estados[i - 1]) ciclos++;
            }

            const cultivo = getCultivoInfo();

            document.getElementById("detalle-titulo").innerHTML = `
                <i class="fas fa-power-off"></i>
                Análisis de la Bomba (${cultivo.nombre})
            `;

            document.getElementById("detalle-metricas").innerHTML = `
                <div class="dato-mini">
                    <span>Estado</span>
                    <strong>${valor ? "✅ Encendida" : "⏸️ Apagada"}</strong>
                </div>
                <div class="dato-mini">
                    <span>Tiempo encendida</span>
                    <strong>${porcentajeEncendida}%</strong>
                </div>
                <div class="dato-mini">
                    <span>Cambios recientes</span>
                    <strong>${ciclos}</strong>
                </div>
            `;

            document.getElementById("detalle-significado-text").textContent =
                valor ? "La bomba está encendida, realizando el ciclo de aspersión." :
                "La bomba está apagada, en espera del próximo ciclo.";

            document.getElementById("detalle-tendencia-text").textContent =
                `En las últimas ${recientes.length} mediciones, la bomba estuvo encendida un ${porcentajeEncendida}% del tiempo.`;

            const solucionesDiv = document.getElementById("detalle-soluciones-text");
            let solucionesHtml = `<p style="color: #c4b5fd; margin-bottom: 8px;">🔧 La bomba es el corazón del sistema.</p><ul>`;
            if (!valor) {
                solucionesHtml += `
                    <li>🔌 Verifica que la bomba esté conectada</li>
                    <li>🔄 Revisa que el relé esté funcionando</li>
                    <li>💧 Comprueba el nivel de agua</li>
                `;
            } else {
                solucionesHtml += `
                    <li>✅ La bomba está funcionando correctamente</li>
                    <li>💧 Mantén el ciclo de aspersión regular</li>
                `;
            }
            solucionesHtml += `</ul>`;
            solucionesDiv.innerHTML = solucionesHtml;

            document.getElementById("detalle-recomendacion-text").textContent =
                "Si la bomba no cambia de estado durante más de 1 hora, verifica la conexión del relé.";
        }

        function actualizarDetalleAbierto() {
            if (sensorAbierto) {
                actualizarDetalle(sensorAbierto);
            }
        }

        // =========================================================
        // 12. PANEL DE CRECIMIENTO
        // =========================================================
        function getEtapaActual(dias) {
            const cultivo = getCultivoInfo();
            let etapa = cultivo.etapas[0];
            for (let i = cultivo.etapas.length - 1; i >= 0; i--) {
                if (dias >= cultivo.etapas[i].dia) {
                    etapa = cultivo.etapas[i];
                    break;
                }
            }
            return etapa;
        }

        function actualizarPanelCrecimiento(previewIdx = null) {
            const cultivo = getCultivoInfo();
            const diasActuales = obtenerDiasTranscurridos();
            const diasMostrar = previewIdx !== null ? cultivo.etapas[previewIdx].dia : diasActuales;
            const etapaActual = getEtapaActual(diasMostrar);
            const porcentaje = Math.min(100, Math.round((diasMostrar / cultivo.ciclo.promedio) * 100));

            document.getElementById('etapaIcono').textContent = etapaActual.nombre.split(' ')[0] || '🌱';
            document.getElementById('etapaNombre').textContent = etapaActual.nombre;
            document.getElementById('etapaDia').textContent = `Día ${diasMostrar}`;
            document.getElementById('etapaDesc').textContent = etapaActual.descripcion;
            document.getElementById('progresoPorcentaje').textContent = `${porcentaje}%`;
            
            const barra = document.getElementById('progresoBarra');
            barra.style.width = `${porcentaje}%`;
            barra.classList.toggle('offline', isOffline);
            
            document.getElementById('diasTranscurridos').textContent = diasMostrar;
            document.getElementById('diasTotales').textContent = cultivo.ciclo.promedio;
            document.getElementById('etapaCorta').textContent = etapaActual.nombre;

            const panel = document.getElementById('panelCrecimiento');
            const etapaPanel = document.getElementById('panelEtapaActual');
            panel.classList.toggle('offline', isOffline);
            etapaPanel.classList.toggle('offline', isOffline);

            const selector = document.getElementById('selectorEtapas');
            if (selector) {
                let html = '';
                cultivo.etapas.forEach((e, idx) => {
                    let clase = 'btn-etapa';
                    const esActual = e.nombre === etapaActual.nombre && previewIdx === null;
                    const esPreview = idx === previewIdx && previewIdx !== null;
                    if (esActual) clase += ' activo';
                    if (esPreview) clase += ' preview';
                    html += `<button class="${clase}" onclick="seleccionarPreview(${idx})" ${isOffline ? 'disabled' : ''}>
                        ${e.nombre}
                    </button>`;
                });
                selector.innerHTML = html;
            }

            const miniEtapas = document.getElementById('miniEtapas');
            if (miniEtapas) {
                let html = '';
                cultivo.etapas.forEach((e, idx) => {
                    let clase = 'mini-etapa';
                    const etapaIdx = cultivo.etapas.indexOf(etapaActual);
                    if (e.nombre === etapaActual.nombre && previewIdx === null) clase += ' actual';
                    else if (idx === previewIdx && previewIdx !== null) clase += ' preview';
                    else if (idx < etapaIdx) clase += ' completada';
                    if (isOffline) clase += ' offline';
                    html += `<span class="${clase}">${e.nombre}</span>`;
                });
                miniEtapas.innerHTML = html;
            }

            const hayPreview = previewIdx !== null;
            const btnAplicar = document.getElementById('btnAplicar');
            const btnCancelar = document.getElementById('btnCancelar');
            const btnDia0 = document.getElementById('btnDia0');
            
            if (isOffline) {
                btnAplicar.disabled = true;
                btnCancelar.disabled = true;
                btnDia0.disabled = true;
                document.getElementById('cambioPendiente').style.display = 'none';
                return;
            }

            if (hayPreview) {
                btnAplicar.disabled = false;
                btnCancelar.disabled = false;
                btnDia0.disabled = true;
                document.getElementById('cambioPendiente').style.display = 'flex';
                const etapaActualNom = getEtapaActual(diasActuales).nombre;
                document.getElementById('cambioPendienteTexto').textContent = etapaActualNom;
                document.getElementById('cambioPendienteNuevo').textContent = cultivo.etapas[previewIdx].nombre;
            } else {
                btnAplicar.disabled = true;
                btnCancelar.disabled = true;
                btnDia0.disabled = false;
                document.getElementById('cambioPendiente').style.display = 'none';
            }
        }

        // =========================================================
        // 13. FUNCIONES DE PREVIEW Y ACCIONES (SOLO ETAPA, NO TOCA CULTIVO)
        // =========================================================
        window.seleccionarPreview = function(idx) {
    if (isOffline) return;
    
    const cultivo = getCultivoInfo();
    const diasActuales = obtenerDiasTranscurridos();
    const etapaActual = getEtapaActual(diasActuales);
    
    // Normalizar nombres sin tildes para comparar
    const nombreSeleccionado = cultivo.etapas[idx].nombre
        .replace(/[^a-zA-Záéíóúñ ]/g, '')
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');
        
    const nombreActual = etapaActual.nombre
        .replace(/[^a-zA-Záéíóúñ ]/g, '')
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '');
    
    // Si la etapa seleccionada ya es la actual, cancelar preview
    if (nombreSeleccionado === nombreActual) {
        cancelarPreview();
        return;
    }
    
    previewEtapa = idx;
    actualizarPanelCrecimiento(idx);
};
        function cancelarPreview() {
            previewEtapa = null;
            actualizarPanelCrecimiento(null);
        }
        function aplicarPreview() {
    if (previewEtapa === null || isOffline) return;
    
    const cultivo = getCultivoInfo();
    const etapa = cultivo.etapas[previewEtapa];
    const dias = etapa.dia;
    
    // Calcular fecha para llegar a ese día
    const ahora = new Date();
    const nuevaFecha = new Date(ahora);
    nuevaFecha.setDate(nuevaFecha.getDate() - dias);
    const fechaStr = nuevaFecha.toISOString().split('T')[0];
    
    fechaInicio = fechaStr;
    localStorage.setItem('fechaSiembra', fechaStr);
    document.getElementById('fechaSiembraPanel').value = fechaStr;
    
    // ===== MAPEAR ETAPA A FIREBASE (SIN TILDES) =====
    let etapaFirebase = "";
    const mapa = {
        "germinacion": "germinacion",
        "plantula": "plantula", 
        "crecimiento": "crecimiento",
        "desarrollo": "desarrollo",
        "floracion": "floracion",
        "cosecha": "cosecha"
    };
    
    // Normalizar el nombre de la etapa: quitar emojis, espacios y convertir a minúsculas
    let nombreLimpio = etapa.nombre
        .replace(/[^a-zA-Záéíóúñ ]/g, '')  // Quitar emojis y símbolos
        .trim()
        .toLowerCase()
        .normalize("NFD")                    // Separar tildes
        .replace(/[\u0300-\u036f]/g, '');   // Eliminar las tildes
    
    console.log("🔍 Nombre normalizado:", nombreLimpio);
    
    for (const [key, value] of Object.entries(mapa)) {
        if (nombreLimpio.includes(key) || key.includes(nombreLimpio)) {
            etapaFirebase = value;
            break;
        }
    }
    
    if (etapaFirebase === "") {
        etapaFirebase = nombreLimpio;
    }
    
    console.log("📝 Aplicando etapa en Firebase:", etapaFirebase);
    
    // ===== ESCRIBIR EN FIREBASE (SOLO LA ETAPA) =====
    const etapaRef = ref(db, "Aeroponia-UTS/Config/etapa");
    set(etapaRef, etapaFirebase)
        .then(() => {
            console.log("✅ Etapa actualizada en Firebase: " + etapaFirebase);
            if (chatIniciado) {
                agregarMensaje(`📅 Cambio aplicado: ${etapa.nombre} (Día ${dias})`, "bot");
            }
        })
        .catch((error) => {
            console.error("❌ Error al actualizar etapa:", error);
        });
    
    previewEtapa = null;
    actualizarPanelCrecimiento(null);
    actualizarEstadoGeneral();
    
    if (datosActuales) {
        for (const sensor in configuracion) {
            const valor = Number(datosActuales[configuracion[sensor].campo]);
            actualizarTarjeta(sensor, valor);
        }
    }
    
    document.getElementById('btnAplicar').disabled = true;
    document.getElementById('btnCancelar').disabled = true;
    document.getElementById('btnDia0').disabled = false;
    document.getElementById('cambioPendiente').style.display = 'none';
}
        function dia0() {
            if (isOffline) return;
            
            if (confirm('¿Estás seguro de que quieres reiniciar el cultivo a Día 0?')) {
                const hoy = new Date();
                const fechaStr = hoy.toISOString().split('T')[0];
                fechaInicio = fechaStr;
                localStorage.setItem('fechaSiembra', fechaStr);
                document.getElementById('fechaSiembraPanel').value = fechaStr;
                
                previewEtapa = null;
                actualizarPanelCrecimiento(null);
                actualizarEstadoGeneral();
                
                if (datosActuales) {
                    for (const sensor in configuracion) {
                        const valor = Number(datosActuales[configuracion[sensor].campo]);
                        actualizarTarjeta(sensor, valor);
                    }
                }
                
                if (chatIniciado) {
                    agregarMensaje(`🔄 Cultivo reiniciado a Día 0 (Germinación)`, "bot");
                }
            }
        }

        // =========================================================
        // 14. GESTIÓN DE CONEXIÓN POR TIMEOUT
        // =========================================================
        function actualizarEstadoOffline(offline) {
            isOffline = offline;
            
            const badge = document.getElementById("statusBadge");
            const text = document.getElementById("statusText");
            const icon = document.getElementById("statusIcon");
            const banner = document.getElementById("offlineBanner");
            const alerta = document.getElementById("alertaBox");
            
            if (offline) {
                badge.className = "status-badge offline";
                text.textContent = '📡 Sin datos ESP32';
                icon.className = 'fas fa-wifi-slash';
                
                banner.classList.add("visible");
                
                if (offlineStartTime === null) {
                    offlineStartTime = new Date();
                }
                iniciarTimerOffline();
                
                alerta.className = "alerta-box offline";
                alerta.innerHTML = `
                    <i class="fas fa-microchip"></i>
                    <span>
                        <strong>📡 ESP32 SIN TRANSMITIR DATOS</strong>
                        <span style="color:#94a3b8; display:block; font-size:13px; margin-top:4px;">
                            El microcontrolador no está enviando datos a Firebase.
                            El sistema <strong>sigue funcionando de forma autónoma</strong> en el invernadero.
                            <span style="color:#fcd34d; display:inline-block; margin-top:4px; padding:2px 10px; background:rgba(245,158,11,0.15); border-radius:12px;">
                                🤖 MODO AUTÓNOMO ACTIVO
                            </span>
                        </span>
                        <span style="color:#64748b; display:block; font-size:12px; margin-top:4px;">
                            ⏱️ Último dato recibido: ${lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : '--'}
                            <span id="offlineTimerAlerta" style="margin-left:8px;"></span>
                        </span>
                    </span>
                `;
                
                document.getElementById('chartContainer').classList.add('offline');
                document.getElementById('tableWrapper').classList.add('offline');
                
            } else {
                badge.className = "status-badge connected";
                text.textContent = '✅ Conectado';
                icon.className = 'fas fa-circle';
                
                banner.classList.remove("visible");
                
                if (offlineStartTime !== null) {
                    offlineStartTime = null;
                }
                if (offlineTimerInterval) {
                    clearInterval(offlineTimerInterval);
                    offlineTimerInterval = null;
                }
                
                document.getElementById('chartContainer').classList.remove('offline');
                document.getElementById('tableWrapper').classList.remove('offline');
                
                // Restaurar alerta
                actualizarEstadoGeneral();
            }
            
            if (datosActuales) {
                for (const sensor in configuracion) {
                    const valor = Number(datosActuales[configuracion[sensor].campo]);
                    actualizarTarjeta(sensor, valor);
                }
                actualizarTarjetaBomba(datosActuales.bomba);
            }
            
            actualizarPanelCrecimiento(previewEtapa);
            actualizarDetalleAbierto();
            actualizarAsistente();
            renderizarChips();
        }

        function iniciarTimerOffline() {
            if (offlineTimerInterval) {
                clearInterval(offlineTimerInterval);
            }
            
            offlineTimerInterval = setInterval(() => {
                if (!offlineStartTime) return;
                
                const ahora = new Date();
                const diff = Math.floor((ahora - offlineStartTime) / 1000);
                
                let tiempoStr = '';
                if (diff < 60) {
                    tiempoStr = `hace ${diff}s`;
                } else if (diff < 3600) {
                    const mins = Math.floor(diff / 60);
                    tiempoStr = `hace ${mins}m ${diff % 60}s`;
                } else {
                    const horas = Math.floor(diff / 3600);
                    const mins = Math.floor((diff % 3600) / 60);
                    tiempoStr = `hace ${horas}h ${mins}m`;
                }
                
                const timerElement = document.getElementById('offlineTimer');
                if (timerElement) {
                    timerElement.textContent = `(${tiempoStr})`;
                }
                
                const timerAlerta = document.getElementById('offlineTimerAlerta');
                if (timerAlerta) {
                    timerAlerta.textContent = `⏱️ ${tiempoStr}`;
                }
            }, 1000);
        }

        // =========================================================
        // 15. DETECCIÓN DE TIMEOUT
        // =========================================================
        function reiniciarTimeout() {
            if (dataTimeout) {
                clearTimeout(dataTimeout);
            }
            
            dataTimeout = setTimeout(() => {
                // Si ya estamos offline y pasó el timeout, reiniciar el contador
                if (isOffline) {
                    actualizarEstadoOffline(true);
                    return;
                }
                // Si no estamos offline, entrar en modo offline
                actualizarEstadoOffline(true);
            }, DATA_TIMEOUT_MS);
        }

        // =========================================================
        // 16. FIREBASE - VALOR ACTUAL
        // =========================================================
        let datosRecibidos = false;

        onValue(valorActualRef, snapshot => {
            const datos = snapshot.val();
            
            if (!datos) {
                if (!datosRecibidos) {
                    // Aún no hay datos, pero estamos conectados a Firebase
                }
                return;
            }

            datosRecibidos = true;
            datosActuales = datos;
            lastUpdateTime = new Date();
            
            // Actualizar última actualización
            const ultimaSpan = document.getElementById('ultimaActualizacion');
            if (ultimaSpan) {
                ultimaSpan.textContent = lastUpdateTime.toLocaleTimeString();
            }

            // Si estábamos offline y recibimos datos, restaurar
            if (isOffline) {
                actualizarEstadoOffline(false);
                if (chatIniciado) {
                    agregarMensaje("🔗 ¡Datos recibidos! El ESP32 está transmitiendo nuevamente.", "bot");
                }
            }

            // Reiniciar el timeout de datos
            reiniciarTimeout();

            for (const sensor in configuracion) {
                const campo = configuracion[sensor].campo;
                const valor = Number(datos[campo]);
                actualizarTarjeta(sensor, valor);
            }
            actualizarTarjetaBomba(datos.bomba);

            actualizarEstadoGeneral();

            const badge = document.getElementById("statusBadge");
            const text = document.getElementById("statusText");
            if (!isOffline) {
                badge.className = "status-badge connected";
                text.textContent = "✅ Conectado";
            }

            actualizarDetalleAbierto();

        }, error => {
            console.error("Firebase error (ValorActual):", error);
            // No activamos offline inmediatamente por error de Firebase
            // esperamos al timeout
        });

        // =========================================================
        // 17. FIREBASE - HISTORIAL
        // =========================================================
        onValue(historialRef, snapshot => {
            const data = snapshot.val();
            if (!data) {
                registrosHistorial = [];
                return;
            }

            registrosHistorial = Object.entries(data)
                .map(([key, value]) => ({ key, ...value }))
                .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

            document.getElementById("contador-registros").textContent = registrosHistorial.length;
            actualizarTabla();
            actualizarGrafica();
            actualizarEstadoGeneral();
            actualizarDetalleAbierto();
            
            // Si estábamos offline y recibimos historial, es buena señal
            if (isOffline && registrosHistorial.length > 0) {
                // Ya se restauró en el onValue de ValorActual si llegaron datos nuevos
            }
        }, error => {
            console.error("Firebase error (Historial):", error);
        });

        // =========================================================
        // 18. TABLA
        // =========================================================
        function actualizarTabla() {
            const tbody = document.getElementById("tabla-body");

            if (!registrosHistorial.length) {
                tbody.innerHTML =
                `<tr><td colspan="8" class="text-center">📭 No hay datos históricos.</td></tr>`;
                return;
            }

            let html = "";
            registrosHistorial.slice().reverse().slice(0, 30).forEach(r => {
                const ph = Number(r.PH);
                const temp = Number(r.Temperatura_Ambiente);
                const tempAgua = Number(r.Temperatura_Agua);
                const hum = Number(r.Humedad_Ambiente);
                const luz = Number(r.luz);
                const bombaOn = r.bomba === true || r.bomba === "true";

                let fecha = "--";
                if (r.timestamp) {
                    fecha = new Date(r.timestamp).toLocaleTimeString();
                }

                const estados = [
                    obtenerEstado("ph", ph).estado,
                    obtenerEstado("temp", temp).estado,
                    obtenerEstado("temp-agua", tempAgua).estado,
                    obtenerEstado("hum", hum).estado,
                    obtenerEstado("luz", luz).estado
                ];

                let estadoTexto = "✅ Normal";
                let estadoClase = "td-ok";
                if (estados.includes("danger")) {
                    estadoTexto = "❌ Revisar";
                    estadoClase = "td-danger";
                } else if (estados.includes("warning")) {
                    estadoTexto = "⚠️ Atención";
                    estadoClase = "td-warning";
                }

                if (isOffline) {
                    estadoTexto = "📡 Sin datos";
                    estadoClase = "td-danger";
                }

                html += `
                    <tr>
                        <td style="color:#64748b; font-size:12px;">${fecha}</td>
                        <td>${Number.isFinite(ph) ? ph.toFixed(2) : "--"}</td>
                        <td>${Number.isFinite(temp) ? temp.toFixed(1)+"°C" : "--"}</td>
                        <td>${Number.isFinite(tempAgua) ? tempAgua.toFixed(1)+"°C" : "--"}</td>
                        <td>${Number.isFinite(hum) ? hum.toFixed(1)+"%" : "--"}</td>
                        <td>${Number.isFinite(luz) ? luz.toFixed(0)+" lux" : "--"}</td>
                        <td class="${bombaOn ? 'td-ok' : ''}">${bombaOn ? "🔴 ON" : "⚪ OFF"}</td>
                        <td class="${estadoClase}">${estadoTexto}</td>
                    </tr>
                `;
            });

            tbody.innerHTML = html;
        }

        // =========================================================
        // 19. GRAFICA
        // =========================================================
        function actualizarGrafica() {
            const ultimos = registrosHistorial.slice(-40);
            if (!ultimos.length) return;

            const labels = ultimos.map(r => r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : "");

            const datasets = [
                { label: "pH", data: ultimos.map(r => Number(r.PH) || null), borderColor: "#a78bfa",
                    backgroundColor: "rgba(167,139,250,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
                { label: "Temp. ambiente °C", data: ultimos.map(r => Number(r.Temperatura_Ambiente) || null),
                    borderColor: "#fb923c", backgroundColor: "rgba(251,146,60,.08)", tension: .3, pointRadius: 2,
                    borderWidth: 2 },
                { label: "Temp. agua °C", data: ultimos.map(r => Number(r.Temperatura_Agua) || null),
                    borderColor: "#2dd4bf", backgroundColor: "rgba(45,212,191,.08)", tension: .3, pointRadius: 2,
                    borderWidth: 2 },
                { label: "Humedad %", data: ultimos.map(r => Number(r.Humedad_Ambiente) || null),
                    borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.08)", tension: .3, pointRadius: 2,
                    borderWidth: 2 },
                { label: "Luz lux", data: ultimos.map(r => Number(r.luz) || null), borderColor: "#facc15",
                    backgroundColor: "rgba(250,204,21,.08)", tension: .3, pointRadius: 2, borderWidth: 2 }
            ];

            const canvas = document.getElementById("grafica");
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (chartInstance) chartInstance.destroy();

            chartInstance = new Chart(ctx, {
                type: "line",
                data: { labels, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: "index", intersect: false },
                    plugins: {
                        legend: {
                            labels: { color: "#94a3b8", boxWidth: 12, padding: 12, font: { size: 11 } }
                        }
                    },
                    scales: {
                        y: { grid: { color: "rgba(255,255,255,.04)" }, ticks: { color: "#64748b", font: { size: 10 } } },
                        x: { grid: { display: false }, ticks: { color: "#64748b", maxTicksLimit: 8, autoSkip: true,
                                font: { size: 9 } } }
                    }
                }
            });
        }

        // =========================================================
        // 20. ESTADO GENERAL
        // =========================================================
        function actualizarEstadoGeneral() {
            const alerta = document.getElementById("alertaBox");

            if (!datosActuales || !registrosHistorial.length) return;

            const cultivo = getCultivoInfo();
            const totalRegistros = registrosHistorial.length;
            const dias = obtenerDiasTranscurridos();
            const etapaActual = getEtapaActual(dias);

            if (isOffline) {
                alerta.className = "alerta-box offline";
                alerta.innerHTML = `
                    <i class="fas fa-microchip"></i>
                    <span>
                        <strong>📡 ESP32 SIN TRANSMITIR DATOS</strong>
                        <span style="color:#94a3b8; display:block; font-size:13px; margin-top:4px;">
                            El sistema sigue funcionando de forma autónoma.
                            <span style="color:#fcd34d; display:inline-block; margin-top:4px; padding:2px 10px; background:rgba(245,158,11,0.15); border-radius:12px;">
                                🤖 MODO AUTÓNOMO ACTIVO
                            </span>
                        </span>
                        <span style="color:#64748b; display:block; font-size:12px; margin-top:4px;">
                            📊 ${totalRegistros} registros históricos | 🌱 ${etapaActual.nombre}
                        </span>
                    </span>
                `;
                actualizarPanelCrecimiento(previewEtapa);
                return;
            }

            let problemas = [];
            let advertencias = [];

            for (const sensor in configuracion) {
                const valor = Number(datosActuales[configuracion[sensor].campo]);
                if (!Number.isFinite(valor)) continue;

                const estado = obtenerEstado(sensor, valor);
                if (estado.estado === "danger") {
                    problemas.push(configuracion[sensor].nombre);
                } else if (estado.estado === "warning") {
                    advertencias.push(configuracion[sensor].nombre);
                }
            }

            let nivel = "success";
            let icono = "✅";
            let mensaje = `${cultivo.nombre} en óptimas condiciones.`;

            if (problemas.length > 0) {
                nivel = "danger";
                icono = "🚨";
                mensaje =
                    `${problemas.length} problema(s) GRAVE: ${problemas.join(", ")}. ¡ACTÚA AHORA!`;
            } else if (advertencias.length > 0) {
                nivel = "loading";
                icono = "⚠️";
                mensaje =
                    `${advertencias.length} aviso(s): ${advertencias.join(", ")}. Presta atención.`;
            }

            alerta.className = `alerta-box ${nivel}`;
            alerta.innerHTML = `
                <i class="fas ${icono === '🚨' ? 'fa-triangle-exclamation' : icono === '⚠️' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
                <span>
                    <strong>${icono} ${mensaje}</strong>
                    📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre} (Día ${dias})
                    ${fechaInicio ? ` | 📅 ${new Date(fechaInicio).toLocaleDateString()}` : ''}
                    ${previewEtapa !== null ? ' | 👁️ VISTA PREVIA' : ''}
                    ${lastUpdateTime ? ` | ⏱️ ${lastUpdateTime.toLocaleTimeString()}` : ''}
                </span>
            `;

            actualizarPanelCrecimiento(previewEtapa);
            actualizarAsistente();
        }

        // =========================================================
        // 21. ASISTENTE
        // =========================================================
        function actualizarAsistente() {
            const container = document.getElementById("consejosContainer");
            const estadoGeneral = document.getElementById("estado-general");

            if (!datosActuales || !registrosHistorial.length) return;

            const cultivo = getCultivoInfo();
            const totalRegistros = registrosHistorial.length;
            const dias = obtenerDiasTranscurridos();
            const etapaActual = getEtapaActual(dias);

            if (isOffline) {
                estadoGeneral.innerHTML = `📡 SIN DATOS | ${totalRegistros} reg.`;
                estadoGeneral.style.color = "#ef4444";
                
                container.innerHTML = `
                    <div class="consejo consejo-offline">
                        <div class="consejo-icono"><i class="fas fa-microchip"></i></div>
                        <div class="consejo-contenido">
                            <h4>📡 ESP32 SIN TRANSMITIR DATOS</h4>
                            <p>
                                El microcontrolador no está enviando datos a Firebase.
                                El sistema aeropónico <strong>sigue funcionando de forma autónoma</strong> en el invernadero.
                            </p>
                            <p style="margin-top: 8px; color: #fcd34d;">
                                <strong>🤖 MODO AUTÓNOMO ACTIVO</strong> - No se requiere intervención.
                            </p>
                            <ul>
                                <li>📊 ${totalRegistros} registros históricos disponibles</li>
                                <li>🌱 ${etapaActual.nombre} (Día ${dias})</li>
                                <li>⏳ Esperando datos del ESP32...</li>
                            </ul>
                            <p style="margin-top: 8px; color: #fca5a5;">
                                🔍 Verifica: conexión WiFi, alimentación y programa del ESP32.
                            </p>
                        </div>
                    </div>
                `;
                return;
            }

            let problemas = [];
            let advertencias = [];

            for (const sensor in configuracion) {
                const valor = Number(datosActuales[configuracion[sensor].campo]);
                if (!Number.isFinite(valor)) continue;

                const analisis = analizarSensor(sensor, valor);
                if (analisis.estado.estado === "danger") {
                    problemas.push({ sensor, analisis });
                } else if (analisis.estado.estado === "warning" || analisis.anomalia) {
                    advertencias.push({ sensor, analisis });
                }
            }

            if (problemas.length) {
                estadoGeneral.innerHTML = `🚨 ${problemas.length} problema(s) | 📊 ${totalRegistros}`;
                estadoGeneral.style.color = "#fca5a5";
            } else if (advertencias.length) {
                estadoGeneral.innerHTML = `⚠️ ${advertencias.length} aviso(s) | 📊 ${totalRegistros}`;
                estadoGeneral.style.color = "#fcd34d";
            } else {
                const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
                estadoGeneral.innerHTML = `✅ OK | 📊 ${totalRegistros} | 🌱 ${porcentaje}%`;
                estadoGeneral.style.color = "#86efac";
            }

            let html = "";

            html += `
                <div class="consejo consejo-info">
                    <div class="consejo-icono"><i class="fas fa-leaf"></i></div>
                    <div class="consejo-contenido">
                        <h4>🌱 ${cultivo.nombre} - ${cultivo.tipo}</h4>
                        <p>${cultivo.descripcion}</p>
                        <p style="margin-top:6px;">📊 ${totalRegistros} registros | 🌱 ${etapaActual.nombre} (Día ${dias})</p>
                        ${fechaInicio ? `<p style="margin-top:4px; color:#94a3b8;">📅 Inicio: ${new Date(fechaInicio).toLocaleDateString()}</p>` : ''}
                        ${previewEtapa !== null ? `<p style="margin-top:4px; color:#fcd34d;">👁️ Vista previa de: ${cultivo.etapas[previewEtapa].nombre}</p>` : ''}
                        ${lastUpdateTime ? `<p style="margin-top:4px; color:#64748b;">⏱️ Última actualización: ${lastUpdateTime.toLocaleTimeString()}</p>` : ''}
                    </div>
                </div>
            `;

            problemas.forEach(item => {
                const c = configuracion[item.sensor];
                const sol = item.analisis.soluciones || { soluciones: [], explicacion: "" };
                html += `
                    <div class="consejo consejo-danger">
                        <div class="consejo-icono"><i class="fas ${c.icono}"></i></div>
                        <div class="consejo-contenido">
                            <h4>🚨 ${c.nombre} - ¡REQUIERE ACCIÓN INMEDIATA!</h4>
                            <p>${item.analisis.significado}</p>
                            ${sol.soluciones && sol.soluciones.length > 0 ? `
                                <p style="margin-top:8px; color:#fcd34d;"><strong>🔧 SOLUCIONES PRÁCTICAS:</strong></p>
                                <ul>
                                    ${sol.soluciones.map(s => `<li class="${s.includes('¡ACTÚA RÁPIDO!') || s.includes('¡URGENTE!') ? 'urgente' : ''}">${s}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                `;
            });

            advertencias.forEach(item => {
                const c = configuracion[item.sensor];
                const sol = item.analisis.soluciones || { soluciones: [], explicacion: "" };
                html += `
                    <div class="consejo consejo-warning">
                        <div class="consejo-icono"><i class="fas ${c.icono}"></i></div>
                        <div class="consejo-contenido">
                            <h4>⚠️ ${c.nombre}</h4>
                            <p>${item.analisis.tendencia.texto}</p>
                            ${sol.soluciones && sol.soluciones.length > 0 ? `
                                <p style="margin-top:8px; color:#fcd34d;"><strong>🔧 Soluciones:</strong></p>
                                <ul>
                                    ${sol.soluciones.slice(0, 4).map(s => `<li>${s}</li>`).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    </div>
                `;
            });

            if (!problemas.length && !advertencias.length) {
                html += `
                    <div class="consejo consejo-ok">
                        <div class="consejo-icono"><i class="fas fa-circle-check"></i></div>
                        <div class="consejo-contenido">
                            <h4>✅ Todo en orden</h4>
                            <p>${cultivo.nombre} está en condiciones óptimas para la etapa ${etapaActual.nombre}.</p>
                            <ul>
                                <li>📊 ${totalRegistros} registros históricos analizados</li>
                                <li>🌱 ${etapaActual.nombre} (Día ${dias})</li>
                                <li>💡 Sigue así para una cosecha exitosa</li>
                            </ul>
                        </div>
                    </div>
                `;
            }

            container.innerHTML = html;
            iniciarChat();
        }

        // =========================================================
        // 22. CHAT
        // =========================================================
        const preguntasChip = [
            { id: "ph", texto: "🔬 pH", icono: "fa-flask" },
            { id: "temp", texto: "🌡️ Temp. ambiente", icono: "fa-temperature-half" },
            { id: "temp-agua", texto: "🌊 Temp. agua", icono: "fa-temperature-three-quarters" },
            { id: "hum", texto: "💧 Humedad", icono: "fa-droplet" },
            { id: "luz", texto: "💡 Luz", icono: "fa-sun" },
            { id: "bomba", texto: "🔌 Bomba", icono: "fa-power-off" },
            { id: "resumen", texto: "📊 Resumen general", icono: "fa-clipboard-list" },
            { id: "cosecha", texto: "🌱 ¿Cuándo cosechar?", icono: "fa-calendar-check" },
            { id: "soluciones", texto: "🔧 Todas las soluciones", icono: "fa-tools" },
            { id: "etapa", texto: "🌿 Etapa actual", icono: "fa-seedling" }
        ];

        function iniciarChat() {
            if (chatIniciado) return;
            chatIniciado = true;

            const cultivo = getCultivoInfo();
            const dias = obtenerDiasTranscurridos();
            const etapaActual = getEtapaActual(dias);

            let mensajeInicial = 
                `🌱 ¡Hola! Soy tu asistente de ${cultivo.nombre}.\n\n` +
                `📅 Día ${dias} - Etapa: ${etapaActual.nombre}\n` +
                `${etapaActual.descripcion}\n\n` +
                `💡 Elige una pregunta o toca un sensor para ver análisis con soluciones adaptadas a tu etapa.\n` +
                `📌 Puedes cambiar de etapa usando los botones arriba (vista previa antes de aplicar).` +
                `\n\n⚠️ Recuerda: Los botones de etapa (Germinación, Plántula, etc.) NO afectan el selector de cultivo.`;

            if (isOffline) {
                mensajeInicial += 
                    `\n\n📡 <strong>ESP32 SIN TRANSMITIR DATOS</strong>\n` +
                    `🤖 El sistema sigue funcionando de forma autónoma. Los datos son los últimos recibidos.\n` +
                    `⏳ Última actualización: ${lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : '--'}`;
            }

            agregarMensaje(mensajeInicial, "bot");
            renderizarChips();
        }

        function renderizarChips() {
            const cont = document.getElementById("chatChips");
            if (!cont) return;

            let hayUrgencia = false;
            if (datosActuales && registrosHistorial.length > 0 && !isOffline) {
                for (const sensor in configuracion) {
                    const valor = Number(datosActuales[configuracion[sensor].campo]);
                    if (Number.isFinite(valor)) {
                        const estado = obtenerEstado(sensor, valor);
                        if (estado.estado === "danger") {
                            hayUrgencia = true;
                            break;
                        }
                    }
                }
            }

            let html = preguntasChip.map(p => `
                <button class="chip ${isOffline ? 'chip-offline' : ''} ${hayUrgencia && (p.id === 'soluciones' || p.id === 'resumen') ? 'chip-urgente' : ''}" onclick="preguntar('${p.id}')" ${isOffline ? 'disabled' : ''}>
                    <i class="fas ${p.icono}"></i> ${p.texto}
                </button>
            `).join("");

            html += `
                <button class="chip chip-reset" onclick="preguntar('reiniciar')">
                    <i class="fas fa-rotate"></i> Reiniciar
                </button>
            `;

            cont.innerHTML = html;
        }

        function agregarMensaje(texto, tipo) {
            const cont = document.getElementById("chatMensajes");
            if (!cont) return;

            const burbuja = document.createElement("div");
            burbuja.className = `chat-bubble ${tipo}`;
            burbuja.innerHTML = texto;
            cont.appendChild(burbuja);
            cont.scrollTop = cont.scrollHeight;
        }

        function generarSolucionesCompletas() {
            const cultivo = getCultivoInfo();
            let mensaje = `🔧 <strong>SOLUCIONES PRÁCTICAS para ${cultivo.nombre}</strong>\n\n`;

            if (isOffline) {
                mensaje += `📡 <strong>ESP32 SIN DATOS</strong> - Mostrando últimos valores conocidos.\n\n`;
            }

            for (const sensor in configuracion) {
                const valor = Number(datosActuales[configuracion[sensor].campo]);
                if (!Number.isFinite(valor)) continue;

                const analisis = analizarSensor(sensor, valor);
                const c = configuracion[sensor];
                const sol = analisis.soluciones || { soluciones: [], explicacion: "" };

                mensaje += `<strong>${c.nombre}:</strong> `;
                if (sensor === 'luz') {
                    mensaje += `${analisis.estado.texto}\n`;
                } else {
                    mensaje += `${formato(valor, sensor)} (${analisis.estado.texto})\n`;
                }
                if (sol.explicacion) {
                    mensaje += `${sol.explicacion}\n`;
                }
                if (sol.soluciones && sol.soluciones.length > 0) {
                    mensaje += `🔹 ${sol.soluciones.join('\n🔹 ')}\n`;
                }
                mensaje += `\n`;
            }

            return mensaje;
        }

        window.preguntar = function(id) {
            if (id === "reiniciar") {
                document.getElementById("chatMensajes").innerHTML = "";
                chatIniciado = false;
                iniciarChat();
                return;
            }

            if (!datosActuales || !registrosHistorial.length) {
                const p = preguntasChip.find(x => x.id === id);
                if (p) agregarMensaje(p.texto, "user");
                agregarMensaje("⏳ Esperando datos... inténtalo en unos segundos.", "bot");
                return;
            }

            const cultivo = getCultivoInfo();
            const dias = obtenerDiasTranscurridos();
            const etapaActual = getEtapaActual(dias);

            // Manejar preguntas offline
            if (isOffline) {
                if (id === "resumen") {
                    agregarMensaje("📊 Dame un resumen general", "user");
                    let mensaje = 
                        `📊 <strong>RESUMEN de ${cultivo.nombre} (MODO AUTÓNOMO)</strong>\n\n` +
                        `📡 <strong>ESP32 SIN TRANSMITIR DATOS</strong>\n` +
                        `📈 ${registrosHistorial.length} registros históricos\n` +
                        `🌱 ${etapaActual.nombre} (Día ${dias})\n\n` +
                        `🤖 El sistema sigue funcionando de forma autónoma en el invernadero.\n` +
                        `💡 Los datos mostrados son los últimos recibidos.\n\n` +
                        `📊 <strong>Últimos valores:</strong>\n`;
                    for (const sensor in configuracion) {
                        const valor = Number(datosActuales[configuracion[sensor].campo]);
                        if (!Number.isFinite(valor)) continue;
                        const analisis = analizarSensor(sensor, valor);
                        if (sensor === 'luz') {
                            mensaje += `${configuracion[sensor].nombre}: ${analisis.estado.texto}\n`;
                        } else {
                            mensaje += `${configuracion[sensor].nombre}: ${formato(valor, sensor)} (${analisis.estado.texto})\n`;
                        }
                    }
                    mensaje += `\n⏱️ Última actualización: ${lastUpdateTime ? lastUpdateTime.toLocaleTimeString() : '--'}`;
                    agregarMensaje(mensaje, "bot");
                    return;
                }

                if (id === "cosecha") {
                    agregarMensaje("🌱 ¿Cuándo estará listo?", "user");
                    const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
                    let mensaje = `🌱 <strong>Análisis de COSECHA para ${cultivo.nombre}</strong>\n\n`;
                    mensaje += `📅 ${dias} días desde el inicio\n`;
                    mensaje += `📈 ${porcentaje}% del ciclo completado\n`;
                    mensaje += `🌿 Etapa actual: ${etapaActual.nombre}\n\n`;
                    mensaje += `📡 Modo autónomo activo.\n`;
                    if (porcentaje >= 100) {
                        mensaje += `✅ ¡LISTO PARA COSECHAR!`;
                    } else if (porcentaje > 80) {
                        mensaje += `🔜 Casi listo para cosechar.`;
                    } else {
                        mensaje += `🌱 Sigue cuidando las plantas.`;
                    }
                    agregarMensaje(mensaje, "bot");
                    return;
                }

                if (id === "soluciones") {
                    agregarMensaje("🔧 Dame todas las soluciones", "user");
                    let mensaje = `🔧 <strong>SOLUCIONES (MODO AUTÓNOMO)</strong>\n\n📡 ESP32 sin datos en tiempo real.\n\n`;
                    mensaje += generarSolucionesCompletas();
                    agregarMensaje(mensaje, "bot");
                    return;
                }

                const c = configuracion[id];
                if (c) {
                    const p = preguntasChip.find(x => x.id === id);
                    if (p) agregarMensaje(p.texto, "user");
                    const valor = Number(datosActuales[c.campo]);
                    if (!Number.isFinite(valor)) {
                        agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot");
                        return;
                    }
                    const analisis = analizarSensor(id, valor);
                    let mensaje = `📡 <strong>MODO AUTÓNOMO</strong>\n\n`;
                    mensaje += `<strong>${c.nombre}:</strong> `;
                    if (id === 'luz') {
                        mensaje += `${analisis.estado.texto}\n\n`;
                    } else {
                        mensaje += `${formato(valor, id)} (${analisis.estado.texto})\n\n`;
                    }
                    mensaje += `📊 Último valor registrado: ${formato(valor, id)}\n`;
                    mensaje += `📡 ESP32 no está transmitiendo datos nuevos.\n`;
                    mensaje += `🤖 El sistema sigue funcionando de forma autónoma.`;
                    agregarMensaje(mensaje, "bot");
                    return;
                }

                if (id === "bomba") {
                    agregarMensaje("🔌 ¿Cómo está la bomba?", "user");
                    const valor = datosActuales.bomba === true || datosActuales.bomba === "true";
                    let mensaje = `📡 <strong>MODO AUTÓNOMO</strong>\n\n`;
                    mensaje += valor ? 
                        "✅ La bomba está ENCENDIDA (último estado conocido)." :
                        "⏸️ La bomba está APAGADA (último estado conocido).";
                    mensaje += "\n\n🤖 El sistema sigue su ciclo programado.";
                    agregarMensaje(mensaje, "bot");
                    return;
                }

                if (id === "etapa") {
                    agregarMensaje("🌿 ¿En qué etapa estoy?", "user");
                    let mensaje = `🌿 <strong>Etapa actual de ${cultivo.nombre}</strong>\n\n`;
                    mensaje += `📅 Día ${dias}\n`;
                    mensaje += `🌱 ${etapaActual.nombre}\n`;
                    mensaje += `${etapaActual.descripcion}\n\n`;
                    mensaje += `📡 Modo autónomo activo.\n\n`;
                    mensaje += `📋 <strong>Todas las etapas:</strong>\n`;
                    cultivo.etapas.forEach(e => {
                        const esActual = e.nombre === etapaActual.nombre;
                        mensaje += `${esActual ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`;
                    });
                    agregarMensaje(mensaje, "bot");
                    return;
                }

                agregarMensaje("📡 El sistema está en MODO AUTÓNOMO. No hay conexión en tiempo real.", "bot");
                return;
            }

            // ===== MODO NORMAL (con conexión) =====
            if (id === "resumen") {
                agregarMensaje("📊 Dame un resumen general", "user");
                const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
                let mensaje =
                `📊 <strong>RESUMEN de ${cultivo.nombre}</strong>\n\n📈 ${registrosHistorial.length} registros históricos\n🌱 ${etapaActual.nombre} (Día ${dias})\n📈 ${porcentaje}% completado\n\n`;
                for (const sensor in configuracion) {
                    const valor = Number(datosActuales[configuracion[sensor].campo]);
                    if (!Number.isFinite(valor)) continue;
                    const analisis = analizarSensor(sensor, valor);
                    if (sensor === 'luz') {
                        mensaje += `${configuracion[sensor].nombre}: ${analisis.estado.texto}\n`;
                    } else {
                        mensaje += `${configuracion[sensor].nombre}: ${formato(valor, sensor)} (${analisis.estado.texto})\n`;
                    }
                }
                mensaje += `\n💡 Los rangos se ajustan automáticamente según tu etapa.`;
                agregarMensaje(mensaje, "bot");
                return;
            }

            if (id === "cosecha") {
                agregarMensaje("🌱 ¿Cuándo estará listo?", "user");
                const porcentaje = Math.min(100, Math.round((dias / cultivo.ciclo.promedio) * 100));
                let mensaje = `🌱 <strong>Análisis de COSECHA para ${cultivo.nombre}</strong>\n\n`;
                mensaje += `📅 ${dias} días desde el inicio\n`;
                mensaje += `📈 ${porcentaje}% del ciclo completado\n`;
                mensaje += `🌿 Etapa actual: ${etapaActual.nombre}\n\n`;
                if (porcentaje >= 100) {
                    mensaje += `✅ ¡LISTO PARA COSECHAR!`;
                } else if (porcentaje > 80) {
                    mensaje += `🔜 Casi listo para cosechar.`;
                } else {
                    mensaje += `🌱 Sigue cuidando las plantas.`;
                }
                agregarMensaje(mensaje, "bot");
                return;
            }

            if (id === "etapa") {
                agregarMensaje("🌿 ¿En qué etapa estoy?", "user");
                let mensaje = `🌿 <strong>Etapa actual de ${cultivo.nombre}</strong>\n\n`;
                mensaje += `📅 Día ${dias}\n`;
                mensaje += `🌱 ${etapaActual.nombre}\n`;
                mensaje += `${etapaActual.descripcion}\n\n`;
                mensaje += `📋 <strong>Todas las etapas:</strong>\n`;
                cultivo.etapas.forEach(e => {
                    const esActual = e.nombre === etapaActual.nombre;
                    mensaje += `${esActual ? '👉' : '  '} Día ${e.dia}: ${e.nombre}\n`;
                });
                mensaje += `\n💡 Puedes cambiar de etapa usando los botones en el panel de progreso.`;
                agregarMensaje(mensaje, "bot");
                return;
            }

            if (id === "soluciones") {
                agregarMensaje("🔧 Dame todas las soluciones", "user");
                agregarMensaje(generarSolucionesCompletas(), "bot");
                return;
            }

            if (id === "bomba") {
                agregarMensaje("🔌 ¿Cómo está la bomba?", "user");
                const valor = datosActuales.bomba === true || datosActuales.bomba === "true";
                let mensaje = valor ?
                    "✅ La bomba está ENCENDIDA. El sistema está pulverizando solución nutritiva." :
                    "⏸️ La bomba está APAGADA. Esperando el próximo ciclo.";
                agregarMensaje(mensaje, "bot");
                return;
            }

            const c = configuracion[id];
            if (!c) {
                agregarMensaje("❓ No entendí la pregunta. Elige una de las opciones.", "bot");
                return;
            }

            const p = preguntasChip.find(x => x.id === id);
            const valor = Number(datosActuales[c.campo]);

            if (p) agregarMensaje(p.texto, "user");

            if (!Number.isFinite(valor)) {
                agregarMensaje(`⏳ No tengo lectura de ${c.nombre}.`, "bot");
                return;
            }

            const analisis = analizarSensor(id, valor);
            const sol = analisis.soluciones || { soluciones: [], explicacion: "" };

            let mensaje = `<strong>${c.nombre}:</strong> `;
            if (id === 'luz') {
                mensaje += `${analisis.estado.texto}\n\n`;
            } else {
                mensaje += `${formato(valor, id)} (${analisis.estado.texto})\n\n`;
            }
            mensaje += analisis.significado + "\n\n";

            if (sol.soluciones && sol.soluciones.length > 0) {
                mensaje += `🔧 <strong>SOLUCIONES PRÁCTICAS:</strong>\n`;
                mensaje += sol.soluciones.map(s => `• ${s}`).join('\n');
            } else {
                mensaje += `✅ Todo en orden. Sigue así.`;
            }

            agregarMensaje(mensaje, "bot");
        };

        // =========================================================
        // 23. SELECTOR DE CULTIVO - NO SE TOCA, SOLO CAMBIA EL CULTIVO
        // =========================================================
        document.getElementById('selectorCultivo').addEventListener('change', function() {
            cultivoSeleccionado = this.value;
            
            // NO ESCRIBE EN FIREBASE, SOLO CAMBIA EL CULTIVO LOCALMENTE
            
            document.getElementById("chatMensajes").innerHTML = "";
            chatIniciado = false;
            previewEtapa = null;
            cancelarPreview();

            if (datosActuales) {
                for (const sensor in configuracion) {
                    const valor = Number(datosActuales[configuracion[sensor].campo]);
                    actualizarTarjeta(sensor, valor);
                }
                actualizarTarjetaBomba(datosActuales.bomba);
                actualizarEstadoGeneral();
                if (sensorAbierto) actualizarDetalle(sensorAbierto);
            }

            iniciarChat();
        });

        // =========================================================
        // 24. FECHA DE SIEMBRA
        // =========================================================
        const fechaPanel = document.getElementById('fechaSiembraPanel');
        const fechaGuardada = localStorage.getItem('fechaSiembra');

        if (fechaGuardada) {
            fechaPanel.value = fechaGuardada;
            fechaInicio = fechaGuardada;
        } else {
            const hoy = new Date();
            const fechaStr = hoy.toISOString().split('T')[0];
            fechaPanel.value = fechaStr;
            fechaInicio = fechaStr;
            localStorage.setItem('fechaSiembra', fechaStr);
        }

        fechaPanel.addEventListener('change', function() {
            if (isOffline) return;
            fechaInicio = this.value;
            localStorage.setItem('fechaSiembra', this.value);
            previewEtapa = null;
            cancelarPreview();
            actualizarEstadoGeneral();
            if (datosActuales) {
                for (const sensor in configuracion) {
                    const valor = Number(datosActuales[configuracion[sensor].campo]);
                    actualizarTarjeta(sensor, valor);
                }
            }
            if (chatIniciado) {
                agregarMensaje(`📅 Fecha de inicio actualizada: ${new Date(fechaInicio).toLocaleDateString()}`, "bot");
            }
        });

        document.getElementById('btnHoy').addEventListener('click', function() {
            if (isOffline) return;
            const hoy = new Date();
            const fechaStr = hoy.toISOString().split('T')[0];
            fechaPanel.value = fechaStr;
            fechaInicio = fechaStr;
            localStorage.setItem('fechaSiembra', fechaStr);
            previewEtapa = null;
            cancelarPreview();
            actualizarEstadoGeneral();
            if (datosActuales) {
                for (const sensor in configuracion) {
                    const valor = Number(datosActuales[configuracion[sensor].campo]);
                    actualizarTarjeta(sensor, valor);
                }
            }
            if (chatIniciado) {
                agregarMensaje(`📅 Inicio cambiado a HOY`, "bot");
            }
        });

        document.getElementById('btnSemana').addEventListener('click', function() {
            if (isOffline) return;
            const hoy = new Date();
            hoy.setDate(hoy.getDate() - 7);
            const fechaStr = hoy.toISOString().split('T')[0];
            fechaPanel.value = fechaStr;
            fechaInicio = fechaStr;
            localStorage.setItem('fechaSiembra', fechaStr);
            previewEtapa = null;
            cancelarPreview();
            actualizarEstadoGeneral();
            if (datosActuales) {
                for (const sensor in configuracion) {
                    const valor = Number(datosActuales[configuracion[sensor].campo]);
                    actualizarTarjeta(sensor, valor);
                }
            }
            if (chatIniciado) {
                agregarMensaje(`📅 Inicio cambiado a -7 días`, "bot");
            }
        });

        // =========================================================
        // 25. BOTONES DE ACCIÓN
        // =========================================================
        document.getElementById('btnAplicar').addEventListener('click', aplicarPreview);
        document.getElementById('btnCancelar').addEventListener('click', cancelarPreview);
        document.getElementById('btnDia0').addEventListener('click', dia0);


        // =========================================================
        // 26. GUÍA INTERACTIVA DE PRIMER USO
        // =========================================================
        const guiaPasos = [
            {
                titulo: "Bienvenido al Dashboard",
                texto: "Esta guía te enseña rápidamente cómo utilizar los controles principales del sistema. Puedes volver a verla cuando quieras pulsando el botón «Guía».",
                icono: "fa-seedling",
                objetivo: null,
                lista: [
                    ["fa-circle-info", "La guía no modifica ninguna configuración."],
                    ["fa-hand-pointer", "Pulsa «Siguiente» para conocer cada control."],
                    ["fa-xmark", "Puedes cerrar la guía en cualquier momento."]
                ]
            },
            {
                titulo: "Selecciona el cultivo",
                texto: "Usa este selector para elegir qué cultivo quieres consultar. Al cambiarlo, el dashboard adapta los rangos y recomendaciones mostrados.",
                icono: "fa-leaf",
                objetivo: "selectorCultivo",
                lista: [
                    ["fa-list", "Elige entre lechuga, fresa, tomate, cilantro, albahaca o espinaca."],
                    ["fa-circle-info", "El cambio del selector es local y no cambia por sí solo la etapa del cultivo en Firebase."]
                ]
            },
            {
                titulo: "Progreso del cultivo",
                texto: "Aquí puedes ver el día actual, la etapa en la que se encuentra el cultivo y el porcentaje aproximado de avance del ciclo.",
                icono: "fa-chart-simple",
                objetivo: "panelCrecimiento",
                lista: [
                    ["fa-calendar-day", "La fecha de inicio determina el día del cultivo."],
                    ["fa-seedling", "Las etapas cambian según los días definidos para cada cultivo."],
                    ["fa-chart-line", "La barra muestra el progreso estimado del ciclo."]
                ]
            },
            {
                titulo: "Botones de etapa",
                texto: "Estos botones permiten seleccionar una etapa para PREVISUALIZAR cómo quedaría el cultivo. Todavía no aplican el cambio.",
                icono: "fa-list-check",
                objetivo: "selectorEtapas",
                lista: [
                    ["fa-eye", "Al tocar una etapa, esta aparece como vista previa."],
                    ["fa-clock", "Se mostrará un aviso indicando el cambio pendiente."],
                    ["fa-triangle-exclamation", "Mientras sea una vista previa, todavía no se guarda el cambio."]
                ]
            },
            {
                titulo: "Aplicar o cancelar",
                texto: "Después de seleccionar una etapa, aparecen dos acciones. «Aplicar cambio» confirma la nueva etapa; «Cancelar» elimina la vista previa.",
                icono: "fa-check-double",
                objetivo: "panel-acciones",
                lista: [
                    ["fa-check", "APLICAR CAMBIO: confirma la etapa y actualiza la configuración correspondiente."],
                    ["fa-xmark", "CANCELAR: vuelve a la etapa actual sin aplicar la previsualización."],
                    ["fa-circle-info", "Si no hay una vista previa, ambos botones permanecen desactivados."]
                ]
            },
            {
                titulo: "Día 0 — Reiniciar cultivo",
                texto: "Este botón reinicia el conteo del cultivo al Día 0, es decir, vuelve a tomar la fecha actual como inicio.",
                icono: "fa-rotate-left",
                objetivo: "btnDia0",
                lista: [
                    ["fa-triangle-exclamation", "El sistema te pedirá confirmación antes de reiniciar."],
                    ["fa-calendar-day", "La fecha de inicio pasa a ser hoy."],
                    ["fa-seedling", "El progreso vuelve a comenzar desde Germinación."]
                ]
            },
            {
                titulo: "Fecha de inicio",
                texto: "También puedes establecer manualmente desde qué fecha comenzó el cultivo. Esto recalcula automáticamente el día y la etapa.",
                icono: "fa-calendar-days",
                objetivo: "panel-fecha-input",
                lista: [
                    ["fa-calendar-check", "HOY: establece la fecha actual como inicio."],
                    ["fa-clock", "-7 DÍAS: coloca como inicio una semana atrás."],
                    ["fa-keyboard", "También puedes seleccionar una fecha directamente."]
                ]
            },
            {
                titulo: "Sensores",
                texto: "Toca cualquier tarjeta de sensor para abrir un análisis detallado. Allí encontrarás el valor actual, rango recomendado, tendencia y soluciones prácticas.",
                icono: "fa-microchip",
                objetivo: "sensores",
                lista: [
                    ["fa-flask", "pH"],
                    ["fa-temperature-half", "Temperatura ambiente y del agua"],
                    ["fa-droplet", "Humedad"],
                    ["fa-sun", "Luz"],
                    ["fa-power-off", "Estado de la bomba"]
                ]
            },
            {
                titulo: "Gráfica e historial",
                texto: "Estas secciones sirven para revisar cómo han cambiado los sensores con el tiempo y consultar las mediciones almacenadas.",
                icono: "fa-chart-line",
                objetivo: "grafica-contenido",
                lista: [
                    ["fa-chart-line", "Evolución de los sensores: muestra las tendencias."],
                    ["fa-clock-rotate-left", "Historial: muestra los registros recibidos."],
                    ["fa-chevron-down", "Toca el encabezado de cada sección para contraerla o abrirla."]
                ]
            },
            {
                titulo: "Asistente del sistema",
                texto: "El asistente analiza los valores y te ofrece recomendaciones. También puedes tocar las preguntas rápidas para consultar un sensor o pedir un resumen.",
                icono: "fa-robot",
                objetivo: "ayuda-contenido",
                lista: [
                    ["fa-comments", "Usa las preguntas rápidas del asistente."],
                    ["fa-wrench", "«Todas las soluciones» reúne las acciones recomendadas."],
                    ["fa-rotate", "«Reiniciar» reinicia la conversación del asistente, no el cultivo."]
                ]
            },
            {
                titulo: "¡Listo!",
                texto: "Ya conoces los controles principales. Ahora puedes utilizar el dashboard con tranquilidad. Si necesitas volver a ver esta explicación, pulsa «Guía» en la parte superior.",
                icono: "fa-circle-check",
                objetivo: null,
                lista: [
                    ["fa-seedling", "Selecciona tu cultivo."],
                    ["fa-calendar", "Comprueba la fecha y etapa."],
                    ["fa-microchip", "Revisa los sensores."],
                    ["fa-robot", "Consulta al asistente cuando necesites ayuda."]
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
            const card = document.getElementById("guiaCard");
            overlay.classList.remove("visible");
            spotlight.classList.remove("visible");
            if (card) card.classList.remove("visible");
            actualizarBlurGuia(null);
            document.body.classList.remove("guia-activa");
            localStorage.setItem("guiaAeroponiaVista", "1");
        }

        // La tarjeta de la guía queda en una posición FIJA (no salta según
        // el botón que se está resaltando). En escritorio se centra en la
        // pantalla; en móvil se ancla abajo como una hoja fija, siempre
        // visible y fácil de leer. Solo el "spotlight" (resplandor) se
        // mueve para señalar el elemento correspondiente.
        function posicionarGuiaCard() {
            const card = document.getElementById("guiaCard");
            if (!card) return;

            const margin = 16;
            const esMovil = window.innerWidth <= 640;
            const ancho = Math.min(520, window.innerWidth - margin * 2);

            card.style.width = `${ancho}px`;
            card.style.left = `${(window.innerWidth - ancho) / 2}px`;

            if (esMovil) {
                card.style.top = "auto";
                card.style.bottom = `${margin}px`;
                card.style.maxHeight = `${Math.min(window.innerHeight * 0.72, 560)}px`;
            } else {
                const alto = Math.min(card.offsetHeight || 430, window.innerHeight - margin * 2);
                card.style.bottom = "auto";
                card.style.top = `${Math.max(margin, (window.innerHeight - alto) / 2)}px`;
            }
        }

        function mostrarPasoGuia(indice) {
            guiaIndice = Math.max(0, Math.min(indice, guiaPasos.length - 1));

            const paso = guiaPasos[guiaIndice];
            const overlay = document.getElementById("guiaOverlay");
            const spotlight = document.getElementById("guiaSpotlight");
            const card = document.getElementById("guiaCard");
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
            card.classList.add("visible");
            document.body.classList.add("guia-activa");
            actualizarBlurGuia(null);
            posicionarGuiaCard();

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
                    }, 180);
                } else {
                    spotlight.classList.remove("visible");
                    actualizarBlurGuia(null);
                }
            });
        }

        function abrirGuia(desdeInicio = false) {
            guiaActiva = true;
            mostrarPasoGuia(desdeInicio ? 0 : 0);
        }

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

        // =========================================================
        // 27. SECCIONES CONTRAÍBLES
        // =========================================================
        window.toggleSeccion = function(id) {
            const contenido = document.getElementById(id);
            const flecha = document.getElementById(`flecha-${id}`);
            if (!contenido) return;

            const oculto = contenido.classList.toggle("oculto");
            if (flecha) {
                flecha.style.transform = oculto ? "rotate(-90deg)" : "rotate(0deg)";
            }
        };

        // =========================================================
        // 27. INICIALIZACIÓN
        // =========================================================
        reiniciarTimeout();

        setTimeout(() => {
            actualizarPanelCrecimiento(null);

            if (!localStorage.getItem("guiaAeroponiaVista")) {
                setTimeout(() => abrirGuia(true), 650);
            }
        }, 100);

        console.log("🚀 Dashboard Aeroponia UTS - Versión corregida");
        console.log("✅ Los botones de etapa NO afectan el selector de cultivo");
        console.log("✅ El selector de cultivo solo cambia el cultivo localmente");
        console.log(`🌱 Cultivo: ${getCultivoInfo().nombre}`);
        console.log(`📅 Día ${obtenerDiasTranscurridos()}`);