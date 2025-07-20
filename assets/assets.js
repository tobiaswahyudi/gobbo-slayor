const FONTS = [
  ['Edu-SA', ['400', '500', '600', '700']],
  ['Tiny5', ['400']],
];

const ASSETS = {
  SPRITE: {
    CRATE: "assets/sprite/crate.png",
    BLOCK: "assets/sprite/block.png",
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
    },
    P2: {
      MASK: "assets/comic/mask-p2.png",
      ONE: {
        BG: "assets/comic/p2/p2-1-bg.png",
        HAND: "assets/comic/p2/p2-1-hand.png",
        HOLDER: "assets/comic/p2/p2-1-holder.png",
        SHADOW: "assets/comic/p2/p2-1-shadow.png",
        STAFF: "assets/comic/p2/p2-1-staff.png",
        WIZ: "assets/comic/p2/p2-1-wiz.png",
      },
      TWO: {
        BG: "assets/comic/p2/p2-2-bg.png",
        BALL: "assets/comic/p2/p2-2-ball.png",
        FIRE: "assets/comic/p2/p2-2-fire.png",
        SHADOW: "assets/comic/p2/p2-2-shadow.png",
        WIZSTAFF: "assets/comic/p2/p2-2-wizstaff.png",
      },
    },
    P3: {
      ONE: {
        WIZ: "assets/comic/p3/p3-1-wiz.png"
      },
      TWO: {
        WIZ: "assets/comic/p3/p3-2-wiz.png",
        BOOM: "assets/comic/p3/p3-2-boom.png",
        GOB_EXPLODE: "assets/comic/p3/p3-2-gob-expl.png",
        GROUND_LIGHT: "assets/comic/p3/p3-2-ground-light.png",
        SAY_BOOM: "assets/comic/p3/p3-2-say-boom.png",
      },
      GOB_RUN: {
        ONE: "assets/comic/p3/p3-1-gob-run-1.png",
        TWO: "assets/comic/p3/p3-1-gob-run-2.png",
      },
      SKY: "assets/comic/p3/p3-sky.png",
      FOREGROUND: "assets/comic/p3/p3-foreground.png",
      BACKGROUND: "assets/comic/p3/p3-background.png",
    }
  },
};

const _flatten = (obj) => {
  return Object.values(obj).flatMap((v) =>
    typeof v === "object" ? _flatten(v) : v
  );
};

const ALL_ASSETS = _flatten(ASSETS);
