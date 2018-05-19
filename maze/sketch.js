/*=================================================
#>= Maze Simulator
#>= Author: Roberto Gervacio ~~ Mx ~~
#>= Start Data: 11-03-18
#>= Last Update: 17-05-18
#>= Aditional Comments: using p5.js
===================================================*/
let rWalker; // walker de menu [Objeto]
let mg; //maze generator [Objeto]
var anchoMaze, altoMaze; //dimesiones dinamicas del canvas
var stage, stageTemp; //status actual, hay que limpiar
//botones
var generate, exportMaze;

class Menu
{
	constructor(x, y, r)
	{
		this.x = x;
		this.y = y;
		this.r = r;
	}

	step()
	{
		this.lastX = this.x;
		this.lastY = this.y;

		var mov = Math.floor(random(4));
		switch(mov)
		{
			case 0: this.x-=this.r; break;
			case 1: this.y+=this.r; break;
			case 2: this.x+=this.r; break;
			case 3: this.y-=this.r; break;
		}
		this.x = constrain(this.x,this.r,anchoMaze-this.r);
		this.y = constrain(this.y,this.r,altoMaze-this.r);

	}

	show()
	{
		stroke(random(255)); //color
		strokeWeight(1); //ancho

		fill(0);
		rect(this.x,this.y,this.r,this.r);
		
		fill(255);
		rect(this.lastX,this.lastY,this.r,this.r);
	}
}

class MazeGenerator
{
	constructor()
	{
		this.generado = false;
	}

	isGenerado()
	{
		return this.generado;
	}

	exportar()
	{

	}
}

function setup()
{
	calcularMaze(); // tamaño responsive
	rectMode(CENTER); // los reactangulos se dibujen desde el centro

	//para posicionarlo desde el dom
	var myCanvas = createCanvas(anchoMaze, altoMaze);
	myCanvas.parent('myContainer');

	//inciar el random walker
	rWalker = new Menu(anchoMaze/2, altoMaze/2, random(15) + 8);

	//iniciar el generador
	mg = new MazeGenerator();

	//status, empieza en el menu
	stage = 0;
	stageTemp = stage;
	changingStage();

	//botones
	generate = select("#generar");
	generate.mouseClicked(tryGenerar);
	exportMaze = select("#mazeExport");
	exportMaze.mouseClicked(tryExportMaze);
}

function draw()
{
	if(stage != stageTemp){changingStage();stageTemp = stage; print("cambio");}

	if(stage == 0)
	{	
		rWalker.show();
		rWalker.step();
	}
	else if(stage = 1)
	{
		//
	}
}

function windowResized()
{
	calcularMaze();
	resizeCanvas(anchoMaze, altoMaze);
}

/*
|========================|
|==funciones del canvas==|
|========================|
*/

function calcularMaze()
{
	(innerWidth <= 767)? anchoMaze = innerWidth * (5/6) : anchoMaze =  innerWidth * (4/6);
	altoMaze = innerHeight * (6/7);
}

function changingStage()
{
	background(255);
	//rectángulo de area principal
	stroke(0);//color
	strokeWeight(8);//ancho del area principal
	rect(anchoMaze/2,altoMaze/2,anchoMaze,altoMaze);
}

/*
|============================|
|==funciones para controles==|
|============================|
*/

function tryGenerar()
{
	if(document.getElementById('rowsG').value <= 0 || document.getElementById('colsG').value <= 0)
	{
		document.getElementById('subhead').innerHTML  = "datos no válidos";
		document.getElementById('history').value= "Los valores para generar el laberinto, deben ser enteros positivos";
	}
	else
	{
		//todo correcto
	}
}

function tryExportMaze()
{
	(mg.isGenerado()) ? mg.exportar() : document.getElementById('subhead').innerHTML  = "no hay nada para exportar"
}