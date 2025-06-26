class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.isRunning = false;
        this.needsRedraw = true;
        
        // Canvas dimensions
        this.width = 800;
        this.height = 600;
        
        // Scene management
        this.scene = 'level'; // menus|level
        
        // Input handling
        this.keys = {};
        this.keysPressed = {}; // For single keypress detection
        this.mouse = {
            x: 0,
            y: 0,
            clicked: false
        };
        
        // Initialize modules
        this.menuManager = new MenuManager(this);
        this.levelManager = new LevelManager(this);
        
        this.init();
    }
    
    init() {
        // Set canvas size
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Configure canvas context
        this.ctx.imageSmoothingEnabled = false; // For pixel-perfect rendering
        
        console.log('Game initialized');
    }
    
    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.keysPressed[e.code] = true; // Single press detection
            }
            this.keys[e.code] = true;
            this.handleKeyPress(e.code);
            e.preventDefault(); // Prevent default browser behavior
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.keysPressed[e.code] = false;
            e.preventDefault();
        });
        
        // Minimal mouse events (mainly for UI)
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', (e) => {
            this.mouse.clicked = true;
            this.handleMouseClick(this.mouse.x, this.mouse.y);
            e.preventDefault();
        });
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
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
            console.log('Game started');
        }
    }
    
    // Trigger a redraw when needed (turn-based, event-driven)
    requestRedraw() {
        if (this.isRunning && this.needsRedraw) {
            this.needsRedraw = false;
            this.render();
        }
    }
    
    // Handle key presses based on current scene
    handleKeyPress(keyCode) {
        this.needsRedraw = true;
        
        switch (this.scene) {
            case 'menus':
                this.menuManager.handleMainMenuInput(keyCode);
                break;
            case 'level':
                this.levelManager.handleGameInput(keyCode);
                break;
        }
        
        this.requestRedraw();
    }
    
    // Handle minimal mouse input (mainly for UI buttons)
    handleMouseClick(x, y) {
        // You can add click handling for UI buttons here if needed
        // For now, just trigger a redraw
        this.needsRedraw = true;
        this.requestRedraw();
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Set default styles
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#fff';
        this.ctx.font = '16px Courier New';
        
        // Render based on current scene
        switch (this.scene) {
            case 'menus':
                this.menuManager.render();
                break;
            case 'level':
                this.levelManager.renderGame(this.ctx);
                break;
        }
    }
    
    // Utility methods
    
    drawText(text, x, y, options = {}) {
        const {
            color = '#fff',
            font = '16px Courier New',
            align = 'left',
            baseline = 'top'
        } = options;
        
        this.ctx.fillStyle = color;
        this.ctx.font = font;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillText(text, x, y);
    }
    
    drawRect(x, y, width, height, color = '#fff', filled = true) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        
        if (filled) {
            this.ctx.fillRect(x, y, width, height);
        } else {
            this.ctx.strokeRect(x, y, width, height);
        }
    }
    
    drawCircle(x, y, radius, color = '#fff', filled = true) {
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
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Distance calculation
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
}

// Initialize and start the game when the page loads
window.addEventListener('load', () => {
    const game = new Game();
    game.start();
}); 