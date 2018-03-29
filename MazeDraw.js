class MazeDraw {
	constructor() {
		this.rowsDraw = 0;
		this.colsDraw = 0;
		this.mazeToDraw = [];
		this.currentPosition;
		this.inicialPos;
		this.finalPos;
	}

	setInitialPos(x, y) {
		this.inicialPos = createVector(x, y);
		this.currentPosition = createVector(x, y);
	}
	setFinalPos(x, y) {
		this.finalPos = createVector(x, y);
	}
	setCols(c){
		this.colsDraw = c
	}
	setRows(r){
		this.rowsDraw = r
	}
	setMaze() {
		this.mazeToDraw = [];
		for (let i = 0; i < this.rowsDraw; i++) {
			for (let j = 0; j < this.colsDraw; j++) {
				this.mazeToDraw.push(currentMaze[i * this.colsDraw + j]);
			}
		}
	}
	drawMaze() {
		background(255);
		rectMode(CORNER);
		strokeWeight(1); // contorno de los cuadritos
		this.anchoCuadrito = (anchoMaze - 30) / this.colsDraw;
		this.altoCuadrito = (altoMaze - 30) / this.rowsDraw;
		this.posX = 0;
		this.posY = 0;
		this.responsiveTextX = this.anchoCuadrito / 3;
		this.responsiveTextY = this.altoCuadrito / 2;
		for (let i = 0; i < this.rowsDraw; i++) {
			for (let j = 0; j < this.colsDraw; j++) {
				if (j == this.colsDraw - 1 || i == this.rowsDraw - 1) {
					noStroke();
					fill(0);
				}
				if (j == this.colsDraw - 1) {
					textSize(this.responsiveTextY);
					text(i, anchoMaze - 25, this.posY + (this.altoCuadrito / 2) + (this.altoCuadrito / 5));
				}
				if (i == this.rowsDraw - 1) {
					textSize(this.responsiveTextX);
					text(j, this.posX + this.anchoCuadrito / 2, altoMaze - 10);
				}
				stroke(0);
				//condiciones para que dibuje las posiciones
				if (i == this.inicialPos.y && j == this.inicialPos.x)
					fill("#2980b9"); //azul
				else if (i == this.finalPos.y && j == this.finalPos.x)
					fill("#e67e22"); //naranja
				else if (i == this.currentPosition.y && j == this.currentPosition.x)
					fill("#8e44ad"); //morado
				else if (this.mazeToDraw[i * this.colsDraw + j] == "v")
					fill("#1abc9c"); //verde
				else
					(this.mazeToDraw[i * this.colsDraw + j]) ? fill("#000000") : fill("#ffffff");
				rect(this.posX, this.posY, this.anchoCuadrito, this.altoCuadrito);
				this.posX += this.anchoCuadrito;
			}
			this.posY += this.altoCuadrito;
			this.posX = 0;
		}
	}
	passUp() {
		this.mazeToDraw[this.currentPosition.y * this.colsDraw + this.currentPosition.x] = "v";
		this.currentPosition.y -= 1;
		this.drawMaze();
	}
	passDown() {
		this.mazeToDraw[this.currentPosition.y * this.colsDraw + this.currentPosition.x] = "v";
		this.currentPosition.y += 1;
		this.drawMaze();
	}
	passLeft() {
		this.mazeToDraw[this.currentPosition.y * this.colsDraw + this.currentPosition.x] = "v";
		this.currentPosition.x -= 1;
		this.drawMaze();
	}
	passRigth() {
		this.mazeToDraw[this.currentPosition.y * this.colsDraw + this.currentPosition.x] = "v";
		this.currentPosition.x += 1;
		this.drawMaze();
	}
}
