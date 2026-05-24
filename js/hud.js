function dibujarHUD(escena) {
    let viejos = escena.children.getAll().filter(obj => obj.name === 'hudCirculo');
    viejos.forEach(obj => obj.destroy());
    
    let tandaActual = Math.floor((window.historialP1.length - 1) / 5);
    if (tandaActual < 0) tandaActual = 0;

    let indiceInicio = tandaActual * 5;

    for (let i = indiceInicio; i < window.historialP1.length; i++) {
        let color = (window.historialP1[i] === "GOL") ? 0x00ff00 : 0xff0000;
        let c = escena.add.circle(50 + ((i % 5) * 25), 550, 10, color).setStrokeStyle(2, 0xffffff);
        c.name = 'hudCirculo';
    }
    
    for (let i = indiceInicio; i < window.historialCPU.length; i++) {
        let color = (window.historialCPU[i] === "GOL") ? 0x00ff00 : 0xff0000;
        let c = escena.add.circle(600 + ((i % 5) * 25), 550, 10, color).setStrokeStyle(2, 0xffffff);
        c.name = 'hudCirculo';
    }
}

// AGREGADO: Función para dibujar los retratos dinámicos abajo a los costados
function actualizarRetratos(escena) {
    // 1. Limpiar retratos anteriores si existen
    if (window.retratoIzquierdo) { window.retratoIzquierdo.destroy(); window.retratoIzquierdo = null; }
    if (window.retratoDerecho) { window.retratoDerecho.destroy(); window.retratoDerecho = null; }

    // Calcular el número de pateador actual basándonos en la ronda (Ronda 0 = N1, Ronda 1 = N2, etc.)
    // Usamos el operador de módulo % 5 para que si van a muerte súbita (ronda 5, 6...) vuelva a empezar del N1 al N5
    let numeroPateador = (window.ronda % 5) + 1;

    // Crear contenedores de Phaser para agrupar el rectángulo y el texto del retrato de manera simple
    window.retratoIzquierdo = escena.add.container(75, 420);
    window.retratoDerecho = escena.add.container(725, 420);

    if (window.esTurnoP1 && !window.esperandoAtajada) {
        // TURNO: P1 Pateador vs CPU Arquero
        // Izquierda: Pateador P1 (Fondo Azul)
        let bgIzq = escena.add.rectangle(0, 0, 110, 130, 0x1a5276).setStrokeStyle(2, 0xffffff);
        let txtIzq = escena.add.text(0, 0, `P1\nPATEADOR\nN° ${numeroPateador}`, { fontSize: '14px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoIzquierdo.add([bgIzq, txtIzq]);

        // Derecha: Arquero CPU (Fondo Rojo)
        let bgDer = escena.add.rectangle(0, 0, 110, 130, 0x7b241c).setStrokeStyle(2, 0xffffff);
        let txtDer = escena.add.text(0, 0, `CPU\nARQUERO`, { fontSize: '14px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoDerecho.add([bgDer, txtDer]);

    } else {
        // TURNO: P1 Arquero vs CPU Pateador
        // Izquierda: Arquero P1 (Fondo Azul)
        let bgIzq = escena.add.rectangle(0, 0, 110, 130, 0x1a5276).setStrokeStyle(2, 0xffffff);
        let txtIzq = escena.add.text(0, 0, `P1\nARQUERO`, { fontSize: '14px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoIzquierdo.add([bgIzq, txtIzq]);

        // Derecha: Pateador CPU (Fondo Rojo)
        let bgDer = escena.add.rectangle(0, 0, 110, 130, 0x7b241c).setStrokeStyle(2, 0xffffff);
        let txtDer = escena.add.text(0, 0, `CPU\nPATEADOR\nN° ${numeroPateador}`, { fontSize: '14px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoDerecho.add([bgDer, txtDer]);
    }
}
