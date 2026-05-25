window.golesP1 = 0;
window.golesCPU = 0;
window.historialP1 = [];
window.historialCPU = [];
window.esTurnoP1 = true;
window.esperandoAtajada = false;
window.zonaGolCPU = -1;
window.ronda = 0;
window.ball = null;
window.marcadorTexto = null;
window.barraTiempo = null;
window.rectTiro = null;
window.rectArquero = null;
window.tuColA = 2;
window.tuRowA = 1;
window.retratoIzquierdo = null;
window.retratoDerecho = null;

// BASE DE DATOS DE EQUIPOS
window.baseDeDatosEquipos = {
    "ARG": {
        nombre: "Indio Malo",
        colorRopa: 0x2980b9, 
        arquero: "El Negrouu",
        pateadores: ["Sebu", "Chino", "Juano", "Nahui"]
    },
    "BRA": {
        nombre: "Ranchos FC",
        colorRopa: 0xf1c40f, 
        arquero: "Rolo",
        pateadores: ["El Gibe", "Santos", "El Oscar", "Caralucas"]
    }
};

window.equipoSeleccionadoP1 = "ARG";
window.equipoSeleccionadoCPU = "BRA";
