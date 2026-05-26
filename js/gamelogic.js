function ejecutarDisparo(escena, colT, rowT, colA, rowA, esJugador) {
    console.log("DISPARO");
    window.ejecutandoTiro = true;
    escena.tweens.killTweensOf(window.barraTiempo);
    
    colT = Math.max(0, Math.min(4, colT));
    rowT = Math.max(0, Math.min(2, rowT));
    colA = Math.max(0, Math.min(4, colA));
    rowA = Math.max(0, Math.min(2, rowA));

    const cfg = window.arcoConfig;
    let xT = cfg.x + (colT * cfg.anchoCelda) + (cfg.anchoCelda / 2);
    let yT = cfg.y + (rowT * cfg.altoCelda) + (cfg.altoCelda / 2);
    let xA = cfg.x + (colA * cfg.anchoCelda) + (cfg.anchoCelda / 2);
    let yA = cfg.y + (rowA * cfg.altoCelda) + (cfg.altoCelda / 2);
    
    let rng = Math.random();
    let tipoResultado = "NORMAL"; 
    let celdaTiro = (rowT * 5) + colT;
let esAtajado = false;

if (colA === 2) {
    if (celdaTiro === 2 || celdaTiro === 7 || celdaTiro === 12) {
        esAtajado = true;
    }
}
else if (rowA === 0 && colA < 2) {
    if (celdaTiro === 0 || celdaTiro === 1 || celdaTiro === 6) {
        esAtajado = true;
    }
}
else if (rowA === 1 && colA < 2) {
    if (celdaTiro === 5 || celdaTiro === 6) {
        esAtajado = true;
    }
}
else if (rowA === 2 && colA < 2) {
    if (celdaTiro === 5 || celdaTiro === 10 || celdaTiro === 11) {
        esAtajado = true;
    }
}
else if (rowA === 0 && colA > 2) {
    if (celdaTiro === 3 || celdaTiro === 4 || celdaTiro === 8) {
        esAtajado = true;
    }
}
else if (rowA === 1 && colA > 2) {
    if (celdaTiro === 8 || celdaTiro === 9) {
        esAtajado = true;
    }
}
else if (rowA === 2 && colA > 2) {
    if (celdaTiro === 9 || celdaTiro === 13 || celdaTiro === 14) {
        esAtajado = true;
    }
}

if (colT === colA && rowT === rowA) {
    esAtajado = true;
}

if (tipoResultado !== "NORMAL") {
    esAtajado = false;
}

if (window.arqueroSprite) {

    window.arqueroSprite.scaleX = 1;

    let equipoEnElArco =
        window.esTurnoP1
            ? window.equipoSeleccionadoCPU
            : window.equipoSeleccionadoP1;

    if (colA === 2) {

        window.arqueroSprite.setTexture(`${equipoEnElArco}_idle`);
        window.arqueroSprite.x = 400;
        window.arqueroSprite.y = 230;

        if (celdaTiro === 12)
            window.arqueroSprite.setFrame(2);
        else
            window.arqueroSprite.setFrame(1);

    } else if (colA < 2) {

        window.arqueroSprite.setTexture(`${equipoEnElArco}_vuelo`);
        window.arqueroSprite.x = 265;
        window.arqueroSprite.y = 222;

        if (rowA === 0) window.arqueroSprite.setFrame(0);
        if (rowA === 1) window.arqueroSprite.setFrame(1);
        if (rowA === 2) window.arqueroSprite.setFrame(2);

    } else {

        window.arqueroSprite.setTexture(`${equipoEnElArco}_vuelo`);
        window.arqueroSprite.x = 535;
        window.arqueroSprite.y = 222;
        window.arqueroSprite.scaleX = -1;

        if (rowA === 0) window.arqueroSprite.setFrame(0);
        if (rowA === 1) window.arqueroSprite.setFrame(1);
        if (rowA === 2) window.arqueroSprite.setFrame(2);
    }
}
    
    if (rng < 0.05) {
        tipoResultado = "PALO";
        let elegirPalo = Math.random();
        if (elegirPalo < 0.4) { xT = cfg.x; } 
        else if (elegirPalo < 0.8) { xT = cfg.x + 400; } 
        else { xT = Math.floor(Math.random() * ((cfg.x + 400) - cfg.x + 1)) + cfg.x; yT = cfg.y; }
    } else if (rng < 0.15) {
        tipoResultado = "AFUERA";
        let elegirAfuera = Math.random();
        if (elegirAfuera < 0.33) { xT = Math.floor(Math.random() * ((cfg.x - 10) - (cfg.x - 50) + 1)) + (cfg.x - 50); } 
        else if (elegirAfuera < 0.66) { let limiteDer = cfg.x + 400; xT = Math.floor(Math.random() * ((limiteDer + 50) - (limiteDer + 10) + 1)) + (limiteDer + 10); } 
        else { yT = Math.floor(Math.random() * ((cfg.y - 10) - (cfg.y - 50) + 1)) + (cfg.y - 50); }
    }

        // --- ⚽ SISTEMA DINÁMICO DE PATEADORES RETRO ⚽ ---
    // Detectamos qué equipo está pateando en esta ronda
        // === 🏃 REEMPLAZÁ TU BLOQUE DE TWEENS VIEJO POR ESTE EXACTO ===
    if (window.pateadorActual) {
        window.pateadorActual.setFrame(0); // Nos aseguramos que empiece corriendo

        // El jugador que ya estaba quieto en la cancha mete el pique hacia adelante
        escena.tweens.add({
            targets: window.pateadorActual,
            x: 390,
            duration: 90, // Tu velocidad rápida de carrera de 90ms
            onComplete: () => {
                window.pateadorActual.setFrame(1); // ¡PUM! Cuadro de impacto
                escena.sound.play('shoot', {
        volume: 0.7
    });
                // En el milisegundo exacto del botinazo, la pelota sale eyectada
                escena.tweens.add({
                    targets: window.ball, 
                    x: xT, y: yT, scaleX: 0.25, scaleY: 0.25, angle: 360, 
                    duration: 350, // Tu velocidad de la pelota
                    onStart: () => {
                        // El festejo (Cuadro 2) arranca instantáneamente si va a ser gol
                        if (tipoResultado === "NORMAL" && !esAtajado) {
                            window.pateadorActual.setFrame(2); 
                        }
                    },
                    onComplete: () => {
                        if (tipoResultado === "NORMAL" && !esAtajado) {
                            esJugador ? window.golesP1++ : window.golesCPU++;
                            const sonidoGol = Math.random() < 0.5 ? 'goal1' : 'goal2';
                            escena.sound.play(sonidoGol);
                            esJugador ? window.historialP1.push("GOL") : window.historialCPU.push("GOL") // === ⚽ ESTO SÓLO SE EJECUTA SI FUE GOL DE VERDAD ⚽ ===
                            let fondoCartel = escena.add.rectangle(400, 300, 800, 90, 0x000000, 0.75).setDepth(10);
                            let textoGol = escena.add.text(400, 300, '¡GAAAAAL!', {
                                fontSize: '64px',
                                fill: '#FFFF00', 
                                fontStyle: 'bold',
                                fontFamily: 'Courier New',
                                stroke: '#000000',
                                strokeThickness: 8
                            }).setOrigin(0.5).setDepth(11);

                            // Se limpia antes de que termine la secuencia del tiro
                            escena.time.delayedCall(950, () => {
                                fondoCartel.destroy();
                                textoGol.destroy();
                            });
                        }
                        
                        else if (esAtajado) {
                            escena.sound.play('nogol');
                            esJugador ? window.historialP1.push("ATA") : window.historialCPU.push("ATA");
                        } else {
                            escena.sound.play('nogol');
                            esJugador ? window.historialP1.push(tipoResultado) : window.historialCPU.push(tipoResultado);
                        }

                        
                        
                        let nomP1 = window.baseDeDatosEquipos[window.equipoSeleccionadoP1].nombre;
                        let nomCPU = window.baseDeDatosEquipos[window.equipoSeleccionadoCPU].nombre;
                        window.marcadorTexto.setText(`${nomP1} ${window.golesP1} - ${window.golesCPU} ${nomCPU}`);
                        
                                            // === 🔄 REEMPLAZÁ TODO TU DELAYEDCALL POR ESTE EXACTO Y COMPLETAMENTE CERRADO ===
                    escena.time.delayedCall(1000, () => {
                        window.ball.setPosition(400, 380); // Tu punto penal base (380)
                        window.ball.setScale(0.35);        // Tu escala corregida
                        window.ball.setAngle(0); 
                        
                        // Borramos el sprite visible justo cuando la pelota vuelve al punto penal
                        if (window.pateadorActual) {
                            window.pateadorActual.destroy();
                            window.pateadorActual = null;
                        }

                        dibujarHUD(escena);

                        // Forzamos la escala de nuevo por si el HUD la pisa al redibujarse
                        window.ball.setScale(0.35); 

                        window.ejecutandoTiro = false;

                        // --- CAMBIO DE TURNO E INVERSIÓN DE TEXTURAS CORREGIDO EN ORDEN CRUCIAL ---
                        if (esJugador) {
                            window.esperandoAtajada = true; 
                            window.esTurnoP1 = false; // El estado lógico cambia primero

                            if (window.arqueroSprite) {
                                window.arqueroSprite.setTexture(`${window.equipoSeleccionadoP1}_idle`);
                                window.arqueroSprite.x = 400;
                                window.arqueroSprite.y = 230;
                                window.arqueroSprite.scaleX = 1;
                                window.arqueroSprite.setFrame(0); // Guardia firme
                            }

                            actualizarRetratos(escena); 
                            iniciarBarra(escena, false);
                        } else {
                            window.esperandoAtajada = false; 
                            window.esTurnoP1 = true; // El estado lógico cambia primero
                            window.ronda++;
                            window.tuColA = 2; 
                            window.tuRowA = 1;

                            if (verificarFinPartido()) {
                        escena.time.delayedCall(50, () => {
                            // --- 🥇 PASO 1: CARTEL DE RESULTADO (Estilo Gaaaal) ---
                            let fondoFinal = escena.add.rectangle(400, 300, 800, 110, 0x000000, 0.75).setDepth(12);
                            
                            // Evaluamos si el jugador ganó o perdió
                            let mensajeGanador = window.golesP1 > window.golesCPU ? "¡GANASTE EL PARTIDO!" : "¡PERDISTE EL PARTIDO!";
                            if (window.golesP1 === window.golesCPU) mensajeGanador = "¡EMPATE FINAL!"; // Por si hay empate

                            let textoResultado = escena.add.text(400, 300, `${mensajeGanador}\nResultado: P1 ${window.golesP1} - CPU ${window.golesCPU}`, {
                                fontSize: '32px',
                                fill: '#FFFF00',
                                fontStyle: 'bold',
                                fontFamily: 'Courier New',
                                align: 'center',
                                stroke: '#000000',
                                strokeThickness: 6
                            }).setOrigin(0.5).setDepth(13);

                            // --- 🕒 PASO 2: ESPERAR 3.5 SEGUNDOS Y CAMBIAR A CRÉDITOS ---
                            escena.time.delayedCall(3500, () => {
                                // Destruimos el cartel flotante
                                fondoFinal.destroy();
                                textoResultado.destroy();

                                // Dibujamos tu foto limpia de creditos.png (Asegurate de precargarla como 'creditos')
                                let fotoCreditos = escena.add.image(400, 300, 'creditos').setDisplaySize(800, 600).setDepth(14);

                                // Al hacer un clic en cualquier lado de los créditos, reinicia
                                                                // Al hacer un clic en cualquier lado de los créditos, reinicia
                                // Al hacer un clic en cualquier lado de los créditos, recarga directo a selección
                                escena.input.once('pointerdown', () => {
                                    window.location.href = window.location.pathname + "?saltarInicio=true";

                                    // 1. Limpiamos la foto de créditos de la pantalla
                                    fotoCreditos.destroy(); 
                                    
                                    // 2. Reseteamos los goles globales para el nuevo partido
                                    window.golesP1 = 0;
                                    window.golesCPU = 0;
                                    window.historialP1 = [];
                                    window.historialCPU = [];
                                    window.esTurnoP1 = true;
                                    window.esperandoAtajada = false;
                                    window.ronda = 1;
                                    window.ejecutandoTiro = false;

                                    // 3. Volvemos a clavar el estado en Selección
                                    window.pantallaActual = "SELECCION";

                                    // 4. Dibujamos la foto de selección directamente en el lienzo
                                    let imgSeleccion = escena.add.image(400, 300, 'fotoSeleccion').setDisplaySize(800, 600).setDepth(100).setInteractive();
                                    
                                    // 5. Al hacer clic en la foto, arranca la tanda otra vez
                                    imgSeleccion.on('pointerdown', () => {
                                        imgSeleccion.destroy();
                                        window.pantallaActual = "PARTIDO";
                                        iniciarBarra(escena, true); 
                                    });
                                });

                            });
                        });
                            } else {
                                if (window.arqueroSprite) {
                                    window.arqueroSprite.setTexture(`${window.equipoSeleccionadoCPU}_idle`);
                                    window.arqueroSprite.x = 400;
                                    window.arqueroSprite.y = 230;
                                    window.arqueroSprite.scaleX = 1;
                                    window.arqueroSprite.setFrame(0); // Guardia firme
                                }

                                actualizarRetratos(escena); 
                                iniciarBarra(escena, true);
                            }
                        }
                    });
                }
            });
        }
    });
}
}

function iniciarBarra(escena, esJugador) {
    window.barraTiempo.scaleX = 1;
    escena.tweens.killTweensOf(window.barraTiempo);
    // if (window.rectTiro) { window.rectTiro.destroy(); window.rectTiro = null; }
    // if (window.rectArquero) { window.rectArquero.destroy(); window.rectArquero = null; }

    if (!esJugador) { window.zonaGolCPU = Math.floor(Math.random() * 15); }

    // === ⚽ NUEVO: EL PATEADOR APARECE APENAS CARGA LA BARRA ⚽ ===
    // Detectamos quién patea en esta ronda
    let equipoPateador = window.esTurnoP1 ? window.equipoSeleccionadoP1 : window.equipoSeleccionadoCPU;
    
    // Si ya existía un pateador viejo por seguridad lo borramos antes de crear el nuevo
    if (window.pateadorActual) { window.pateadorActual.destroy(); }

    // Creamos al jugador quieto en guardia (X=360) atrás de tu pelota en 395
    window.pateadorActual = escena.add.sprite(360, 395, `${equipoPateador}_pateador`);
    window.pateadorActual.setOrigin(0.5, 1);
    window.pateadorActual.setFrame(0); // Cuadro 0: Espera/Carrera (Aparece ya visible)
    window.pateadorActual.setDepth(4); // Capa arriba de la pelota
    window.pateadorActual.setScale(1.2); // Tu escala grande preferida
    window.pateadorActual.texture.setFilter(Phaser.Textures.FilterMode.NEAREST); // Píxeles nítidos
    // ==============================================================

    escena.tweens.add({ 
        targets: window.barraTiempo, scaleX: 0, duration: 3000, 
        onComplete: () => {
            if (esJugador) {
                window.ejecutandoTiro = true;
                ejecutarDisparo(escena, 2, 1, Math.floor(Math.random() * 5), Math.floor(Math.random() * 3), true);
            } else {
                window.ejecutandoTiro = true;
                let c = window.zonaGolCPU % 5, r = Math.floor(window.zonaGolCPU / 5);
                ejecutarDisparo(escena, c, r, window.tuColA, window.tuRowA, false);
            }
        }
    });
}

function verificarFinPartido() {
    let tirosP1 = window.historialP1.length;
    let tirosCPU = window.historialCPU.length;
    if (tirosP1 !== tirosCPU) return false;
    let restantes = Math.max(0, 5 - tirosP1);
    if (tirosP1 <= 5) {
        if (window.golesP1 > window.golesCPU + restantes) return true;
        if (window.golesCPU > window.golesP1 + restantes) return true;
        if (tirosP1 === 5 && window.golesP1 !== window.golesCPU) return true;
        return false;
    }
    return (window.golesP1 !== window.golesCPU);
}
