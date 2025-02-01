import { DrawingPad } from "/js/drawing-pad.js";
import { ModelController } from "/js/model-controller.js";
import { Visualizer } from "/js/visualizer.js";

const modelController = new ModelController();
const drawingPad = new DrawingPad();
const viz = new Visualizer('#viz-container', '#viz-canvas');

function main() {
    drawingPad.init();
    modelController.loadModel();
    
    const predictButton = document.getElementById('btn-predict');
    const output = document.getElementById('output');
    predictButton.addEventListener('click', async () => {
        const layerValues = await modelController.predictIntermediateLayerOutputs(drawingPad.getImageData(), output);
        viz.plotModel(layerValues);
    });

    drawingPad.clearButton.addEventListener('click', () => viz.clearScene());
}

main();