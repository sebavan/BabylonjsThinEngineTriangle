import { DemoRenderer } from "./demoRenderer";
import { ThinEngine } from "@babylonjs/core/Engines/thinEngine";

// Find our elements
const mainCanvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const headerTitle = document.getElementById("headerTitle") as HTMLCanvasElement;

// Create our engine to hold on the canvas (this part could be replace for Native)
const engine = new ThinEngine(mainCanvas, true, { 
    preserveDrawingBuffer: true,
    premultipliedAlpha: false,
    alpha: true,
});

// Starts drawing
const triangleApp = new DemoRenderer(engine);
triangleApp.start();

headerTitle.innerHTML = "Rendering";