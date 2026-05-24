const config = {
    type: Phaser.AUTO, 
    width: 800, 
    height: 600, 
    backgroundColor: '#2d862d',
    // FIX: Esto le avisa al navegador que optimice las lecturas repetidas de imágenes
    contextOptions: {
        willReadFrequently: true
    },
    scene: { 
        preload: preload,
        create: create 
    }
};

const game = new Phaser.Game(config);


// AGREGADO: Función para cargar la imagen de fondo antes de que empiece el juego
function preload() {
    this.load.image('fondoCancha', 'bg/penales.png');
}

function create() {
    // 1. DIBUJAR EL FONDO PRIMERO (Para que todo lo demás se dibuje arriba)
    // El fondo se posiciona en el centro de la pantalla (400, 300)
    let fondo = this.add.image(400, 300, 'fondoCancha');
    
    // Opcional: Si tu imagen no mide justo 800x600, descomentá la línea de abajo para estirarla
    // fondo.setDisplaySize(800, 600);

    // 2. Dibujar el arco de fondo blanco con borde negro
    // Nota: Si tu imagen ya trae el arco dibujado, podés borrar o comentar esta línea
    this.add.rectangle(400, 150, 400, 200, 0xffffff, 0.2).setStrokeStyle(4, 0x000000);
    
    // Guardamos las referencias en el objeto global "window"
    window.marcadorTexto = this.add.text(400, 30, 'P1: 0 - CPU: 0', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.rectangle(400, 550, 200, 20, 0x555555);
    window.barraTiempo = this.add.rectangle(300, 550, 200, 20, 0x00ff00).setOrigin(0, 0.5);
    window.ball = this.add.circle(400, 500, 15, 0xffffff).setStrokeStyle(2, 0x000000);

    // Crear las 15 zonas interactivas del arco (5 columnas x 3 filas)
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 3; row++) {
            let x = 200 + (col * 80) + 40;
            let y = 50 + (row * 66.6) + 33;
            
            // Bajamos la opacidad del rojo a 0.05 para que no te tape tu nueva imagen de fondo
            let zona = this.add.rectangle(x, y, 80, 66.6, 0xff0000, 0.05).setStrokeStyle(1, 0xffffff, 0.3).setInteractive();
            
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
