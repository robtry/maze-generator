/*
|====================================|
|=========Variables globales=========|
|====================================|
*/

const anchoConsola = 140; //ancho de la consola en px para que se vea el maze
let anchoMaze = 0, altoMaze = 0; //dimesiones dinamicas del canvas
let currentMaze = new Array()
let historial; //textbox con el historial
const md = new MazeDraw(); //maze draw [Objeto]
const mc = new MazeController(); // contralador que permite mover el bot

/*
|======================================|
|=========funciones del canvas=========|
|======================================|
*/

function setup() {

	calcularMaze(); // tamaño responsive

	//posicionar el canvas desde el DOM
	createCanvas(anchoMaze, altoMaze).parent('myContainer');
	clearStage();

	//dibujar
	loadStrings("currentMaze.txt", createMaze);

	//botones
	select("#photo").mousePressed(function (){save('my.png');});
	select("#reiniciar").mouseClicked(function(){tryReloadMaze();});
	historial = select("#history");

	//los numeros
	textStyle(NORMAL);
}

function draw() {
	//ir caminando
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

/*
|============================|
|===funciones para botones===|
|============================|
*/

function createMaze(matriz)//matriz es el arreglo que recibo
{

	console.log(matriz);
	currentMaze = new Array()

	md.setCols(matriz[0].split(" ")[0])
	md.setRows(matriz[0].split(" ")[1])
	md.setInitialPos(matriz[1].split(" ")[0], matriz[1].split(" ")[1])
	md.setFinalPos(matriz[2].split(" ")[0], matriz[2].split(" ")[1])

	for (let i = 3; i < matriz.length; i++) {
		if(matriz[i].length > 0){
			currentMaze.push(matriz[i].split(""))
		}
	}

	console.log("cols: " + md.colsDraw)
	console.log("filas: "+ md.rowsDraw)
	console.log("inicial: " + md.inicialPos)
	console.log("actual: " + md.currentPosition)
	console.log("final: " + md.finalPos)
	console.log(currentMaze)

}

function tryReloadMaze(){
	// reinicia todo
}

//momentaneo
function keyPressed()
{
	if (keyCode === RIGHT_ARROW)
	{
		if(currentMaze[md.currentPosition.y * md.colsDraw + (md.currentPosition.x+1)] || md.currentPosition.x == md.colsDraw - 1){mc.denyPass();}
		else{ md.passRigth(); mc.permitPass();}
	}
	else if(keyCode === LEFT_ARROW)
	{
		if(currentMaze[md.currentPosition.y * md.colsDraw + (md.currentPosition.x-1)] || md.currentPosition.x == 0) {mc.denyPass();}
		else{ md.passLeft(); mc.permitPass();}
	}
	else if(keyCode === UP_ARROW)
	{
		if(currentMaze[(md.currentPosition.y - 1) * md.colsDraw + md.currentPosition.x] || md.currentPosition.y == 0) {mc.denyPass();}
		else{ md.passUp(); mc.permitPass();}
	}
	else if(keyCode === DOWN_ARROW)
	{
		if(currentMaze[(md.currentPosition.y + 1) * md.colsDraw + md.currentPosition.x] || md.currentPosition.y == md.rowsDraw - 1){ mc.denyPass();}
		else{ md.passDown(); mc.permitPass();}
	}
}
