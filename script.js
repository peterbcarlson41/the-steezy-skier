const game = document.getElementById('game');
const skier = document.getElementById('skier');
let counter = 0;
let blue = true;
const initialAnimationDuration = 3; // seconds
let started = false;

//set score to 0 intitially
document.getElementById("scoreSpan").innerHTML = Math.floor(counter);

game.addEventListener('mousemove', (event) => {
  const gameRect = game.getBoundingClientRect();
  const x = event.clientX - gameRect.left + 10;

  if((event.clientX) < (gameRect.right - 70)) {
    skier.style.left = `${x}px`;
  }
});

function checkCollision() {
  const skierRect = skier.getBoundingClientRect();
  const gates = document.querySelectorAll('.gate');

  gates.forEach(gate => {
    const gateRect = gate.getBoundingClientRect();
    counter++;
    document.getElementById("scoreSpan").innerHTML = Math.floor(counter + 1);
    if (skierRect.bottom >= gateRect.top && skierRect.top <= gateRect.bottom &&
        skierRect.right >= gateRect.left && skierRect.left <= gateRect.right) {
      // handle collision here, such as game over or score increment
      // alert("You hit a gate. score: "+Math.floor(counter));
      counter=0;
    }
    else {
      if (gate.style.backgroundColor == "red") {
        if (skierRect.bottom >= gateRect.top && skierRect.left <= gateRect.right && skierRect.top <= gateRect.bottom) {
          // alert("You missed a red gate. score: "+ Math.floor(counter));
          //insert game end function
          counter=0;
        }
      }
      if (gate.style.backgroundColor == "blue"){
        //if the gate is blue, the skier should be on the left side of the gate before the top of the gate passes the bottom of the skier
        if (skierRect.bottom >= gateRect.top && skierRect.right >= gateRect.left && skierRect.top <= gateRect.bottom) {
          // alert("You missed a blue gate. score: "+Math.floor(counter));
          counter=0;
        }
      }
    }
  });
}

let currentAnimationDuration = initialAnimationDuration;

function createGate() {
  const gate = document.createElement('div');
  gate.classList.add('gate');
  const gameRect = game.getBoundingClientRect();
  const minDistanceFromEdge = 80; // minimum distance from the edge

  // Generate a random gate position on the left or right half of the screen
  const gatePosition = blue ? Math.random() * (gameRect.width/2 - minDistanceFromEdge * 2 - 50) + minDistanceFromEdge : Math.random() * (gameRect.width/2 - minDistanceFromEdge * 2 - 50) + gameRect.width/2 + minDistanceFromEdge;

  gate.style.left = `${gatePosition}px`;
  gate.style.backgroundColor = blue ? 'blue' : 'red';

  // Set the initial animation duration
  gate.style.animationDuration = `${currentAnimationDuration}s`;
  game.appendChild(gate);

  //alternate the value of blue
  blue = !blue;

  gate.addEventListener('animationend', () => {
    gate.remove();
  });

  // Decrease the animation duration after every gate is created, only to a point
  console.log(currentAnimationDuration);
  if (currentAnimationDuration >= 1) {
    currentAnimationDuration -= 0.01;
  } 

  // Calculate the next interval based on the current animation duration
  const nextInterval = currentAnimationDuration * 1000 / 2;

  // Create the next gate after the calculated interval
  setTimeout(createGate, nextInterval);
}


// Start creating gates when the user clicks the screen
document.addEventListener("click", gameLoop);

function gameLoop() {
  if (started == false) {
    started = true;

    //make click header and instructions disappear
    const start = document.getElementById("start");
    start.style.display = "none";

    const instructions = document.getElementById("instructions");
    setTimeout(() => {
      instructions.style.display = "none";
    }, 5000);

    setTimeout(createGate, currentAnimationDuration * 1000);
    setInterval(checkCollision, 10);
  }

  //else do nothing and let the game run
}

