// import * as TF from '@tensorflow/tfjs';

class ModelController {
 
    async loadModel(tfModelpath) {
        this.model = await tf.loadLayersModel(tfModelpath);
        this.compileIntermediateLayerModel();
        console.log('Model Loaded');
    }

    compileIntermediateLayerModel() {
        this.intermediateModel = tf.model({
            inputs: this.model.inputs,
            outputs: this.model.layers.map(layer => layer.output)
          });
        this.model.layers.forEach((layer, index) => {
            console.log(`Layer ${index}: [${layer.outputShape.slice(1)}]`);
        })
    }

    async predictIntermediateLayerOutputs(inputImg) {
        if (!this.intermediateModel) {
            console.log('Intermediate Model not loaded');
            return;
        }
        
        const pred = tf.tidy(() => {
            const preds = this.intermediateModel.predict(inputImg);
            return preds;
        });

        const layerActivations = pred.map( (out) => { return out.squeeze().arraySync();} );
        const layerShapes = pred.map( (out) => {return out.squeeze().shape;} );

        return {layerActivations, layerShapes};
    }
}

export default ModelController;