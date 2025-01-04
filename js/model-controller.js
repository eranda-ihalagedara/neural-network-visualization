
export class ModelController {
 
    async loadModel() {
        this.model = await tf.loadLayersModel('models/mnist/saved_model/mnist-model.json');
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
}

