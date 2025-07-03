const ETHEREAL_START = 0.8;
const ETHEREAL_END = 1.4;
const ETHEREAL_OPACITY = 0.6;
const ETHEREAL_OUT_FRAMES = 8;
const ETHEREAL_IN_FRAMES = 4;

const ETHEREAL_RENDER = (img, x, y, originalSize) => (game, frame) => {
  const opacityProgress =
    frame < ETHEREAL_IN_FRAMES
      ? frame / ETHEREAL_IN_FRAMES
      : 1 - (frame - ETHEREAL_IN_FRAMES) / ETHEREAL_OUT_FRAMES;

  const scaleProgress = frame / (ETHEREAL_IN_FRAMES + ETHEREAL_OUT_FRAMES);
  const scale = ETHEREAL_START + (ETHEREAL_END - ETHEREAL_START) * scaleProgress;

  const size = originalSize * scale;
  const halfSize = size * 0.5;

  game.ctx.save();
  game.ctx.globalAlpha = ETHEREAL_OPACITY * opacityProgress;

  game.drawImage(img, x - halfSize, y - halfSize, size, size);

  game.ctx.restore();
};

class EtherealAnimation extends GSAnimation {
  constructor(x, y, img, originalSize) {
    super({
      frames: ETHEREAL_IN_FRAMES + ETHEREAL_OUT_FRAMES,
      render: ETHEREAL_RENDER(img, x, y, originalSize),
    });
  }
}
