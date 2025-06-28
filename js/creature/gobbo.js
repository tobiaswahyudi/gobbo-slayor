class Gobbo extends Position {
    constructor(x, y, direction, hatType) {
      super(x, y);
      this.direction = direction;
      this.hatType = hatType;
    }
  
    clone() {
      return new Gobbo(this.x, this.y, this.direction, this.hatType);
    }
  }