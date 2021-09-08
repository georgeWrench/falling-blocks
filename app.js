document.addEventListener("DOMContentLoaded", () => {

let playing = false
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.getElementById('scoreValue')
const startBtn = document.getElementById('start-button')
const highScorePlayAgain = document.getElementById('highScorePlayAgain')
const gameOverGif = document.getElementById('gameOverGif')
const width = 10
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');

let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
let highScoresList = document.getElementById('highScoresList');
    

highScoresList.innerHTML =  
highScores.map(score => {
return `<li class="high-score">${score.name}-${score.score}<br><br></li>`;
}).join("");

let nextRandom = 0
let timerId
let scoreValue = 0

const colors = [
  'orange',
  'red',
  'purple',
  'blue',
  'yellow'
]
//  the tettominos
const lTetromino = [
  [1, width+1, width*2+1, 2],
  [width, width+1, width+2, width*2+2],
  [1, width+1, width*2+1, width*2],
  [width, width*2, width*2+1, width*2+2]
]

const zTetrimino = [
  [0, width, width+1, width*2+1 ],
  [width+1, width+2, width*2, width*2+1],
  [0, width, width+1, width*2+1],
  [width+1, width+2, width*2, width*2+1]
]

const tTetromino = [
  [1, width, width+1, width+2],
  [1, width+1, width+2, width*2+1],
  [width, width+1, width+2, width*2+1],
  [1, width, width+1, width*2+1],
]

const oTetromino = [
  [0, 1, width, width+1],
  [0, 1, width, width+1],
  [0, 1, width, width+1],
  [0, 1, width, width+1],
]

const iTetromino = [
  [1, width +1, width*2+1, width*3+1],
  [width, width+1, width+2, width+3],
  [1, width +1, width*2+1, width*3+1],
  [width, width+1, width+2, width+3],
]

const theTetrominos = [lTetromino, zTetrimino, tTetromino, oTetromino, iTetromino]

let currentPosition = 4
let currentRotation = 0

// select tetromino randomly
let random = Math.floor(Math.random()*theTetrominos.length)
let current = theTetrominos[random][currentRotation]



function control(e) {
 
  if(e.keyCode === 37) {
    moveLeft()
  } else if(e.keyCode === 38) {
    rotate()
  } else if(e.keyCode === 39) {
    moveRight()
  } else if(e.keyCode === 40) {
    moveDown()
  }
  }

document.addEventListener('keyup', control);

// timerId = setInterval(moveDown, 1000)

function moveDown() {
  undraw()
  currentPosition += width
  draw()
  freeze()
}
  

function draw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.add('tetromino')
    squares[currentPosition + index].style.backgroundColor = colors[random]
  })
}

function undraw() {
   current.forEach( index => {
     squares[currentPosition + index].classList.remove('tetromino')
     squares[currentPosition + index].style.backgroundColor = ''
   })
 }

function freeze() {
 if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
   current.forEach(index => squares[currentPosition + index].classList.add('taken'))
  
  random = nextRandom
  nextRandom = Math.floor(Math.random() * theTetrominos.length)
  current = theTetrominos[random][currentRotation]
  currentPosition = 4 
  draw()
  displayShape()
  addScore()
  gameOver()
  
 }
}

// move the tet left, unless is at the edge or there is a blockage
function moveLeft() {
  undraw()
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

  if(!isAtLeftEdge) currentPosition -=1

  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition +=1
  }
  draw()
}
// move the tet right, unless is at the edge of the grid or there is a blockage 
function moveRight() {
  undraw()
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

  if(!isAtRightEdge) currentPosition +=1

  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -=1
  }

  draw()
}

function rotate(){
  undraw()
  currentRotation ++
  if(currentRotation === current.length){ 
    currentRotation = 0 
  }
  current = theTetrominos[random][currentRotation]
  draw()
}

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0


// the tet without rotations
const upNextTetrominos = [
  
  [1, displayWidth+1, displayWidth*2+1, 2],
  [0, displayWidth, displayWidth+1, displayWidth*2+1],
  [1, displayWidth, displayWidth+1, displayWidth+2],
  [0, 1, displayWidth, displayWidth+1],
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
]

// display the next tet

function displayShape() {
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = ''

  })
  upNextTetrominos[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}



// add functionality to the button 
startBtn.addEventListener('click', () => {
if(playing == true) {
    location.reload();

} else {

    startBtn.innerHTML = ('Restart')
    draw()
    timerId = setInterval(moveDown, 500)
    nextRandom = Math.floor(Math.random()*theTetrominos.length)
    displayShape()
    addScore()
    freeze()
    
    playing = true;
  }
}) 

function addScore() {
  for(let i = 0; i < 199; i+=width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if(row.every(index => squares[index].classList.contains('taken'))) {
      scoreValue += 10
      scoreDisplay.innerHTML = scoreValue
      row.forEach(index => {
      squares[index].classList.remove('taken')
      squares[index].classList.remove('tetromino')
      squares[index].style.backgroundColor = ''

      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
     }
       if( scoreValue >= 50 ) {
      clearInterval(timerId)
      timerId = null
      timerId = setInterval(moveDown, 200)
      document.getElementById("level-1").style.display = "block"
     
    } 

       if( scoreValue >= 70 ) {
      clearInterval(timerId)
      timerId = null
      timerId = setInterval(moveDown, 100)
      document.getElementById("level-1").style.display = "none"
      document.getElementById("level-2").style.display = "block"
      
     }
    }
  }

// game over

function gameOver() {
 if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
  
  clearInterval(timerId);
  
  finalScore.innerHTML =`${scoreValue}!</p>`
  
      document.getElementById("start-button").style.display = "none"
      document.getElementById("mini-grid.").style.display = "none"
      document.getElementById("score-bored").style.display = "none"
      document.getElementById("scoreValue").style.display = "none"
      document.getElementById('next').style.display = "none"
      gameOverGif.style.display = "block"
  
  setTimeout(() => {
      gameOverGif.style.display = "none"
    
  }, 3000);
  
  setTimeout(() => {
    document.getElementById("end").style.display = "block";
    }, 3250);
  
  localStorage.setItem("mostRecentScore", scoreValue);
 }
}

// saving High Scores to Local Storage

const mostRecentScore = localStorage.getItem('mostRecentScore');
finalScore.innerText = mostRecentScore

const MAX_HIGH_SCORES = 5;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => {
  e.preventDefault();

  const score = {
    score: scoreValue,
    name: username.value
};
  
  
  highScores.push(score);
  highScores.sort((a,b) => b.score - a.score)
  highScores.splice(5);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  
  
  document.getElementById('end').style.display = "none";
  
  highScorePlayAgain.style.display = "block";
  
  highScorePlayAgain.addEventListener('click', () => {
    location.reload();
  })

  let highScoresList = document.getElementById('highScoresList');
    
  highScoresList.innerHTML =  
  highScores.map(score => {
  return `<li class="high-score">${score.name}-${score.score}<br><br></li>`;
  }).join("");

  grid.style.display = "none"
  document.getElementById('level-1').style.display = "none"
  document.getElementById('level-2').style.display = "none"
  document.getElementById('controls').style.display = "none"
  document.getElementById('highScores').style.top = "100px"
  document.getElementById('highScores').style.left = "294px"
  document.getElementById('mini-grid').style.display = "none"
  scorebored.style.display = "none"
  
  }
});