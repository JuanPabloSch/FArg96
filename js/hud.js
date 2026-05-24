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

function actualizarRetratos(escena) {
    if (window.retratoIzquierdo) { window.retratoIzquierdo.destroy(); window.retratoIzquierdo = null; }
    if (window.retratoDerecho) { window.retratoDerecho.destroy(); window.retratoDerecho = null; }

    // Obtenemos los datos de las plantillas actuales
    let datosP1 = window.baseDeDatosEquipos[window.equipoSeleccionadoP1];
    let datosCPU = window.baseDeDatosEquipos[window.equipoSeleccionadoCPU];

    // Índice del jugador actual (0 al 4)
    let idxJugador = window.ronda % 5;

    window.retratoIzquierdo = escena.add.container(75, 420);
    window.retratoDerecho = escena.add.container(725, 420);

    if (window.esTurnoP1 && !window.esperandoAtajada) {
        // TURNO: P1 Pateador vs CPU Arquero
        let nombrePateador = datosP1.pateadores[idxJugador];
        let nombreArquero = datosCPU.arquero;

        // Izquierda: Tu Pateador (Usa el color de su ropa)
        let bgIzq = escena.add.rectangle(0, 0, 120, 130, datosP1.colorRopa).setStrokeStyle(2, 0xffffff);
        let txtIzq = escena.add.text(0, 0, `${datosP1.nombre}\n\n${nombrePateador}\n(Pateador)`, { fontSize: '12px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoIzquierdo.add([bgIzq, txtIzq]);

        // Derecha: Arquero CPU
        let bgDer = escena.add.rectangle(0, 0, 120, 130, datosCPU.colorRopa).setStrokeStyle(2, 0xffffff);
        let txtDer = escena.add.text(0, 0, `${datosCPU.nombre}\n\n${nombreArquero}\n(Arquero)`, { fontSize: '12px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoDerecho.add([bgDer, txtDer]);

    } else {
        // TURNO: P1 Arquero vs CPU Pateador
        let nombreArquero = datosP1.arquero;
        let nombrePateador = datosCPU.pateadores[idxJugador];

        // Izquierda: Tu Arquero
        let bgIzq = escena.add.rectangle(0, 0, 120, 130, datosP1.colorRopa).setStrokeStyle(2, 0xffffff);
        let txtIzq = escena.add.text(0, 0, `${datosP1.nombre}\n\n${nombreArquero}\n(Arquero)`, { fontSize: '12px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoIzquierdo.add([bgIzq, txtIzq]);

        // Derecha: Pateador CPU
        let bgDer = escena.add.rectangle(0, 0, 120, 130, datosCPU.colorRopa).setStrokeStyle(2, 0xffffff);
        let txtDer = escena.add.text(0, 0, `${datosCPU.nombre}\n\n${nombrePateador}\n(Pateador)`, { fontSize: '12px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoDerecho.add([bgDer, txtDer]);
    }
}
