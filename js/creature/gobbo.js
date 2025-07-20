class Gobbo extends Position {
  constructor(x, y, direction, hat, lastMovedDirection) {
    super(x, y);
    this.direction = direction;
    this.hat = hat;
    this.lastMovedDirection = lastMovedDirection;
  }

  clone() {
    return new Gobbo(
      this.x,
      this.y,
      this.direction,
      this.hat,
      this.lastMovedDirection
    );
  }

  render(game, offset = new Position(0, 0)) {
    if (this.direction === Direction.SLEEP) {
      game.drawImage(
        ASSETS.SPRITE.GOBBOS.SLEEP,
        cellCorner(this.x) + SPRITE_PADDING + offset.x,
        cellCorner(this.y) + SPRITE_PADDING + offset.y,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    } else {
      game.drawImage(
        ASSETS.SPRITE.GOBBOS.MOVE,
        cellCorner(this.x) + SPRITE_PADDING + offset.x,
        cellCorner(this.y) + SPRITE_PADDING + offset.y,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    }

    game.ctx.save();

    switch (this.lastMovedDirection) {
      case undefined:
        break;
      case Direction.UP:
        game.ctx.translate(
          cellCorner(this.x) + offset.x + HALF_SQUARE_SIZE,
          cellCorner(this.y) + offset.y + 1.35 * SQUARE_SIZE
        );
        game.ctx.rotate(-Math.PI / 2);
        game.drawImage(
          ASSETS.SPRITE.DUST,
          -HALF_SQUARE_SIZE,
          -HALF_SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
        break;
      case Direction.DOWN:
        game.ctx.translate(
          cellCorner(this.x) + offset.x + HALF_SQUARE_SIZE,
          cellCorner(this.y) + offset.y - 0.3 * SQUARE_SIZE
        );
        game.ctx.rotate(Math.PI / 2);
        game.drawImage(
          ASSETS.SPRITE.DUST,
          -HALF_SQUARE_SIZE,
          -HALF_SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
        break;
      case Direction.LEFT:
        game.ctx.translate(
          cellCorner(this.x) + offset.x + 1.2 * SQUARE_SIZE,
          cellCorner(this.y) + offset.y + 0.8 * SQUARE_SIZE
        );
        game.ctx.rotate(Math.PI);
        game.drawImage(
          ASSETS.SPRITE.DUST,
          -HALF_SQUARE_SIZE,
          -HALF_SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
        break;
      case Direction.RIGHT:
        game.ctx.translate(
          cellCorner(this.x) + offset.x - 0.2 * SQUARE_SIZE,
          cellCorner(this.y) + offset.y + 0.8 * SQUARE_SIZE
        );
        game.drawImage(
          ASSETS.SPRITE.DUST,
          -HALF_SQUARE_SIZE,
          -HALF_SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
        break;
    }

    game.ctx.restore();

    game.drawImage(
      this.hat.sprite,
      cellCorner(this.x) + SPRITE_PADDING + offset.x,
      cellCorner(this.y) + SPRITE_PADDING + offset.y,
      SPRITE_SIZE,
      SPRITE_SIZE
    );
  }
}
