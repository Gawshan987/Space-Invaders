const grid2 = document.querySelector('.grid2')
const resultsDisplay = document.querySelector('.results')
const startButton = document.querySelector('.startButton')
let currentShooterIndex = 202
let width = 15
let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0 

startButton.addEventListener("click", startGame)

function startGame() {
   invadersId = setInterval(moveInvaders, 300)

}

//for loop for the
for (let i = 0; i < 255; i++) {    
    const square = document.createElement('div')
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
            if(currentShooterIndex % width !== 0) currentShooterIndex -=1
            break
        case "ArrowRight":
            if(currentShooterIndex % width < width -1 ) currentShooterIndex +=1
            break 
    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

//to move the invaders for both edges
function moveInvaders(){
    const leftEdge = alienInvaders[0] % width === 0  
    const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1
    remove()

    if(rightEdge && goingRight){
        for ( let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width +1
            direction = -1
            goingRight = false
        }
    }

    if(leftEdge && !goingRight){
        for(let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width -1
            direction = 1
            goingRight = true
        }
    }

    for(let i = 0; i < alienInvaders.length; i++){
        alienInvaders[i] += direction
    }

    draw()

    // If shooter touches an alien
    if(squares[currentShooterIndex].classList.contains('invader','shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
    }

    
    // If alien touches bottom of the board
    for (let i = 0; i < alienInvaders.length; i++){
        if(alienInvaders[i] > (squares.length)){
            resultsDisplay.innerHTML = ('GAME OVER')
            clearInterval(invadersId)
        }
    }

    // If all aliens have been shot and removed
    if (aliensRemoved.length === alienInvaders.length) { 
        resultsDisplay.innerHTML  = "YOU WIN"
        clearInterval(invadersId)
    }
}
//invadersId = setInterval(moveInvaders, 300)

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