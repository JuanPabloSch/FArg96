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
window.tuColA = 2; // Columna central por defecto
window.tuRowA = 1; // Fila central por defecto
window.retratoIzquierdo = null;
window.retratoDerecho = null;

// Base de datos oficial de tus plantillas
window.baseDeDatosEquipos = {
    "LAN": { nombre: "Lanus", carpeta: "lanus", sprites: { idle: "negrouu_idle", vuelo: "negrouu_vuelo", shoot: "indio_shoot" }, colorRopa: 0x2980b9, arquero: "Lechuga", pateadores: ["Huguito", "Chango", "Caño", "Chupa"] },
    "BOK": { nombre: "Boca", carpeta: "boca", sprites: { idle: "negrouu_idle", vuelo: "negrouu_vuelo", shoot: "indio_shoot" },colorRopa: 0xf1c40f, arquero: "El_Mono", pateadores: ["Cagna", "Fabri", "Manteca", "Alphonse"] },
    "RIV": { nombre: "River", carpeta: "river", sprites: { idle: "negrouu_idle", vuelo: "negrouu_vuelo", shoot: "indio_shoot" }, colorRopa: 0xff0000, arquero: "Burgos", pateadores: ["El_Enzo", "El_Burrito", "Crespo", "Almeyda"] },
    "RAC": { nombre: "Racing", carpeta: "racing", sprites: { idle: "negrouu_idle", vuelo: "negrouu_vuelo", shoot: "indio_shoot" }, colorRopa: 0x00a8e8, arquero: "Nacho", pateadores: ["Mago", "Chelo", "Ubeda", "Piojo"] },
    "IND": { nombre: "Indepte", carpeta: "independiente", sprites: { idle: "negrouu_idle", vuelo: "negrouu_vuelo", shoot: "indio_shoot" }, colorRopa: 0xff0000, arquero: "Faryd", pateadores: ["Burru", "Panchito", "Morron", "Cascini"] },
    "NEW": { nombre: "Newells", carpeta: "newells", sprites: { idle: "negrouu_idle", vuelo: "negrouu_vuelo", shoot: "indio_shoot" }, colorRopa: 0xff0000, arquero: "Cejas", pateadores: ["Manso", "Marioni", "Oliendo", "Saldaña"] }
};

window.equipoSeleccionadoP1 = "LAN";
window.equipoSeleccionadoCPU = "BOK";
