const AnimationType = {
  NONE: false,
  EXPLODING: "EXPLODING",
  TRANSITION_OUT: "TRANSITION_OUT",
  TRANSITION_IN: "TRANSITION_IN",
};

class GSAnimation {
  constructor({
    needsInput = false,
    blocksInput = false,
    frames = 0,
    render = (game, frame) => {},
    handleInput = () => {
      return true;
    },
    callback = () => {},
  }) {
    this.frame = 0;
    this.frames = frames;
    this.needsInput = needsInput;
    this.blocksInput = blocksInput;
    this.render = render;
    this.inputHandler = handleInput;
    this.callback = callback;

    this.finished = false;
  }

  // Ticks the animation. Returns false if animation is done and needs to be cleaned up;
  tick(game) {
    if (this.finished) {
      return;
    }
    if (this.frame < this.frames) {
      this.frame++;
    }
    this.render(game, this.frame);
    if (this.frame >= this.frames && !this.needsInput) {
      if (this.callback) this.callback();
      this.finished = true;
    }
  }

  handleInput(input) {
    if (this.needsInput && this.frame >= this.frames) {
      console.log("receiving input", input);
      const res = this.inputHandler(input);
      console.log("input received for ", this.name, res);
      this.needsInput = res;
    }
  }
}
