const MOTION_TWEEN_RENDER = (tgt, from, to, frames) => {
  const delta = to.negate().add(from);
  return (game, frame) => {
    const progress = frame / frames;
    tgt = from.clone().add(delta.scale(progress));
  };
};

class MotionTweenAnimation extends GSAnimation {
  constructor(tgt, from, to, frames) {
    super({
      frames: frames,
      render: MOTION_TWEEN_RENDER(tgt, from, to, frames),
    });
  }
}
