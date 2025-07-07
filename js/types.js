const Direction = {
  UP: "u",
  DOWN: "d",
  LEFT: "l",
  RIGHT: "r",
  SLEEP: "s",
};

const oppositeDirection = (direction) => {
  switch (direction) {
    case Direction.UP:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.UP;
    case Direction.LEFT:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.LEFT;
  }
  return direction;
};

class Position {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Position(this.x, this.y);
  }

  add(other) {
    return new Position(this.x + other.x, this.y + other.y);
  }

  zero() {
    this.x = 0;
    this.y = 0;
    return this;
  }

  randomize() {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    return this;
  }

  normalize() {
    const len = Math.hypot(this.x, this.y);
    this.x /= len;
    this.y /= len;
    return this;
  }

  scale(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }
}
