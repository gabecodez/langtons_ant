// Function name: renderDot
// Purpose: renders a dot on the screen
// Input: canvasContext - the canvas context to render to
//        x - where to print it on the x axis
//        y - where to print it on the y axis
//        color - the color to print
// Output: none
// Throws: none
function renderDot(canvasContext, x, y, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x * 5, y * 5, 5, 5);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Classname: Ant
// Purpose: template for ants
class Ant {
  // Constructor
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction; // 1 through 4 counter clockwise
  }

  // Function name: render
  // Purpose: renders the ant on the screen
  // Input: canvasContext - the canvas context to render to
  render(canvasContext) {
    renderDot(canvasContext, this.x, this.y, "red");
  }

  // Function name: move
  // Purpose: moves the ant
  // Input: none
  // Output: none
  // Throws: none
  move(canvas) {
    let newX = this.x;
    let newY = this.y;

    // move it based on the direction its facing
    switch (this.direction) {
      case 0:
        newX += 1;
        break;
      case 1:
        newY += 1;
        break;
      case 2:
        newX -= 1;
        break;
      case 3:
        newY -= 1;
        break;
    }

    if (
      newX >= 0 &&
      newY >= 0 &&
      newX < canvas.pixels.length &&
      newY < canvas.pixels[0].length
    ) {
      this.x = newX;
      this.y = newY;
    }
  }

  // Function name: turnLeft
  // Purpose: turns the ant left
  turnLeft() {
    this.direction += 1;
    if (this.direction > 3) this.direction = 0;
  }

  // Function name: turnRight
  // Purpose: turns the ant right
  turnRight() {
    this.direction -= 1;
    if (this.direction < 0) this.direction = 3;
  }

  // Function name: checkUnder
  // Purpose: checks underneath the ant at whichever pixel it is at
  checkUnder(canvas) {
    // checks the canvas pixel of the ant and returns the rgb value
    if (canvas.pixels[this.x][this.y] == "black") {
      this.turnLeft();
      canvas.pixels[this.x][this.y] = "white";
    } else {
      this.turnRight();
      canvas.pixels[this.x][this.y] = "black";
    }
    renderDot(
      canvas.canvasContext,
      this.x,
      this.y,
      canvas.pixels[this.x][this.y]
    );
  }
}

// Classname: Canvas
// Purpose: handles the canvas object
class Canvas {
  constructor(width, height, canvasObject) {
    this.pixels = [];
    for (let i = 0; i < width; i++) {
      this.pixels[i] = [];
      for (let j = 0; j < height; j++) {
        this.pixels[i][j] = "white";
      }
    }
    this.canvasObject = canvasObject;
    this.canvasContext = canvasObject.getContext("2d");
  }

  // Function name: render
  // Purpose: renders the canvas in full
  // Input: none
  // Output: none
  // Throws: none
  render() {
    for (let i = 0; i < this.pixels.length; i++) {
      for (let j = 0; j < this.pixels[i].length; j++) {
        renderDot(this.canvasContext, i, j, this.pixels[i][j]);
      }
    }
  }
}

const ants = [];

for (let i = 0; i < 120; i++) {
  ants.push(new Ant(getRandomInt(1000), getRandomInt(1000), getRandomInt(4)));
}

const canvasObject = document.getElementById("canvas");
const canvas = new Canvas(1000, 1000, canvasObject);
const simulationSpeed = 5;

// make a loop
document.addEventListener("DOMContentLoaded", () => {
  canvas.render();
  setInterval(() => {
    ants.forEach((ant) => {
      ant.checkUnder(canvas);
      ant.move(canvas);
      ant.render(canvas.canvasContext);
    });
  }, simulationSpeed);
});
