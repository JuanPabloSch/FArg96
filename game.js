const config = {
    type: Phaser.AUTO, width: 800, height: 600, backgroundColor: '#2d862d',
    scene: { create: create }
};

const game = new Phaser.Game(config);
let ball, golesP1 = 0, golesCPU = 0, marcadorTexto, esTurnoP1 = true;
let esperandoAtajada = false, zonaGolCPU = -1, ronda = 0;
let rectTiro, rectArquero, barraTiempo;
let historialP1 = []; // Guarda los resultados de P1
let historialCPU = []; // Guarda los resultados de CPU

function create() {
    this.add.rectangle(400, 150, 400, 200, 0xffffff).setStrokeStyle(4, 0x000000);
    marcadorTexto = this.add.text(400, 30, 'P1: 0 - CPU: 0', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    let fondoBarra = this.add.rectangle(400, 550, 200, 20, 0x555555);
    barraTiempo = this.add.rectangle(300, 550, 200, 20, 0x00ff00).setOrigin(0, 0.5);
    ball = this.add.circle(400, 500, 15, 0xffffff).setStrokeStyle(2, 0x000000);

    // Crear las 15 zonas del arco (5 columnas x 3 filas)
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 3; row++) {
            let x = 200 + (col * 80) + 40, y = 50 + (row * 66.6) + 33;
            let zona = this.add.rectangle(x, y, 80, 66.6, 0xff0000, 0.2).setStrokeStyle(1, 0xffffff).setInteractive();
            
            zona.on('pointerdown', () => {
                if (esTurnoP1 && !esperandoAtajada) {
                    ejecutarDisparo(this, col, row, Math.floor(Math.random()*5), Math.floor(Math.random()*3), true);
                } else if (esperandoAtajada) {
                    let c = zonaGolCPU % 5, r = Math.floor(zonaGolCPU / 5);
                    ejecutarDisparo(this, c, r, col, row, false);
                }
            });
        }
    }
    iniciarBarra(this, true);
}

function ejecutarDisparo(escena, colT, rowT, colA, rowA, esJugador) {
    // 1. Detener la barra y asegurar coordenadas dentro del arco (0-4, 0-2)
    escena.tweens.killTweensOf(barraTiempo);
    colT = Math.max(0, Math.min(4, colT));
    rowT = Math.max(0, Math.min(2, rowT));
    colA = Math.max(0, Math.min(4, colA));
    rowA = Math.max(0, Math.min(2, rowA));

    let xT = 200 + (colT * 80) + 40;
    let yT = 50 + (rowT * 66.6) + 33;
    let xA = 200 + (colA * 80) + 40;
    let yA = 50 + (rowA * 66.6) + 33;
    
    let esAtajado = (colT === colA && rowT === rowA);
    
    // 2. Dibujar marcas de tiro y arquero
    if(rectTiro) rectTiro.destroy(); 
    if(rectArquero) rectArquero.destroy();
    rectTiro = escena.add.rectangle(xT, yT, 80, 66.6).setStrokeStyle(4, 0x3366ff);
    rectArquero = escena.add.rectangle(xA, yA, 80, 66.6).setStrokeStyle(4, esJugador ? 0xff6666 : 0x66ff66);

    // 3. Mover pelota
    escena.tweens.add({
        targets: ball, x: xT, y: yT, duration: 500,
        onComplete: () => {
            // Actualizar marcador e historial
            if (!esAtajado) {
                esJugador ? golesP1++ : golesCPU++;
                esJugador ? historialP1.push("GOL") : historialCPU.push("GOL");
            } else {
                esJugador ? historialP1.push("ATA") : historialCPU.push("ATA");
            }
            
            marcadorTexto.setText(`P1: ${golesP1} - CPU: ${golesCPU}`);
            ball.setPosition(400, 500);
            
            // Dibujar el HUD de círculos
            dibujarHUD(escena);

            if(rectTiro) rectTiro.destroy(); 
            if(rectArquero) rectArquero.destroy();

            // Lógica de turnos
            if (esJugador) {
                esperandoAtajada = true; esTurnoP1 = false;
                iniciarBarra(escena, false);
            } else {
                esperandoAtajada = false; esTurnoP1 = true; ronda++;
                if (ronda < 5 || golesP1 === golesCPU) {
                    iniciarBarra(escena, true);
                } else {
                    alert("Final: " + golesP1 + "-" + golesCPU); 
                    location.reload();
                }
            }
        }
    });
}

function dibujarHUD(escena) {
    // Limpiar círculos anteriores no es necesario si los dibujas en una capa fija
    // pero aquí dibujamos según el tamaño del historial
    for (let i = 0; i < historialP1.length; i++) {
        let color = (historialP1[i] === "GOL") ? 0x00ff00 : 0xff0000;
        escena.add.circle(150 + (i * 30), 100, 10, color).setStrokeStyle(2, 0xffffff);
    }
    for (let i = 0; i < historialCPU.length; i++) {
        let color = (historialCPU[i] === "GOL") ? 0x00ff00 : 0xff0000;
        escena.add.circle(550 + (i * 30), 100, 10, color).setStrokeStyle(2, 0xffffff);
    }
}

function iniciarBarra(escena, esJugador) {
    barraTiempo.scaleX = 1;
    escena.tweens.killTweensOf(barraTiempo);
    escena.tweens.add({ targets: barraTiempo, scaleX: 0, duration: 3000, onComplete: () => {
        if (esJugador && !esperandoAtajada) ejecutarDisparo(escena, 2, 1, 0, 0, true);
        else if (!esJugador) {
            zonaGolCPU = Math.floor(Math.random() * 15);
            ejecutarDisparo(escena, zonaGolCPU % 5, Math.floor(zonaGolCPU / 5), 2, 1, false);
        }
    }});

function dibujarHUD(escena) {
    // 1. ELIMINAR CÍRCULOS ANTERIORES
    // Buscamos todos los objetos que tengan un 'name' específico para borrarlos
    let viejos = escena.children.getAll().filter(obj => obj.name === 'hudCirculo');
    viejos.forEach(obj => obj.destroy());

    // 2. DIBUJAR P1 (abajo a la izquierda)
    for (let i = 0; i < historialP1.length; i++) {
        let color = (historialP1[i] === "GOL") ? 0x00ff00 : 0xff0000;
        let c = escena.add.circle(50 + (i * 30), 550, 12, color).setStrokeStyle(2, 0xffffff);
        c.name = 'hudCirculo'; // Le damos un nombre para identificarlo luego
    }
    
    // 3. DIBUJAR CPU (abajo a la derecha)
    for (let i = 0; i < historialCPU.length; i++) {
        let color = (historialCPU[i] === "GOL") ? 0x00ff00 : 0xff0000;
        let c = escena.add.circle(600 + (i * 30), 550, 12, color).setStrokeStyle(2, 0xffffff);
        c.name = 'hudCirculo';
    }
}

    function actualizarHUD(escena) {
    // Limpiamos etiquetas previas si es necesario, aunque aquí dibujaremos sobre el canvas
    // Dibujamos el historial de P1 (izquierda) y CPU (derecha)
    for (let i = 0; i < historialP1.length; i++) {
        let color = historialP1[i] === "GOL" ? 0x00ff00 : 0xff0000;
        escena.add.circle(100 + (i * 30), 100, 10, color).setStrokeStyle(2, 0xffffff);
    }
    for (let i = 0; i < historialCPU.length; i++) {
        let color = historialCPU[i] === "GOL" ? 0x00ff00 : 0xff0000;
        escena.add.circle(600 + (i * 30), 100, 10, color).setStrokeStyle(2, 0xffffff);
    }
}
}