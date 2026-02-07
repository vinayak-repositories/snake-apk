const board = document.querySelector('.board');
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


if(head.x<0||head.y<0||head.x>=rows||head.y>=cols){ gameOver(); return }


snake.unshift(head)


if(head.x===food.x&&head.y===food.y){
score++; scoreElement.innerText=score;
if(score>highScore){localStorage.setItem("highScore",score)}
food=randomFood();
} else snake.pop();


blocks.forEach(b=>b.classList.remove('fill','food'))
snake.forEach(s=>blocks[`${s.x}-${s.y}`]?.classList.add('fill'))
blocks[`${food.x}-${food.y}`]?.classList.add('food')
}


function gameOver(){
clearInterval(intervalId)
modal.style.display='flex'
startGameModal.style.display='none'
gameOverModal.style.display='flex'
}


startButton.onclick=()=>{ modal.style.display='none'; intervalId=setInterval(render,250) }
restartButton.onclick=()=>location.reload()


// keyboard
addEventListener("keydown",e=>{
if(e.key=="ArrowUp")setDirection("up")
if(e.key=="ArrowDown")setDirection("down")
if(e.key=="ArrowLeft")setDirection("left")
if(e.key=="ArrowRight")setDirection("right")
})


// SWIPE CONTROLS
let startX=0,startY=0;
document.addEventListener("touchstart",e=>{
startX=e.touches[0].clientX; startY=e.touches[0].clientY;
})


document.addEventListener("touchend",e=>{
let dx=e.changedTouches[0].clientX-startX;
let dy=e.changedTouches[0].clientY-startY;
if(Math.abs(dx)>Math.abs(dy)) setDirection(dx>0?"right":"left")
else setDirection(dy>0?"down":"up")
})