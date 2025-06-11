// Filename: ant.ts
// Purpose: the main program for the Langton's Ant WAR
// Author: Gabriel Sullivan

// Function name: renderDot
// Purpose: renders a dot on the screen
// Input: canvasContext - the canvas context to render to
//        x - where to print it on the x axis
//        y - where to print it on the y axis
//        color - the color to print
// Output: none
// Throws: none
function renderDot(
  canvasContext: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x * 5, y * 5, 5, 5);
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

// Classname: Ant
// Purpose: template for ants
class Ant {
  x: number;
  y: number;
  direction: number;
  trail_color: string;
  lives: number;

  // Constructor
  constructor(x: number, y: number, direction: number, trail_color: string) {
    this.x = x;
    this.y = y;
    this.direction = direction; // 1 through 4 counter clockwise
    this.trail_color = trail_color;
    this.lives = 5;
  }

  // Function name: render
  // Purpose: renders the ant on the screen
  // Input: canvasContext - the canvas context to render to
  render(canvasContext: CanvasRenderingContext2D) {
    renderDot(canvasContext, this.x, this.y, "red");
  }

  // Function name: move
  // Purpose: moves the ant
  // Input: none
  // Output: none
  // Throws: none
  move(canvas: Canvas) {
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
  checkUnder(canvas: Canvas) {
    let currentPixel = canvas.pixels[this.x][this.y];
    // checks the canvas pixel of the ant and returns the rgb value
    if (currentPixel != "white") {
      this.turnLeft();
      if (currentPixel === this.trail_color) {
        this.lives += 1;
        if (this.lives >= 2) {
          this.lives = 2;
        }
      } else {
        this.lives -= 1;
      }

      canvas.pixels[this.x][this.y] = "white";
    } else {
      this.turnRight();
      canvas.pixels[this.x][this.y] = this.trail_color;
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
  width: number;
  height: number;
  canvasObject: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  pixels: string[][];

  constructor(width: number, height: number, canvasObject: HTMLCanvasElement) {
    this.pixels = [];
    for (let i = 0; i < width; i++) {
      this.pixels[i] = [];
      for (let j = 0; j < height; j++) {
        this.pixels[i][j] = "white";
      }
    }
    this.canvasObject = canvasObject;
    this.canvasContext = canvasObject.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    this.width = width;
    this.height = height;
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

const ants: Ant[] = [];

for (let i = 0; i < 120; i++) {
  let color_picker = getRandomInt(3);
  let new_color = "black";
  switch (color_picker) {
    case 0:
      new_color = "blue";
      break;
    case 1:
      new_color = "green";
      break;
    case 2:
      new_color = "purple";
      break;
    case 3:
      new_color = "orange";
      break;
  }

  ants.push(
    new Ant(getRandomInt(1000), getRandomInt(1000), getRandomInt(4), new_color)
  );
}

const canvasObject = document.getElementById("canvas") as HTMLCanvasElement;
const canvas = new Canvas(1000, 1000, canvasObject);
const simulationSpeed = 1;

// make a loop
document.addEventListener("DOMContentLoaded", () => {
  canvas.render();
  setInterval(() => {
    ants.forEach((ant) => {
      if (ant.lives > 0) {
        ant.checkUnder(canvas);
        ant.move(canvas);
        ant.render(canvas.canvasContext);
      }
    });
  }, simulationSpeed);
});
