const TERRA = "0xB96E54";
const VERDE = "0x72A11D";
const ROSSO = "0xE44A4A";
const MARRONE = "0x8B5A2B";

const A_TERRENO = 96;
const Y_TERRENO = 624;
const X_GINO = 200;
const L_GINO = 81;
const A_GINO = 84;
const L_FUNGO = 90;
const A_FUNGO = 63;
const L_LIVELLO = 3840;
const ANTICIPO_CAMERA = 200;
const X_FUNGHI = [900, 1700, 1800, 2600, 3100];
const L_PIATTAFORMA = 192;
const A_PIATTAFORMA = 21;
const X_PIATTAFORMA = 1740;
const Y_PIATTAFORMA = 456;

const VEL_SALTO = 1000;
const VEL_FUNGO = 100;
const VEL_CORSA = 480;

const TASTO_SALTO = PP.key_codes.SPACE;
const TASTO_SX = PP.key_codes.LEFT;
const TASTO_DX = PP.key_codes.RIGHT;

let terreno;
let gino;
let partita_finita = false;
let funghi = [];

function preload(s) {}

function crea_terreno(s) {
    terreno = PP.shapes.rectangle_add(s, L_LIVELLO / 2, Y_TERRENO + A_TERRENO / 2, L_LIVELLO, A_TERRENO, TERRA, 1);
    PP.physics.add(s, terreno, PP.physics.type.STATIC);
}

function crea_gino(s) {
    gino = PP.shapes.rectangle_add(s, X_GINO, Y_TERRENO - A_GINO / 2, L_GINO, A_GINO, VERDE, 1);
    PP.physics.add(s, gino, PP.physics.type.DYNAMIC);
    PP.physics.set_collide_world_bounds(gino, true);
    PP.physics.add_collider(s, gino, terreno);
}

function crea_fungo(s) {
    fungo = PP.shapes.rectangle_add(s, LARGHEZZA * 3 / 4, Y_TERRENO - A_FUNGO / 2, L_FUNGO, A_FUNGO, ROSSO, 1);
    PP.physics.add(s, fungo, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(fungo, false);
    PP.physics.set_velocity_x(fungo, -VEL_FUNGO);
    PP.physics.add_overlap_f(s, gino, fungo, fine_partita);
}
function crea_funghi(s) {
    for (let i = 0; i < X_FUNGHI.length; i++) {
        let f = PP.shapes.rectangle_add(s,
        X_FUNGHI[i], Y_TERRENO - A_FUNGO / 2,
        L_FUNGO, A_FUNGO, ROSSO, 1);
    PP.physics.add(s, f, PP.physics.type.DYNAMIC);
    PP.physics.set_allow_gravity(f, false);
    PP.physics.set_velocity_x(f, -VEL_FUNGO);
    PP.physics.add_overlap_f(s, gino, f, fine_partita);
    funghi.push(f);
}
}

function crea_camera(s) {
PP.physics.set_world_bounds(s, 0, 0, L_LIVELLO, ALTEZZA);
PP.camera.set_bounds(s, 0, 0, L_LIVELLO, ALTEZZA);
PP.camera.start_follow(s, gino, -ANTICIPO_CAMERA, 0);
}

function crea_piattaforma(s) {
let piattaforma = PP.shapes.rectangle_add(s,
X_PIATTAFORMA, Y_PIATTAFORMA,
L_PIATTAFORMA, A_PIATTAFORMA, MARRONE, 1);
PP.physics.add(s, piattaforma, PP.physics.type.STATIC);
PP.physics.add_collider(s, gino, piattaforma);
}

function create(s) {
    crea_terreno(s);
    crea_gino(s);
    crea_camera(s);
    crea_funghi(s);
    crea_piattaforma(s);
}

function fine_partita(s, a, b) {
    partita_finita = true;
    PP.scenes.start("fine");
}

function update(s) {
    if (partita_finita) {
        return;
    }
    salta(s);
    cammina(s);
}

function salta(s) {
    if (PP.interactive.kb.is_key_just_down(s, TASTO_SALTO)
    && PP.physics.is_on_ground(gino)) {
    PP.physics.set_velocity_y(gino, -VEL_SALTO);
    }
}

function cammina(s) {
    if (PP.interactive.kb.is_key_down(s, TASTO_SX)) {
        PP.physics.set_velocity_x(gino, -VEL_CORSA);
    } else if (PP.interactive.kb.is_key_down(s, TASTO_DX)) {
        PP.physics.set_velocity_x(gino, VEL_CORSA);
    } else {
        PP.physics.set_velocity_x(gino, 0);
}
}

function destroy(s) {}

PP.scenes.add("gino", preload, create, update, destroy);