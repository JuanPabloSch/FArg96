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

// --- NUEVA SECCIÓN: PLANTILLAS Y SELECCIÓN DE EQUIPOS ---

// Base de datos de los equipos (Podés agregar más países siguiendo esta estructura)
window.baseDeDatosEquipos = {
    "ARG": {
        nombre: "Argentina",
        colorRopa: 0x2980b9, // Celeste/Azul
        arquero: "G. Pumpido",
        pateadores: ["D. Maradona", "G. Batistuta", "L. Messi", "H. Crespo", "J. Riquelme"]
    },
    "BRA": {
        nombre: "Brasil",
        colorRopa: 0xf1c40f, // Amarillo
        arquero: "Taffarel",
        pateadores: ["Pelé", "Ronaldo", "Ronaldinho", "Romario", "Rivaldo"]
    }
};

// Variables que definirán qué equipo se usa en el partido.
// Por ahora los dejamos fijos, luego tu menú de selección cambiará estos strings.
window.equipoSeleccionadoP1 = "ARG";
window.equipoSeleccionadoCPU = "BRA";
