import { DrawingPad } from "/js/drawing-pad.js";
import { NNVisualizer } from "/src/index.js";

const drawingPad = new DrawingPad();

function main() {
    drawingPad.init();

    const vis = new NNVisualizer();
    vis.init('models/mnist/saved_model/mnist-model.json', '#viz-container', '#viz-canvas');

    const predictButton = document.getElementById('btn-predict');
    predictButton.addEventListener('click', async () => {
        const ctxImage = drawingPad.getImageData();
        const inputImg = tf.tidy(() => {
            const image = tf.browser.fromPixels(ctxImage, 1);
            const reImg = image.resizeBilinear([28,28]).toFloat().div(tf.scalar(255));
            return tf.expandDims(reImg, 0);
        });

        await vis.predictAndVisualize(inputImg);
    });

    drawingPad.clearButton.addEventListener('click', () => vis.clearScene());

}

main();