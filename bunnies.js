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

class Grass {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  draw() {
    canvas.beginPath();
    canvas.ellipse(this.x, this.y, 2, 2, 0, 0, 360);
    canvas.fillStyle = "green";
    canvas.fill();
  }
}

class Bunny {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  draw() {
    canvas.drawImage(art, 0, 0, 19, 19, this.x, this.y, 40, 40);
  }
  tick() {
    let moveX = Math.random() * 6 - 3;
    let moveY = Math.random() * 6 - 3;
    this.x += moveX;
    this.y += moveY;
    if (
      this.x > game.canvasWidth ||
      this.x < 0
    ) {
      this.x -= moveX;  
    }
    if (
      this.y > game.canvasHeight ||
      this.y < 0
    ) {
      this.y -= moveY;
    }
  }
}

class Game {
  constructor() {
    /** @type {Bunny[]} */
    this.bunnies = [];
    /** @type {Grass[]} */
    this.grasses = [];
    this.canvasWidth = canvasContainer.width;
    this.canvasHeight = canvasContainer.height;
    this.bunnyCount = document.getElementById("bunnyCount");
    this.spawnBunnyButton = document.getElementById("spawnBunny");
    this.spawnBunnyButton.addEventListener("click", () => { 
      this.spawnBunny();
    });
  }
  run() {
    setInterval(() => {
      this.tick();
    }, 100);
  }
  spawnBunny() {
    let incomingBunny = new Bunny();
    incomingBunny.x = Math.floor(Math.random() * (this.canvasWidth - 40));
    incomingBunny.y = Math.floor(Math.random() * (this.canvasHeight - 40));
    this.bunnies.push(incomingBunny);
  }
  tick() {
    this.spawnGrass();
    for (let bunny of this.bunnies) {
      bunny.tick();
    }
    this.bunnyCount.textContent = this.bunnies.length;
    this.draw();
  }
  draw() {
    canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    for (let grass of this.grasses) {
      grass.draw();
    }
    for (let bunny of this.bunnies) {
      bunny.draw();
    }
  }
  spawnGrass() {
    if (this.grasses.length >= 10000) {
      return;
    }
    let newGrass = new Grass();
    newGrass.x = Math.random() * this.canvasWidth;
    newGrass.y = Math.random() * this.canvasHeight;
    this.grasses.push(newGrass);
  }
}

let game = new Game();

