const PARTICLE_RENDER = (img, pos, vel, size, params) => (game, frame) => {
    const {
        gravity,
        shrink,
    } = params;

    vel.x += gravity.x;
    vel.y += gravity.y;

    pos.x += vel.x;
    pos.y += vel.y;

    size -= shrink;

    if(size < 1) return;

    game.drawImage(img, pos.x - size/2, pos.y - size/2, size, size);
};

class ParticleAnimation extends GSAnimation {
  constructor(frames, pos, vel, img, originalSize, params = {}, callback) {
    const defaultedParams = {
        gravity: new Position(0, 1),
        shrink: 0,
        ...params
    }

    super({
      frames: frames,
      render: PARTICLE_RENDER(img, pos, vel, originalSize, defaultedParams),
      callback: callback,
      absoluteSize: true,
      ...params
    });
  }
}
