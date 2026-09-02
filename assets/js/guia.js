    /* =========================================================
       GUÍA INTERACTIVA - CONTROL INDEPENDIENTE
       Este bloque funciona aunque el módulo principal tenga un error.
    ========================================================= */
    (function () {
        function iniciarGuia() {
            const overlay = document.getElementById('guiaOverlay');
            const spotlight = document.getElementById('guiaSpotlight');
            const card = document.getElementById('guiaCard');
            const titulo = document.getElementById('guiaTitulo');
            const texto = document.getElementById('guiaTexto');
            const lista = document.getElementById('guiaLista');
            const paso = document.getElementById('guiaPaso');
            const progreso = document.getElementById('guiaProgreso');
            const anterior = document.getElementById('guiaAnterior');
            const siguiente = document.getElementById('guiaSiguiente');
            const cerrar = document.getElementById('guiaCerrar');
            const botonGuia = document.getElementById('btnGuia');

            if (!overlay || !card || !botonGuia || !siguiente || !cerrar) {
                console.error('Guía: faltan elementos HTML.');
                return;
            }

            const pasos = [
                { titulo:'Bienvenido al sistema', texto:'Esta guía te enseñará a utilizar los controles principales del dashboard de aeroponía.', objetivo:null, items:[['fa-seedling','Vamos a recorrer la pantalla paso a paso.'],['fa-arrow-right','Pulsa Siguiente para continuar.']] },
                { titulo:'1. Selecciona el cultivo', texto:'Aquí eliges qué cultivo estás monitoreando. Al cambiarlo, el sistema utiliza sus rangos y etapas correspondientes.', objetivo:'selectorCultivo', items:[['fa-seedling','Selecciona Lechuga, Tomate, Cilantro, Albahaca o Espinaca.'],['fa-circle-info','El cultivo seleccionado sirve como referencia para el análisis.']] },
                { titulo:'2. Revisa el progreso', texto:'En esta zona puedes ver el día actual del cultivo, la etapa en la que se encuentra y el progreso hacia la siguiente etapa.', objetivo:'panelCrecimiento', items:[['fa-calendar-day','Muestra el día transcurrido.'],['fa-leaf','Muestra la etapa actual.']] },
                { titulo:'3. Botones de etapa', texto:'Puedes seleccionar una etapa para previsualizar cómo quedarían los parámetros de esa etapa.', objetivo:'selectorEtapas', items:[['fa-hand-pointer','Pulsa una etapa para previsualizarla.'],['fa-eye','La selección todavía no se aplica automáticamente.']] },
                { titulo:'4. Aplicar o cancelar', texto:'Después de seleccionar una etapa, utiliza estos botones para confirmar o descartar la vista previa.', objetivo:'panel-acciones', items:[['fa-check','APLICAR CAMBIO confirma la etapa.'],['fa-xmark','CANCELAR descarta la vista previa.']] },
                { titulo:'5. Día 0', texto:'Este botón reinicia el cultivo al Día 0 y toma la fecha actual como fecha de inicio.', objetivo:'btnDia0', items:[['fa-rotate-left','Reinicia el conteo del cultivo.'],['fa-triangle-exclamation','Te pedirá confirmación antes de hacerlo.']] },
                { titulo:'6. Fecha de inicio', texto:'También puedes cambiar manualmente la fecha desde la que comenzó el cultivo. Esto recalcula el día y la etapa.', objetivo:'panel-fecha-input', items:[['fa-calendar-day','HOY establece la fecha actual.'],['fa-clock','-7 DÍAS coloca el inicio una semana atrás.'],['fa-calendar','También puedes escoger una fecha manualmente.']] },
                { titulo:'7. Sensores', texto:'Las tarjetas muestran el estado de los sensores. Puedes tocar una tarjeta para abrir su análisis detallado.', objetivo:'sensores', items:[['fa-flask','pH'],['fa-temperature-half','Temperatura ambiente y del agua'],['fa-droplet','Humedad'],['fa-sun','Luz'],['fa-power-off','Bomba']] },
                { titulo:'8. Gráfica e historial', texto:'Aquí puedes consultar la evolución de las mediciones y revisar los registros almacenados.', objetivo:'grafica-contenido', items:[['fa-chart-line','La gráfica muestra la evolución.'],['fa-clock-rotate-left','El historial muestra registros recibidos.']] },
                { titulo:'9. Asistente', texto:'El asistente te ayuda a interpretar los sensores y proporciona recomendaciones prácticas.', objetivo:'ayuda-contenido', items:[['fa-robot','Consulta recomendaciones.'],['fa-comments','Puedes usar las preguntas rápidas.'],['fa-wrench','También puedes consultar las soluciones.']] },
                { titulo:'¡Listo!', texto:'Ya conoces los controles principales. Puedes volver a abrir esta guía en cualquier momento pulsando el botón Guía.', objetivo:null, items:[['fa-seedling','Selecciona tu cultivo.'],['fa-microchip','Revisa los sensores.'],['fa-robot','Consulta al asistente cuando necesites ayuda.']] }
            ];

            let indice = 0;
            let activa = false;

            function limpiar() {
                document.querySelectorAll('.guia-target').forEach(e => e.classList.remove('guia-target'));
                spotlight.classList.remove('visible');
            }

            function colocar() {
                const objetivoId = pasos[indice].objetivo;
                limpiar();
                if (!objetivoId) {
                    card.style.left = Math.max(16, (window.innerWidth - card.offsetWidth) / 2) + 'px';
                    card.style.top = Math.max(16, (window.innerHeight - card.offsetHeight) / 2) + 'px';
                    return;
                }
                let objetivo = document.getElementById(objetivoId);
                if (!objetivo && objetivoId === 'panel-acciones') objetivo = document.querySelector('.panel-acciones');
                if (!objetivo && objetivoId === 'panel-fecha-input') objetivo = document.querySelector('.panel-fecha-input');
                if (!objetivo && objetivoId === 'sensores') objetivo = document.querySelector('#sensores');
                if (!objetivo) {
                    card.style.left = Math.max(16, (window.innerWidth - card.offsetWidth) / 2) + 'px';
                    card.style.top = Math.max(16, (window.innerHeight - card.offsetHeight) / 2) + 'px';
                    return;
                }
                objetivo.classList.add('guia-target');
                objetivo.scrollIntoView({behavior:'smooth', block:'center'});
                setTimeout(() => {
                    const r = objetivo.getBoundingClientRect();
                    const pad = 8;
                    spotlight.style.left = Math.max(0, r.left-pad) + 'px';
                    spotlight.style.top = Math.max(0, r.top-pad) + 'px';
                    spotlight.style.width = Math.min(window.innerWidth, r.width+pad*2) + 'px';
                    spotlight.style.height = Math.min(window.innerHeight, r.height+pad*2) + 'px';
                    spotlight.classList.add('visible');
                    const ancho = Math.min(520, window.innerWidth-32);
                    card.style.width = ancho + 'px';
                    let left = r.left;
                    let top = r.bottom + 18;
                    if (top + card.offsetHeight > window.innerHeight-16) top = r.top-card.offsetHeight-18;
                    if (top < 16) top = 16;
                    if (left + ancho > window.innerWidth-16) left = window.innerWidth-ancho-16;
                    if (left < 16) left = 16;
                    card.style.left = left + 'px';
                    card.style.top = top + 'px';
                }, 250);
            }

            function mostrar(i) {
                indice = Math.max(0, Math.min(i, pasos.length-1));
                const p = pasos[indice];
                paso.textContent = indice === 0 ? 'BIENVENIDO' : (indice === pasos.length-1 ? 'FINAL' : 'PASO '+indice+' DE '+(pasos.length-2));
                titulo.textContent = p.titulo;
                texto.textContent = p.texto;
                lista.innerHTML = p.items.map(x => `<div class="guia-item"><i class="fas ${x[0]}"></i><span>${x[1]}</span></div>`).join('');
                progreso.innerHTML = pasos.map((_,i) => `<span class="guia-dot ${i===indice?'activo':''}"></span>`).join('');
                anterior.style.display = indice > 0 ? 'inline-flex' : 'none';
                siguiente.innerHTML = indice === pasos.length-1 ? 'Terminar <i class="fas fa-check"></i>' : (indice===0 ? 'Comenzar <i class="fas fa-arrow-right"></i>' : 'Siguiente <i class="fas fa-arrow-right"></i>');
                overlay.classList.add('visible');
                document.body.classList.add('guia-activa');
                activa = true;
                requestAnimationFrame(colocar);
            }

            function abrir() { mostrar(0); }
            function cerrarGuiaReal() { activa=false; limpiar(); overlay.classList.remove('visible'); document.body.classList.remove('guia-activa'); }

            botonGuia.onclick = function(e) { e.preventDefault(); e.stopPropagation(); abrir(); };
            cerrar.onclick = function(e) { e.preventDefault(); e.stopPropagation(); cerrarGuiaReal(); };
            anterior.onclick = function(e) { e.preventDefault(); if(indice>0) mostrar(indice-1); };
            siguiente.onclick = function(e) { e.preventDefault(); if(indice>=pasos.length-1) cerrarGuiaReal(); else mostrar(indice+1); };
            overlay.onclick = function(e) { if(e.target === overlay) cerrarGuiaReal(); };
            window.addEventListener('resize', () => { if(activa) colocar(); });

            window.abrirGuia = abrir;
            window.cerrarGuia = cerrarGuiaReal;

            if (!localStorage.getItem('guiaAeroponiaVista')) {
                setTimeout(abrir, 900);
                localStorage.setItem('guiaAeroponiaVista','1');
            }
        }

        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarGuia);
        else iniciarGuia();
    })();
