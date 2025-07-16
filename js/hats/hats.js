const HatType = {
  VERTICAL: "V",
  HORIZONTAL: "H",
  REMOVE: "X",
};

class Hat {
  constructor(type, sprite, display, gobboKilledCallback) {
    this.type = type;
    this.sprite = sprite;
    this.display = display;
    this.gobboKilledCallback = gobboKilledCallback;
  }

  gobboKilled(aimArea, gobbo) {
    this.gobboKilledCallback(aimArea, gobbo);
  }
}

const HATS = {
  [HatType.REMOVE]: new Hat(
    HatType.REMOVE,
    ASSETS.SPRITE.HAT[HatType.REMOVE],
    ASSETS.UI.HAT[HatType.REMOVE],
    (aimArea, gobbo) => {
      aimArea.remove(gobbo);
    }
  ),
  [HatType.HORIZONTAL]: new Hat(
    HatType.HORIZONTAL,
    ASSETS.SPRITE.HAT[HatType.HORIZONTAL],
    ASSETS.UI.HAT[HatType.HORIZONTAL],
    (aimArea, gobbo) => {
      aimArea.add(new Position(gobbo.x - 1, gobbo.y));
      aimArea.add(new Position(gobbo.x + 1, gobbo.y));
    }
  ),
  [HatType.VERTICAL]: new Hat(
    HatType.VERTICAL,
    ASSETS.SPRITE.HAT[HatType.VERTICAL],
    ASSETS.UI.HAT[HatType.VERTICAL],
    (aimArea, gobbo) => {
      aimArea.add(new Position(gobbo.x, gobbo.y - 1));
      aimArea.add(new Position(gobbo.x, gobbo.y + 1));
    }
  ),
};
