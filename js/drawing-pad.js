
export class DrawingPad {
    constructor() {
        this.canvas = document.getElementById('drawing-pad');
        this.ctx = this.canvas.getContext('2d', {alpha: false, willReadFrequently: true});
        this.clearButton = document.getElementById('clear-canvas');
        this.output = document.getElementById('output');
        this.brushSizeInput = document.getElementById('brush-size');
        this.brushSizeValue = document.getElementById('brush-size-value');
        this.brushSmoothnessInput = document.getElementById('brush-smoothness');
        this.brushSmoothnessValue = document.getElementById('brush-smoothness-value');

        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
    }
    
    init() {
        
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        this.clearButton.addEventListener('click', () => this.clearCanvas());

        this.brushSizeInput.addEventListener('input', () => this.updateBrush());
        this.brushSmoothnessInput.addEventListener('input', () => this.updateBrush());

        this.updateBrush();
    }

    startDrawing(e) {
        this.isDrawing = true;
        [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
    
        [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    }
    
    stopDrawing() {
        this.isDrawing = false;
    }
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.output.innerText = '';
    }
    
    updateBrush() {
        const size = this.brushSizeInput.value;
        const smoothness = this.brushSmoothnessInput.value;
    
        this.brushSizeValue.textContent = size;
        this.brushSmoothnessValue.textContent = smoothness;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = size;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowBlur = size * smoothness;
        this.ctx.shadowColor = this.ctx.strokeStyle;
    }

    getImageData() {
        return this.ctx.getImageData(0, 0, this.canvas.height, this.canvas.width);
    }
}


