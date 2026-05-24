// js/main.js
const config = {
    type: Phaser.AUTO, width: 800, height: 600, backgroundColor: '#2d862d',
    scene: { create: create }
};

const game = new Phaser.Game(config);

function create() {
    this.add.rectangle(400, 150, 400, 200, 0xffffff).setStrokeStyle(4, 0x000000);
    window.marcadorTexto = this.add.text(400, 30, 'P1: 0 - CPU: 0', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.rectangle(400, 550, 200, 20, 0x555555);
    window.barraTiempo = this.add.rectangle(300, 550, 200, 20, 0x00ff00).setOrigin(0, 0.5);
    window.ball = this.add.circle(400, 500, 15, 0xffffff).setStrokeStyle(2, 0x000000);

    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 3; row++) {
            let x = 200 + (col * 80) + 40, y = 50 + (row * 66.6) + 33;
            let zona = this.add.rectangle(x, y, 80, 66.6, 0xff0000, 0.2).setStrokeStyle(1, 0xffffff).setInteractive();
            zona.on('pointerdown', () => {
                if (window.esTurnoP1 && !window.esperandoAtajada) {
                    ejecutarDisparo(this, col, row, Math.floor(Math.random()*5), Math.floor(Math.random()*3), true);
                } else if (window.esperandoAtajada) {
                    let c = window.zonaGolCPU % 5, r = Math.floor(window.zonaGolCPU / 5);
                    ejecutarDisparo(this, c, r, col, row, false);
                }
            });
        }
    }
    iniciarBarra(this, true);
}