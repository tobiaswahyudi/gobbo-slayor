const LOCK_SIZE = 60;
const LOCK_PADDING = (SQUARE_SIZE - LOCK_SIZE) * 0.5;

class LockTile extends Position {
  constructor(x, y, neededStars, zoneId, progress) {
    super(x, y);
    this.neededStars = Number(neededStars);
    this.zoneId = zoneId;
    this.progress = progress;

    this.closed = true;
  }

  get stars() {
    return this.progress.getLevelSilver(this.zoneId);
  }

  checkOpen(game) {
    this.closed = this.stars < this.neededStars;
  }

  render(game) {
    this.checkOpen(game);
    if (!this.closed) return;

    game.drawImage(
      ASSETS.WORLD.LOCK,
      BOARD_PADDING + this.x * SQUARE_SIZE + LOCK_PADDING,
      BOARD_PADDING + this.y * SQUARE_SIZE + LOCK_PADDING,
      LOCK_SIZE,
      LOCK_SIZE
    );

    game.drawText(
      this.stars,
      BOARD_PADDING + cellCorner(this.x) + HALF_SQUARE_SIZE + 14,
      BOARD_PADDING + cellCorner(this.y) + HALF_SQUARE_SIZE - 8,
      {
        color: "#97a0cc",
        font: `500 16px Tiny5`,
        align: "center",
      }
    );

    game.drawText(
      this.neededStars,
      BOARD_PADDING + cellCorner(this.x) + HALF_SQUARE_SIZE + 16,
      BOARD_PADDING + cellCorner(this.y) + HALF_SQUARE_SIZE + 8,
      {
        color: "#97a0cc",
        font: `500 16px Tiny5`,
        align: "center",
      }
    );
  }
}
