const ASSETS = {
  SPRITE: {
    CRATE: "assets/sprite/crate.png",
    GOBBO: "assets/sprite/gobblin.png",
    HAT: {
        V: "assets/sprite/hat_v.png",
        H: "assets/sprite/hat_h.png",
        X: "assets/sprite/hat_no.png",
    },
    WIZ: "assets/sprite/wiz.png",
    EXPLOSION: "assets/sprite/explosion.png",
  },
  UI: {
    HAT: {
        V: "assets/ui/hat_v.png",
        H: "assets/ui/hat_h.png",
        X: "assets/ui/hat_no.png",
    },
    MANA: "assets/ui/mana.png",
  },
  TUTORIAL: {
    MOVE: "assets/ui/inst-move.png",
    ATTACK: "assets/ui/inst-attack.png",
    UNDO: "assets/ui/inst-undo.png",
  },
};

const _flatten = (obj) => {
    return Object.values(obj).flatMap(v => typeof v === 'object' ? _flatten(v) : v);
};

const ALL_ASSETS = _flatten(ASSETS);