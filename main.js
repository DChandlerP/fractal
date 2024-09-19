// main.js

// Select the canvas and set up the rendering context
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
const width = canvas.width;
const height = canvas.height;

// Fractal parameters
let maxIterations = 100;
let zoom = 1;
let offsetX = -0.5;
let offsetY = 0;

// Generate the Mandelbrot Set
function generateMandelbrot() {
  // Create an ImageData object
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  // Iterate over each pixel
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Convert pixel coordinate to complex number
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

      // Calculate color based on iteration count
      const colorValue = iteration === maxIterations ? 0 : (iteration / maxIterations) * 360;
      const rgb = hslToRgb(colorValue / 360, 1, 0.5);

      const pixelIndex = (py * width + px) * 4;
      data[pixelIndex] = rgb[0];     // Red
      data[pixelIndex + 1] = rgb[1]; // Green
      data[pixelIndex + 2] = rgb[2]; // Blue
      data[pixelIndex + 3] = 255;    // Alpha
    }
  }

  // Render the image data onto the canvas
  ctx.putImageData(imageData, 0, 0);
}

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // Achromatic
  } else {
    const hue2rgb = function(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
}

// Variables for zooming and panning
let isDragging = false;
let startX, startY;

// Mouse wheel event for zooming
canvas.addEventListener('wheel', function(event) {
  event.preventDefault();

  // Get mouse coordinates relative to canvas
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Convert mouse position to complex plane coordinates
  const x0 = (mouseX - width / 2) * (4 / width) / zoom + offsetX;
  const y0 = (mouseY - height / 2) * (4 / height) / zoom + offsetY;

  // Update zoom level
  if (event.deltaY < 0) {
    zoom *= 1.1; // Zoom in
  } else {
    zoom /= 1.1; // Zoom out
  }

  // Adjust offsets to center the zoom on the mouse position
  offsetX = x0 - (mouseX - width / 2) * (4 / width) / zoom;
  offsetY = y0 - (mouseY - height / 2) * (4 / height) / zoom;

  // Regenerate the fractal
  generateMandelbrot();
});

// Mouse events for panning
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

// Generate the initial fractal
generateMandelbrot();
