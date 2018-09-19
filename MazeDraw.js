class MazeDraw {
	constructor() {
		this.rowsDraw = 0;
		this.colsDraw = 0;
		this.mazeToDraw = new Array();
		this.currentPosition;
		this.inicialPos;
		this.finalPos;
	}

	setInitialPos(x, y) {
		this.inicialPos = createVector(x, y)
		this.currentPosition = createVector(x, y)
	}
	setCurrentPos(x, y){
		this.currentPosition = createVector(x, y)
	}
	setFinalPos(x, y) {
		this.finalPos = createVector(x, y)
	}
	setCols(c){
		this.colsDraw = c
	}
	setRows(r){
		this.rowsDraw = r
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
		const r = (this.rowsDraw - 1)
		for (let i = 0; i < this.rowsDraw; i++) {
			for (let j = 0; j < this.colsDraw; j++) {
				if (j == r || i == r) {
					noStroke();
					fill(0);
				}
				if (j == r) {
					textSize(this.responsiveTextY);
					text(i, anchoMaze - 25, this.posY + (this.altoCuadrito / 2) + (this.altoCuadrito / 5));
				}
				if (i == r) {
					textSize(this.responsiveTextX);
					text(j, this.posX + this.anchoCuadrito / 2, altoMaze - 10);
				}
				stroke(0);
				//condiciones para que dibuje las posiciones
				if ((r - i) == this.inicialPos.y && j == this.inicialPos.x && this.inicialPos.x == this.currentPosition.x && this.inicialPos.y == this.currentPosition.y)
					fill("#27ae60");//verde
				else if ((r - i) == this.finalPos.y && j == this.finalPos.x && this.finalPos.x == this.currentPosition.x && this.finalPos.y == this.currentPosition.y)
					fill("#c0392b");//rojo
				else if ((r - i) == this.inicialPos.y && j == this.inicialPos.x)
					fill("#f1c40f"); //amarillo
				else if ((r - i)  == this.finalPos.y && j == this.finalPos.x)
					fill("#e67e22"); //naranja
				else if ((r - i) == this.currentPosition.y && j == this.currentPosition.x)
					fill("#2980b9"); //azul
				else if (this.mazeToDraw[(i)][j] == "v")
					fill("#95a5a6"); //gris
				else
					(this.mazeToDraw[i][j] == "1") ? fill("#000000") : fill("#ffffff");
					
				rect(this.posX, this.posY, this.anchoCuadrito, this.altoCuadrito);
				this.posX += this.anchoCuadrito;
			}
			this.posY += this.altoCuadrito;
			this.posX = 0;
		}
	}
	passUp() {
		const x = parseInt(this.currentPosition.x) 
		const y = parseInt(this.currentPosition.y)
		const r = (this.rowsDraw - 1)
		if((y + 1) < this.rowsDraw){
			if(this.mazeToDraw[r - (y + 1)][x] != "1"){
				this.mazeToDraw[r-y][x] = "v";
				this.setCurrentPos(x,y+1)
				this.drawMaze();
				this.permitPass();
			}else{
				this.denyPass()
			}
		}else{
			this.denyPass()
		}
	}
	passDown() {
		const x = parseInt(this.currentPosition.x) 
		const y = parseInt(this.currentPosition.y)
		const r = (this.rowsDraw - 1)
		if((y - 1) >= 0){
			if(this.mazeToDraw[r - (y - 1)][x] != "1"){
				this.mazeToDraw[r-y][x] = "v";
				this.setCurrentPos(x,y-1)
				this.drawMaze();
				this.permitPass();
			}else{
				this.denyPass()
			}
		}else{
			this.denyPass()
		}
	}
	passLeft() {
		const x = parseInt(this.currentPosition.x) 
		const y = parseInt(this.currentPosition.y)
		const r = (this.rowsDraw - 1)
		if(x - 1 >= 0){
			if(this.mazeToDraw[r - y][x - 1] != "1"){
				this.mazeToDraw[r -y][x] = "v";
				this.setCurrentPos(x - 1,y)
				this.drawMaze();
				this.permitPass();
			}else{
				this.denyPass()
			}
		}else{
			this.denyPass()
		}
	}
	passRight() {
		const x = parseInt(this.currentPosition.x) 
		const y = parseInt(this.currentPosition.y)
		const r = (this.rowsDraw - 1)
		if(x + 1 < this.colsDraw){
			if(this.mazeToDraw[r - y][x + 1] != "1"){
				this.mazeToDraw[r - y][x] = "v";
				this.setCurrentPos(x + 1,y)
				this.drawMaze();
				this.permitPass();
			}else{
				this.denyPass()
			}
		}else{
			this.denyPass()
		}
	}

	permitPass() {
		let aux = historial.value().split("\n");
		let pos = aux.length;
		let aux2 = [];
		let quee = "";
		let cont;
		//console.log(aux);
		if(aux[pos-2] == undefined){
			historial.value(historial.value() + "true\n");
		} else {
			if(aux[pos-2].startsWith("true")){
				for(let i = 0; i < pos; i++){
					if(i == (pos-2)) { 
						aux2 = aux[i].split("x");
						if(aux2.length > 1){
							cont = aux2[1];
							cont++;
							quee += "true x"+cont+"\n"
						}else{
							quee += "true x2\n";
						}
					} else if(aux[i] != ""){ quee += (aux[i] + "\n"); }					
				}
				historial.value(quee);
			} else {
				historial.value(historial.value() + "true\n");
			}
		}
	}
	denyPass() {
		let aux = historial.value().split("\n");
		let pos = aux.length;
		let aux2 = [];
		let quee = "";
		let cont;
		//console.log(aux);
		if(aux[pos-2] == undefined){
			historial.value(historial.value() + "false\n");
		} else {
			if(aux[pos-2].startsWith("false")){
				for(let i = 0; i < pos; i++){
					if(i == (pos-2)) { 
						aux2 = aux[i].split("x");
						if(aux2.length > 1){
							cont = aux2[1];
							cont++;
							quee += "false x"+cont+"\n"
						}else{
							quee += "false x2\n";
						}
					} else if(aux[i] != ""){ quee += (aux[i] + "\n"); }					
				}
				historial.value(quee);
			} else {
				historial.value(historial.value() + "false\n");
			}
		}
	}
}
