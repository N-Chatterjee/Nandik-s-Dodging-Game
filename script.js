// Game state variables
const gameScreen = document.getElementById('gameScreen');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
let score = 0;
let playerSpeed = 10; // Speed of the player
let objectSpeed = 2; // Initial falling speed of objects
let gameInterval;
let fallingObjects = [];
const maxFallingObjects = 5; // Limit the number of falling objects

// Function to create falling objects
function createFallingObject() {
  if (fallingObjects.length >= maxFallingObjects) return; // Prevent creation if max limit reached

  const fallingObject = document.createElement('div');
  fallingObject.className = 'fallingObject';
  
  // Set width, height, and color
  fallingObject.style.width = `${Math.random() * 50 + 20}px`; // Random width
  fallingObject.style.height = `${Math.random() * 30 + 20}px`; // Random height
  fallingObject.style.left = `${Math.random() * (gameScreen.offsetWidth - 50)}px`; // Random starting position
  fallingObject.style.top = '-50px'; // Start off-screen (above the screen)
  fallingObject.style.backgroundColor = 'red'; // Visible color for objects
  fallingObject.style.position = 'absolute'; // Absolute position to control falling
  gameScreen.appendChild(fallingObject);
  fallingObjects.push(fallingObject);
}

// Update game: Move objects and check collisions
function updateGame() {
  // Update score
  score++;
  scoreElement.textContent = `Score: ${score}`;

  // Increase falling speed over time
  objectSpeed += 0.01;  // Gradually make falling objects faster

  // Move falling objects
  fallingObjects.forEach((object, index) => {
    const objectTop = parseInt(object.style.top || 0);
    object.style.top = `${objectTop + objectSpeed}px`; // Move down the screen

    // Check if the object has gone off the screen
    if (objectTop > gameScreen.offsetHeight) {
      object.remove();
      fallingObjects.splice(index, 1);
    }

    // Collision detection with player
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();
    if (playerRect.top < objectRect.bottom && playerRect.bottom > objectRect.top &&
        playerRect.left < objectRect.right && playerRect.right > objectRect.left) {
      gameOver();
    }
  });
}

// Game Over Function
function gameOver() {
  clearInterval(gameInterval);
  alert(`Game Over! Final Score: ${score}`);
  restartGame();
}

// Restart Game
function restartGame() {
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  fallingObjects.forEach(object => object.remove());
  fallingObjects = [];
  player.style.left = '375px'; // Reset player position to center
  startGame();
}

// Start the game
function startGame() {
  gameInterval = setInterval(() => {
    createFallingObject();
    updateGame();
  }, 1000 / 60); // 60 FPS
}

// Movement controls
document.addEventListener('keydown', (event) => {
  const playerLeft = parseInt(player.style.left || 0);
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    player.style.left = `${Math.max(playerLeft - playerSpeed, 0)}px`;
  }
  if (event.key === 'ArrowRight' || event.key === 'd') {
    player.style.left = `${Math.min(playerLeft + playerSpeed, gameScreen.offsetWidth - player.offsetWidth)}px`;
  }
});

// Start the game on page load
startGame();
