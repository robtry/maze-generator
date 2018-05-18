/*=================================================
#>= Maze Simulator
#>= Author: Roberto Gervacio ~~ Mx ~~
#>= Start Data: 11-03-18
#>= Last Update: 17-05-18
#>= Aditional Comments: using p5.js & jquery.js
===================================================*/
var anchoMaze, altoMaze;
function calcularMaze()
{
	(innerWidth <= 767)? anchoMaze = innerWidth * (5/6) : anchoMaze =  innerWidth * (4/6);
	altoMaze = innerHeight * (6/7);
}

function setup()
{
	calcularMaze();
	var myCanvas = createCanvas(anchoMaze, altoMaze);
	myCanvas.parent('myContainer');
	
}

function draw()
{
	if (mouseIsPressed) fill(0);
	else fill(255);

	ellipse(mouseX, mouseY, 80, 80);
}

function windowResized()
{
	calcularMaze();
	resizeCanvas(anchoMaze, altoMaze, false);
}