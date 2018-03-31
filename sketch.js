/*=================================================
#>= Maze Simulator
#>= Author: Roberto Gervacio ~~ Mx ~~
#>= Start Data: 11-03-18
#>= Last Update: 31-03-18
#>= Aditional Comments: using p5.js
===================================================*/
//botones
var generarBtn, fotoBtn, importarBtn, pasosBtn, restartBtn;

//pasos (cadena de los pasos dados)
var steps = '';

//para tamaños de font, padding de los botones, ancho y alto del area principal
var responsiveSize = innerWidth*(1/25);
var anchoMaze = innerWidth/(4/3);
var altoMaze = innerHeight/(6/5);
var xposMaze = innerWidth*(1/9);
var yposMaze = innerHeight*(1/16)+(responsiveSize/3)+10;

//matriz que contiene el maze matriz[filas][columnas];
var matriz;

//posiciones del control
var currentPos;
var finalPos;
var initialPos;
var poderMover = false;

//tamaño de los cuadritos del maze
var anchoCuadritos;
var altoCuadritos;
var xposCuadrito;
var yposCuadrito;

function setup()
{
	createCanvas(innerWidth, innerHeight/(100/99));

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
		//noLoop();
		save('my.png');
		//loop();
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
	poderMover = false;
	/*================================*/
}

function menu()
{
	//rectangulo
	mainArea();

	//texto
	textSize(responsiveSize);
	fill(0, 102, 153);//azul
	var titulo = 'Maze Simulator';
	text(titulo, width/2.1 - textWidth(titulo)/2.3, height/2.5);

	//boton cargar laberinto
	importarBtn = createButton('Load Maze');
	importarBtn.position(width/3,height/2);
	importarBtn.style('background-color','#4CAF50');
	importarBtn.style('border', 'none');
	importarBtn.style('color','white');
	importarBtn.style('padding', responsiveSize/2+'px');
	importarBtn.style('text-aling','center');
	importarBtn.style('display','block');
	importarBtn.style('font-size','16px');
	importarBtn.mousePressed(function (){
		loadStrings("currentMaze.txt", copyMaze);
	});

	//boton crear laberinto con algoritmo
	generarBtn = createButton('Create Maze');
	generarBtn.position((width/1.95),height/2);
	generarBtn.style('background-color','#4CAF50');
	generarBtn.style('border', 'none');
	generarBtn.style('color','white');
	generarBtn.style('padding', responsiveSize/2+'px');
	generarBtn.style('text-aling','center');
	generarBtn.style('display','block');
	generarBtn.style('font-size','16px');
	generarBtn.mousePressed(function (){
		//aqui va algo muy hd
	});
}

function mainArea()
{
	background(255); // para limpiar todo
	fill(255);
	stroke(40);//color
	strokeWeight(8);
	rect(xposMaze,yposMaze,anchoMaze,altoMaze);

	//resetear
	noStroke(); 
}

function copyMaze(matrizLeida)//matrizLeida es el arreglo que leyo
{
	//console.log(matrizLeida);

	var filas = matrizLeida[0].split(" ")[0];
	var columnas = matrizLeida[0].split(" ")[1];	

	matriz = new Array(filas);
	for(var i = 0; i < filas; i++)
	{
		matriz[i] = new Array(columnas);
	}

	anchoCuadritos = ((100/columnas)*anchoMaze)/100
	altoCuadritos = ((100/filas)*altoMaze)/100;


	for(var i = 1; i <= filas; i++) // uno por que es la segunda linea donde empieza
	{
		for(var j = 0; j < columnas; j++)
		{
			matriz[i-1][j] = matrizLeida[i].split("")[j]
		}
	}

	//depues de que se lleno la matriz selccionar el punto final, e inicial
	chooseFinalPosition();
	chooseInitialPosition();
	drawMaze();
	poderMover = true;
}

function chooseFinalPosition()
{
	//cambiar la probabilidad
	var valido = false;
	while(!valido)
	{
		finalPos = createVector(Math.floor(random(matriz.length-1)), Math.floor(random(matriz[0].length-1)));
		//console.log(finalPos.x);
		//console.log(finalPos.y);
		if(matriz[finalPos.x][finalPos.y] == 1 && (finalPos.x != 0 || finalPos.y != 0))
			valido = false;
		else
			valido = true;
		//console.log(matriz[finalPos.x][finalPos.y])
	}
}

function chooseInitialPosition()
{
	initialPos = createVector(matriz.length-1,0); // siempre n-1,0
	currentPos = initialPos;
}

function currentPosition()
{

	console.log('cordenadas actuales:[' +currentPos.x+']['+currentPos.y+']' );
}

function keyPressed() {
	if(poderMover)
	{
		if (keyCode === LEFT_ARROW)
		{
			if(currentPos.y-1 < 0)
				alertLimit();
			else if(matriz[currentPos.x][currentPos.y-1] == 1)
				alertCollision();
			else
				currentPos.y -= 1; //columnas
		}
		else if (keyCode === RIGHT_ARROW)
		{
			if(currentPos.y+1 > matriz[0].length-1)
				alertLimit();
			else if(matriz[currentPos.x][currentPos.y+1] == 1)
				alertCollision();
			else
				currentPos.y += 1; //columnas
		}
		else if (keyCode === UP_ARROW)
		{
			if(currentPos.x-1 < 0)
				alertLimit();
			else if(matriz[currentPos.x-1][currentPos.y] == 1)
				alertCollision();
			else
				currentPos.x -= 1; // filas
		}
		else if (keyCode === DOWN_ARROW)
		{
			if(currentPos.x+1 > matriz.length-1)
				alertLimit();
			else if(matriz[currentPos.x+1][currentPos.y] == 1)
				alertCollision();
			else
				currentPos.x += 1; // filas
		}
		else if (keyCode === 69) //e
		{
			currentPosition();
		}
		drawMaze();
	}
}

function alertLimit()
{
	console.log("te pasaste del maze");
}

function alertCollision()
{
	console.log("no puedes pasar");
}

function drawMaze()
{
	//rectangulo principal
	mainArea();

	importarBtn.style('display','none');
	generarBtn.style('display','none');

	textSize(0);

	xposCuadrito = xposMaze;
	yposCuadrito = yposMaze;
	for(var i = 0; i < matriz.length; i++)
	{
		xposCuadrito = xposMaze;
		noStroke();
		fill(0);
		text(i,xposCuadrito-30, yposCuadrito+altoCuadritos/2);
		for(var j = 0; j < matriz[0].length; j++)
		{
			if(i == initialPos.x && j == initialPos.y)
				fill("#27ae60");
			else if(i == finalPos.x && j == finalPos.y)
				fill("#e67e22");
			else if(matriz[i][j] == 0)
				fill(255); //blanco
			else 
				fill(0); //negro

			strokeWeight(4); // para los cuadritos mas pequeños
			stroke(0); // para los cuadritos mas pequeños
			rect(xposCuadrito,yposCuadrito,anchoCuadritos,altoCuadritos);

			if(i == (matriz.length)-1)//es el ultimo
			{
				noStroke();
				fill(0);
				text(j,xposCuadrito+anchoCuadritos/2, yposCuadrito + altoCuadritos + 20);
			}

			xposCuadrito += anchoCuadritos;
		}
		yposCuadrito += altoCuadritos;
	}
}

/*
function draw() // si se elimina quitar los loops de la foto
{
	if (mouseIsPressed)
	ellipse(mouseX, mouseY, 80, 80);
}
*/