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
    this.aimArea = [];
  }

  static make({ title = "", bombs = 0, level, aimArea = []}) {
    const state = new LevelState();
    state.title = title;
    state.remainingBombs = bombs;
    state.levelString = level;
    state.aimArea = aimArea.map(([x, y]) => new Position(x, y));

    state.parse();
    return state;
  }

  clone() {
    const state = new LevelState();
    state.turnCount = this.turnCount;
    state.player = this.player.clone();
    state.gobbos = this.gobbos.map((gobbo) => gobbo.clone());
    state.walls = this.walls.map((wall) => wall.clone());
    state.aimArea = this.aimArea.map((aim) => aim.clone());
    state.remainingBombs = this.remainingBombs;
    state.title = this.title;
    return state;
  }

  parse(specialTiles = {}) {
    const lines = this.levelString.split("\n");

    const OFFSET_LINES = 1

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
            this.gobbos.push(new Gobbo(x, y, direction, hatType));
            break;
          case "W":
            this.player = new Position(x, y);
            break;
        }
      }
    }
  }

  render(game, x, y) {
    const pos = new Position(x, y);

    game.drawImage(
      ASSETS.SPRITE.WIZ,
      cellCorner(this.player.x) + SPRITE_PADDING + x,
      cellCorner(this.player.y) + SPRITE_PADDING + y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );

    this.gobbos.forEach((gobbo) => gobbo.render(game, pos));
    this.walls.forEach((wall) => this.renderWall(game, wall, pos));
    this.renderAimAreas(game, pos);
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

  isOutOfBounds(x, y) {
    return x < 0 || x > 7 || y < 0 || y > 7;
  }

  isInAimArea(x, y, lookup) {
    return !this.isOutOfBounds(x, y) && lookup[x][y];
  }

  renderAimAreas(game, pos) {
    const aimAreaLookup = new Array(GRID_SIZE)
      .fill(null)
      .map(() => new Array(GRID_SIZE).fill(false));

    const areas = this.aimArea
      .map((area) => area.add(this.player))
      .filter((area) => !this.isOutOfBounds(area.x, area.y));

    if (areas.length == 0) return;

    areas.forEach((area) => {
      aimAreaLookup[area.x][area.y] = true;
      this.renderAimArea(game, area, pos);
    });

    const outline = new Path2D();

    areas.forEach((area) => {
      if (!this.isInAimArea(area.x - 1, area.y, aimAreaLookup)) {
        outline.moveTo(cellCorner(area.x) + pos.x, cellCorner(area.y) + pos.y);
        outline.lineTo(
          cellCorner(area.x) + pos.x,
          cellCorner(area.y + 1) + pos.y
        );
      }
      if (!this.isInAimArea(area.x + 1, area.y, aimAreaLookup)) {
        outline.moveTo(
          cellCorner(area.x + 1) + pos.x,
          cellCorner(area.y) + pos.y
        );
        outline.lineTo(
          cellCorner(area.x + 1) + pos.x,
          cellCorner(area.y + 1) + pos.y
        );
      }
      if (!this.isInAimArea(area.x, area.y - 1, aimAreaLookup)) {
        outline.moveTo(cellCorner(area.x) + pos.x, cellCorner(area.y) + pos.y);
        outline.lineTo(
          cellCorner(area.x + 1) + pos.x,
          cellCorner(area.y) + pos.y
        );
      }
      if (!this.isInAimArea(area.x, area.y + 1, aimAreaLookup)) {
        outline.moveTo(
          cellCorner(area.x) + pos.x,
          cellCorner(area.y + 1) + pos.y
        );
        outline.lineTo(
          cellCorner(area.x + 1) + pos.x,
          cellCorner(area.y + 1) + pos.y
        );
      }
    });

    const leftmostCellPos = areas.reduce(
      (min, area) => (area.x < min ? area.x : min),
      GRID_SIZE
    );
    const leftmostCell = areas.find((area) => area.x === leftmostCellPos);

    // draw a line from THE MIDDLE OF THE MAGIC STAFF at (28, 12)

    const magicStaffX = (27.5 / 32) * SPRITE_SIZE + SPRITE_PADDING;
    const magicStaffY = (11.5 / 32) * SPRITE_SIZE + SPRITE_PADDING;

    outline.moveTo(
      cellCorner(this.player.x) + magicStaffX + pos.x,
      cellCorner(this.player.y) + magicStaffY + pos.y
    );
    outline.lineTo(
      cellCorner(leftmostCell.x) + pos.x,
      cellCorner(leftmostCell.y + 0.5) + pos.y
    );

    game.drawPath(outline, {
      stroke: this.remainingBombs > 0 ? "#FF6F00" : "#808080A0",
      strokeWidth: 4,
    });
  }

  renderAimArea(game, area, pos) {
    game.drawRect(
      cellCorner(area.x) + pos.x,
      cellCorner(area.y) + pos.y,
      SQUARE_SIZE,
      SQUARE_SIZE,
      { fill: this.remainingBombs > 0 ? "#ffa05766" : "#ababab66" }
    );
  }
}
