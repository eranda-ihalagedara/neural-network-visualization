
export class ModelController {
 
    async loadModel() {
        this.model = await tf.loadLayersModel('models/mnist/saved_model/mnist-model.json');
        this.compileIntermediateLayerModel();
        console.log('MNIST Model Loaded');
    }

    async predictValues(ctxImage, output) {
        if (!this.model) {
            console.log('Model not loaded');
            output.innerText = '';
            return;
        }
        
        // const ctxImage = ctx.getImageData(0, 0, canvas.height, canvas.width);
        const inputImg = tf.tidy(() => {
            const image = tf.browser.fromPixels(ctxImage, 1);
            const reImg = image.resizeBilinear([28,28]).toFloat().div(tf.scalar(255));
            return tf.expandDims(reImg, 0);
        });

        const pred = tf.tidy(() => {
            const preds = this.model.predict(inputImg).argMax(-1);
            return preds.dataSync()[0];
        });

        output.innerText = pred;
    }

    compileIntermediateLayerModel() {
        this.intermediateModel = tf.model({
            inputs: this.model.inputs,
            outputs: this.model.layers.map(layer => layer.output)
          });
        this.model.layers.forEach((layer, index) => {
            console.log(`Layer ${index}: ${layer.outputShape.slice(1)}`);
        })
        // this.intermediateModel.summary();
    }

    async predictIntermediateLayerOutputs(ctxImage) {
        if (!this.intermediateModel) {
            console.log('Intermediate Model not loaded');
            return;
        }
        
        const inputImg = tf.tidy(() => {
            const image = tf.browser.fromPixels(ctxImage, 1);
            const reImg = image.resizeBilinear([28,28]).toFloat().div(tf.scalar(255));
            return tf.expandDims(reImg, 0);
        });

        const pred = tf.tidy(() => {
            const preds = this.intermediateModel.predict(inputImg);
            return preds;
        });

        output.innerText = tf.tidy(() => {
            const outs = pred[pred.length - 1].argMax(-1);
            return outs.dataSync()[0];
        });

        const layerActivations = pred.map((out)=>{ return out.squeeze().arraySync();});
        const layerShapes = pred.map((out)=>{return out.squeeze().shape;});

        // viz.plotLayer(layerActivations[6], layerShapes[6]);
        return {layerActivations, layerShapes};
    }
}
