const config = {
    type: Phaser.AUTO, 
    width: 800, 
    height: 600, 
    backgroundColor: '#2d862d',
    scene: { create: create }
};

const game = new Phaser.Game(config);

function create() {
    // Dibujar el arco de fondo blanco con borde negro
    this.add.rectangle(400, 150, 400, 200, 0xffffff).setStrokeStyle(4, 0x000000);
    
    // IMPORTANTE: Guardamos las referencias en el objeto global "window"
    window.marcadorTexto = this.add.text(400, 30, 'P1: 0 - CPU: 0', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    
    // Fondo de la barra de potencia/tiempo
    this.add.rectangle(400, 550, 200, 20, 0x555555);
    
    // Guardamos la barra y la pelota en window para que gameLogic.js pueda animarlas
    window.barraTiempo = this.add.rectangle(300, 550, 200, 20, 0x00ff00).setOrigin(0, 0.5);
    window.ball = this.add.circle(400, 500, 15, 0xffffff).setStrokeStyle(2, 0x000000);

    // Crear las 15 zonas interactivas del arco (5 columnas x 3 filas)
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 3; row++) {
            let x = 200 + (col * 80) + 40;
            let y = 50 + (row * 66.6) + 33;
            let zona = this.add.rectangle(x, y, 80, 66.6, 0xff0000, 0.1).setStrokeStyle(1, 0xffffff).setInteractive();
            
            zona.on('pointerdown', () => {
                if (window.esTurnoP1 && !window.esperandoAtajada) {
                    // P1 Pateador: Elegís tiro. La CPU calcula su atajada aleatoria.
                    let arqueroCol = Math.floor(Math.random() * 5);
                    let arqueroRow = Math.floor(Math.random() * 3);
                    ejecutarDisparo(this, col, row, arqueroCol, arqueroRow, true);

                } else if (window.esperandoAtajada) {
                    // P1 Arquero: Elegís dónde tirarte.
                    window.tuColA = col; 
                    window.tuRowA = row;
                    
                    // Traemos la zona a la que la CPU ya decidió patear en 'iniciarBarra'
                    let cpuCol = window.zonaGolCPU % 5;
                    let cpuRow = Math.floor(window.zonaGolCPU / 5);
                    
                    // Se ejecuta el penal inmediatamente cruzando los datos
                    ejecutarDisparo(this, cpuCol, cpuRow, window.tuColA, window.tuRowA, false);
                }
            });
        }
    }
    actualizarRetratos(this);
    // Llama a la función iniciarBarra() que se encuentra guardada en js/gameLogic.js
    iniciarBarra(this, true);
}
