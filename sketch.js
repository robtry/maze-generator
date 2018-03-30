/*=================================================
#>= Maze Simulator
#>= Author: Roberto Gervacio ~~ Mx ~~
#>= Start Data: 11-03-18
#>= Last Update: 29-03-18
#>= Aditional Comments: using p5.js
===================================================*/
//botones
var generarBtn, fotoBtn, importarBtn, pasosBtn, restartBtn;
//pasos (cadena de los pasos dados)
var steps = '';
//para tamaños de font y padding de los botones
var responsiveSize = innerWidth*(1/25);

function setup()
{
	createCanvas(innerWidth, innerHeight/(100/99));
	background(255);
	menu();

	/*======= ACOMODAR BOTONES =======*/
	var space = 140; //espacio entre botones

	//boton exportar pasos
	pasosBtn = createButton('Given Steps');
	pasosBtn.position(width/3,10);
	pasosBtn.style('background-color','#008CBA');
	pasosBtn.style('border', 'none');
	pasosBtn.style('color','white');
	pasosBtn.style('padding', responsiveSize/3+'px');
	pasosBtn.style('text-aling','center');
	pasosBtn.style('display','inline-block');
	pasosBtn.style('font-size','16px');
	pasosBtn.mousePressed(function (){
		console.log(steps);
		/* DESCOMENTAR PARA GUARDAR
		var writer = createWriter('historial.txt');
		writer.print(steps);
		writer.close();
		writer.clear()
		*/
	});

	//boton tomar foto
	fotoBtn = createButton('Take Shot');
	fotoBtn.position(width/3+space,10);
	space += 130;
	fotoBtn.style('background-color','#008CBA');
	fotoBtn.style('border', 'none');
	fotoBtn.style('color','white');
	fotoBtn.style('padding', responsiveSize/3+'px');
	fotoBtn.style('text-aling','center');
	fotoBtn.style('display','inline-block');
	fotoBtn.style('font-size','16px');
	fotoBtn.mousePressed(function (){
		noLoop();
		save('my.png');
		loop();
	});

	//boton reiniciar
	restartBtn = createButton('Restart');
	restartBtn.position(width/3+space,10);
	restartBtn.style('background-color','#f44336');
	restartBtn.style('border', 'none');
	restartBtn.style('color','white');
	restartBtn.style('padding', responsiveSize/3+'px');
	restartBtn.style('text-aling','center');
	restartBtn.style('display','inline-block');
	restartBtn.style('font-size','16px');
	restartBtn.mousePressed(function () {
		menu();
	});
	/*================================*/
}

function menu()
{
	//rectangulo
	stroke(40);
	strokeWeight(9);
	rect(width*(1/16),height*(1/16)+responsiveSize/3+10,width/(8/7),height/(8/7));
	noStroke(); // para que afecte al texto

	//texto
	textSize(responsiveSize);
	fill(0, 102, 153);
	var titulo = 'Maze Simulator';
	text(titulo, width/2 - textWidth(titulo)/2.3, height/2.5);

	//boton cargar laberinto
	importarBtn = createButton('Load Maze');
	importarBtn.position(width/2.8,height/2);
	importarBtn.style('background-color','#4CAF50');
	importarBtn.style('border', 'none');
	importarBtn.style('color','white');
	importarBtn.style('padding', responsiveSize/2+'px');
	importarBtn.style('text-aling','center');
	importarBtn.style('display','inline-block');
	importarBtn.style('font-size','16px');
	importarBtn.mousePressed(function (){
		loadStrings("currentMaze.txt", createMaze);
	});

	//boton crear laberinto con algoritmo
	generarBtn = createButton('Create Maze');
	generarBtn.position((width/1.8),height/2);
	generarBtn.style('background-color','#4CAF50');
	generarBtn.style('border', 'none');
	generarBtn.style('color','white');
	generarBtn.style('padding', responsiveSize/2+'px');
	generarBtn.style('text-aling','center');
	generarBtn.style('display','inline-block');
	generarBtn.style('font-size','16px');
	generarBtn.mousePressed(function (){
		//aqui va algo muy hd
	});

	//regresar todo a la normalidad
	strokeWeight(1); 
	stroke(1);
	fill(255);
}

function createMaze(result)//result es el arreglo que recibio
{
	console.log(result);
	console.log(result[0]);
}

function draw() // si se elimina quitar los loops de la foto
{
	if (mouseIsPressed)
	ellipse(mouseX, mouseY, 80, 80);
}