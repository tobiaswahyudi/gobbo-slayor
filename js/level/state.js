const LEVEL_NO_OFFSETS = {
  wiz: new Position(0, 0),
  gobbos: [],
  aimArea: new Position(0, 0),
};

const DEFAULT_SIZE = 8;
class LevelState {
  constructor() {
    this.turnCount = 0;
    this.player = new Position(0, 0);
    this.gobbos = [];
    this.crates = [];
    this.blocks = []; // Aim-blocking blocks
    this.remainingBombs = 0;
    this.title = "";
    this.specialTiles = [];
    this.levelString = "";
    this.aimArea = new AimArea([]);
    this.id = "";
    this.bestMoves = 0;
    this.size = 8;
  }

  static make({
    id = "",
    title = "",
    bombs = 0,
    level,
    aimArea = [],
    bestMoves = 0,
  }) {
    const state = new LevelState();
    state.id = id;
    state.title = title;
    state.remainingBombs = bombs;
    state.levelString = level;
    state.aimArea = new AimArea(aimArea.map(([x, y]) => new Position(x, y)));
    state.bestMoves = bestMoves;
    state.parse();
    return state;
  }

  clone() {
    const state = new LevelState();
    state.turnCount = this.turnCount;
    state.player = this.player.clone();
    state.gobbos = this.gobbos.map((gobbo) => gobbo.clone());
    state.crates = this.crates.map((wall) => wall.clone());
    state.blocks = this.blocks.map((wall) => wall.clone());
    state.aimArea = new AimArea(this.aimArea.cells.map((cell) => cell.clone()));
    state.remainingBombs = this.remainingBombs;
    state.title = this.title;
    state.size = this.size;
    return state;
  }

  parse(specialTiles = {}) {
    const lines = this.levelString.split("\n");

    const OFFSET_LINES = 1;

    this.size = lines.filter((x) => x.length).length;

    for (let y = 0; y < this.size; y++) {
      const line = lines[y + OFFSET_LINES];
      const cells = line.trim().split("|");
      for (let x = 0; x < this.size; x++) {
        const cell = cells[x];
        if (cell in specialTiles) {
          const [ctor, ...args] = specialTiles[cell];
          this.specialTiles.push(new ctor(x, y, ...args));
          continue;
        }
        switch (cell[0]) {
          case "B":
            this.blocks.push(new Position(x, y));
            break;
          case "C":
            this.crates.push(new Position(x, y));
            break;
          case "H":
          case "V":
          case "X":
            const direction = cell[1];
            const hatType = cell[0];
            const hat = HATS[hatType];
            this.gobbos.push(new Gobbo(x, y, direction, hat));
            break;
          case "W":
            this.player = new Position(x, y);
            break;
        }
      }
    }
  }

  render(game, x, y, inputOffsets) {
    const offsets = {
      ...LEVEL_NO_OFFSETS,
      ...inputOffsets,
    };

    const scale = DEFAULT_SIZE / this.size;

    game.ctx.save();
    game.ctx.translate(x, y);
    game.ctx.scale(scale, scale);

    const wizPos = offsets.wiz || new Position(0, 0);

    game.drawImage(
      ASSETS.SPRITE.WIZ,
      cellCorner(this.player.x) + SPRITE_PADDING + wizPos.x,
      cellCorner(this.player.y) + SPRITE_PADDING + wizPos.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );

    this.gobbos.forEach((gobbo, idx) =>
      gobbo.render(game, offsets.gobbos[idx])
    );
    this.crates.forEach((wall) => this.renderCrate(game, wall));
    this.blocks.forEach((wall) => this.renderBlock(game, wall));

    this.aimArea.render(
      game,
      this.size,
      wizPos,
      this.player,
      this.remainingBombs > 0,
      offsets.aimArea
    );

    game.ctx.restore();
  }

  renderCrate(game, wall) {
    game.drawImage(
      ASSETS.SPRITE.CRATE,
      cellCorner(wall.x) + SPRITE_PADDING,
      cellCorner(wall.y) + SPRITE_PADDING,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }

  renderBlock(game, wall) {
    game.drawImage(
      ASSETS.SPRITE.BLOCK,
      cellCorner(wall.x) + SPRITE_PADDING,
      cellCorner(wall.y) + SPRITE_PADDING,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }
}
