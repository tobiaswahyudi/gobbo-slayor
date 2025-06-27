const ASSETS = {
  SPRITE: {
    CRATE: "assets/sprite/crate.png",
    GOBBO: "assets/sprite/gobblin.png",
    HAT: {
        VERTICAL: "assets/sprite/hat_v.png",
        HORIZONTAL: "assets/sprite/hat_h.png",
        REMOVE: "assets/sprite/hat_no.png",
    },
    WIZ: "assets/sprite/wiz.png",
  },
  UI: {
    HAT: {
        VERTICAL: "assets/ui/hat_v.png",
        HORIZONTAL: "assets/ui/hat_h.png",
        REMOVE: "assets/ui/hat_no.png",
    },
    MANA: "assets/ui/mana.png",
  },
};

const _flatten = (obj) => {
    return Object.values(obj).flatMap(v => typeof v === 'object' ? _flatten(v) : v);
};

const ALL_ASSETS = _flatten(ASSETS);