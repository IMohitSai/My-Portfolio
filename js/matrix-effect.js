class Matrix {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        this.fontSize = 10;
        this.columns = 0;
        this.drops = [];
        this.zooming = false;
        this.blinkInterval = 100;
        
        // Transition-related properties:
        this.transitionActive = false;
        this.retracePhase = false;
        this.topDrops = [];
        this.bottomDrops = [];
        this.transitionSpeed = 5; // Adjust for smoother/faster retrace

        this.init();
        window.addEventListener('resize', this.init.bind(this));
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
    }

    // Called when the "Enter the Portfolio" button is pressed.
    // Stops the normal matrix effect and starts the dual-stream transition.
    startPortfolioTransition() {
        // Stop the normal matrix drawing.
        if (this.drawIntervalId) {
            clearInterval(this.drawIntervalId);
        }
        this.transitionActive = true;
        this.retracePhase = false;
        // Initialize the top drops to start above the canvas.
        this.topDrops = Array(this.columns).fill(-this.fontSize);
        // Initialize the bottom drops to start below the canvas.
        this.bottomDrops = Array(this.columns).fill(this.canvas.height + this.fontSize);
        this.animateMatrixTransition();
    }

    animateMatrixTransition() {
        if (!this.transitionActive) return;
        
        const center = this.canvas.height / 2;
        // Clear the canvas.
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.retracePhase) {
            // Approach Phase: streams move toward the center.
            let allReached = true;
            for (let i = 0; i < this.columns; i++) {
                const x = i * this.fontSize;
                
                // Top stream: moving downward.
                if (this.topDrops[i] < center) {
                    this.ctx.fillStyle = '#0F0';
                    this.ctx.font = `${this.fontSize}px 'MatrixFont'`;
                    const letter = this.letters[Math.floor(Math.random() * this.letters.length)];
                    this.ctx.fillText(letter, x, this.topDrops[i]);
                    this.topDrops[i] += this.transitionSpeed;
                    if (this.topDrops[i] > center) this.topDrops[i] = center;
                    allReached = false;
                } else {
                    // Once reached, render in white.
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.font = `${this.fontSize}px 'MatrixFont'`;
                    const letter = this.letters[Math.floor(Math.random() * this.letters.length)];
                    this.ctx.fillText(letter, x, center);
                }
                
                // Bottom stream: moving upward.
                if (this.bottomDrops[i] > center) {
                    this.ctx.fillStyle = '#0F0';
                    this.ctx.font = `${this.fontSize}px 'MatrixFont'`;
                    const letter = this.letters[Math.floor(Math.random() * this.letters.length)];
                    this.ctx.fillText(letter, x, this.bottomDrops[i]);
                    this.bottomDrops[i] -= this.transitionSpeed;
                    if (this.bottomDrops[i] < center) this.bottomDrops[i] = center;
                    allReached = false;
                } else {
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.font = `${this.fontSize}px 'MatrixFont'`;
                    const letter = this.letters[Math.floor(Math.random() * this.letters.length)];
                    this.ctx.fillText(letter, x, center);
                }
            }
            if (allReached) {
                // When all columns have met at the center, begin retracing.
                this.retracePhase = true;
            }
        } else {
            // Retrace Phase: streams reverse their paths off-screen.
            let allOffScreen = true;
            for (let i = 0; i < this.columns; i++) {
                const x = i * this.fontSize;
                
                // Top stream retraces upward.
                if (this.topDrops[i] > -this.fontSize) {
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.font = `${this.fontSize}px 'MatrixFont'`;
                    const letter = this.letters[Math.floor(Math.random() * this.letters.length)];
                    this.ctx.fillText(letter, x, this.topDrops[i]);
                    this.topDrops[i] -= this.transitionSpeed;
                    allOffScreen = false;
                }
                // Bottom stream retraces downward.
                if (this.bottomDrops[i] < this.canvas.height + this.fontSize) {
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.font = `${this.fontSize}px 'MatrixFont'`;
                    const letter = this.letters[Math.floor(Math.random() * this.letters.length)];
                    this.ctx.fillText(letter, x, this.bottomDrops[i]);
                    this.bottomDrops[i] += this.transitionSpeed;
                    allOffScreen = false;
                }
            }
            if (allOffScreen) {
                // Once all streams are off-screen, fade out and navigate.
                if (allOffScreen) {
                    // Instantly navigate to the portfolio page without waiting.
                    window.location.href = 'portfolio.html';
                    return;
                }
                
                return;
            }
        }
        
        requestAnimationFrame(this.animateMatrixTransition.bind(this));
    }

    // The regular matrix rain draw function.
    draw() {
        if (!this.transitionActive) {
            if (this.zooming) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            } else {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            }
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.zooming ? 
                `hsl(${Math.random() * 120}, 100%, 50%)` : '#0F0';
            this.ctx.font = `${this.fontSize}px 'MatrixFont'`;

            for (let i = 0; i < this.drops.length; i++) {
                const text = this.letters[Math.floor(Math.random() * this.letters.length)];
                this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
                
                if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                this.drops[i]++;
            }
        }
    }
}

const canvas = document.getElementById('matrix-canvas');
const matrix = new Matrix(canvas);
// Start the regular matrix rain effect.
matrix.drawIntervalId = setInterval(() => matrix.draw(), 50);
