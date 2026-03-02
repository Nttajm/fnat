// fnat (fnaf) game recreation.


import { CLOCK_SET } from "./clock.js";

const elemems = {
  clock: document.querySelector('.clock'),
  night: document.querySelector('.door1'),
  door1: document.querySelector('.door2'),
  door2: document.querySelector('.light1'),
  light1: document.querySelector('.light2'),
  cameras: document.querySelector('.cameras'),
}

export let game = {
  isNew : true, // if it is a new game itll show like thw newspaper animation, if not itll show the normal start screen
  gameStarted : false, // like if the game has started or not
  loop: false,
  time: 0,
  night: 1,
  aiLevel: 1,
  gamespeed: 1000, // in milliseconds
}

export let scene = {
  door1: false,
  door2: false, // false means open, true means closed
  light1: false, // false means off, true means on
  light2: false,
  cameras: false,
  power: 100,
  powerOn: true,
  CheckingCameras: false,
}

// Camera panning system
let cameraSystem = {
  currentPanX: 0, // current horizontal pan position (0 = center)
  maxPanX: 30, // maximum pan distance (in percentage)
  panSpeed: 0.8, // how fast to pan
  isMovingLeft: false,
  isMovingRight: false,
  studentCenterElement: null,
}

function initCameraPanning() {
  // Prevent double initialization  
  if (cameraSystem.studentCenterElement) return;
  
  cameraSystem.studentCenterElement = document.querySelector('.student-center');
  
  if (!cameraSystem.studentCenterElement) return;
  
  // Set initial background position
  cameraSystem.studentCenterElement.style.backgroundPosition = '50% 50%';
  
  // Add mouse move event listener
  document.addEventListener('mousemove', handleCameraPanning);
  
  // Start the camera panning animation loop
  requestAnimationFrame(updateCameraPosition);
}

function handleCameraPanning(event) {
  const screenWidth = window.innerWidth;
  const mouseX = event.clientX;
  const leftThreshold = screenWidth * 0.2; // 20% from left
  const rightThreshold = screenWidth * 0.8; // 20% from right
  
  // Reset movement flags
  cameraSystem.isMovingLeft = false;
  cameraSystem.isMovingRight = false;
  
  // Check if mouse is in left 20% area
  if (mouseX <= leftThreshold) {
    cameraSystem.isMovingLeft = true;
  }
  // Check if mouse is in right 20% area  
  else if (mouseX >= rightThreshold) {
    cameraSystem.isMovingRight = true;
  }
}

function updateCameraPosition() {
  // Move left
  if (cameraSystem.isMovingLeft && cameraSystem.currentPanX > -cameraSystem.maxPanX) {
    cameraSystem.currentPanX -= cameraSystem.panSpeed;
    if (cameraSystem.currentPanX < -cameraSystem.maxPanX) {
      cameraSystem.currentPanX = -cameraSystem.maxPanX;
    }
  }
  
  // Move right
  if (cameraSystem.isMovingRight && cameraSystem.currentPanX < cameraSystem.maxPanX) {
    cameraSystem.currentPanX += cameraSystem.panSpeed;
    if (cameraSystem.currentPanX > cameraSystem.maxPanX) {
      cameraSystem.currentPanX = cameraSystem.maxPanX;
    }
  }
  
  // Apply the background position
  if (cameraSystem.studentCenterElement) {
    const backgroundPosX = 50 + cameraSystem.currentPanX; // 50% is center
    cameraSystem.studentCenterElement.style.backgroundPosition = `${backgroundPosX}% 50%`;
  }
  
  // Continue the animation loop
  requestAnimationFrame(updateCameraPosition);
}


export function startGame() {
  // set the clock to show 12:00 AM with a custom date text and keep it static
  CLOCK_SET('12:00', 'AM', 'NIGHT 1', true);
  // Initialize camera panning system
  initCameraPanning();
  // game.loop = true; 
  // initGameLoop();
}



function initGameLoop() {
  while (game.loop) {
    setInterval(() => {
      GameLoop();
    }, game.gamespeed);
  }
}

function GameLoop() {
  game.time += 1;

  updateTronics();
  powerCheckers();
  events();
  updateTime();
}

function updateTronics() {
  const random = Math.floor(Math.random() * 20) + 1;
  while (random < game.aiLevel) {
  }
} 


function powerCheckers() {
  if (scene.door1 || scene.door2) {
    scene.power -= 0.5; // if the door is closed it uses 0.5% power per second, if its open it uses 0% power per second
  }

  if ( scene.door1 && scene.door2) {
    scene.power -= 1; // if both doors are closed it uses 1% power per second, if one is open and the other is closed it uses 0.5% power per second, if both are open it uses 0% power per second
  }

  if (scene.light1 || scene.light2) {
    scene.power -= 0.5; // if the light is on it uses 0.5% power per second, if its off it uses 0% power per second
  }

  if (scene.cameras) {
    scene.power -= 0.2;
  }
}

function updateTime() {
  if (game.night == 1) {
    HELPER_updateTime(30);
  } else if (game.night == 2) {
    HELPER_updateTime(25);
  }
}

function HELPER_updateTime(divby) {
  const hours = Math.floor(game.time / divby) + 12;
    const displayHour = hours > 12 ? hours - 12 : hours;
    CLOCK_SET(`${displayHour}:00`, 'AM', `NIGHT ${game.night}`);
}

function events() {
}

// Initialize camera panning when DOM is loaded (fallback)
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for other scripts to load, then check if game view is visible
  setTimeout(() => {
    const gameView = document.querySelector('.game-view');
    if (gameView && !gameView.classList.contains('dn')) {
      initCameraPanning();
    }
  }, 100);
});