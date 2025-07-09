const FONTS = [
  ['Edu-SA', ['400', '500', '600', '700']],
  ['Tiny5', ['400']],
];

const ASSETS = {
  SPRITE: {
    CRATE: "assets/sprite/crate.png",
    GOBBOS: {
      MOVE: "assets/sprite/gobblin.png",
      SLEEP: "assets/sprite/slepgobbo.png",
    },
    HAT: {
        V: "assets/sprite/hat_v.png",
        H: "assets/sprite/hat_h.png",
        X: "assets/sprite/hat_no.png",
    },
    WIZ: "assets/sprite/wiz.png",
    EXPLOSION: "assets/sprite/explosion.png",
    DUST: "assets/sprite/dust.png",
  },
  UI: {
    HAT: {
        V: "assets/ui/hat_v.png",
        H: "assets/ui/hat_h.png",
        X: "assets/ui/hat_no.png",
    },
    MANA: "assets/ui/mana.png",
    TITLE: "assets/ui/title.png",
    CREDITS: "assets/ui/creds.png",
    RESTART: "assets/ui/restart.png",
    POPUP: "assets/ui/nineslice-2.png",
    STAR: {
      SILVER: "assets/ui/star-silver.png",
      GOLD: "assets/ui/star-gold.png",
      WTF: "assets/ui/star-wtf.png",
    },
    SPACEBAR: "assets/ui/spacebar.png",
  },
  TUTORIAL: {
    MOVE: "assets/ui/inst-move.png",
    ATTACK: "assets/ui/inst-attack.png",
    UNDO: "assets/ui/inst-undo.png",
    TOOLTIP: "assets/ui/inst-tooltip.png",
    RESTART: "assets/ui/inst-restart.png",
  },
  WORLD: {
    MAP: "assets/worldmap/world.png",
    CAMP: {
      GOB: "assets/worldmap/camp-gob.png",
    },
    FORT: {
      GOB: "assets/worldmap/fort-gob.png",
    },
    FIRE: {
      GOB: "assets/worldmap/fire-gob.png",
      CLEAR: "assets/worldmap/fire-clear.png",
    },
    FLAG: {
      GOB: "assets/worldmap/flag-gob.png",
      WIZ: "assets/worldmap/flag-wiz.png",
    },
    LOCK: "assets/worldmap/lock.png",
  },
};

const _flatten = (obj) => {
    return Object.values(obj).flatMap(v => typeof v === 'object' ? _flatten(v) : v);
};

const ALL_ASSETS = _flatten(ASSETS);