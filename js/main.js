const phaserConfig = {
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

const game = new Phaser.Game(phaserConfig);

function preload() {
    // 1. Cargar fondo de cancha y pelota
    this.load.image('fondoCancha', 'bg/penales.png');
    this.load.image('pelotaNueva', 'assets/pelota.png'); 

     // 2. NUEVA CARGA RETRO GENERAL DE CUERPOS (185x138px)
    // Hojas de Argentina (Indio Malo - El Negrouu)
    this.load.spritesheet('ARG_idle', 'players/negrouu_idle.png', { frameWidth: 110, frameHeight: 140 });
    this.load.spritesheet('ARG_vuelo', 'players/negrouu_vuelo.png', { frameWidth: 190, frameHeight: 140 });

    // Hojas de Brasil (Ranchos FC - Rolo)
    this.load.spritesheet('BRA_idle', 'players/rolo_idle.png', { frameWidth: 110, frameHeight: 140 });
    this.load.spritesheet('BRA_vuelo', 'players/rolo_vuelo.png', { frameWidth: 190, frameHeight: 140 });

    // 3. Carga de fotos para los retratos estáticos del HUD
    this.load.image('El Negrouu', 'players/negrouu.png');
    this.load.image('Sebu', 'players/sebu.png');
    this.load.image('Chino', 'players/chino.png');
    this.load.image('Juano', 'players/juano.png');
    this.load.image('Nahui', 'players/nahui.png');

    this.load.image('Rolo', 'players/rolo.png');
    this.load.image('El Gibe', 'players/gibe.png');
    this.load.image('Santos', 'players/santos.png');
    this.load.image('El Oscar', 'players/oscar.png');
    this.load.image('Caralucas', 'players/caralucas.png');

        // 4. PATEADORES: Hojas de disparo con tus medidas calibradas (150x122px por cuadro)
    this.load.spritesheet('ARG_pateador', 'players/indio_shoot.png', { frameWidth: 150, frameHeight: 122 });
    this.load.spritesheet('BRA_pateador', 'players/rancho_shoot.png', { frameWidth: 150, frameHeight: 122 });

    this.load.image('creditos', 'bg/creditos.png'); // Poné acá la ruta real de tu archivo

}

function create() {
    // Dibujar fondo estirado
    let fondo = this.add.image(400, 300, 'fondoCancha');
    fondo.setDisplaySize(800, 600);

    // Medidas definitivas del arco
    const arcoX = 200;       
    const arcoY = 95;        
    const arcoAncho = 400;   
    const arcoAlto = 135;    

    const celdaAncho = arcoAncho / 5; 
    const celdaAlto = arcoAlto / 3;   

    window.arcoConfig = {
        x: arcoX,
        y: arcoY,
        anchoCelda: celdaAncho,
        altoCelda: celdaAlto
    };

    // --- MARCADOR SUPERIOR RETRO TRANSLÚCIDO ---
    this.add.rectangle(400, 35, 520, 45, 0x000000, 0.6).setStrokeStyle(2, 0xffffff, 0.3);
    
    let nomP1 = window.baseDeDatosEquipos[window.equipoSeleccionadoP1].nombre;
    let nomCPU = window.baseDeDatosEquipos[window.equipoSeleccionadoCPU].nombre;

    window.marcadorTexto = this.add.text(400, 35, `${nomP1} 0 - 0 ${nomCPU}`, { 
        fontSize: '22px', 
        fill: '#ffffff', 
        fontStyle: 'bold',
        fontFamily: 'Courier New, monospace'
    }).setOrigin(0.5);

    // Contenedores de barra de tiempo
    this.add.rectangle(400, 550, 200, 20, 0x555555);
    window.barraTiempo = this.add.rectangle(300, 550, 200, 20, 0x00ff00).setOrigin(0, 0.5);
    
    // Pelota en capa superior (Depth 3)
    window.ball = this.add.image(400, 380, 'pelotaNueva').setScale(0.35).setDepth(3); 

        // --- ARQUERO INICIAL: Arranca el arquero de la CPU en el centro ---
    let equipoAtajadorInicial = window.equipoSeleccionadoCPU; // Arranca atajando BRA
    window.arqueroSprite = this.add.sprite(400, 230, `${equipoAtajadorInicial}_idle`);
    window.arqueroSprite.setOrigin(0.5, 1); 
    window.arqueroSprite.setScale(1);
    window.arqueroSprite.setFrame(0); 
    window.arqueroSprite.setDepth(1);


    // Crear las 15 zonas interactuables
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 3; row++) {
            let x = arcoX + (col * celdaAncho) + (celdaAncho / 2);
            let y = arcoY + (row * celdaAlto) + (celdaAlto / 2);
            
            // Depth=2 garantiza que las zonas de clic queden arriba del cuerpo del arquero
            let zona = this.add.rectangle(x, y, celdaAncho, celdaAlto, 0xff0000, 0.01)
            .setStrokeStyle(1, 0xffffff, 0.15)
            .setInteractive()
            .setDepth(2);
            
            zona.on('pointerdown', () => {
                if (window.ejecutandoTiro) return;
                window.ejecutandoTiro = true;

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
