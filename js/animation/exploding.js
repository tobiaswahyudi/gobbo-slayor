const EXPLOSION_FRAMES = 4;

const EXPLOSION_RENDER = (x, y, size, juice) => (game, frame) => {
  game.drawImage(ASSETS.SPRITE.EXPLOSION, x, y, size, size, {
    x: 32 * (frame % 4),
    y: 0,
    width: 32,
    height: 32,
  });

  juice
    .zero()
    .randomize()
    .normalize()
    .scale(6 - frame)
    .scale(1.5);

  if(frame == EXPLOSION_FRAMES) {
    juice.zero();
  }
};

class ExplosionAnimation extends GSAnimation {
  constructor(x, y, size, juice) {
    super({
      frames: EXPLOSION_FRAMES,
      render: EXPLOSION_RENDER(x, y, size, juice),
    });
  }
}
