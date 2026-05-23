const config = {
    type: Phaser.AUTO, width: 800, height: 600, backgroundColor: '#2d862d',
    scene: { create: create }
};

const game = new Phaser.Game(config);
let ball, golesP1 = 0, golesCPU = 0, marcadorTexto, esTurnoP1 = true;
let esperandoAtajada = false, zonaGolCPU = -1, ronda = 0;
let rectTiro, rectArquero, barraTiempo;

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
    escena.tweens.killTweensOf(barraTiempo);
    
    // 1. FORZAMOS coordenadas dentro del arco (0 a 4, 0 a 2)
    // Esto evita que la pelota se vaya a cualquier lugar si el valor es incorrecto
    colT = Math.max(0, Math.min(4, colT));
    rowT = Math.max(0, Math.min(2, rowT));
    colA = Math.max(0, Math.min(4, colA));
    rowA = Math.max(0, Math.min(2, rowA));

    let xT = 200 + (colT * 80) + 40, yT = 50 + (rowT * 66.6) + 33;
    let xA = 200 + (colA * 80) + 40, yA = 50 + (rowA * 66.6) + 33;
    
    // 2. Lógica clara: es gol si las columnas y filas NO coinciden
    let esAtajado = (colT === colA && rowT === rowA);
    
    if(rectTiro) rectTiro.destroy(); 
    if(rectArquero) rectArquero.destroy();
    rectTiro = escena.add.rectangle(xT, yT, 80, 66.6).setStrokeStyle(4, 0x3366ff);
    rectArquero = escena.add.rectangle(xA, yA, 80, 66.6).setStrokeStyle(4, esJugador ? 0xff6666 : 0x66ff66);

    escena.tweens.add({
        targets: ball, x: xT, y: yT, duration: 500,
        onComplete: () => {
            // 3. Validación estricta: si no está atajado, es gol, pero solo si es posición válida
            if (!esAtajado) {
                esJugador ? golesP1++ : golesCPU++;
            }
            
            marcadorTexto.setText(`P1: ${golesP1} - CPU: ${golesCPU}`);
            ball.setPosition(400, 500); // Reset pelota al centro
            
            if(rectTiro) rectTiro.destroy(); 
            if(rectArquero) rectArquero.destroy();

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
}