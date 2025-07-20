const MOTION_TWEEN_RENDER = (tgt, from, to, frames) => {
  return (game, frame) => {
    const delta = from.negate().add(to);
    const progress = frame / frames;
    const res = from.clone().add(delta.scale(progress));
    tgt.x = res.x;
    tgt.y = res.y;
  };
};

class MotionTweenAnimation extends GSAnimation {
  constructor(tgt, from, to, frames, options) {
    super({
      ...getAnimationOptions(options),
      frames: frames,
      render: MOTION_TWEEN_RENDER(tgt, from, to, frames),
    });

    this.tgt = tgt;
    this.from = from;
    this.to = to;
  }
}
