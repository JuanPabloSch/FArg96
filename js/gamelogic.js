function ejecutarDisparo(escena, colT, rowT, colA, rowA, esJugador) {
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
                            esJugador ? window.historialP1.push("GOL") : window.historialCPU.push("GOL");
                        } else if (esAtajado) {
                            esJugador ? window.historialP1.push("ATA") : window.historialCPU.push("ATA");
                        } else {
                            esJugador ? window.historialP1.push(tipoResultado) : window.historialCPU.push(tipoResultado);
                        }
                        
                        let nomP1 = window.baseDeDatosEquipos[window.equipoSeleccionadoP1].nombre;
                        let nomCPU = window.baseDeDatosEquipos[window.equipoSeleccionadoCPU].nombre;
                        window.marcadorTexto.setText(`${nomP1} ${window.golesP1} - ${window.golesCPU} ${nomCPU}`);
                        
                        escena.time.delayedCall(1000, () => {
                            window.ball.setPosition(400, 380); // Tu punto penal base
                            window.ball.setScale(0.35); 
                            window.ball.setAngle(0); 
                            
                            // Borramos el sprite visible justo cuando la pelota vuelve al punto penal
                            if (window.pateadorActual) {
                                window.pateadorActual.destroy();
                                window.pateadorActual = null;
                            }

                            dibujarHUD(escena);
                            window.ejecutandoTiro = false;

                            if (esJugador) {
                                window.esperandoAtajada = true; window.esTurnoP1 = false;
                                actualizarRetratos(escena); iniciarBarra(escena, false);
                            } else {
                                window.esperandoAtajada = false; window.esTurnoP1 = true; window.ronda++;
                                window.tuColA = 2; window.tuRowA = 1;
                                if (verificarFinPartido()) {
                                    escena.time.delayedCall(50, () => {
                                        alert(`¡Tanda Finalizada!\nResultado: P1 ${window.golesP1} - CPU ${window.golesCPU}`);
                                        location.reload();
                                    });
                                } else {
                                    actualizarRetratos(escena); iniciarBarra(escena, true);
                                }
                            }
                        });
                    }
                });
            }
        });
    }
    // ===============================================================
 // ¡MÁS ARRIBA QUE LA PELOTA!: La pelota tiene Depth 3, el jugador la tapa al correr


    // --- NUEVO SISTEMA DE ZONAS DE ALCANCE DEL ARQUERO (COBERTURA MEJORADA) ---
    let celdaTiro = (rowT * 5) + colT;
    let esAtajado = false;

    // 1. ZONA CENTRO (Celdas 2, 7, 12)
    if (colA === 2) {
        if (celdaTiro === 2 || celdaTiro === 7 || celdaTiro === 12) {
            esAtajado = true;
        }
    }
    // 2. ZONA ARRIBA IZQUIERDA (Celdas 0, 1, 6)
    else if (rowA === 0 && colA < 2) {
        if (celdaTiro === 0 || celdaTiro === 1 || celdaTiro === 6) {
            esAtajado = true;
        }
    }
    // 3. ZONA MEDIO IZQUIERDA (Celdas 5, 6)
    else if (rowA === 1 && colA < 2) {
        if (celdaTiro === 5 || celdaTiro === 6) {
            esAtajado = true;
        }
    }
    // 4. ZONA BAJO IZQUIERDA (Celdas 5, 10, 11)
    else if (rowA === 2 && colA < 2) {
        if (celdaTiro === 5 || celdaTiro === 10 || celdaTiro === 11) {
            esAtajado = true;
        }
    }
    // 5. ZONA ARRIBA DERECHA (Celdas 3, 4, 8)
    else if (rowA === 0 && colA > 2) {
        if (celdaTiro === 3 || celdaTiro === 4 || celdaTiro === 8) {
            esAtajado = true;
        }
    }
    // 6. ZONA MEDIO DERECHA (Celdas 8, 9)
    else if (rowA === 1 && colA > 2) {
        if (celdaTiro === 8 || celdaTiro === 9) {
            esAtajado = true;
        }
    }
    // 7. ZONA BAJO DERECHA (Celdas 9, 13, 14)
    else if (rowA === 2 && colA > 2) {
        if (celdaTiro === 9 || celdaTiro === 13 || celdaTiro === 14) {
            esAtajado = true;
        }
    }

    // Filtro de seguridad por si coincide la celda exacta
    if (colT === colA && rowT === rowA) {
        esAtajado = true;
    }

    // Si la pelota fue al palo o afuera, se anula la atajada
    if (tipoResultado !== "NORMAL") {
        esAtajado = false;
    }
    // --------------------------------------------------------------------------

    // --- ASIGNAR TEXTURA DINÁMICA, COORDENADA X Y ESPEJADO SEGÚN EL ARQUERO DE TURNO ---
    if (window.arqueroSprite) {
        window.arqueroSprite.scaleX = 1; 

        let equipoEnElArco = window.esTurnoP1 ? window.equipoSeleccionadoCPU : window.equipoSeleccionadoP1;

        if (colA === 2) { // --- CENTRO ---
            window.arqueroSprite.setTexture(`${equipoEnElArco}_idle`);
            window.arqueroSprite.x = 400; 
            window.arqueroSprite.y = 230; 
            
            if (celdaTiro === 12) window.arqueroSprite.setFrame(2); 
            else window.arqueroSprite.setFrame(1); 
        } 
        else if (colA < 2) { // --- VOLAR A LA IZQUIERDA (NATURAL) ---
            window.arqueroSprite.setTexture(`${equipoEnElArco}_vuelo`);
            window.arqueroSprite.y = 222; 
            window.arqueroSprite.x = 265; 
            
            if (rowA === 0) window.arqueroSprite.setFrame(0); 
            if (rowA === 1) window.arqueroSprite.setFrame(1); 
            if (rowA === 2) window.arqueroSprite.setFrame(2); 
        } 
        else if (colA > 2) { // --- VOLAR A LA DERECHA (ESPEJADO) ---
            window.arqueroSprite.setTexture(`${equipoEnElArco}_vuelo`);
            window.arqueroSprite.y = 222; 
            window.arqueroSprite.x = 535; 
            window.arqueroSprite.scaleX = -1; 
            
            if (rowA === 0) window.arqueroSprite.setFrame(0); 
            if (rowA === 1) window.arqueroSprite.setFrame(1); 
            if (rowA === 2) window.arqueroSprite.setFrame(2); 
        }
    }

    if(window.rectTiro) window.rectTiro.destroy(); 
    if(window.rectArquero) window.rectArquero.destroy();
    window.rectTiro = escena.add.rectangle(cfg.x + (colT * cfg.anchoCelda) + (cfg.anchoCelda / 2), cfg.y + (rowT * cfg.altoCelda) + (cfg.altoCelda / 2), cfg.anchoCelda, cfg.altoCelda).setStrokeStyle(4, 0x3366ff);
    window.rectArquero = escena.add.rectangle(xA, yA, cfg.anchoCelda, cfg.altoCelda).setStrokeStyle(4, esJugador ? 0xff6666 : 0x66ff66);

    window.ball.setScale(0.4);
    window.ball.setAngle(0);

        // El pateador da un paso adelante hacia la pelota (X=400) y patea (Cuadro 1)
        escena.tweens.add({
        targets: pateadorSprite,
        x: 390,
        duration: 50, // <--- CAMBIÁ ESTO: Bajalo a 90 o 100 para que corra a los pedos
        onComplete: () => {
            pateadorSprite.setFrame(2); // ¡PUM! Cuadro de impacto/patada
        }
    });


    // Tu tween actual de la pelota viajando (Arranca en paralelo)
    escena.tweens.add({
        targets: window.ball, 
        x: xT, y: yT, scaleX: 0.25, scaleY: 0.25, angle: 360, duration: 500,
        onComplete: () => {
            // ... Acá adentro de tu onComplete actual ...
            
            // Si fue GOL, hacemos que el pateador pase a su cuadro de festejo (Cuadro 2)
            if (tipoResultado === "NORMAL" && !esAtajado) {
                pateadorSprite.setFrame(2); 
            }

            // Destruimos al pateador para limpiar la pantalla justo cuando la pelota vuelve al punto penal
            escena.time.delayedCall(1000, () => {
                pateadorSprite.destroy(); // Lo borramos para que la cancha quede limpia para el próximo tiro
                
                // ... Tu lógica de reseteo actual (setPosition, cambiarTurno, etc.) ...
            });
        }
    });


    escena.tweens.add({
        targets: window.ball, 
        x: xT, y: yT, scaleX: 0.25, scaleY: 0.25, angle: 360, duration: 500,
        onComplete: () => {
            if (tipoResultado === "NORMAL" && !esAtajado) {
                esJugador ? window.golesP1++ : window.golesCPU++;
                esJugador ? window.historialP1.push("GOL") : window.historialCPU.push("GOL");

                // === ⚽ CARTELAZO ANIMADO DE GOOOL RETRO (Capa superpuesta protegida) ⚽ ===
                let fondoCartel = escena.add.rectangle(400, 300, 800, 90, 0x000000, 0.75).setDepth(10);
                let textoGol = escena.add.text(400, 300, '¡GAAAAAL!', {
                    fontSize: '64px',
                    fill: '#f1c40f', 
                    fontStyle: 'bold',
                    fontFamily: 'Courier New, monospace',
                    stroke: '#000000',
                    strokeThickness: 8
                }).setOrigin(0.5).setDepth(11).setScale(0);

                escena.tweens.add({
                    targets: textoGol,
                    scaleX: 1.2, scaleY: 1.2, duration: 200, ease: 'Quad.easeOut',
                    onComplete: () => {
                        escena.tweens.add({ targets: textoGol, scaleX: 1, scaleY: 1, duration: 100 });
                    }
                });

                // Lo destruimos milisegundos antes del reseteo del turno
                escena.time.delayedCall(950, () => {
                    escena.tweens.add({
                        targets: [fondoCartel, textoGol], alpha: 0, duration: 120,
                        onComplete: () => { fondoCartel.destroy(); textoGol.destroy(); }
                    });
                });
                // =========================================================================

            } else if (esAtajado) {
                esJugador ? window.historialP1.push("ATA") : window.historialCPU.push("ATA");
            } else {
                esJugador ? window.historialP1.push(tipoResultado) : window.historialCPU.push(tipoResultado);
            }
            
            let nomP1 = window.baseDeDatosEquipos[window.equipoSeleccionadoP1].nombre;
            let nomCPU = window.baseDeDatosEquipos[window.equipoSeleccionadoCPU].nombre;
            window.marcadorTexto.setText(`${nomP1} ${window.golesP1} - ${window.golesCPU} ${nomCPU}`);
            
            escena.time.delayedCall(1000, () => {
                // Mantenemos tu reseteo original a la altura que tenías en este archivo (380)
                window.ball.setPosition(400, 380);
                window.ball.setScale(0.4); 
                window.ball.setAngle(0); 
                
                dibujarHUD(escena);
                window.ejecutandoTiro = false;

                if (esJugador) {
                    window.esperandoAtajada = true; 
                    window.esTurnoP1 = false;
                    
                    if (window.arqueroSprite) {
                        window.arqueroSprite.setTexture(`${window.equipoSeleccionadoP1}_idle`);
                        window.arqueroSprite.x = 400;
                        window.arqueroSprite.y = 230;
                        window.arqueroSprite.scaleX = 1;
                        window.arqueroSprite.setFrame(0);
                    }

                    actualizarRetratos(escena); 
                    iniciarBarra(escena, false);
                } else {
                    window.esperandoAtajada = false; 
                    window.esTurnoP1 = true; 
                    window.ronda++;
                    window.tuColA = 2; 
                    window.tuRowA = 1;

                    if (verificarFinPartido()) {
                        escena.time.delayedCall(50, () => {
                            alert(`¡Tanda Finalizada!\nResultado: P1 ${window.golesP1} - CPU ${window.golesCPU}`);
                            location.reload();
                        });
                    } else {
                        if (window.arqueroSprite) {
                            window.arqueroSprite.setTexture(`${window.equipoSeleccionadoCPU}_idle`);
                            window.arqueroSprite.x = 400;
                            window.arqueroSprite.y = 230;
                            window.arqueroSprite.scaleX = 1;
                            window.arqueroSprite.setFrame(0);
                        }

                        actualizarRetratos(escena); 
                        iniciarBarra(escena, true);
                    }
                }
            });
        }
    });
}


function iniciarBarra(escena, esJugador) {
    window.barraTiempo.scaleX = 1;
    escena.tweens.killTweensOf(window.barraTiempo);
    if (window.rectTiro) { window.rectTiro.destroy(); window.rectTiro = null; }
    if (window.rectArquero) { window.rectArquero.destroy(); window.rectArquero = null; }

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
