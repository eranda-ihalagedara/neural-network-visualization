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
        const {layerActivations, layerShapes} = await this.modelController.predictIntermediateOutputs(modelInput);
        this.viz.plotModel(layerActivations, layerShapes);
        return layerActivations[layerActivations.length - 1];
    }

    clearScene() {
        this.viz.clearScene();
    }
}

export default NNVisualizer;