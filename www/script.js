window.onload = () => {

const board = document.querySelector('.board');
const blockSize = 40;

const startButton = document.querySelector('.btn-start')
const restartButton = document.querySelector('.btn-restart')
const modal = document.querySelector('.modal')
const startGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')

const highScoreElement = document.querySelector('.high-score')
const scoreElement = document.querySelector('.score')

let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerText = highScore;

let score = 0;
let intervalId = null;
let blocks = [];

let cols, rows;
let snake, direction, food;

function initGame(){

    const boardRect = board.getBoundingClientRect();
    cols = Math.floor(boardRect.width / blockSize);
    rows = Math.floor(boardRect.height / blockSize);

    snake = [{x:5,y:5},{x:5,y:6},{x:5,y:7}]
    direction = "left"
    food = randomFood();

    // create grid
    board.innerHTML = "";
    blocks = [];

    for(let r=0;r<rows;r++){
        for(let c=0;c<cols;c++){
            const b=document.createElement('div');
            b.classList.add('block');
            board.appendChild(b);
            blocks[`${r}-${c}`]=b;
        }
    }
}

function randomFood(){
    return {
        x: Math.floor(Math.random()*rows),
        y: Math.floor(Math.random()*cols)
    }
}

function setDirection(newDir){
 if(direction==='up'&&newDir==='down')return;
 if(direction==='down'&&newDir==='up')return;
 if(direction==='left'&&newDir==='right')return;
 if(direction==='right'&&newDir==='left')return;
 direction=newDir;
}

function render(){
 let head={...snake[0]}
 if(direction==='left')head.y--;
 if(direction==='right')head.y++;
 if(direction==='up')head.x--;
 if(direction==='down')head.x++;

 if(head.x<0||head.y<0||head.x>=rows||head.y>=cols){
     gameOver(); return
 }

 snake.unshift(head)

 if(head.x===food.x&&head.y===food.y){
   score++;
   scoreElement.innerText=score;
   if(score>highScore){
     highScore=score;
     localStorage.setItem("highScore",score);
     highScoreElement.innerText=highScore;
   }
   food=randomFood();
 } else snake.pop();

 Object.values(blocks).forEach(b=>b.classList.remove('fill','food'))
 snake.forEach(s=>blocks[`${s.x}-${s.y}`]?.classList.add('fill'))
 blocks[`${food.x}-${food.y}`]?.classList.add('food')
}

function gameOver(){
 clearInterval(intervalId)
 modal.style.display='flex'
 startGameModal.style.display='none'
 gameOverModal.style.display='flex'
}

startButton.onclick=()=>{
 modal.style.display='none'
 initGame()                     // ⭐ important fix
 intervalId=setInterval(render,250)
}

restartButton.onclick=()=>location.reload()

// keyboard
addEventListener("keydown",e=>{
 if(e.key=="ArrowUp")setDirection("up")
 if(e.key=="ArrowDown")setDirection("down")
 if(e.key=="ArrowLeft")setDirection("left")
 if(e.key=="ArrowRight")setDirection("right")
})

// swipe controls
let startX=0,startY=0;
document.addEventListener("touchstart",e=>{
 startX=e.touches[0].clientX;
 startY=e.touches[0].clientY;
})

document.addEventListener("touchend",e=>{
 let dx=e.changedTouches[0].clientX-startX;
 let dy=e.changedTouches[0].clientY-startY;
 if(Math.abs(dx)>Math.abs(dy)) setDirection(dx>0?"right":"left")
 else setDirection(dy>0?"down":"up")
})

}
