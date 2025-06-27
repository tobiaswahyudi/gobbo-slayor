const MS_PER_FRAME = 30;

class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Game state
    this.isRunning = false;

    // Canvas dimensions
    this.width = 816;
    this.height = 576;

    // Scene management
    this.scene = "level"; // menus|level

    // Input handling
    this.keys = {};
    this.keysPressed = {}; // For single keypress detection
    this.mouse = {
      x: 0,
      y: 0,
      clicked: false,
    };

    // Initialize modules
    this.menuManager = new MenuManager(this);
    this.levelManager = new LevelManager(this);

    this.preloadFinished = false;
    this.loadedImages = new Map();

    this.init();
  }

  init() {
    // Set canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.setupEventListeners();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.textRendering = "geometricPrecision";


    console.log("Game initialized");
  }

  setupEventListeners() {
    // Keyboard events
    window.addEventListener("keydown", (e) => {
      if (!this.keys[e.code]) {
        this.keysPressed[e.code] = true; // Single press detection
      }
      this.keys[e.code] = true;
      if (this.handleKeyPress(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
      this.keysPressed[e.code] = false;
      e.preventDefault();
    });

    // Minimal mouse events (mainly for UI)
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.addEventListener("click", (e) => {
      this.mouse.clicked = true;
      this.handleMouseClick(this.mouse.x, this.mouse.y);
      e.preventDefault();
    });

    // Prevent context menu
    this.canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      this.handleResize();
    });
  }

  handleResize() {
    // Optional: implement responsive canvas sizing
    // For now, keep fixed size
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.render(); // Initial render
      console.log("Game started");

      this.preloadImages(ALL_ASSETS).then(() => {
        this.preloadFinished = true;
        this.requestRedraw();
      });
    }
  }

  // Trigger a redraw when needed (turn-based, event-driven)
  requestRedraw() {
    if (this.isRunning) {
      this.render();
    }
  }

  // Handle key presses based on current scene
  handleKeyPress(keyCode) {
    switch (this.scene) {
      case "menus":
        this.menuManager.handleMainMenuInput(keyCode);
        break;
      case "level":
        if (!this.levelManager.handleGameInput(keyCode)) {
          return false;
        }
        break;
    }

    this.requestRedraw();
  }

  // Handle minimal mouse input (mainly for UI buttons)
  handleMouseClick(x, y) {
    this.requestRedraw();
  }

  render() {
    if (!this.preloadFinished) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Set default styles
    this.ctx.fillStyle = "#fff";
    this.ctx.strokeStyle = "#fff";
    this.ctx.font = "16px Courier New";

    let anotherRender = false;

    // Render based on current scene
    switch (this.scene) {
      case "menus":
        this.menuManager.render();
        break;
      case "level":
        anotherRender = this.levelManager.renderGame(this.ctx);
        break;
    }

    if(anotherRender) {
      setTimeout(() => {
        this.requestRedraw();
      }, MS_PER_FRAME);
    }
  }

  async loadImage(src) {
    if (this.loadedImages.has(src)) {
      return this.loadedImages.get(src);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  // Preload multiple images
  async preloadImages(imagePaths) {
    try {
      const promises = imagePaths.map((path) => this.loadImage(path));
      await Promise.all(promises);
      console.log("All images preloaded");
    } catch (error) {
      console.error("Error preloading images:", error);
    }
  }

  // Draw image utility
  drawImage(src, x, y, width = null, height = null, clip = {}) {
    const { x: clipX, y: clipY, width: clipWidth, height: clipHeight } = clip;
    const img = this.loadedImages.get(src);
    if (!img) {
      console.warn(`Image not loaded: ${src}`);
      return;
    }

    if (Object.keys(clip).length > 0) {
      this.ctx.drawImage(img, clipX, clipY, clipWidth, clipHeight, x, y, width, height);
    } else if (width && height) {
      this.ctx.drawImage(img, x, y, width, height);
    } else {
      this.ctx.drawImage(img, x, y);
    }
  }

  // Utility methods

  DRAW_PARAMS = {
    fill: "#fff",
    stroke: "#000",
    strokeWidth: 0,
  };

  getDrawParams(params = {}) {
    const result = {
      ...this.DRAW_PARAMS,
      ...params,
    };

    result.filled = !!result.fill;

    return result;
  }

  drawText(text, x, y, options = {}) {
    const {
      color = "#fff",
      font = "16px Courier New",
      align = "left",
      baseline = "top",
    } = options;

    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, x, y);
  }

  drawRect(x, y, width, height, params = {}) {
    const { fill, stroke, strokeWidth, filled } = this.getDrawParams(params);

    this.ctx.strokeStyle = stroke;
    this.ctx.fillStyle = fill;
    this.ctx.lineWidth = strokeWidth;

    if (filled) this.ctx.fillRect(x, y, width, height);
    if (strokeWidth) this.ctx.strokeRect(x, y, width, height);
  }

  drawPath(path, params = {}) {
    const { fill, stroke, strokeWidth, filled } = this.getDrawParams(params);

    this.ctx.strokeStyle = stroke;
    this.ctx.fillStyle = fill;
    this.ctx.lineWidth = strokeWidth;

    if (filled) this.ctx.fill(path);
    if (strokeWidth) this.ctx.stroke(path);
  }

  drawCircle(x, y, radius, color = "#fff", filled = true) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;

    if (filled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  // Collision detection utility
  isColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  // Distance calculation
  getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
}

// Initialize and start the game when the page loads
window.addEventListener("load", () => {
  const game = new Game();
  game.start();
});
