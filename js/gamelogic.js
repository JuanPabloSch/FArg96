const config = {
    type: Phaser.AUTO, 
    width: 800, 
    height: 600, 
    backgroundColor: '#2d862d',
    contextOptions: {
        willReadFrequently: true
    },
    scene: { 
        preload: preload,
        create: create 
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('fondoCancha', 'bg/penales.png');
}

function create() {
    // 1. Dibujar el fondo estirado
    let fondo = this.add.image(400, 300, 'fondoCancha');
    fondo.setDisplaySize(800, 600);

    // 2. MEDIDAS FINALES: Ajuste de 5px hacia arriba
    const arcoX = 200;       // Centrado perfecto (va de 200 a 600)
    const arcoY = 95;        // SUBIDO: El travesaño sube a Y=95 para calzar el madero superior
    const arcoAncho = 400;   // El ancho que calzó perfecto
    const arcoAlto = 135;    // COMPENSADO: Sumamos 5px de alto para mantener la base en el pasto

    const celdaAncho = arcoAncho / 5; // 80px cada columna
    const celdaAlto = arcoAlto / 3;   // 45px cada fila exacta

    // Guardamos las medidas en window para usarlas en ejecutarDisparo
    window.arcoConfig = {
        x: arcoX,
        y: arcoY,
        anchoCelda: celdaAncho,
        altoCelda: celdaAlto
    };



    window.marcadorTexto = this.add.text(400, 30, 'P1: 0 - CPU: 0', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.rectangle(400, 550, 200, 20, 0x555555);
    window.barraTiempo = this.add.rectangle(300, 550, 200, 20, 0x00ff00).setOrigin(0, 0.5);
    
    // Pelota blanca arrancando más abajo cerca de tu HUD (Y=520)
    window.ball = this.add.circle(400, 520, 15, 0xffffff).setStrokeStyle(2, 0x000000);

    // Crear las 15 zonas interactivas rectangulares
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 3; row++) {
            let x = arcoX + (col * celdaAncho) + (celdaAncho / 2);
            let y = arcoY + (row * celdaAlto) + (celdaAlto / 2);
            
            // Opacidad casi invisible para que aprecies el pixelart pero detecte el clic
            let zona = this.add.rectangle(x, y, celdaAncho, celdaAlto, 0xff0000, 0.01).setStrokeStyle(1, 0xffffff, 0.15).setInteractive();
            
            zona.on('pointerdown', () => {
                if (window.esTurnoP1 && !window.esperandoAtajada) {
                    let arqueroCol = Math.floor(Math.random() * 5);
                    let arqueroRow = Math.floor(Math.random() * 3);
                    ejecutarDisparo(this, col, row, arqueroCol, arqueroRow, true);
                } else if (window.esperandoAtajada) {
                    window.tuColA = col; 
                    window.tuRowA = row;
                    let c = window.zonaGolCPU % 5;
                    let r = Math.floor(window.zonaGolCPU / 5);
                    ejecutarDisparo(this, c, r, window.tuColA, window.tuRowA, false);
                }
            });
        }
    }
    
    actualizarRetratos(this);
    iniciarBarra(this, true);
}

function ejecutarDisparo(escena, colT, rowT, colA, rowA, esJugador) {
    escena.tweens.killTweensOf(window.barraTiempo);
    
    colT = Math.max(0, Math.min(4, colT));
    rowT = Math.max(0, Math.min(2, rowT));
    colA = Math.max(0, Math.min(4, colA));
    rowA = Math.max(0, Math.min(2, rowA));

    const cfg = window.arcoConfig;

    // Coordenadas calculadas en base al arco estirado
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
            xT = cfg.x; // Palo izquierdo real
        } else if (elegirPalo < 0.8) { 
            xT = cfg.x + (cfg.anchoCelda * 5); // Palo derecho real
        } else { 
            xT = Math.floor(Math.random() * ((cfg.x + cfg.anchoCelda * 5) - cfg.x + 1)) + cfg.x; 
            yT = cfg.y; // Travesaño real
        }
    } else if (rng < 0.15) {
        tipoResultado = "AFUERA";
        let elegirAfuera = Math.random();
        if (elegirAfuera < 0.33) { 
            xT = Math.floor(Math.random() * ((cfg.x - 10) - (cfg.x - 60) + 1)) + (cfg.x - 60); 
        } else if (elegirAfuera < 0.66) { 
            let limiteDer = cfg.x + (cfg.anchoCelda * 5);
            xT = Math.floor(Math.random() * ((limiteDer + 60) - (limiteDer + 10) + 1)) + (limiteDer + 10); 
        } else { 
            yT = Math.floor(Math.random() * ((cfg.y - 10) - (cfg.y - 50) + 1)) + (cfg.y - 50); 
        }
    }

    let esAtajado = (colT === colA && rowT === rowA && tipoResultado === "NORMAL");
    
    if(window.rectTiro) window.rectTiro.destroy(); 
    if(window.rectArquero) window.rectArquero.destroy();
    
    // Dibujamos las marcas rectangulares estables sobre las dimensiones reales del arco
    window.rectTiro = escena.add.rectangle(cfg.x + (colT * cfg.anchoCelda) + (cfg.anchoCelda / 2), cfg.y + (rowT * cfg.altoCelda) + (cfg.altoCelda / 2), cfg.anchoCelda, cfg.altoCelda).setStrokeStyle(4, 0x3366ff);
    window.rectArquero = escena.add.rectangle(xA, yA, cfg.anchoCelda, cfg.altoCelda).setStrokeStyle(4, esJugador ? 0xff6666 : 0x66ff66);

    // Resetear escala de la pelota antes del tiro por si acaso
    window.ball.setScale(1);

    // Animación del tiro con EFECTO 3D (Se desplaza y se achica a la mitad)
    escena.tweens.add({
        targets: window.ball,
        x: xT,
        y: yT,
        scaleX: 0.5, // AGREGADO: Se achica simulando distancia
        scaleY: 0.5,
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
            
            window.marcadorTexto.setText(`P1: ${window.golesP1} - CPU: ${window.golesCPU}`);
            
            escena.time.delayedCall(1000, () => {
                window.ball.setPosition(400, 520);
                window.ball.setScale(1); // Reset de tamaño para el próximo tiro
                dibujarHUD(escena);

                if (esJugador) {
                    window.esperandoAtajada = true; 
                    window.esTurnoP1 = false;
                    actualizarRetratos(escena); 
                    iniciarBarra(escena, false);
                } else {
                    window.esperandoAtajada = false; 
                    window.esTurnoP1 = true; 
                    window.ronda++;
                    window.tuColA = 2; window.tuRowA = 1;
                    
                    if (verificarFinPartido()) {
                        escena.time.delayedCall(50, () => {
                            alert(`¡Tanda Finalizada!\nResultado: P1 ${window.golesP1} - CPU ${window.golesCPU}`);
                            location.reload();
                        });
                    } else {
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

    if (!esJugador) {
        window.zonaGolCPU = Math.floor(Math.random() * 15);
    }

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
