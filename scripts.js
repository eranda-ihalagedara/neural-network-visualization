const canvas = document.getElementById('drawing-pad');
const ctx = canvas.getContext('2d', {alpha: false, willReadFrequently: true});
const output = document.getElementById('output');

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
    // predictValues();
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
    output.innerText = '';
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
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = size * smoothness;
    ctx.shadowColor = ctx.strokeStyle;
}

updateBrush();

let model;

async function loadModel() {
    model = await tf.loadLayersModel('models/mnist/saved_model/mnist-model.json');
    console.log('Model Loaded');
}

loadModel();

const predictButton = document.getElementById('btn-predict');
predictButton.addEventListener('click', predictValues);
async function predictValues() {
    if (!model) {
        console.log('Model not loaded');
        return;
    }
    
    const ctxImage = ctx.getImageData(0, 0, canvas.height, canvas.width);
    const inputImg = tf.tidy(() => {
        const image = tf.browser.fromPixels(ctxImage, 1);
        const reImg = image.resizeBilinear([28,28]).toFloat().div(tf.scalar(255));
        return tf.expandDims(reImg, 0);
    });

    const pred = tf.tidy(() => {
        const preds = model.predict(inputImg).argMax(-1);
        return preds.dataSync()[0];
    });

    output.innerText = pred;
}

