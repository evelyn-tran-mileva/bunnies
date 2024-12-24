console.log("Hello bunnies2");
/** @type {HTMLCanvasElement} */
let canvasContainer = document.getElementById("gamecanvas");
let canvas = canvasContainer.getContext("2d");
canvas.beginPath();
canvas.moveTo(50, 60);
canvas.lineTo(100, 100);
canvas.stroke();