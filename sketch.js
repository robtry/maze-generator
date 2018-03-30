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
//para tamaños de font, padding de los botones, ancho y alto del area principal
var responsiveSize = innerWidth*(1/25);
var anchoMaze = innerWidth/(4/3);
var altoMaze = innerHeight/(6/5);
var xposMaze = innerWidth*(1/9);
var yposMaze = innerHeight*(1/16)+(responsiveSize/3)+10;

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
		loadStrings("currentMaze.txt", createMaze);
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

function createMaze(matriz)//matriz es el arreglo que recibo
{
	//console.log(matriz);

	//rectangulo principal
	mainArea();

	importarBtn.style('display','none');
	generarBtn.style('display','none');

	var filas = matriz[0].split(" ")[0];
	var columnas = matriz[0].split(" ")[1];	

	var anchoCuadritos = ((100/columnas)*anchoMaze)/100
	var altoCuadritos = ((100/filas)*altoMaze)/100;
	var xposCuadrito = xposMaze;
	var yposCuadrito = yposMaze;
	textSize(0);

	for(var i = 1; i <= filas; i++)
	{
		xposCuadrito = xposMaze;
		noStroke();
		fill(0);
		text(i-1,xposCuadrito-30, yposCuadrito+altoCuadritos/2);
		for(var j = 0; j < columnas; j++)
		{
			if(matriz[i].split("")[j] == 0)
				fill(255); //blanco
			else 
				fill(0); //negro

			strokeWeight(4); // para los cuadritos mas pequeños
			stroke(0); // para los cuadritos mas pequeños
			rect(xposCuadrito,yposCuadrito,anchoCuadritos,altoCuadritos);

			if(i == filas)//es el ultimo
			{
				noStroke();
				fill(0);
				text(j,xposCuadrito+anchoCuadritos/2, yposCuadrito + altoCuadritos + 25);
			}

			xposCuadrito += anchoCuadritos;
		}
		yposCuadrito += altoCuadritos;
	}

		
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

/*
function draw() // si se elimina quitar los loops de la foto
{
	if (mouseIsPressed)
	ellipse(mouseX, mouseY, 80, 80);
}
*/