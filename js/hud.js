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

    let datosP1 = window.baseDeDatosEquipos[window.equipoSeleccionadoP1];
    let datosCPU = window.baseDeDatosEquipos[window.equipoSeleccionadoCPU];

    // FIX: Ahora modificado para dividir entre 4 pateadores (% 4)
    let idxJugador = window.ronda % 4;

    window.retratoIzquierdo = escena.add.container(75, 410);
    window.retratoDerecho = escena.add.container(725, 410);

    if (window.esTurnoP1 && !window.esperandoAtajada) {
        // TURNO: P1 Pateador vs CPU Arquero
        let nombrePateador = datosP1.pateadores[idxJugador];
        let nombreArquero = datosCPU.arquero;

        // --- IZQUIERDA: P1 PATEANDO ---
        let marcoIzq = escena.add.rectangle(0, 0, 100, 110, datosP1.colorRopa).setStrokeStyle(3, 0xffffff);
        let imgIzq = escena.add.image(0, 0, nombrePateador).setDisplaySize(94, 104);
        // TEXTO ABAJO: Cartelera oscura debajo de la card
        let cartelIzq = escena.add.rectangle(0, 75, 110, 34, 0x111111, 0.8).setStrokeStyle(1, 0xffffff);
        let txtIzq = escena.add.text(0, 75, `${nombrePateador}\n(PATEA)`, { fontSize: '11px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoIzquierdo.add([marcoIzq, imgIzq, cartelIzq, txtIzq]);

        // --- DERECHA: CPU ATAJANDO ---
        let marcoDer = escena.add.rectangle(0, 0, 100, 110, datosCPU.colorRopa).setStrokeStyle(3, 0xffffff);
        let imgDer = escena.add.image(0, 0, nombreArquero).setDisplaySize(94, 104);
        let cartelDer = escena.add.rectangle(0, 75, 110, 34, 0x111111, 0.8).setStrokeStyle(1, 0xffffff);
        let txtDer = escena.add.text(0, 75, `${nombreArquero}\n(ARQUERO)`, { fontSize: '11px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoDerecho.add([marcoDer, imgDer, cartelDer, txtDer]);

    } else {
        // TURNO: P1 Arquero vs CPU Pateador
        let nombreArquero = datosP1.arquero;
        let nombrePateador = datosCPU.pateadores[idxJugador];

        // --- IZQUIERDA: P1 ATAJANDO ---
        let marcoIzq = escena.add.rectangle(0, 0, 100, 110, datosP1.colorRopa).setStrokeStyle(3, 0xffffff);
        let imgIzq = escena.add.image(0, 0, nombreArquero).setDisplaySize(94, 104);
        let cartelIzq = escena.add.rectangle(0, 75, 110, 34, 0x111111, 0.8).setStrokeStyle(1, 0xffffff);
        let txtIzq = escena.add.text(0, 75, `${nombreArquero}\n(ARQUERO)`, { fontSize: '11px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoIzquierdo.add([marcoIzq, imgIzq, cartelIzq, txtIzq]);

        // --- DERECHA: CPU PATEANDO ---
        let marcoDer = escena.add.rectangle(0, 0, 100, 110, datosCPU.colorRopa).setStrokeStyle(3, 0xffffff);
        let imgDer = escena.add.image(0, 0, nombrePateador).setDisplaySize(94, 104);
        let cartelDer = escena.add.rectangle(0, 75, 110, 34, 0x111111, 0.8).setStrokeStyle(1, 0xffffff);
        let txtDer = escena.add.text(0, 75, `${nombrePateador}\n(PATEA)`, { fontSize: '11px', fill: '#ffffff', align: 'center', fontStyle: 'bold' }).setOrigin(0.5);
        window.retratoDerecho.add([marcoDer, imgDer, cartelDer, txtDer]);
    }
}
