const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let p1 = 0;
let p2 = 0;

const Player = {
	w: 50,
	h: 70,
	x: 150,
	y: canvas.height/2-45,
	speed: 5,
	dy: 0
}

const AI = {
	w: 50,
	h: 70,
	x: 850,
	y: canvas.height/2-45,
	dy: 4
}

const ball = {
	x: canvas.width/2,
	y: 100,
	size: 7.5,
	dx: 6,
	dy: 5
};

function resetball() {
	ball.x = canvas.width/2;
	ball.y = 100;
}

function resetPlayer() {
	Player.x = 150
	Player.y = canvas.height/2-45
	Player.dy = 0
}

function drawPlayer() {
	ctx.beginPath();
	ctx.moveTo(Player.x,
		Player.y);
	ctx.lineTo(Player.x,
		Player.y + Player.h);
	ctx.arc(
		Player.x-10,
		Player.y + Player.h,
		10,
		0,
		Math.PI);
	ctx.lineTo(Player.x-20, Player.y);
	ctx.arc(Player.x-10, Player.y, 10, 0, Math.PI, true);
	ctx.fill();
}

function drawAI() {
	ctx.beginPath();
	ctx.moveTo(AI.x,
		AI.y);
	ctx.lineTo(AI.x,
		AI.y + AI.h);
	ctx.arc(
		AI.x-10,
		AI.y + AI.h,
		10,
		0,
		Math.PI);
	ctx.lineTo(AI.x-20, AI.y);
	ctx.arc(AI.x-10, AI.y, 10, 0, Math.PI, true);
	ctx.fill();
}

function drawball() {
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI*2);
	ctx.fill();
}

function detectWalls() {
	if (Player.y-10 < 0){
		Player.y = 10;
	}
	if (Player.y+80 > canvas.height){
		Player.y = canvas.height-80;
	}
}

function detectWallsAI() {
	if (AI.y-10 < 0){
		AI.y = 10;
	}
	if (AI.y+80 > canvas.height){
		AI.y = canvas.height-80;
	}
}

function move() {
	Player.y += Player.dy;

	detectWalls();
}

function moveUp() {
	Player.dy = -Player.speed;
}
function moveDown() {
	Player.dy = Player.speed;
}

function chaseball() {
	if (AI.y+35 > ball.y){
		AI.y -= AI.dy;
	}
	else if (AI.y+35 < ball.y) {
		AI.y += AI.dy;
	}
}

function paddlehit() {
	return ((ball.x - ball.size <= Player.x && ball.x + ball.size >= Player.x-3) && (ball.y - ball.size >= Player.y-10 && ball.y + ball.size <= Player.y+Player.h+10))
}

function paddlehitAI() {
	return ((ball.x + ball.size >= AI.x-20 && ball.x - ball.size <= AI.x-17) && (ball.y - ball.size >= AI.y-10 && ball.y + ball.size <= AI.y+AI.h+10))
}

function edgehit() {
	//When it hits the side of the paddle
	return (((ball.y+ball.size >= Player.y-10 && ball.y+ball.size <= Player.y-5) //Top side
			|| (ball.y-ball.size <= Player.y+Player.h+10 && ball.y-ball.size >= Player.y+Player.h+5)) //Bottom side
			&& (ball.x-ball.size <= Player.x && ball.x+ball.size >= Player.x-20))//x range
}

function edgehitAI() {
	return (((ball.y+ball.size <= AI.y-10 && ball.y+ball.size >= AI.y-7)//Top side
			|| (ball.y-ball.size >= Player.y+Player.h+10 && ball.y-ball.size <= Player.y+Player.h+7))//Bottom side
			&& (ball.x-ball.size >= AI.x && ball.x+ball.size <= Player.x-20))//x range
}

function keyDown(e) {
	if (e.key === 'ArrowUp' || e.key === 'Up'){
		moveUp();
	} else if (e.key === 'ArrowDown' || e.key === 'Down') {
		moveDown();
	}
}

function keyUp(e) {
	if (e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'ArrowDown' || e.key === 'Down'){
		Player.dx = 0;
		Player.dy = 0;
	}
}

function update() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	drawPlayer();
	move();
	drawball();
	drawAI();
	chaseball();
	detectWallsAI();

	if (paddlehit() || paddlehitAI() || edgehit() || edgehitAI()) {
		ball.dx *= -1;
	}
	if (ball.y + ball.size >= canvas.height || ball.y - ball.size <= 0) {
		ball.dy *= -1;
	}
	
	ball.x += ball.dx;
	ball.y += ball.dy;

	if (ball.x + ball.size <= 0 || ball.x - ball.size >= canvas.width) {
		resetball();
	}

	requestAnimationFrame(update);
}

update();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// // Arcs
// ctx.beginPath();
// const centerX = canvas.width/2;
// const centerY = canvas.height/2
// //head
// ctx.arc(centerX, centerY, 290, 0, Math.PI*2);
// //mouth
// ctx.moveTo(centerX + 100, centerY);
// ctx.arc(centerX, centerY, 100, 0, Math.PI, false);
// //eyes
// ctx.moveTo(centerX - 60, centerY- 80);
// ctx.arc(centerX - 80, centerY - 80, 20, 0, Math.PI*2);
// ctx.moveTo(centerX + 100, centerY - 80);
// ctx.arc(centerX + 80, centerY - 80, 20, 0, Math.PI*2);

// ctx.stroke();


// Paths
// ctx.beginPath();
// ctx.moveTo(50, 50);
// ctx.lineTo(150, 50);
// ctx.lineTo(100, 150);
// //ctx.lineTo(50, 50);
// ctx.closePath();
// ctx.fill();

// // fillRect()
// ctx.fillStyle = 'red';
// ctx.fillRect(20,20,150,100);
// ctx.fillRect(20,200,150,100);

// // strokeRect()
// ctx.lineWidth = 5;
// ctx.strokeStyle = 'yellow';
// ctx.strokeRect(100,200,150,100);

// // clearRect()
// ctx.clearRect(25, 25, 140,90);

// //fillText()
// ctx.font = '30px Arial';
// ctx.fillStyle = 'purple';
// ctx.fillText("Hello world", 400, 50);

// // strokeText()
// ctx.lineWidth = 1;
// ctx.strokeStyle = 'orange';
// ctx.strokeText('Hello world', 400, 100)