// js/gameLogic.js
function ejecutarDisparo(escena, colT, rowT, colA, rowA, esJugador) {
    escena.tweens.killTweensOf(window.barraTiempo);
    
    let xT = 200 + (Math.max(0, Math.min(4, colT)) * 80) + 40;
    let yT = 50 + (Math.max(0, Math.min(2, rowT)) * 66.6) + 33;
    let xA = 200 + (Math.max(0, Math.min(4, colA)) * 80) + 40;
    let yA = 50 + (Math.max(0, Math.min(2, rowA)) * 66.6) + 33;
    let esAtajado = (colT === colA && rowT === rowA);
    
    if(window.rectTiro) window.rectTiro.destroy(); 
    if(window.rectArquero) window.rectArquero.destroy();
    window.rectTiro = escena.add.rectangle(xT, yT, 80, 66.6).setStrokeStyle(4, 0x3366ff);
    window.rectArquero = escena.add.rectangle(xA, yA, 80, 66.6).setStrokeStyle(4, esJugador ? 0xff6666 : 0x66ff66);

    escena.tweens.add({
        targets: window.ball, x: xT, y: yT, duration: 500,
        onComplete: () => {
            if (!esAtajado) {
                esJugador ? window.golesP1++ : window.golesCPU++;
                esJugador ? window.historialP1.push("GOL") : window.historialCPU.push("GOL");
            } else {
                esJugador ? window.historialP1.push("ATA") : window.historialCPU.push("ATA");
            }
            window.marcadorTexto.setText(`P1: ${window.golesP1} - CPU: ${window.golesCPU}`);
            window.ball.setPosition(400, 500);
            dibujarHUD(escena);
            if(window.rectTiro) window.rectTiro.destroy(); 
            if(window.rectArquero) window.rectArquero.destroy();
            
            if (esJugador) {
                window.esperandoAtajada = true; window.esTurnoP1 = false;
                iniciarBarra(escena, false);
            } else {
                window.esperandoAtajada = false; window.esTurnoP1 = true; window.ronda++;
                if (window.ronda < 5 || window.golesP1 === window.golesCPU) iniciarBarra(escena, true);
                else { alert("Final: " + window.golesP1 + "-" + window.golesCPU); location.reload(); }
            }
        }
    });
}

function iniciarBarra(escena, esJugador) {
    window.barraTiempo.scaleX = 1;
    escena.tweens.killTweensOf(window.barraTiempo);
    escena.tweens.add({ targets: window.barraTiempo, scaleX: 0, duration: 3000, onComplete: () => {
        if (esJugador && !window.esperandoAtajada) ejecutarDisparo(escena, 2, 1, 0, 0, true);
        else if (!window.esperandoAtajada) {
            window.zonaGolCPU = Math.floor(Math.random() * 15);
            ejecutarDisparo(escena, window.zonaGolCPU % 5, Math.floor(window.zonaGolCPU / 5), 2, 1, false);
        }
    }});
}