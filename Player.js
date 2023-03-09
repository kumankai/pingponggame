const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Player {
    // Paddle object
    constructor(speed, posx, posy) {
        this.w = 50; //paddle width
        this.h = 70; //paddle height, exluding round edges
        this.speed = speed; //paddle speed
        this.dy = 0; //paddle current rate of change in y
        this.x = posx; //paddle starting x position
        this.y = posy; //paddle stating y position 
    }
    drawPlayer() {
        //Draws paddle with canvas API
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.h);
        ctx.arc(this.x-10, this.y+this.h, 10, 0, Math.PI);
        ctx.lineTo(this.x-20, this.y);
        ctx.arc(this.x-10, this.y, 10, 0, Math.PI, true);
        ctx.fill();
    }
    move() {
        // Main move function
        this.detectWalls(); //detect walls
        this.y += this.dy; //Change position
    }
    detectWalls() {
        if (this.y-10 < 0){
            this.y = 10;
        }
        if (this.y+80 > canvas.height){
            this.y = canvas.height-80;
        }
    }
    moveUp() {
        this.dy = -this.speed;
    }
    moveDown() {
        this.dy = this.speed;
    }
    resetPlayer(speed, posx, posy) {
        this.w = 50;
        this.h = 70;
        this.speed = speed;
        this.dy = 0;
        this.x = posx;
        this.y = posy;
    }
}