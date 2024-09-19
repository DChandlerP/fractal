# Fractal Generator Web App

[**View the Fractal Generator Web App**](https://dchandlerp.github.io/fractal/)

## Introduction

Welcome to the Fractal Generator Web App! This interactive application allows you to explore the fascinating world of fractals directly in your web browser. Using HTML, CSS, and JavaScript, the app renders the intricate patterns of the **Mandelbrot Set**, providing an immersive experience into mathematical beauty.

## What Are Fractals?

**Fractals** are infinitely complex patterns that are self-similar across different scales. They are created by repeating a simple process over and over in an ongoing feedback loop. Fractals are not just mathematical constructs—they frequently appear in nature, such as in the branching of trees, the structure of snowflakes, coastlines, and even within our own bodies.

### The Mandelbrot Set

The **Mandelbrot Set** is one of the most well-known fractals, named after mathematician Benoît Mandelbrot. It is defined by a simple iterative equation involving complex numbers:

\[ z_{n+1} = z_n^2 + c \]

- **\( z \)** starts at zero and is iteratively updated.
- **\( c \)** represents each point on the complex plane.
- The set of \( c \) values for which the sequence does not tend to infinity forms the Mandelbrot Set.

When plotted, this set produces a complex and infinitely detailed boundary that has captivated mathematicians and artists alike.

## How the JavaScript Functions Work

The core functionality of the Fractal Generator Web App is implemented in the `main.js` file. Here's an overview of how the JavaScript code generates and renders the Mandelbrot Set.

### Canvas Setup

First, we select the `<canvas>` element and set up the drawing context:

```javascript
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
```

### Fractal Parameters

We initialize parameters that control zooming, panning, and the level of detail:

```javascript
let maxIterations = 100;
let zoom = 1;
let offsetX = -0.5;
let offsetY = 0;
```

- **`maxIterations`**: Determines the number of iterations for the escape-time algorithm, affecting the detail level.
- **`zoom`**: Controls the zoom level into the fractal.
- **`offsetX` and `offsetY`**: Adjust the center point for panning.

### Generating the Mandelbrot Set

The `generateMandelbrot` function computes the fractal image:

```javascript
function generateMandelbrot() {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Map pixel to complex plane
      let x0 = (px - width / 2) * (4 / width) / zoom + offsetX;
      let y0 = (py - height / 2) * (4 / height) / zoom + offsetY;

      let x = 0;
      let y = 0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIterations) {
        let xTemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xTemp;
        iteration++;
      }

      // Color calculation
      const colorValue = iteration === maxIterations ? 0 : (iteration / maxIterations) * 360;
      const rgb = hslToRgb(colorValue / 360, 1, 0.5);

      const pixelIndex = (py * width + px) * 4;
      data[pixelIndex] = rgb[0];     // Red
      data[pixelIndex + 1] = rgb[1]; // Green
      data[pixelIndex + 2] = rgb[2]; // Blue
      data[pixelIndex + 3] = 255;    // Alpha
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
```

#### Explanation

- **Mapping Pixels to the Complex Plane**: Each pixel corresponds to a complex number \( c = x0 + y0i \) in the complex plane. The mapping accounts for the current zoom level and offsets.
- **Escape-Time Algorithm**: For each pixel, we iterate \( z_{n+1} = z_n^2 + c \) until the magnitude exceeds 2 (the point escapes) or we reach `maxIterations`.
- **Coloring Pixels**: The number of iterations determines the color of each pixel, creating a gradient effect that highlights the fractal's structure.

### Coloring Function

The `hslToRgb` function converts HSL color values to RGB:

```javascript
function hslToRgb(h, s, l) {
  // Conversion algorithm
  // Returns an array [r, g, b]
}
```

Using HSL allows for smooth color transitions, enhancing the visual appeal of the fractal.

### User Interaction

#### Zooming

Users can zoom in and out using the mouse wheel. The event listener updates the zoom factor and adjusts the offsets to center the zoom on the mouse position:

```javascript
canvas.addEventListener('wheel', function(event) {
  event.preventDefault();

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const x0 = (mouseX - width / 2) * (4 / width) / zoom + offsetX;
  const y0 = (mouseY - height / 2) * (4 / height) / zoom + offsetY;

  zoom *= event.deltaY < 0 ? 1.1 : 0.9;

  offsetX = x0 - (mouseX - width / 2) * (4 / width) / zoom;
  offsetY = y0 - (mouseY - height / 2) * (4 / height) / zoom;

  generateMandelbrot();
});
```

#### Panning

Clicking and dragging the mouse pans the view by updating the offsets:

```javascript
let isDragging = false;
let startX, startY;

canvas.addEventListener('mousedown', function(event) {
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
});

canvas.addEventListener('mousemove', function(event) {
  if (isDragging) {
    event.preventDefault();
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;

    offsetX -= dx * (4 / width) / zoom;
    offsetY -= dy * (4 / height) / zoom;

    startX = event.clientX;
    startY = event.clientY;

    generateMandelbrot();
  }
});

canvas.addEventListener('mouseup', function() {
  isDragging = false;
});

canvas.addEventListener('mouseleave', function() {
  isDragging = false;
});
```

### Initialization

Finally, we initiate the first rendering of the fractal:

```javascript
generateMandelbrot();
```

## Exploring the Fractal

The Mandelbrot Set is known for its infinite complexity. As you zoom in, you'll discover never-ending patterns and shapes, each more intricate than the last. Feel free to pan around and zoom in to different areas to observe the self-similar structures.

## Technologies Used

- **HTML5 Canvas**: Provides a drawable region in the browser where the fractal is rendered.
- **JavaScript**: Implements the fractal generation algorithm and handles user interactions.
- **CSS**: Styles the web app for a clean and user-friendly interface.

## Contributing

Contributions are welcome! You can enhance the app by:

- **Adding New Fractals**: Implement other fractal types like the Julia Set, Burning Ship, or Sierpinski Triangle.
- **Improving Performance**: Optimize the rendering process or use Web Workers for computation.
- **Enhancing the UI**: Add controls for adjusting parameters, changing color schemes, or saving images.
- **Refactoring Code**: Improve the code structure and readability.

Feel free to fork the repository and submit pull requests with your improvements.

---

Enjoy exploring the infinite beauty of fractals!