
class RandomWalker {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    step() {
        this.lastX = this.x;
        this.lastY = this.y;
        switch (Math.floor(random(4))) {
            case 0:
                this.x -= this.r;
                break;
            case 1:
                this.y += this.r;
                break;
            case 2:
                this.x += this.r;
                break;
            case 3:
                this.y -= this.r;
                break;
        }
        this.x = constrain(this.x, this.r, anchoMaze - this.r);
        this.y = constrain(this.y, this.r, altoMaze - this.r);
    }
    show() {
        stroke(random(255)); //color
        strokeWeight(3); //ancho
        fill(0);
        rect(this.x, this.y, this.r, this.r);
        fill(255);
        rect(this.lastX, this.lastY, this.r, this.r);
    }
}