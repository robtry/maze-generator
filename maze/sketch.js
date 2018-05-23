/*=================================================
#>= Maze Simulator
#>= Author: Roberto Gervacio ~~ Mx ~~
#>= Start Data: 11-03-18
#>= Last Update: 23-05-18
#>= Aditional Comments: using p5.js
===================================================*/
let rWalker; // walker de menu [Objeto]
let mg; //maze generator [Objeto]
var anchoMaze, altoMaze; //dimesiones dinamicas del canvas
var stage, stageTemp; //status actual, hay que limpiar
//botones
var generate, exportMaze;

class RandomWalker
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
	//https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker

	constructor()
	{
		this.generado = false;
		this.noValid = "datos no válidos";
		this.noValidMessage = "Los valores para generar el laberinto, deben ser enteros positivos impares";
		this.onlyOdd = "Los valores deben ser números impares";
		this.noExport = "no hay nada para exportar";
		this.correctMessage = "Creado correctamente";
		//los del algoritmo
		this.colsGen = 0;
		this.rowsGen = 0;
		this.cuadritosAll = [];
		this.currentCelda;
		this.nextCelda;
		this.cell;
		this.stack = [];
	}

	isGenerado()
	{
		return this.generado;
	}

	exportar()
	{
		//[top, rigth, bottom, left];
		var writer = createWriter('currentMaze.txt');
		var cadena = "";

		writer.print((this.rowsGen * 2 -1) +" "+ (this.colsGen * 2 - 1));

		for (var i = 0; i < this.rowsGen; i++)
		{
			//top
			cadena = "";
			for(var j = 0; j < this.colsGen; j++)
			{
				if(i != 0)
				{
					if(j != this.colsGen-1)
					{
						if (this.cuadritosAll[i*this.colsGen+j].walls[0]) cadena+="11"
						else (this.cuadritosAll[(i-1)*this.colsGen+j].walls[1] || this.cuadritosAll[i*this.colsGen+j].walls[1]) ? cadena+="01" : cadena+= "00"

					}
					else (this.cuadritosAll[i*this.colsGen+j].walls[0]) ? cadena+="1" : cadena+="0"
				}
			}

			if(i != 0) writer.print(cadena);
			
			//derechas
			cadena = "";
			for(var j = 0; j < this.colsGen; j++)
			{
				if(j != this.colsGen-1) (this.cuadritosAll[i*this.colsGen+j].walls[1]) ? cadena+="01" : cadena+="00"
				else cadena += "0"
			}
			writer.print(cadena);
		}

		writer.close();
	}

	crear(r, c)
	{
		this.rowsGen = (r + 1) / 2;
		this.colsGen = (c + 1) / 2;
		//print(this.colsGen + " " + this.rowsGen);

		//borrar todo
		while(this.cuadritosAll.length > 0)
		{
			this.cuadritosAll.pop();
		}

		for(var i = 0; i < this.rowsGen; i++)
		{
			for(var j = 0; j < this.colsGen; j++)
			{
				this.cuadritosAll.push(new Cuadro(i,j)); // arreglo con todos los cuadritos			
			}
		}

		//1.- Make the initial cell the current cell and mark it as visited
		this.currentCelda = this.cuadritosAll[0];
		this.currentCelda.visited = true;

		//2.- While there are unvisited cells
		while(this.areUnVisited())
		{
		//2.1.- If the current cell has any neighbours which have not been visited || lo hace el metodo checkVecinos()
			//2.1.1.- Choose randomly one of the unvisited neighbours || lo hace el metodo checkVecinos()
			this.nextCelda = this.currentCelda.checkVecinos(this.colsGen, this.rowsGen, this.cuadritosAll);

			if(this.nextCelda) // si no regreso undefined, o sea hay un vecino que no ha sido visitado
			{
			//2.1.2.- Push the current cell to the stack
				this.stack.push(this.currentCelda);
			//2.1.3.- Remove the wall between the current cell and the chosen cell || lo hace removeWalls()
				this.currentCelda.removeWalls(this.nextCelda);
			//2.1.4.- Make the chosen cell the current cell and mark it as visited
				this.currentCelda = this.nextCelda;
				this.currentCelda.visited = true; 
			}
		//2.2.- Else if stack is not empty 
			else if(this.stack.length > 0)
			{
			//2.2.1.- Pop a cell from the stack
				this.cell = this.stack.pop();
			//2.2.2.- Make it the current cell
				this.currentCelda = this.cell;
			}
		}

		//print("terminado");
		this.generado = true;
	}

	areUnVisited()
	{
		var seguir = false;

		for(var i = 0; i < this.cuadritosAll.length && !seguir; i++)
		{
				if (!this.cuadritosAll[i].visited) seguir = true;
				//print(this.cuadritosAll[i].visited);
		}

		return seguir;
	}
}

class Cuadro
{
	constructor(i, j)
	{
		this.i = i;
		this.j = j;
		this.walls = [true, true, true, true];
		//...........[top, rigth, bottom, left];
		this.visited = false;
	}

	index(i, j, c, r)
	{
		if(i < 0 || j < 0 || i > r-1 || j > c-1)
		{
			//son index invalidos
			return -1;
		}
		else
		{
			//indexFila*numeroColums + indexColum
			return i*c + j;
			// la formula anterior regresa la posicion, como si fuera un arreglo bidemsional
			//siendo unidimensional 
		}
	}

	checkVecinos(c, r, cuadritosAllC)
	{
		//cada celda tiene 4 vecinos
		//        [i-1,j]
		// [i,j-1] [i,j] [i,j+1]
		//        [i+1,j]
		var vecinos = [];
		// como es de una sola dimension
		var top =    cuadritosAllC[this.index(this.i-1,this.j  , c, r)];
		var right =  cuadritosAllC[this.index(this.i  ,this.j+1, c, r)];
		var bottom = cuadritosAllC[this.index(this.i+1,this.j  , c, r)];
		var left =   cuadritosAllC[this.index(this.i  ,this.j-1, c, r)];
		//si reciben -1, toman el valor de undefined,entonces hay que ver que sean validos:

		//2.1.- If the current cell has any neighbours which have not been visited

		if (top    && !top.visited)    vecinos.push(top);
		if (right  && !right.visited)  vecinos.push(right);
		if (bottom && !bottom.visited) vecinos.push(bottom);
		if (left   && !left.visited)   vecinos.push(left);

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

	removeWalls(next)
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

		var x = this.j - next.j;
		if(x == 1)
		{
			this.walls[3] = false;
			next.walls[1] = false;
		}
		else if(x == -1)
		{
			this.walls[1] = false;
			next.walls[3] = false;
		}

		var y = this.i - next.i;

		if(y == 1)
		{
			this.walls[0] = false;
			next.walls[2] = false;
		}
		else if(y == -1)
		{
			this.walls[2] = false;
			next.walls[0] = false;
		}

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
	rWalker = new RandomWalker(anchoMaze/2, altoMaze/2, random(15) + 8);

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
	(innerWidth <= 767) ? anchoMaze = innerWidth * (5/6) : anchoMaze =  innerWidth * (4/6);
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
	var rows = parseInt(document.getElementById('rowsG').value);
	var cols = parseInt(document.getElementById('colsG').value);

	if(rows <= 0 || cols  <= 0)
	{
		//no válido
		document.getElementById('subhead').innerHTML = mg.noValid;
		document.getElementById('history').value = mg.noValidMessage;
	}
	else
	{
		//son positivos
		if(rows % 2 == 0 || cols % 2 == 0)
		{
			//se rompe
			document.getElementById('history').value = mg.onlyOdd;
			document.getElementById('subhead').innerHTML = mg.noValid;
			if(document.getElementById('history').value == mg.noValidMessage)
				document.getElementById('history').value = '';
		}
		else
		{
			mg.crear(rows, cols);
			document.getElementById('subhead').innerHTML = mg.correctMessage;
			if(document.getElementById('history').value == mg.noValidMessage)
				document.getElementById('history').value = '';
		}
	}
}

function tryExportMaze()
{
	if(mg.isGenerado())
	{
		mg.exportar();
		document.getElementById('subhead').innerHTML = "Exportado correctamente";
	}
	else document.getElementById('subhead').innerHTML = mg.noExport;
}