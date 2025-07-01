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
  COMIC: {
    OUTLINE: "assets/comic/outlines.png",
    P1: {
      MASK: "assets/comic/mask-p1.png",
      ONE: {
        DOOR: "assets/comic/p1/p1-1-door.png",
        WINDOW: "assets/comic/p1/p1-1-window.png",
      },
      TWO: {
        DOOR: "assets/comic/p1/p1-2-door.png",
        DOOR_FRAGMENTS: "assets/comic/p1/p1-2-doorfragments.png",
        WINDOW: "assets/comic/p1/p1-2-window.png",
        EXCLAMATION: "assets/comic/p1/p1-2-excl.png",
        GOBBO: {
          LEFT: "assets/comic/p1/p1-2-lgobbo.png",
          RIGHT: "assets/comic/p1/p1-2-rgobbo.png",
          WINDOW: "assets/comic/p1/p1-2-windowgobbo.png",
        },
        WIZ: "assets/comic/p1/p1-2-wiz.png",
      },
      GROUND: "assets/comic/p1/p1-ground.png",
      SIGN: "assets/comic/p1/p1-sign.png",
      SKY: "assets/comic/p1/p1-sky.png",
      TOWER: "assets/comic/p1/p1-tower.png",
    }
  },
};

const _flatten = (obj) => {
    return Object.values(obj).flatMap(v => typeof v === 'object' ? _flatten(v) : v);
};

const ALL_ASSETS = _flatten(ASSETS);