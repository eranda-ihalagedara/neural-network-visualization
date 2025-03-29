import ModelController from "./ModelController.js";
import Visualizer from "./Visualizer.js";

class NNVisualizer {
    constructor() {
        this.modelController = new ModelController();
    }

    init(tfModelpath, containerId, canvasId) {
        this.modelController.loadModel(tfModelpath);
        this.viz = new Visualizer(containerId, canvasId);
    }

    async predictAndVisualize(modelInput) {
        const layerValues = await this.modelController.predictIntermediateLayerOutputs(modelInput);
        this.viz.plotModel(layerValues);
    }

    clearScene() {
        this.viz.clearScene();
    }
}

export default NNVisualizer;