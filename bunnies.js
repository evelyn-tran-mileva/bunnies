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

/** 
 * Returns the distance between point1 and point2.
 * 
 * @param {number[]} point1: The coordinates of the
 * first point, for example [20,30].
 * @param {number[]} point2: The coordinates of the
 * second point, for example [65,75]. 
 * @return {number} 
 */
function distance(
  /** @type {number[]}*/
  point1,
  /** @type {number[]}*/
  point2,
) {
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];
  return Math.sqrt(dx * dx + dy * dy);  
}

/** 
 * Returns the difference of two vectors.
 * 
 * @param {number[]} a: vectorA
 * @param {number[]} b: vectorB
 * @return {number[]}
 */
function subtractVectorsAMinusB(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}

/** 
 * Returns a vector pointing in the same direction but with unit length. 
 * 
 * @param {number[]} v: the vector.
 * 
 * @return {number[]}
 */
function rescaleVectorToUnitLength(v) {
  const vectorLength = distance([0, 0], v);
  return [v[0] / vectorLength, v[1] / vectorLength];
}

/**
 * Multiplies a vector v by a scalar a.
 * 
 * @param {number[]} v 
 * @param {number} a 
 * 
 * @return {number[]}
 */
function multiplyVectorByScalar(v, a) {
  return [v[0] * a, v[1] * a];
}

class Grass {
  constructor() {
    this.x = 0;
    this.y = 0;
    // Temporary state in which the grass is eaten but we haven't 
    // removed it from the list of grasses.
    this.eaten = false;
    this.nutritionValue = 1;
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
    this.hp = 1;
    this.maxhp = 20;
    /** @type {Grass|null} */
    this.targetFood = null;
    this.speed = 5;
  }

  draw() {
    canvas.drawImage(art, 0, 0, 19, 19, this.x, this.y, 40, 40);
    if (this.hp < this.maxhp) {
      this.drawHpBar();
    }
  }

  drawHpBar() {
    canvas.fillStyle = "red";
    canvas.fillRect(this.x, this.y + 40, 40, 2);
    canvas.fillStyle = "green";
    canvas.fillRect(this.x, this.y + 40, 40 * this.hp / this.maxhp, 2);
  }
  
  tick() {
    if (this.targetFood === null) {
      this.selectTargetFood();
    }
    if (this.targetFood === null) {
      this.moveRandomly();
    } else {
      this.moveTowardsFoodAndEatWhenYouReach();
    }
  }

  moveTowardsFoodAndEatWhenYouReach() {
    const targetLocation = [this.targetFood.x, this.targetFood.y];
    const myLocation = this.getLocation(); 
    if (distance(myLocation, targetLocation) < 3) {
      this.eatTarget();
      return;
    }
    const directionOfTravel = subtractVectorsAMinusB(
      targetLocation, myLocation
    );
    const unitVectorDirectionOfTravel = rescaleVectorToUnitLength(
      directionOfTravel
    );
    const changeInLocation = multiplyVectorByScalar(
      unitVectorDirectionOfTravel, this.speed
    );
    this.x += changeInLocation[0];
    this.y += changeInLocation[1];
  }

  eatTarget() {
    if (this.targetFood === null) {
      return;
    }
    if (!this.targetFood.eaten) {
      this.hp += this.targetFood.nutritionValue;
      if (this.hp > this.maxhp) {
        this.hp = this.maxhp;
      }
      // Marks the grass for deletion.
      this.targetFood.eaten = true;
    }
    this.targetFood = null;
  }

  getLocation() {
    return [this.x, this.y];
  }

  selectTargetFood() {
    let bestDistanceFromGrass = -1;
    const bunnyLocation = this.getLocation();
    for (let grass of game.grasses) {
      const grassLocation = [grass.x, grass.y];
      const distanceToCurrentGrass = distance(bunnyLocation, grassLocation);
      if (this.targetFood === null) {
        this.targetFood = grass;
        bestDistanceFromGrass = distanceToCurrentGrass
      }
      if (distanceToCurrentGrass < bestDistanceFromGrass) {
        this.targetFood = grass;
        bestDistanceFromGrass = distanceToCurrentGrass;
      }
    }
  }

  moveRandomly() {
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
    this.grassCount = document.getElementById("grassCount");
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
    this.cleanUpEatenObjects();
    // Set the text of the bunny count element to hold the number of bunnies.
    this.bunnyCount.textContent = this.bunnies.length;
    this.grassCount.textContent = this.grasses.length;
    this.draw();
  }

  cleanUpEatenObjects() {
    const remainingGrasses = [];
    for (let grass of this.grasses) {
      if (!grass.eaten) {
        remainingGrasses.push(grass);
      }
    }
    this.grasses = remainingGrasses;
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

