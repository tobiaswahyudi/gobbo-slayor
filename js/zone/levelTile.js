const LEVEL_TILE_SIZE = 50;
const LEVEL_TILE_PADDING = (SQUARE_SIZE - LEVEL_TILE_SIZE) * 0.5;

class LevelTile extends Position {
  constructor(x, y, number, zoneId, levelId) {
    super(x, y);
    this.number = number;
    this.zoneId = zoneId;
    this.levelId = levelId;

    this.level = new LevelState();
    this.level.parse(ZONE_LEVELS[zoneId].levels[levelId]);
  }

  render(game) {
    game.drawRect(
      BOARD_PADDING + this.x * SQUARE_SIZE + LEVEL_TILE_PADDING,
      BOARD_PADDING + this.y * SQUARE_SIZE + LEVEL_TILE_PADDING,
      LEVEL_TILE_SIZE,
      LEVEL_TILE_SIZE,
      {
        color: "#000",
        border: "#000",
        borderWidth: 1,
      }
    );

    game.drawText(
      this.number,
      BOARD_PADDING + cellCorner(this.x) + HALF_SQUARE_SIZE,
      BOARD_PADDING + cellCorner(this.y) + HALF_SQUARE_SIZE - 16,
      {
        color: "#000",
        font: `500 32px Tiny5`,
        align: "center",
      }
    );
  }
}
