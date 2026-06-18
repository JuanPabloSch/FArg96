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

// --- 🕹️ CONTROL GLOBAL DE MENÚS RETRO ---
window.pantallaActual = "INICIO"; // Cambia a "SELECCION" y luego a "PARTIDO"
let imagenInicio;
let imagenSeleccion;

function preload() {
    // 0. Cargar assets fijos (Menús, cancha, pelota, créditos)
    this.load.image('fotoInicio', 'bg/inicio.png');
    this.load.image('fotoSeleccion', 'bg/seleccion.png');
    this.load.image('fondoCancha', 'bg/penales.png');
    this.load.image('pelotaNueva', 'assets/pelota.png');
    this.load.image('creditos', 'bg/creditos.png');


    Object.keys(window.baseDeDatosEquipos).forEach(id => {
        let e = window.baseDeDatosEquipos[id];
        
        // Carga sprites usando los nombres definidos en tu base de datos
        this.load.spritesheet(`${id}_idle`, `players/${e.sprites.idle}.png`, { frameWidth: 110, frameHeight: 140 });
        this.load.spritesheet(`${id}_vuelo`, `players/${e.sprites.vuelo}.png`, { frameWidth: 190, frameHeight: 140 });
        this.load.spritesheet(`${id}_pateador`, `players/${e.sprites.shoot}.png`, { frameWidth: 150, frameHeight: 122 });

        // Carga retratos
        this.load.image(e.arquero, `teams/${e.carpeta}/${e.arquero.toLowerCase().replace(' ', '')}.png`);
        e.pateadores.forEach(p => {
            this.load.image(p, `teams/${e.carpeta}/${p.toLowerCase().replace(' ', '')}.png`);
        });
    });


    // 2. Carga de audio (Esto no cambia)
    this.load.audio('musicaMenu', 'assets/sfx/menu.mp3');
    this.load.audio('ambientePartido', 'assets/sfx/ambiente.mp3');
    this.load.audio('goal1', 'assets/sfx/goal1.mp3');
    this.load.audio('goal2', 'assets/sfx/goal2.mp3');
    this.load.audio('nogol', 'assets/sfx/no_goal.mp3');
    this.load.audio('shoot', 'assets/sfx/shoot.mp3');
    this.load.audio('clank', 'assets/sfx/clank.mp3');
    this.load.audio('creditosMusic', 'assets/sfx/creditos.mp3');
}

function create() {
    let escena = this;

    // Dibujar fondo estirado de la cancha
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

    // --- ARQUERO INICIAL ---
        // === BORRÁ ESTAS LÍNEAS DE TU MAIN.JS ===
    let equipoAtajadorInicial = window.equipoSeleccionadoCPU; 
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
            
            let zona = this.add.rectangle(x, y, celdaAncho, celdaAlto, 0xff0000, 0.01)
            .setStrokeStyle(1, 0xffffff, 0.15)
            .setInteractive()
            .setDepth(2);
            
            zona.on('pointerdown', () => {
                // BLOQUEO DE SEGURIDAD: No permite clics si se está en las pantallas de menús
                if (window.pantallaActual !== "PARTIDO") return;
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

    // =======================================================
    // 📺 GESTIÓN VISUAL DE CAPAS SOBRE EL JUEGO BASE
    // =======================================================
    
    function mostrarPantallaSeleccion() {

        // --- 🎵 ARRANCAR MÚSICA CON LOOP REPETITIVO ---
        if (!escena.sound.get('musicaMenu')) {
            escena.sound.play('musicaMenu', { loop: true, volume: 0.5 });
        }
// 1. Fondo del menú
    let imagenSeleccion = escena.add.image(400, 300, 'fotoSeleccion').setDisplaySize(800, 600).setDepth(100);
    
    // 2. Generar botones dinámicos
    let equipos = Object.keys(window.baseDeDatosEquipos);
    equipos.forEach((idEquipo, index) => {
        let x = 150 + (index % 3) * 250;
        let y = 200 + Math.floor(index / 3) * 200;
        
        // Botón táctil grande
        let boton = escena.add.rectangle(x, y, 200, 150, 0xffffff, 0.2)
            .setStrokeStyle(4, 0xffffff)
            .setInteractive({ useHandCursor: true })
            .setDepth(101);
            
        escena.add.text(x, y, window.baseDeDatosEquipos[idEquipo].nombre, { 
            fontSize: '20px', fill: '#ffffff', fontStyle: 'bold' 
        }).setOrigin(0.5).setDepth(102);

        boton.on('pointerdown', () => {
            // Lógica de selección
            window.equipoSeleccionadoP1 = idEquipo;
            // Elegir un rival al azar que no sea el mismo
            let posiblesRivales = equipos.filter(e => e !== idEquipo);
            window.equipoSeleccionadoCPU = posiblesRivales[Math.floor(Math.random() * posiblesRivales.length)];
            
            iniciarPartido(escena); // Función para limpiar el menú e iniciar
        });
    });
}


    // === CONTROL INTELIGENTE DE ARRANQUE POR URL ===
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get('saltarInicio') === 'true') {
    // Si viene de los créditos, salta el inicio y va directo a la selección
    window.pantallaActual = "SELECCION";
    mostrarPantallaSeleccion();

} else {

    // Imagen portada
    imagenInicio = this.add.image(400, 300, 'fotoInicio')
        .setDisplaySize(800, 600)
        .setDepth(101)
        .setInteractive();

    // Texto "Click para continuar"
    const textoContinuar = this.add.text(400, 550, 'HAGA CLICK PARA CONTINUAR', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 5
    })
    .setOrigin(0.5)
    .setDepth(102);

    // Efecto parpadeo
    this.tweens.add({
        targets: textoContinuar,
        alpha: 0.2,
        duration: 800,
        yoyo: true,
        repeat: -1
    });

    imagenInicio.on('pointerdown', () => {

        textoContinuar.destroy();
        imagenInicio.destroy();

        window.pantallaActual = "SELECCION";
        mostrarPantallaSeleccion();
    });
}

}
