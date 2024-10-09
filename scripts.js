const canvas = document.getElementById('drawing-pad');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

const clearButton = document.getElementById('clear-canvas');
clearButton.addEventListener('click', clearCanvas);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const brushSizeInput = document.getElementById('brush-size');
const brushSizeValue = document.getElementById('brush-size-value');
const brushSmoothnessInput = document.getElementById('brush-smoothness');
const brushSmoothnessValue = document.getElementById('brush-smoothness-value');

brushSizeInput.addEventListener('input', updateBrush);
brushSmoothnessInput.addEventListener('input', updateBrush);

function updateBrush() {
    const size = brushSizeInput.value;
    const smoothness = brushSmoothnessInput.value;

    brushSizeValue.textContent = size;
    brushSmoothnessValue.textContent = smoothness;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = size * smoothness;
    ctx.shadowColor = ctx.strokeStyle;
}

updateBrush();