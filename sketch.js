/*
|====================================|
|=========Variables globales=========|
|====================================|
*/

const anchoConsola = 140; //ancho de la consola en px para que se vea el maze
let anchoMaze = 0, altoMaze = 0; //dimesiones dinamicas del canvas
let historial; //textbox con el historial
let currentMaze = []
const salida = "LLUDDDDRRRRRRUUUURRDDRRDDRRUUUURRDDDDDDDDLLLLLUULLLLLLLLLDDDDRRRRUURRDDRRRRRRRRDDLDDR\n"
const tam = salida.length
let wc
const md = new MazeDraw(); //maze draw [Objeto]

/*
|======================================|
|=========funciones del canvas=========|
|======================================|
*/

function setup() {

	calcularMaze(); // tamaño responsive

	//posicionar el canvas desde el DOM
	createCanvas(anchoMaze, altoMaze).parent('myContainer')
	clearStage();

	//dibujar
	loadStrings("currentMaze.txt", createMaze)

	historial = select("#history");

	//botones
	select("#photo").mousePressed(function (){save('my.png')})
	select("#reiniciar").mouseClicked(function(){tryReloadMaze()})
	select("#clearConsole").mouseClicked(function(){clearHistory()})

	//contador
	wc = 0

	frameRate(30);

	//los numeros
	textStyle(NORMAL);
}

function draw() {
	if(md.terminado && wc < tam){
		if(salida[wc] == "L")
			md.passLeft()
		else if(salida[wc] == "R")
			md.passRight()
		else if(salida[wc] == "D")
			md.passDown()
		else if(salida[wc] == "U")
			md.passUp()
		wc++;
	}else{
		//si o no llego
	}
}

function windowResized() {
	calcularMaze();
	resizeCanvas(anchoMaze, altoMaze);
	clearStage();
}

/*
|===================================|
|==funciones auxiliares del canvas==|
|===================================|
*/

function calcularMaze() {
	anchoMaze = innerWidth * (9.5/10) - ((innerWidth > 570) ? anchoConsola : 0);
	altoMaze = innerHeight * (8.8/10);
}

function clearStage() {
	//rectángulo de area principal
	rectMode(CENTER); // los reactangulos se dibujen desde el centro
	background(255);
	stroke(0);//color
	strokeWeight(8);//ancho del area principal
	rect(anchoMaze/2, altoMaze/2, anchoMaze, altoMaze);
}

function clearHistory(){
	historial.value("")
}

/*
|============================|
|===funciones para botones===|
|============================|
*/

function createMaze(matriz)//matriz es el arreglo que recibo
{

	//console.log(matriz);
	currentMaze = matriz

	md.mazeToDraw = []

	md.setCols(matriz[0].split(" ")[0])
	md.setRows(matriz[0].split(" ")[1])
	md.setInitialPos(matriz[1].split(" ")[0], matriz[1].split(" ")[1])
	md.setFinalPos(matriz[2].split(" ")[0], matriz[2].split(" ")[1])

	for (let i = 3; i < matriz.length; i++) {
		if(matriz[i].length > 0){
			md.mazeToDraw.push(matriz[i].split(""))
		}
	}
	md.drawMaze()
	md.terminado = true

	// console.log("cols: " + md.colsDraw)
	// console.log("filas: "+ md.rowsDraw)
	// console.log("inicial: " + md.inicialPos)
	// console.log("actual: " + md.currentPosition)
	// console.log("final: " + md.finalPos)
	// console.log(md.mazeToDraw)

}

function tryReloadMaze(){
	//console.log(currentMaze)
	terminado = false
	createMaze(currentMaze)
	clearHistory()
	wc = 0
}

//momentaneo
function keyPressed()
{
	if (keyCode === RIGHT_ARROW){
		md.passRight()
	}
	else if(keyCode === LEFT_ARROW){
		md.passLeft()
	}
	else if(keyCode === UP_ARROW){
		md.passUp()
	}
	else if(keyCode === DOWN_ARROW){
		md.passDown()
	}
}
