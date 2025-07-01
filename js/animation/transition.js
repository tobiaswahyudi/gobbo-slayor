const TRANSITION_FRAMES = 8;

const TRANSITION_DIRECTION = {
  IN: "in",
  OUT: "out",
};

const TRANSITION_RENDER = (direction) => (game, frame) => {
  const progress =
    direction === TRANSITION_DIRECTION.OUT
      ? 1 - frame / TRANSITION_FRAMES
      : frame / TRANSITION_FRAMES;

  const maxRadius = H_BOARD_SIZE * Math.sqrt(2);
  const radius = maxRadius * progress;

  const vignette = new Path2D();

  vignette.arc(32 + H_BOARD_SIZE, 32 + H_BOARD_SIZE, radius, 0, Math.PI * 2);
  vignette.lineTo(32 + BOARD_SIZE, 32 + H_BOARD_SIZE);
  vignette.lineTo(32 + BOARD_SIZE, 32 + BOARD_SIZE);
  vignette.lineTo(32, 32 + BOARD_SIZE);
  vignette.lineTo(32, 32);
  vignette.lineTo(32 + BOARD_SIZE, 32);
  vignette.lineTo(32 + BOARD_SIZE, 32 + H_BOARD_SIZE);
  vignette.closePath();

  game.ctx.save();
  game.ctx.clip(vignette, "evenodd");
  game.ctx.globalAlpha = 1 - 0.6 * progress;
  game.drawRect(32, 32, BOARD_SIZE, BOARD_SIZE, {
    fill: "#BDAFA1",
  });
  game.ctx.restore();
};

class TransitionAnimation extends GSAnimation {
  constructor(direction = TRANSITION_DIRECTION.IN, callback) {
    super({
      frames: TRANSITION_FRAMES,
      render: TRANSITION_RENDER(direction),
      callback: callback,
      blocksInput: true,
    });
    this.direction = direction;
    this.name = direction + this.name;
  }
}
