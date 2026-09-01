// ============================================================
// GRÁFICA CON CHART.JS
// ============================================================

import { getRegistrosHistorial } from './utils.js';

let chartInstance = null;

export function actualizarGrafica() {
    const registros = getRegistrosHistorial();
    const ultimos = registros.slice(-40);

    if (!ultimos.length) {
        const canvas = document.getElementById("grafica");
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        }
        return;
    }

    const labels = ultimos.map(r => r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : "");

    const datasets = [
        { label: "pH", data: ultimos.map(r => Number(r.PH) || null), borderColor: "#a78bfa",
            backgroundColor: "rgba(167,139,250,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Temp. ambiente °C", data: ultimos.map(r => Number(r.Temperatura_Ambiente) || null),
            borderColor: "#fb923c", backgroundColor: "rgba(251,146,60,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Temp. agua °C", data: ultimos.map(r => Number(r.Temperatura_Agua) || null),
            borderColor: "#2dd4bf", backgroundColor: "rgba(45,212,191,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
        { label: "Humedad %", data: ultimos.map(r => Number(r.Humedad_Ambiente) || null),
            borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,.08)", tension: .3, pointRadius: 2, borderWidth: 2 },
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

export function destroyGrafica() {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
}