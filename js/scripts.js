import { DrawingPad } from "/js/drawing-pad.js";
import { ModelController } from "/js/model-controller.js";
import { Visualizer } from "/js/visualizer.js";

const modelController = new ModelController();
const drawingPad = new DrawingPad();
const viz = new Visualizer();

function main() {
    drawingPad.init();
    modelController.loadModel();
    
    const predictButton = document.getElementById('btn-predict');
    const output = document.getElementById('output');
    predictButton.addEventListener('click', async () => {
        // /modelController.predictValues(drawingPad.getImageData(), output);
        const layerValues = await modelController.predictIntermediateLayerOutputs(drawingPad.getImageData(), output);
        viz.plotModel(layerValues);
        // viz.plotLayer(layerValues.layerActivations[layerId], layerValues.layerShapes[layerId]);
    });

    drawingPad.clearButton.addEventListener('click', () => viz.clearScene());
}

main();