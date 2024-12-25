console.log("Hello bunnies");
/** @type {HTMLCanvasElement} */
let canvasContainer = document.getElementById("gamecanvas");
let canvas = canvasContainer.getContext("2d");

let art = new Image();
art.src = "bunny.png";
function run() { 
  game.run();
}
art.onload = run;

class Bunny{
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  draw() {
    canvas.drawImage(art, 0, 0, 19, 19, this.x, this.y, 40, 40);

  }
}

class Game {
  constructor() {
    /** @type {Bunny[]} */
    this.bunnies = [];
    this.canvasWidth = canvasContainer.width;
    this.canvasHeight = canvasContainer.height;
    this.bunnyCount = document.getElementById("bunnyCount");
  }
  run() {
    setInterval(() => {
      this.tick();
    }, 100);
  }
  tick() {
    if (this.bunnies.length < 1000) {
      let incomingBunny = new Bunny();
      incomingBunny.x = Math.floor(Math.random() * (this.canvasWidth-40));
      incomingBunny.y = Math.floor(Math.random() * (this.canvasHeight-40));
      this.bunnies.push(incomingBunny);
    }
    this.bunnyCount.textContent = this.bunnies.length;
    this.draw();
  }
  draw() {
    canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (let bunny of this.bunnies) {
      bunny.draw();
    }
  }
}

let game = new Game();

