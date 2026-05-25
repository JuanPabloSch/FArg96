function ejecutarDisparo(escena, colT, rowT, colA, rowA, esJugador) {
    // FIX: Volamos la línea de scaleX para que la barra se mueva libremente
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
        if (elegirPalo < 0.4) { 
            xT = cfg.x; 
        } else if (elegirPalo < 0.8) { 
            xT = cfg.x + 400; 
        } else { 
            xT = Math.floor(Math.random() * ((cfg.x + 400) - cfg.x + 1)) + cfg.x; 
            yT = cfg.y; 
        }
    } else if (rng < 0.15) {
        tipoResultado = "AFUERA";
        let elegirAfuera = Math.random();
        if (elegirAfuera < 0.33) { 
            xT = Math.floor(Math.random() * ((cfg.x - 10) - (cfg.x - 50) + 1)) + (cfg.x - 50); 
        } else if (elegirAfuera < 0.66) { 
            let limiteDer = cfg.x + 400; 
            xT = Math.floor(Math.random() * ((limiteDer + 50) - (limiteDer + 10) + 1)) + (limiteDer + 10); 
        } else { 
            yT = Math.floor(Math.random() * ((cfg.y - 10) - (cfg.y - 50) + 1)) + (cfg.y - 50); 
        }
    }

    let esAtajado = (colT === colA && rowT === rowA && tipoResultado === "NORMAL");
    
        if(window.rectTiro) window.rectTiro.destroy(); 
    if(window.rectArquero) window.rectArquero.destroy();
    window.rectTiro = escena.add.rectangle(cfg.x + (colT * cfg.anchoCelda) + (cfg.anchoCelda / 2), cfg.y + (rowT * cfg.altoCelda) + (cfg.altoCelda / 2), cfg.anchoCelda, cfg.altoCelda).setStrokeStyle(4, 0x3366ff);
    window.rectArquero = escena.add.rectangle(xA, yA, cfg.anchoCelda, cfg.altoCelda).setStrokeStyle(4, esJugador ? 0xff6666 : 0x66ff66);

    // FIX: Escala inicial corregida a 0.8
        // Forzamos la escala a 0.5 antes de patear y reseteamos el ángulo a 0 por las dudas
    window.ball.setScale(0.5);
    window.ball.setAngle(0);

    // Animación: viaja, se achica en 3D y GIRA en el aire
    escena.tweens.add({
        targets: window.ball, 
        x: xT, 
        y: yT, 
        scaleX: 0.25, // Como usás base 0.5, se reduce a la mitad al llegar a la red
        scaleY: 0.25, 
        angle: 360,   // AGREGADO: Pega una vuelta completa (efecto de rosca/giro)
        duration: 500,
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
                // FIX: El punto de penal ahora vuelve exactamente a Y=500
                window.ball.setPosition(400, 380);
                
                window.ball.setScale(0.5); 
                window.ball.setAngle(0); 
                
                dibujarHUD(escena);

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
                ejecutarDisparo(escena, 2, 1, Math.floor(Math.random() * 5), Math.floor(Math.random() * 3), true);
            } else {
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
