const LEVEL_NO_OFFSETS = {
  wiz: new Position(0, 0),
  gobbos: [],
};

class LevelState {
  constructor() {
    this.turnCount = 0;
    this.player = new Position(0, 0);
    this.gobbos = [];
    this.walls = [];
    this.remainingBombs = 0;
    this.title = "";
    this.specialTiles = [];
    this.levelString = "";
    this.aimArea = new AimArea([]);
    this.id = "";
    this.bestMoves = 0;
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
    state.walls = this.walls.map((wall) => wall.clone());
    state.aimArea = new AimArea(this.aimArea.cells.map((cell) => cell.clone()));
    state.remainingBombs = this.remainingBombs;
    state.title = this.title;
    return state;
  }

  parse(specialTiles = {}) {
    const lines = this.levelString.split("\n");

    const OFFSET_LINES = 1;

    for (let y = 0; y < 8; y++) {
      const line = lines[y + OFFSET_LINES];
      const cells = line.trim().split("|");
      for (let x = 0; x < 8; x++) {
        const cell = cells[x];
        if (cell in specialTiles) {
          const [ctor, ...args] = specialTiles[cell];
          this.specialTiles.push(new ctor(x, y, ...args));
          continue;
        }
        switch (cell[0]) {
          case "C":
            this.walls.push(new Position(x, y));
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

  render(game, x, y, offsets = LEVEL_NO_OFFSETS) {
    const pos = new Position(x, y);

    const wizPos = pos.add(offsets.wiz);

    game.drawImage(
      ASSETS.SPRITE.WIZ,
      cellCorner(this.player.x) + SPRITE_PADDING + wizPos.x,
      cellCorner(this.player.y) + SPRITE_PADDING + wizPos.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );

    this.gobbos.forEach((gobbo, idx) =>
      gobbo.render(game, pos.add(offsets.gobbos[idx]))
    );
    this.walls.forEach((wall) => this.renderWall(game, wall, pos));

    this.aimArea.render(game, wizPos, this.player, this.remainingBombs > 0);
  }

  renderWall(game, wall, pos) {
    game.drawImage(
      ASSETS.SPRITE.CRATE,
      cellCorner(wall.x) + SPRITE_PADDING + pos.x,
      cellCorner(wall.y) + SPRITE_PADDING + pos.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }
}
