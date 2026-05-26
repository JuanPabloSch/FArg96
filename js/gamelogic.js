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

    // --- SISTEMA DE 7 ZONAS DE ATAJADA ---
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

    // Filtro de seguridad por si coincide la celda exacta exacta
    if (colT === colA && rowT === rowA) {
        esAtajado = true;
    }

    // Si la pelota fue al palo o afuera, se anula la atajada
    if (tipoResultado !== "NORMAL") {
        esAtajado = false;
    }
    // --------------------------------------------------------------------------

    
        // --- CALIBRACIÓN DEFICITIVA DE POSICIÓN Y VUELOS DEL ARQUERO ---
    if (window.arqueroSprite) {
        window.arqueroSprite.scaleX = 1; // Reseteo espejo

        if (colA === 2) { // --- CENTRO ---
            window.arqueroSprite.setTexture('rolo_idle');
            window.arqueroSprite.x = 400; // Centro perfecto
            window.arqueroSprite.y = 230; // ¡AJUSTADO!: Bajamos 5px en el centro para que apoye bien los pies
            
            if (celdaTiro === 12) window.arqueroSprite.setFrame(2); // Agachado
            else window.arqueroSprite.setFrame(1); // Salto al centro
        } 
        else if (colA < 2) { // --- VOLAR A LA IZQUIERDA (NATURAL) ---
            window.arqueroSprite.setTexture('rolo_vuelo');
            window.arqueroSprite.y = 222; // Altura normal de la cal
            window.arqueroSprite.x = 265; // ¡AJUSTADO!: Frena 20px antes (pasó de 245 a 265)
            
            if (rowA === 0) window.arqueroSprite.setFrame(0); // Arriba
            if (rowA === 1) window.arqueroSprite.setFrame(1); // Medio
            if (rowA === 2) window.arqueroSprite.setFrame(2); // Abajo
        } 
        else if (colA > 2) { // --- VOLAR A LA DERECHA (ESPEJADO) ---
            window.arqueroSprite.setTexture('rolo_vuelo');
            window.arqueroSprite.y = 222; // Altura normal de la cal
            window.arqueroSprite.x = 535; // ¡AJUSTADO!: Frena 20px antes (pasó de 555 a 535)
            window.arqueroSprite.scaleX = -1; // Espejo horizontal
            
            if (rowA === 0) window.arqueroSprite.setFrame(0); // Arriba
            if (rowA === 1) window.arqueroSprite.setFrame(1); // Medio
            if (rowA === 2) window.arqueroSprite.setFrame(2); // Abajo
        }
    }


    if(window.rectTiro) window.rectTiro.destroy(); 
    if(window.rectArquero) window.rectArquero.destroy();
    window.rectTiro = escena.add.rectangle(cfg.x + (colT * cfg.anchoCelda) + (cfg.anchoCelda / 2), cfg.y + (rowT * cfg.altoCelda) + (cfg.altoCelda / 2), cfg.anchoCelda, cfg.altoCelda).setStrokeStyle(4, 0x3366ff);
    window.rectArquero = escena.add.rectangle(xA, yA, cfg.anchoCelda, cfg.altoCelda).setStrokeStyle(4, esJugador ? 0xff6666 : 0x66ff66);

    window.ball.setScale(0.5);
    window.ball.setAngle(0);

    escena.tweens.add({
        targets: window.ball, 
        x: xT, y: yT, scaleX: 0.25, scaleY: 0.25, angle: 360, duration: 500,
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
                window.ball.setPosition(400, 500);
                window.ball.setScale(0.5); 
                window.ball.setAngle(0); 
                
                dibujarHUD(escena);
                window.ejecutandoTiro = false;

                // --- RESETEO: El arquero vuelve al centro, firme y en guardia ---
                    // Buscá el delayedCall(1000) abajo y dejá el bloque del sprite así:
            if (window.arqueroSprite) {
                window.arqueroSprite.setTexture('rolo_idle');
                window.arqueroSprite.x = 400;
                window.arqueroSprite.y = 230; // Vuelve abajo con los pies firmes
                window.arqueroSprite.scaleX = 1;
                window.arqueroSprite.setFrame(0);
            }


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

function iniciarBarra(escena, esJugador) {
    window.barraTiempo.scaleX = 1;
    escena.tweens.killTweensOf(window.barraTiempo);
    if (window.rectTiro) { window.rectTiro.destroy(); window.rectTiro = null; }
    if (window.rectArquero) { window.rectArquero.destroy(); window.rectArquero = null; }

    if (!esJugador) { window.zonaGolCPU = Math.floor(Math.random() * 15); }

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
