// game.js
(() => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const scoreDisplay = document.getElementById("scoreDisplay");
  const healthBar = document.getElementById("healthBar");
  const gameOverScreen = document.getElementById("gameOverScreen");
  const gameOverMessage = document.getElementById("gameOverMessage");
  const restartBtn = document.getElementById("restartBtn");

  // Player paddles
  const paddleWidth = 110;
  const paddleHeight = 16;
  const player1StartX = WIDTH * 0.20 - paddleWidth / 2;
  const player2StartX = WIDTH * 0.80 - paddleWidth / 2;
  const playerY = HEIGHT - 44;

  const player1 = { x: player1StartX, y: playerY, speed: 7, color: "#ff6fae" }; // ADH
  const player2 = { x: player2StartX, y: playerY, speed: 7, color: "#d63384" }; // ALDH

  // Game state
  let molecules = [];
  let powerUps = [];
  const moleculeSize = 20;
  let score = 0;
  let health = 100;
  let slowMotion = false;
  let gameOver = false;

  // Intervals
  let moleculeInterval = null;
  let powerupInterval = null;

  // Input
  const keys = {};
  window.addEventListener("keydown", (e) => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

  // Helpers
  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnMolecule() {
    molecules.push({
      x: rand(12, WIDTH - 12 - moleculeSize),
      y: -30,
      speed: slowMotion ? rand(0.7, 1.3) : rand(2.2, 4.0)
    });
  }

  function spawnPowerUp() {
    powerUps.push({
      x: rand(12, WIDTH - 12 - 20),
      y: -28,
      speed: 2.2,
      type: Math.random() < 0.55 ? "heal" : "slow"
    });
  }

  function resetGameState() {
    // Reset player positions
    player1.x = player1StartX;
    player1.y = playerY;
    player2.x = player2StartX;
    player2.y = playerY;

    // Reset game variables
    molecules = [];
    powerUps = [];
    score = 0;
    health = 100;
    slowMotion = false;
    gameOver = false;

    // Reset UI
    updateUI();
    gameOverScreen.classList.add("hidden");

    // Clear existing intervals
    clearInterval(moleculeInterval);
    clearInterval(powerupInterval);

    // Start intervals
    moleculeInterval = setInterval(spawnMolecule, 700);
    powerupInterval = setInterval(spawnPowerUp, 5500);

    // Start main loop
    requestAnimationFrame(gameLoop);
  }

  function movePlayers() {
    // ADH controls: A / D
    if (keys["a"] && player1.x > 4) player1.x -= player1.speed;
    if (keys["d"] && player1.x < WIDTH - paddleWidth - 4) player1.x += player1.speed;
    // ALDH controls: J / L
    if (keys["j"] && player2.x > 4) player2.x -= player2.speed;
    if (keys["l"] && player2.x < WIDTH - paddleWidth - 4) player2.x += player2.speed;
  }

  function checkCollision(obj, paddle) {
    const objRight = obj.x + moleculeSize;
    const paddleRight = paddle.x + paddleWidth;
    return (obj.y + moleculeSize >= paddle.y) && (obj.x < paddleRight) && (objRight > paddle.x);
  }

  function updateMolecules() {
    for (let i = molecules.length - 1; i >= 0; i--) {
      const m = molecules[i];
      m.y += m.speed;

      if (checkCollision(m, player1) || checkCollision(m, player2)) {
        molecules.splice(i, 1);
        score += 1;
        continue;
      }

      if (m.y > HEIGHT + 10) {
        molecules.splice(i, 1);
        health = Math.max(0, health - 12);
        if (health <= 0) endGame();
      }
    }
  }

  function updatePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const p = powerUps[i];
      p.y += p.speed;

      if (checkCollision(p, player1) || checkCollision(p, player2)) {
        if (p.type === "heal") health = Math.min(100, health + 18);
        if (p.type === "slow") {
          slowMotion = true;
          setTimeout(() => { slowMotion = false; }, 4000);
        }
        powerUps.splice(i, 1);
        continue;
      }

      if (p.y > HEIGHT + 10) powerUps.splice(i, 1);
    }
  }

  function drawPlayers() {
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);

    ctx.fillStyle = player2.color;
    ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);
  }

  function drawMolecules() {
    ctx.fillStyle = "#ffd1e8";
    molecules.forEach(m => {
      ctx.beginPath();
      ctx.arc(m.x + moleculeSize / 2, m.y + moleculeSize / 2, moleculeSize / 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawPowerUps() {
    powerUps.forEach(p => {
      if (p.type === "heal") {
        ctx.fillStyle = "#7de2a8";
      } else {
        ctx.fillStyle = "#ffd166";
      }
      ctx.fillRect(p.x, p.y, 20, 20);
    });
  }

  function updateUI() {
    scoreDisplay.textContent = `Score: ${score}`;
    healthBar.style.width = `${health}%`;
  }

  function endGame() {
    gameOver = true;
    clearInterval(moleculeInterval);
    clearInterval(powerupInterval);
    gameOverMessage.textContent = `Game Over! Final Score: ${score}`;
    gameOverScreen.classList.remove("hidden");
  }

  restartBtn.addEventListener("click", resetGameState);

  function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    movePlayers();
    updateMolecules();
    updatePowerUps();

    drawPlayers();
    drawMolecules();
    drawPowerUps();

    updateUI();

    requestAnimationFrame(gameLoop);
  }

  // Start the game initially
  resetGameState();
})();
