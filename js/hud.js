// js/hud.js
function dibujarHUD(escena) {
    escena.children.getAll().filter(obj => obj.name === 'hudCirculo').forEach(obj => obj.destroy());
    
    for (let i = 0; i < window.historialP1.length; i++) {
        let c = escena.add.circle(50 + (i * 30), 550, 12, (window.historialP1[i] === "GOL") ? 0x00ff00 : 0xff0000).setStrokeStyle(2, 0xffffff);
        c.name = 'hudCirculo';
    }
    for (let i = 0; i < window.historialCPU.length; i++) {
        let c = escena.add.circle(600 + (i * 30), 550, 12, (window.historialCPU[i] === "GOL") ? 0x00ff00 : 0xff0000).setStrokeStyle(2, 0xffffff);
        c.name = 'hudCirculo';
    }
}