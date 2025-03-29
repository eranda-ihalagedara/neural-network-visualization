import { DrawingPad } from "./DrawingPad.js";
import NNVisualizer from "../dist/nn-visualizer.js";

const drawingPad = new DrawingPad();

function main() {
    drawingPad.init();

    const vis = new NNVisualizer();
    vis.init('./models/mnist/saved_model/mnist-model.json', '#viz-container', '#viz-canvas');

    const predictButton = document.getElementById('btn-predict');
    predictButton.addEventListener('click', async () => {
        const ctxImage = drawingPad.getImageData();
        const inputImg = tf.tidy(() => {
            const image = tf.browser.fromPixels(ctxImage, 1);
            const reImg = image.resizeBilinear([28,28]).toFloat().div(tf.scalar(255));
            return tf.expandDims(reImg, 0);
        });

        const output = await vis.predictAndVisualize(inputImg);
        const predictedLabel = String(output.indexOf(Math.max(...output)));
        drawingPad.showOutput(predictedLabel);
    });

    drawingPad.clearButton.addEventListener('click', () => vis.clearScene());

}

main();