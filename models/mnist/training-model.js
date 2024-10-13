import {IMAGE_H, IMAGE_W, MnistData} from './data.js';     

function getModel() {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: 'relu'
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2}));
    model.add(tf.layers.conv2d({filters: 64, kernelSize: 3, activation: 'relu'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 64, activation: 'relu'}));
    model.add(tf.layers.dense({units: 10, activation: 'softmax'}));

    model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    return model;
}

async function trainModel(model) {
    // const mnist = require('@tensorflow/tfjs-data');
    let data = new MnistData();
    await data.load();
    const trainData = data.getTrainData();
    const testData = data.getTestData();
    const batchOutput = document.getElementById('batch-out');
    const epochOutput = document.getElementById('epoch-out');
    

    // const oneHotEncode = (label) => tf.tidy(() => tf.oneHot(tf.tensor1d([label], 'int32'), 10));

    // const xs = tf.tensor4d(trainImages, [trainImages.length, 28, 28, 1]).div(255.0);  // Input images
    // const ys = tf.tensor2d(trainLabels.map(oneHotEncode));  // Labels

    const trainEpochs = 10;
    const batchSize = 32;
    const validationSplit = 0.15;
    const totalNumBatches = Math.ceil(trainData.xs.shape[0] * (1 - validationSplit) / batchSize);

    await model.fit(trainData.xs, trainData.labels, {
        batchSize,
        validationSplit,
        epochs: trainEpochs,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                const epochText = `Epoch ${epoch + 1} / ${trainEpochs}. Loss: ${logs.loss.toFixed(4)}, Train Accuracy: ${logs.acc.toFixed(4)}, Validation Accuracy: ${logs.val_acc.toFixed(4)}`;
                epochOutput.innerHTML = epochOutput.innerHTML + '<br>' + epochText;
                await tf.nextFrame();
            },
            onBatchEnd: async (batch, logs) => {
                const batchText = `Epoch completion: ${((batch + 1)*100/totalNumBatches).toFixed(2)}%`;
                batchOutput.innerText = batchText;
                await tf.nextFrame();
            }
        }
    });
}

function preprocessImage(image) {
    // return tf.tidy(() => {
    //     let tensor = tf.browser.fromPixels(imageData, 1);
    //     tensor = tensor.resizeBilinear([28, 28]);
    //     tensor = tensor.toFloat();
    //     tensor = tensor.div(tf.scalar(255));
    //     tensor = tensor.expandDims(0);
    //     return tensor;
    // });

    return image.reshape([28, 28, 1]).div(255.0);
}

function predict(imageData) {
    const tensor = preprocessImage(imageData);
    const prediction = model.predict(tensor);
    const result = prediction.argMax(1).dataSync()[0];
    return result;
}

async function main(){
    const model = getModel();
    console.log(model.summary());
    await trainModel(model);
    await model.save('downloads://mnist-model');
}

main();