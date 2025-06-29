class LevelHistory {
  constructor(levelString) {
    this.current = 0;
    const firstState = new LevelState();
    firstState.parse(levelString);
    this.history = [firstState];
  }

  getCurrent() {
    return this.history[this.current];
  }

  copyTop() {
    this.history.push(this.getCurrent().clone());
    this.current++;
  }

  pop() {
    if (this.current > 0) {
      this.history.pop();
      this.current--;
    }
  }

  reset() {
    this.current = 0;
    this.history = [this.history[0]];
  }
}
