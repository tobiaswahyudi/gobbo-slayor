// two square centered
const TUTORIAL_MURAL_SIZE = 96;
const TUTORIAL_MURAL_PADDING = 16;

class TutorialTile extends Position {
  constructor(x, y, image, width = TUTORIAL_MURAL_SIZE, height = TUTORIAL_MURAL_SIZE) {
    super(x, y);
    this.image = image;
    this.width = width;
    this.height = height;
  }

  render(game, offsets = {x: 0, y: 0}) {
    game.ctx.globalAlpha = 0.3;
    game.drawImage(
      this.image,
      cellCorner(this.x + 0.5) + 0.5 * offsets.x + TUTORIAL_MURAL_PADDING,
      cellCorner(this.y + 0.5) + 0.5 * offsets.y + TUTORIAL_MURAL_PADDING,
      this.width,
      this.height,
    );
    game.ctx.globalAlpha = 1;
  }
}

class TextTutorialTile extends Position {
  constructor(x, y, text, xPadding = 0, yPadding = 0) {
    super(x, y);
    this.text = text;
    this.xPadding = xPadding;
    this.yPadding = yPadding;
  }

  render(game, offsets = {x: 0, y: 0}) {
    game.ctx.globalAlpha = 0.3;
    game.drawText(
      this.text.split('\n'),
      cellCorner(this.x + 0.5) + 0.5 * offsets.x + this.xPadding,
      cellCorner(this.y + 0.5) + 0.5 * offsets.y + this.yPadding,
      {
        color: "#000",
        font: "600 36px Tiny5",
        align: "left",
      },
    );
    game.ctx.globalAlpha = 1;
  }
}
