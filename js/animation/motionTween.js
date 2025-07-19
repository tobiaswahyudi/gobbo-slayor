class MotionTweenAnimation extends GSAnimation {
  constructor(tgt, from, to, frames, options) {
    super({
      ...getAnimationOptions(options),
      frames: frames,
      render: this._render.bind(this),
    });

    this.tgt = tgt;
    this.from = from;
    this.to = to;
  }

  _render (game, frame) {
    const delta = this.from.negate().add(this.to);
    const progress = frame / this.frames;
    const res = this.from.clone().add(delta.scale(progress));
    this.tgt.x = res.x;
    this.tgt.y = res.y;
  }
}
