//searches thru html file and find the grid2 from it
const grid2 = document.querySelector('.grid2') 
const resultsDisplay = document.querySelector('.results')
const startButton = document.querySelector('.startButton')
const replayButton = document.querySelector('.replayButton')
//start the shooter in the middle
let currentShooterIndex = 202
//width of grid
let width = 15
//postive 1 cause it goes to the right of the grid
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0 

//looking for an input ex; click for something to happen
startButton.addEventListener("click", startGame)
replayButton.addEventListener('click',replayGame) 

//for the start game button
function startGame() {
   invadersId = setInterval(moveInvaders, 300)
}
 
//for the replay button
function replayGame(){
    location.reload()  
    startGame() 
}

//for loop to put 255 squares in the grid.
for (let i = 0; i < 255; i++) {    
    const square = document.createElement('div')
    //so the appendChild is the total grid and inside it are the squares
    //ask?
    grid2.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid2 div'))

//array for the invaders
const alienInvaders =  [
     0,1,2,3,4,5,6,7,8,9,
     15,16,17,18,19,20,21,22,23,24,
     30,31,32,33,34,35,36,37,38,39 
]

//adding the invaders 
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
        squares[alienInvaders[i]].classList.add('invader')

        }
    }
}

draw()

//removing the invaders
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

squares[currentShooterIndex].classList.add('shooter')

//can move right and left
function moveShooter(e){
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key){
        case 'ArrowLeft':
          //checking to see if shooter is at the left and cause its not u can move it left
            if(currentShooterIndex % width !== 0) currentShooterIndex -=1
            break
        case "ArrowRight":
          //check to see if its not on the right hand side so u can move it right 
            if(currentShooterIndex % width < width -1 ) currentShooterIndex +=1
            break 
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

function reserveMoveShooter(e){
  squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key){
        case 'ArrowRight':
          //checking to see if shooter is at the left and cause its not u can move it left
            if(currentShooterIndex % width !== 0) currentShooterIndex -=1
            break
        case "ArrowLeft":
          //check to see if its not on the right hand side so u can move it right 
            if(currentShooterIndex % width < width -1 ) currentShooterIndex +=1 
            break 
    }
    squares[currentShooterIndex].classList.add('shooter')
}

//to move the invaders for both edges
//add a boolean variable to track the movement direction
//moving up is first set to false because the grid is gonna move down when the game starts
let movingUp = false;
let movingDown = true;
let reseting = false;
let paused = false;  

function moveInvaders() { 
  //
  const leftEdge = alienInvaders[0] % width === 0;
  //checking with the array   
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
  //checking to see is the first alien is at the top left coner still
  //this is a boolean cause its checking if 2 things are equal
  const atTopEdgeThreshold = alienInvaders[0] === 0; 
  if (paused){
    //nothing will happen if game is paused
    return
  }
  remove(); 
  

  if(atTopEdgeThreshold){   
    //check if invaders have reached the top edge of the grid 
    movingUp = false;
    if(reseting){ 
      //reset the invaders positions and directions  
    goingRight = true; 
    reseting = false; 
    paused = true;
    console.log(paused) 
    draw() 
    return 
    }    
  }
    if (rightEdge && goingRight) { 
      //the invaders reached the right edge and were moving right
    for (let i = 0; i < alienInvaders.length; i++) {
      //move invaders up 
      if(movingUp){
        //the width is moving to the left
        alienInvaders[i] -= width - 1;
        direction = 1;
      }
      else {
      //the width is moving to the right 
      alienInvaders[i] += width + 1;
      direction = -1;
      }
      goingRight = false;  
    
    }
  
  } else if (leftEdge && !goingRight) {
    //the invaders reached the left edge and were moving left
    for (let i = 0; i < alienInvaders.length; i++) {
      if(movingUp){
        //move invaders up
      alienInvaders[i] -= width + 1;  
      direction = -1;
      } 
      else {     
        //move invaders down 
         alienInvaders[i] += width - 1;
         direction = 1; 
      } 
      goingRight = true;
    }
  }
  if(movingUp == true){

    //move the invaders up 
      for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] -= direction; 
      }
}
  else if (movingDown){
    //move the invaders down
    for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction;
    }
  }
  
  draw();

  // If shooter touches an alien
  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = 'GAME OVER';
    clearInterval(invadersId);
  }

  // If alien touches bottom of the board 
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > squares.length - width) {
      resultsDisplay.innerHTML = ('GAME OVER');
      clearInterval(invadersId);
    }
  }

  // If all aliens have been shot and removed
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = "YOU WIN";
    clearInterval(invadersId);
  }
} 
  
// Define the top edge threshold
const topEdgeThreshold = 0; // Example value, adjust as needed


//when pressing the z button down it becomes true and goes upwards 
document.addEventListener('keydown', function (e) {
  //when x if pressed moving upwards is equal to true
    if (e.key === 'z') {
        movingUp = true;
        //first it removes the moveshooter keys so player cannot move
        document.removeEventListener('keydown', moveShooter);
        //reserveMoveShooter is active now  
        document.addEventListener('keydown', reserveMoveShooter);
        goingRight = !goingRight;  
        reseting = true; 
    }
    //checking to see if aliens are at the top of the board
    if(movingUp == false){
      if(e.key === 'x'){
        movingDown = true;
        document.removeEventListener('keydown', moveShooter);
        document.addEventListener('keydown', reserveMoveShooter); 
        paused = false;
      }
    }
    
});
    
function shoot(e){
    let laserId
    let currentLaserIndex = currentShooterIndex 
    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if (squares[currentLaserIndex].classList.contains('invader')){
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')    

            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results 
            console.log(aliensRemoved)
        }

    }
    switch(e.key) {
        case 'ArrowUp':
            laserId = setInterval(moveLaser,100)
    }
}

document.addEventListener('keydown', shoot) 
 