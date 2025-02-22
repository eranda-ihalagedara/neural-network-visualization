# Neural Network Visualizer
A lightweight javascript library to visualize neural network models build on top of Three.js and TensorFlow.js. 

## Usage

Download the repo or clone with `git clone https://github.com/eranda-ihalagedara/neural-network-visualization.git` and have the `src` directory in your project folder.

### Setting up dependancies

The dependancies has to be included in the html document.
- TensorFlow.js
- three.js

```
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
<script type="importmap">
    {
        "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/"
        }
    }
</script>
```
### Saved model

A TensorFlow model has to be saved in `.json` format.

### Creating visuals

- Have a container div and a canvas element inside it with the html document.
```
<div id="viz-container">
    <canvas id="viz-canvas"></canvas>
</div>
```
*You have set width and height of the canvas as you prefer.*

- Import the `NNVisualizer` class to your script.

```
import { NNVisualizer } from "../src/index.js";
```

- Create the visualizer object and initiate with path to saved model, container id and canvas id.
```
const vis = new NNVisualizer();
vis.init('./models/mnist/mnist-model.json', '#viz-container', '#viz-canvas');
```
- Feed the input to the model and visualize
```
await vis.predictAndVisualize(modelInput);
```

### Canvas Control
- Left click and drag to move around.
- Right click and drag to rotate.
- Scroll to zoom in and out.

## Example
A demo of the library can be found in [here](https://eranda-ihalagedara.github.io/neural-network-visualization/example/index.html). It uses a neural network trained on MNIST dataset and visualize the activations taking in a drawing of a digit on a canvas.

## References
1. https://medium.com/ailab-telu/learn-and-play-with-tensorflow-js-part-3-dd31fcab4c4b
2. https://github.com/tensorflow/tfjs-examples/tree/master/mnist