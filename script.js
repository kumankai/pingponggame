

//////////////////////// Global Variables ////////////////////////
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = 'grey';
ctx.font = '30px Arial';

//////////////////////// Player ////////////////////////
function Player() {
    this.w = 20;
    this.h= 70;
    this.x = 150;
    this.y = canvas.height/2-45;
    this.speed = 5;
    this.dy = 0;

    this.drawPlayer = () => {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.h);
        ctx.arc(this.x-this.w/2, this.y + this.h, this.w/2, 0, Math.PI);
        ctx.lineTo(this.x-this.w, this.y);
        ctx.arc(this.x-this.w/2, this.y, this.w/2, 0, Math.PI, true);
        ctx.fill();
    };

    this.resetPlayer = () => {
        this.y = canvas.height/2-45;
        this.dy = 0;
    };

    this.detectWalls = () => {
        if (this.y-10 < 0){
            this.y = 10;
        }
        if (this.y+80 > canvas.height){
            this.y = canvas.height-80;
        }
    };

    this.moveUp = () => {
        this.dy = -this.speed;
    };

    this.moveDown = function() {
        this.dy = this.speed;
    };

    this.keyDown = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'Up'){
            this.moveUp();
        } else if (e.key === 'ArrowDown' || e.key === 'Down') {
            this.moveDown();
        }
    };

    this.keyUp = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'ArrowDown' || e.key === 'Down'){
            this.dx = 0;
            this.dy = 0;
        }
    };

    this.move = () => {
        document.addEventListener('keydown', this.keyDown);
        document.addEventListener('keyup', this.keyUp);
        this.y += this.dy;
        this.detectWalls();
    };
};

//////////////////////// AI ////////////////////////
function AI() {
    this.w = 20;
    this.h = 70;
    this.x = 850;
    this.y = canvas.height/2-45;
    this.dy = 3.9;

    this.drawAI = () => {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.h);
        ctx.arc(this.x-this.w/2, this.y + this.h, this.w/2, 0,Math.PI);
        ctx.lineTo(this.x-this.w, this.y);
        ctx.arc(this.x-this.w/2, this.y, this.w/2, 0, Math.PI, true);
        ctx.fill();
    };
    this.resetAI = () => {
        this.y = canvas.height/2-45;
    };
    this.detectWallsAI = () => {
        if (this.y-10 < 0){
            this.y = 10;
        }
        if (this.y+80 > canvas.height){
            this.y = canvas.height-80;
        }
    };
};

//////////////////////// Ball ////////////////////////
function Ball() {
    this.x = canvas.width/2;
    this.y = 100;
    this.size = 7.5;
    this.dx = 5;
    this.dy = 4;

    this.drawball = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    };

    this.resetball = () => {
        this.x = canvas.width/2;
        this.y = Math.floor(Math.random() * 300) + 200;
    };

    this.outleft = () => {
        return this.x + this.size <= 0
    };

    this.outright = () => {
        return this.x - this.size >= canvas.width
    };
};

//////////////////////// Sound ////////////////////////
function boom() {
	const audio = new Audio();
	audio.src = "./sounds/boom.mp3";
	audio.play();
}

//////////////////////// Game ////////////////////////

function Game() {
    this.player = new Player();
    this.ai = new AI();
    this.ball = new Ball();
    this.p1 = 0;
    this.p2 = 0;
    this.running = false;

    this.net = () => {
        ctx.lineWidth = 10;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(500, 0);
        ctx.lineTo(500, 600);
        ctx.fill();
        ctx.stroke();
    };

    this.ui = () => {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.fillText(this.p1, 380, 100);
        ctx.fillText(this.p2, 600, 100);
        this.net();
        this.player.drawPlayer();
        this.ai.drawAI();
    };

    this.paddlehit = () => {
        return ((this.ball.y+this.ball.size >= this.player.y-this.player.w/2 && this.ball.y-this.ball.size <= this.player.y+this.player.h+this.player.w/2)
            && (this.ball.x-this.ball.size < this.player.x && this.ball.x-this.ball.size > this.player.x-this.player.w/2))
    };

    this.paddlehitAI = () => {
        return ((this.ball.y+this.ball.size >= this.ai.y-this.ai.w/2 && this.ball.y-this.ball.size <= this.ai.y+this.ai.h+this.ai.w/2)
            && (this.ball.x+this.ball.size >= this.ai.x-20 && this.ball.x+this.ball.size <= this.ai.x-this.ai.w/2))
    };

    this.chaseball = () => {
        if (this.ai.y+35 > this.ball.y){
            this.ai.y -= this.ai.dy;
        }
        else if (this.ai.y+35 < this.ball.y) {
            this.ai.y += this.ai.dy;
        }
    };

    this.menu = () => {
        ctx.clearRect(475, 270, 50, 40);
        ctx.fillText("Press any key to start", 365, 300);
        this.player.resetPlayer();
        this.ai.resetAI();
    };

    this.start = () => {
        if (this.running == false) {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            this.running = true;
            this.p1 = 0;
            this.p2 = 0;
            this.player.resetPlayer();
            this.ai.resetAI();
            this.ball.resetball();
        }
    };

    this.gameover = () => {
        this.running = false;
        ctx.clearRect(475, 80, 50, 60);
        ctx.fillText("Game Over", 425, 100);
        if (this.p1 > this.p2){
            ctx.fillText("You Win!", 440, 130);
        }
        else {
            ctx.fillText("You Lose!", 440, 130);
        }
    };

    this.play  = () => {
        this.player.move();
        this.chaseball();
        this.ai.detectWallsAI();
        this.ball.drawball();

        if (this.paddlehit() || this.paddlehitAI()) {
            this.ball.dx *= -1;
        }
        if (this.ball.y + this.ball.size >= canvas.height || this.ball.y - this.ball.size <= 0) {
            this.ball.dy *= -1;
        }
        
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        if (this.ball.outright()){
            boom();
            this.p1++;
            this.ball.resetball();
        }
        if (this.ball.outleft()){
            boom();
            this.p2++;
            this.ball.resetball();
        }
    };

    this.run = () => {
        this.ui();

        if (this.p1 == 20 || this.p2 == 20){
            this.gameover();
        }

        if (this.running == true) {
            this.play();
        }
        else {
            this.menu();
        }

        document.addEventListener('keypress', this.start);
        requestAnimationFrame(this.run);
    };
};

//////////////////////////////////////////////////////////

const Pong = new Game();
Pong.run();