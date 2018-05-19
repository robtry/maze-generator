
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
var matrizPass; //donde ya pasó

//posiciones del control
var currentPos;
var finalPos;
var initialPos;
var poderMover = false;
var win = false;

//tamaño de los cuadritos del maze
var anchoCuadritos;
var altoCuadritos;
var xposCuadrito;
var yposCuadrito;


function setup()
{
	createCanvas(innerWidth, innerHeight/(100/99));

	menu();

	// acomodar botnoes
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
		//DESCOMENTAR PARA GUARDAR
		//var writer = createWriter('historial.txt');
		//writer.print(steps);
		//writer.close();
		//writer.clear()
		
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
		poderMover = false;
		win = false;
		steps = '';
	});
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
	strokeWeight(8);//ancho del area principal
	rect(xposMaze,yposMaze,anchoMaze,altoMaze); //dibujar area principal

	//resetear
	noStroke(); 
}

function copyMaze(matrizLeida)//matrizLeida es el arreglo que leyo
{
	//console.log(matrizLeida);

	var filas = matrizLeida[0].split(" ")[0];
	var columnas = matrizLeida[0].split(" ")[1];	

	matriz = new Array(filas);
	matrizPass = new Array(filas);
	for(var i = 0; i < filas; i++)
	{
		matriz[i] = new Array(columnas);
		matrizPass[i] = new Array(columnas);
	}

	anchoCuadritos = ((100/columnas)*anchoMaze)/100
	altoCuadritos = ((100/filas)*altoMaze)/100;


	for(var i = 1; i <= filas; i++) // uno por que es la segunda linea donde empieza
	{
		for(var j = 0; j < columnas; j++)
		{
			matriz[i-1][j] = matrizLeida[i].split("")[j];
			matrizPass[i-1][j] = null; 
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
	addPass();
}

function currentPosition()
{
	console.log('cordenadas actuales:[' +currentPos.x+']['+currentPos.y+']' );
}

function keyPressed()
{
	if(poderMover)
	{
		if (keyCode === LEFT_ARROW)
		{
			if(currentPos.y-1 < 0)
				alertLimit();
			else if(matriz[currentPos.x][currentPos.y-1] == 1)
				alertCollision();
			else
			{
				currentPos.y -= 1; //columnas
				steps += 'L';
				addPass();
			}
		}
		else if (keyCode === RIGHT_ARROW)
		{
			if(currentPos.y+1 > matriz[0].length-1)
				alertLimit();
			else if(matriz[currentPos.x][currentPos.y+1] == 1)
				alertCollision();
			else
			{
				currentPos.y += 1; //columnas
				steps += 'R';
				addPass();
			}
		}
		else if (keyCode === UP_ARROW)
		{
			if(currentPos.x-1 < 0)
				alertLimit();
			else if(matriz[currentPos.x-1][currentPos.y] == 1)
				alertCollision();
			else
			{
				currentPos.x -= 1; // filas
				steps += 'U';
				addPass();
			}
		}
		else if (keyCode === DOWN_ARROW)
		{
			if(currentPos.x+1 > matriz.length-1)
				alertLimit();
			else if(matriz[currentPos.x+1][currentPos.y] == 1)
				alertCollision();
			else
			{
				currentPos.x += 1; // filas
				steps += 'D';
				addPass();
			}
		}
		else if (keyCode === 69) //e
		{
			currentPosition();
		}

		checkWin();
		drawMaze();
	}
}

function alertLimit()
{
	console.log("fuera de limite");
}

function alertCollision()
{
	console.log("no puedes pasar, hay una pared");
}

function checkWin()
{
	if(currentPos.equals(finalPos.x,finalPos.y)) 
	{
		win = true
		poderMover = false;
		console.log("LLegaste a la meta");
	}
}

function addPass()
{
	matrizPass[currentPos.x][currentPos.y] = 'algo'; // pintado
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
			if(i == currentPos.x && j == currentPos.y)
				!win? fill("#2980b9") : fill("#e74c3c") //azul y rojo
			else if(i == finalPos.x && j == finalPos.y)
				fill("#e67e22"); // naranja
			else if(matrizPass[i][j] != null)
				fill("#1a989c");
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




/*********************
**********************
*** MAZE GENERATOR ***
**********************
*********************
//https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker


var colsGen=0, rowsGen=0;
var t = 10; // ancho de cada cuadro
var cuadritosAll = []; // el de una sola dimension funciona
var currentCelda; // cuadro actual siendo visitado
var stack = []; //pila que es necesaria 

function setup()
{	
	//frameRate(4);
	createCanvas(800,600);
	//definir en numero de columas y filas
	colsGen = Math.floor(width/t);
	rowsGen = Math.floor(height/t);
	//console.log(colsGen);
	//console.log(rowsGen);
	//crear cuadritos
	for(var i = 0; i < rowsGen; i++)
	{
		for(var j = 0; j < colsGen; j++)
		{
			cuadritosAll.push(new Cuadro(i,j)); // arreglo con toods los cuadritos			
		}
	}

	//1.- Make the initial cell the current cell and mark it as visited
		currentCelda = cuadritosAll[0];
		currentCelda.visited = true;

	//frameRate(4);
}

function draw()
{
	background("#27ae60")
	for(var i = 0; i < cuadritosAll.length; i++)
	{
		cuadritosAll[i].show(); // metodo show, es public y existe en Cuadro
	}

	//2.- While there are unvisited cells

	//2.1.- If the current cell has any neighbours which have not been visited || lo hace el metodo checkVecinos()
		//2.1.1.- Choose randomly one of the unvisited neighbours || lo hace el metodo checkVecinos()
		var nextCelda = currentCelda.checkVecinos();			

		if(nextCelda) // si no regreso undefined, o sea hay un vecino que no ha sido visitado
		{
			//2.1.2.- Push the current cell to the stack
			stack.push(currentCelda);
			//2.1.3.- Remove the wall between the current cell and the chosen cell || lo hace removeWalls()
			Cuadro.removeWalls(currentCelda, nextCelda);
			//2.1.4.- Make the chosen cell the current cell and mark it as visited
			currentCelda = nextCelda;
			currentCelda.visited = true; 
		}
	//2.2.- Else if stack is not empty 
		else if(stack.length > 0)
		{
			//2.2.1.- Pop a cell from the stack
			var cell = stack.pop();
			//2.2.2.- Make it the current cell
			currentCelda = cell;
		}
		else{
			noLoop();//detente
		}
		currentCelda.resaltar();//para que desaparesca ponerlo dentro del if
}



function Cuadro(i,j) // es lo equivalente a un constructor
{
	this.i = i;
	this.j = j;
	this.walls =[true, true, true, true];
	//..........[top, rigth, bottom, left];
	this.visited = false;

	this.show = function()
	{
		var x = this.j*t; //columnas
		var y = this.i*t; //filas

		if(this.visited)
		{
			noStroke();
			//fill(255,0,255,100); si se pone alfa puede ir hastra abajo
			fill("#2c3e50");
			rect(x,y,t,t); //no se van a dibujar con rectangulos, sino con lineas
		}

		stroke(255);
		//cada linea empieza en la esquina de cada cuadro
		if (this.walls[0])
		{
			line(x  , y  , x+t, y); // top
		}

		if (this.walls[1])
		{
			line(x+t, y  , x+t, y+t); // right
		}

		if (this.walls[2])
		{
			line(x+t, y+t, x  , y+t); // bottom
		}

		if (this.walls[3])
		{
			line(x  , y+t, x  , y); // left
		}


	}

	this.resaltar = function()
	{
		var x = this.j*t; //columnas
		var y = this.i*t; //filas
		fill(236,240,241,100);//alpha
		noStroke();
		rect(x,y,t,t);
	}

	var index = function(i,j) //queda como funcion privada
	{
		if(i < 0 || j < 0 || i > rowsGen-1 || j > colsGen-1)
		{
			//son index invalidos
			return -1;
		}
		else
		{
			//indexFila*numeroColums + indexColum
			return i*colsGen + j;
			// la formula anterior regresa la posicion, como si fuera un arreglo bidemsional
			//siendo unidimensional 
		}
	}

	this.checkVecinos = function()
	{
		//cada celda tiene 4 vecinos
		//        [i-1,j]
		// [i,j-1] [i,j] [i,j+1]
		//        [i+1,j]
		var vecinos = [];
		// como es de una sola dimension
		var top =    cuadritosAll[index(i-1,j)];
		var right =  cuadritosAll[index(i,j+1)];
		var bottom = cuadritosAll[index(i+1,j)];
		var left =   cuadritosAll[index(i,j-1)];
		//si reciben -1, toman el valor de undefined,entonces hay que ver que sean validos:

		//2.1.- If the current cell has any neighbours which have not been visited

		if (top && !top.visited) vecinos.push(top);
		if (right && !right.visited)  vecinos.push(right);
		if (bottom && !bottom.visited) vecinos.push(bottom);
		if (left && !left.visited)   vecinos.push(left);

		//2.1.1.- Choose randomly one of the unvisited neighbours
		if(vecinos.length > 0)
		{
			var r = Math.floor(random(0,vecinos.length))
			return vecinos[r];
		}
		else
		{
			return undefined;
		}

	}

	Cuadro.removeWalls = function (a,b)// funcion estatica
	{
		//cuatro escenarios
		//1: [current][next] => current.j - next.j = 1; => remover izquierdo y derecho
		//2: [next][current] => current.j - next.j = -1; => remover derecho e izquierdo
		//3: [current]       => current.i - next.i = -1; => remover abajo y arriba
		//    [next]
		//4:  [next]         => current.i - next.i = 1; => remove arriba y abajo
		//   [current]

		//[top, rigth, bottom, left];
		//[0  ,   1   ,   2  ,  3  ];

		var x = a.j - b.j;
		if(x == 1)
		{
			a.walls[3] = false;
			b.walls[1] = false;
		}
		else if(x == -1)
		{
			a.walls[1] = false;
			b.walls[3] = false;
		}

		var y = a.i - b.i;

		if(y == 1)
		{
			a.walls[0] = false;
			b.walls[2] = false;
		}
		else if(y == -1)
		{
			a.walls[2] = false;
			b.walls[0] = false;
		}

	}

}
*/