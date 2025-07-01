const CONSTANT_ONE = () => 1;

const JUICE_RENDER =
  (juice, frames, magnitude, fn = CONSTANT_ONE) =>
  (game, frame) => {
    juice.zero().randomize().normalize().scale(fn(frame)).scale(magnitude);
    if (frame == frames) {
      juice.zero();
    }
  };

class JuiceAnimation extends GSAnimation {
  constructor(juice, frames, magnitude, fn = CONSTANT_ONE) {
    super({
      frames: frames,
      render: JUICE_RENDER(juice, frames, magnitude, fn),
    });
  }
}
