class LevelState {
    constructor() {
      this.turnCount = 0;
      this.player = new Position(0, 0);
      this.gobbos = [];
      this.walls = [];
      this.aimArea = [];
      this.remainingBombs = 2;
      this.title = "";
    }
  
    clone() {
      const state = new LevelState();
      state.turnCount = this.turnCount;
      state.player = this.player.clone();
      state.gobbos = this.gobbos.map((gobbo) => gobbo.clone());
      state.walls = this.walls.map((wall) => wall.clone());
      state.aimArea = this.aimArea.map((aim) => aim.clone());
      state.remainingBombs = this.remainingBombs;
      return state;
    }
  
    parse(levelString) {
      const lines = levelString.split("\n");
  
      this.title = lines[1];
      this.remainingBombs = parseInt(lines[2]);
  
      for (let y = 0; y < 8; y++) {
        const line = lines[y + 3];
        const cells = line.split("|");
  
        for (let x = 0; x < 8; x++) {
          const cell = cells[x];
          switch (cell[0]) {
            case "C":
              this.walls.push(new Position(x, y));
              break;
            case "H":
            case "V":
            case "X":
              const direction = cell[1];
              const hatType = cell[0];
              this.gobbos.push(new Gobbo(x, y, direction, hatType));
              break;
            case "W":
              this.player = new Position(x, y);
              break;
          }
        }
      }
      for (let line = 11; line < lines.length; line++) {
        const coords = lines[line].split(",");
        if (coords.length < 2) continue;
        this.aimArea.push(new Position(parseInt(coords[0]), parseInt(coords[1])));
      }
    }
  }