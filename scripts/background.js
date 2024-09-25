// Get the canvas element
const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

// Set the canvas dimensions
let elementWidth = window.innerWidth - widthUncidodeLine;
canvas.width = elementWidth;
canvas.height = window.innerHeight;

function drawSquare(x, y, size) {
  // Map size to a grayscale color
  var gray = Math.floor(255 * (1 - size / 400));
  c.strokeStyle = 'rgb(' + gray + ',' + gray + ',' + gray + ')';
  c.beginPath();
  c.rect(x - size / 2, y - size / 2, size, size);
  c.stroke();
}

var gridSize = 50;

function drawBackground(mouseX, mouseY, targetSize, waveDistance) {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.strokeStyle = 'white';
  for (let x = gridSize; x < canvas.width; x += gridSize * 2) {
    for (let y = gridSize; y < canvas.height; y += gridSize * 2) {
      // Vary the square size based on the mouse position
      const distanceToMouseX = Math.abs(x - mouseX);
      const distanceToMouseY = Math.abs(y - mouseY);
      const distanceToMouse = Math.sqrt(distanceToMouseX * distanceToMouseX + distanceToMouseY * distanceToMouseY);

      let size = 10;
      size *= distanceToMouse / 10;

      // Apply the "shockwave" effect
      const distanceToCenter = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2));
      if (distanceToCenter < waveDistance) {
        const scaleFactor = 1 - distanceToCenter / waveDistance;
        size += 10 * scaleFactor * ((waveDistance - distanceToCenter) / distanceToCenter);
      }

      drawSquare(x, y, size);
    }
  }
}

// Animate the background
let currentWaveDistance = 0;
let targetWaveDistance = 0;
let animationSpeed = 0.1;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let waveSpeed = 1; // speed of the wave

function animate() {
  if (Math.abs(targetWaveDistance - currentWaveDistance) > 0.1) {
    currentWaveDistance += (targetWaveDistance - currentWaveDistance) * animationSpeed;
  } else {
    currentWaveDistance = 0;
  }

  // increase the targetWaveDistance over time
  targetWaveDistance += waveSpeed;

  drawBackground(mouseX, mouseY, 10, currentWaveDistance);
  requestAnimationFrame(animate);
}

window.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
});

document.addEventListener('keydown', () => {
  if (gridSize > 20) {
    gridSize -= 1;
  }
});

animate();