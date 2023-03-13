//Responsible for all functionalities

//////////////////////// Global Variables ////////////////////////
const canvas = document.getElementById("canvas"); //canvas
const ctx = canvas.getContext("2d"); //context

//////////////////////// Player ////////////////////////
function Player() {
    //Player Attributes
    this.w = 20;
    this.h= 70;
    this.x = 150;
    this.y = canvas.height/2-45;
    this.speed = 3.5;
    this.dy = 0;

    //draws player
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
        if (this.y-this.w/2 < 0){ // we minus with the width/2 to consider the round edges
            this.y = this.w/2;
        }
        if (this.y+this.h+this.w/2 > canvas.height){ //we add the width/2 to consider the round edges
            this.y = canvas.height-(this.h+this.w/2);
        }
    };

    this.moveUp = () => {
        this.dy = -this.speed; //set dy to negative speed
    };

    this.moveDown = function() {
        this.dy = this.speed; //set dy to speed
    };

    this.keyDown = (e) => {
        //When arrows are pressed
        if (e.key === 'ArrowUp' || e.key === 'Up'){
            this.moveUp();
        } else if (e.key === 'ArrowDown' || e.key === 'Down') {
            this.moveDown();
        }
    };

    this.keyUp = (e) => {
        //When arrows are lifted
        if (e.key === 'ArrowUp' || e.key === 'Up' || e.key === 'ArrowDown' || e.key === 'Down'){
            this.dy = 0; //stops moving
        }
    };

    this.move = () => {
        this.y += this.dy;
        this.detectWalls(); //Avoids going through walls
    };
};

//////////////////////// AI ////////////////////////
function AI() {
    //AI Attributes
    this.w = 20;
    this.h = 70;
    this.x = 850;
    this.y = canvas.height/2-45;
    this.dy = 3.5;

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
        if (this.y-this.w/2 < 0){
            this.y = 10;
        }
        if (this.y+this.h+this.w/2 > canvas.height){
            this.y = canvas.height-(this.h+this.w/2);
        }
    };
};

//////////////////////// Ball ////////////////////////
function Ball() {
    //Ball attributes
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
        //Randomly positions ball in range 200,300 pixel
        this.y = Math.floor(Math.random() * 300) + 200;
    };

    this.outleft = () => {
        return this.x + this.size <= 0
    };

    this.outright = () => {
        return this.x - this.size >= canvas.width
    };
    this.move = () => {
        this.x += this.dx;
        this.y += this.dy;
    };
};

//////////////////////// Sound ////////////////////////
function Sound() {
    this.sound = false;
    this.unmuted = new Image();
    this.muted = new Image();
    
    this.unmuted.src = "./images/unmuted.png";
    this.muted.src = "./images/muted.png";

    this.unmute = () => { //Loads unmuted logo
        ctx.drawImage(this.unmuted, 20, 20, 50, 40);
    };

    this.mute = () => { //Loads muted logo
        ctx.drawImage(this.muted, 20, 20, 50, 40);
    };

    this.click = (event) => { //Determines whether the button is clicked
        const rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            if (x >= 20 && x <= 70 && y >= 20 && y <= 60){
                 if (this.sound == false){
                    this.sound = true;
                 } else {this.sound = false;}
            }
    };

    this.audiobutton = () => { //Listens for mouse click
        canvas.addEventListener('click', this.click)
    };

    this.toggle = () => { //Provides entire functionality
        this.audiobutton();
        if (this.sound == false){
            this.unmute();
        }
        else{
            this.mute();
        }
    };

    this.boom = () => { //Score sound
        const score = new Audio();
        score.src = "./sounds/boom.mp3";
        if (this.sound == false){
            score.play();
        }
    };

    this.beep= () => { //Paddle hit sound
        const hit = new Audio();
        hit.src = "./sounds/beep.mp3";
        if (this.sound == false){
            hit.play();
        }
    };
};

//////////////////////// Game ////////////////////////

function Game() {
    //Game attributes
    this.player = new Player();
    this.ai = new AI();
    this.ball = new Ball();
    this.audio = new Sound();
    this.p1 = 0;
    this.p2 = 0;
    this.playing = false;
    ctx.font = '30px Arial'; //font size

    this.net = () => {
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(500, 0);
        ctx.lineTo(500, 600);
        ctx.fill();
        ctx.stroke();
    };

    this.ui = () => {
        //Updates the canvas
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.fillText(this.p1, 380, 100);
        ctx.fillText(this.p2, 600, 100);
        this.net();
        this.player.drawPlayer();
        this.ai.drawAI();
        this.audio.toggle();
    };

    this.paddlehit = () => {
        //Player's hitbox
        return ((this.ball.y+this.ball.size >= this.player.y-this.player.w/2 && this.ball.y-this.ball.size <= this.player.y+this.player.h+this.player.w/2)
            && (this.ball.x-this.ball.size < this.player.x && this.ball.x-this.ball.size > this.player.x-this.player.w/2))
    };

    this.paddlehitAI = () => {
        //AI's hitbox
        return ((this.ball.y+this.ball.size >= this.ai.y-this.ai.w/2 && this.ball.y-this.ball.size <= this.ai.y+this.ai.h+this.ai.w/2)
            && (this.ball.x+this.ball.size >= this.ai.x-20 && this.ball.x+this.ball.size <= this.ai.x-this.ai.w/2))
    };

    this.chaseball = () => {
        //AI's mind
        //Tries to center the ball to its center
        if (this.ai.y+this.ai.h/2 > this.ball.y){
            this.ai.y -= this.ai.dy;
        }
        else if (this.ai.y+this.ai.h/2 < this.ball.y) {
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
        // starts/resets the game
        //condition for extra security that the game does not reset while playing
        if (this.playing == false) {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            this.playing = true;
            this.p1 = 0;
            this.p2 = 0;
            this.player.resetPlayer();
            this.ai.resetAI();
            this.ball.resetball();
        }
    };

    this.gameover = () => {
        //End of game
        this.playing = false;
        ctx.clearRect(475, 70, 50, 70);
        ctx.fillText("Game Over", 425, 100);
        if (this.p1 > this.p2){
            ctx.fillText("You Win!", 440, 130);
        }
        else {
            ctx.fillText("You Lose!", 440, 130);
        }
    };

    this.play  = () => {
        //game functionalities

        //updates
        this.player.move();
        this.chaseball();
        this.ai.detectWallsAI();
        this.ball.drawball();

        if (this.paddlehit()) {
            this.ball.dx *= -1;
            this.audio.beep();
            //Prevents the ball from sticking to the paddle
            this.ball.x = this.player.x+this.ball.size+1
        }
        else if (this.paddlehitAI()){
            this.ball.dx *= -1;
            this.audio.beep();
            //Prevents the ball from sticking to the paddle
            this.ball.x = this.ai.x-this.ai.w-this.ball.size-1;
        }

        // Floor & ceiling bounce
        if (this.ball.y + this.ball.size >= canvas.height || this.ball.y - this.ball.size <= 0) {
            this.ball.dy *= -1;
        }
        
        this.ball.move();

        if (this.ball.outright()){
            //Player's point
            this.audio.boom();
            this.p1++;
            this.ball.resetball();
        }
        if (this.ball.outleft()){
            //AI's point
            this.audio.boom();
            this.p2++;
            this.ball.resetball();
        }
    };

    this.run = () => {
        //Main function
        this.ui();

        if (this.p1 == 20 || this.p2 == 20){
            this.gameover();
        }

        if (this.playing == true) {
            this.play();
        }
        else {
            this.menu();
        }
        requestAnimationFrame(this.run);
    };
    document.addEventListener('keypress', this.start);
    document.addEventListener('keydown', this.player.keyDown);
    document.addEventListener('keyup', this.player.keyUp);
};

//////////////////////////////////////////////////////////

var Pong = new Game();
Pong.run();