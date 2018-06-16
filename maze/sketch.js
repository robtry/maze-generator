/*=================================================
#>= Maze Simulator
#>= Author: Roberto Gervacio ~~ Mx ~~
#>= Start Data: 11-03-18
#>= Last Update: 15-06-18
#>= Aditional Comments: using p5.js
===================================================*/
let rWalker; // walker de menu [Objeto]
let mg; //maze generator [Objeto]
let md; //maze draw [Objeto]
let mc; // maze controller [Objeto]
var anchoMaze, altoMaze; //dimesiones dinamicas del canvas
var stage; //status actual
// stage = 0 -> Menu
// stage = 1 -> Maze
var currentMaze = [];
var responsiveSize; // boolean saber de que tamaño hay que dibujar el maze
var atmPos; //boolean para saber que donde poner las posiciones
//botones
let generateBtn, exportMazeBtn, loadMazeBtn, dropzone, photoBtn, sizeCheckBtn, changeSizeBtn, restartBtn, posCheckBtn, setPosBtn;

/*
|========================|
|=========clases=========|
|========================|
*/

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
		strokeWeight(3); //ancho

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
		this.noValid = "Datos no válidos";
		this.noValidMessage = "Los valores para generar el laberinto, deben ser enteros positivos";
		this.onlyOdd = "Los valores deben ser números impares";
		this.noExport = "No hay nada para exportar";
		this.noReload = "No hay nada para recargar";
		this.correctMessage = "Creado correctamente";
		this.noToResponsive = "Los valores para las dimensiones del laberinto deben ser enteros positivos mayores a 100";
		this.realRows = 0;
		this.realCols = 0;
		//los del algoritmo
		this.rowsGen = 0;
		this.colsGen = 0;
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

	exportar(send)
	{
		var writer;

		//si el argumento esta vacio entonces debe imprimirlo
		(send == undefined) ? writer = createWriter('currentMaze.txt') : writer = ""

		//[top, rigth, bottom, left];
		var cadena = "";
		var toPrintCols, toPrintRows;

		if(this.realRows % 2 == 0) toPrintRows =  this.rowsGen * 2;
		else toPrintRows = (this.rowsGen * 2) - 1;

		if(this.realCols % 2 == 0) toPrintCols = this.colsGen * 2;
		else toPrintCols = (this.colsGen * 2) - 1;

		(send == undefined) ? writer.print(toPrintRows +" "+ toPrintCols) : writer += toPrintRows +" "+ toPrintCols + "\n"

		for (var i = 0; i < this.rowsGen; i++)
		{
			//top
			cadena = "";
			for(var j = 0; j < this.colsGen; j++)
			{
				if(i == 0 && this.realRows % 2 == 0)
				{
					//son tops ver si el de la derecha solo entra cuando sea par
					(this.cuadritosAll[i*this.colsGen+j].walls[1]) ? cadena += "01" : cadena += "11"
				}
				else
				{
					if(j != this.colsGen-1)
					{
						if (this.cuadritosAll[i*this.colsGen+j].walls[0]) cadena += "11"
						else (this.cuadritosAll[(i-1)*this.colsGen+j].walls[1] || this.cuadritosAll[i*this.colsGen+j].walls[1]) ? cadena+="01" : cadena+= "00"

					}
					else
					{
						//es la última columna
						if(this.realCols % 2 == 0)
							(this.cuadritosAll[i*this.colsGen+(j-1)].walls[1]) ? cadena += "01" : cadena += "00"
						else
							(this.cuadritosAll[i*this.colsGen+j].walls[0]) ? cadena += "1" : cadena += "0"
					}
				}
			}

			if(i != 0 || this.realRows % 2 == 0)
			{
				(send == undefined) ? writer.print(cadena) : writer += cadena + "\n"
			}

			//derechas
			cadena = "";
			for(var j = 0; j < this.colsGen; j++)
			{
				if(j != this.colsGen-1) (this.cuadritosAll[i*this.colsGen+j].walls[1]) ? cadena+="01" : cadena+="00"
				else
				{
					//es la última columna
					//(this.realCols % 2 == 0) ? cadena += "00" : cadena += "0"
					if(this.realCols % 2 == 0)
						(this.cuadritosAll[i*this.colsGen+(j-1)].walls[1]) ? cadena += "01" : cadena += "00"
					else
						cadena += "0"
				}
			}

			(send == undefined) ? writer.print(cadena) : writer += cadena + "\n"
		}

		if (send == undefined) writer.close();
		else return writer;
	}

	crear(r, c)
	{
		this.realRows = r;
		this.realCols = c;

		if(r % 2 == 0) this.rowsGen = r / 2;
		else this.rowsGen = (r + 1) / 2;

		if(c % 2 == 0) this.colsGen = c / 2;
		else this.colsGen = (c + 1) / 2;

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

class MazeDraw
{
	constructor()
	{
		this.importado = false;
		this.rowsDraw = 0;
		this.colsDraw = 0;
		this.anchoCuadrito = 0;
		this.altoCuadrito = 0;
		this.posX = 0;
		this.posY = 0;
		this.responsiveTextX = 0;
		this.responsiveTextY = 0;

		this.currentPosition;
		this.inicialPos;
		this.finalPos;
	}

	setRows(r)
	{
		this.rowsDraw = r;
	}

	setCols(c)
	{
		this.colsDraw = c;
	}

	setImportado()
	{
		this.importado = true;
	}

	isImportado()
	{
		return this.importado;
	}

	chooseInitialPosition()
	{
		this.inicialPos = createVector(0, this.rowsDraw - 1);
		this.currentPosition = this.inicialPos;
		//console.log(this.currentPosition)
	}

	chooseFinalPosition(matriz)
	{
		//cambiar la probabilidad
		var valido = false;
		while(!valido)
		{
			this.finalPos = createVector(Math.floor(random(this.colsDraw-1)), Math.floor(random(this.rowsDraw-1)));
			(matriz[this.finalPos.y * this.colsDraw + this.finalPos.x])? valido = false : valido = true
		}
		//console.log(this.finalPos);
	}

	setInitialPos(x,y)
	{
		this.inicialPos = createVector(x, y);
	}

	setFinalPos(x,y)
	{
		this.finalPos = createVector(x, y);
	}

	drawMaze(mazeToDraw)
	{
		rectMode(CORNER);
		strokeWeight(1); // contorno de los cuadritos
		this.anchoCuadrito = (anchoMaze - 30) / this.colsDraw;
		this.altoCuadrito = (altoMaze - 30) / this.rowsDraw;
		this.posX = 0;
		this.posY = 0;
		this.responsiveTextX  = this.anchoCuadrito/3;
		this.responsiveTextY = this.altoCuadrito/2;

		for(var i = 0; i < this.rowsDraw; i++)
		{
			for(var j = 0; j < this.colsDraw; j++)
			{
				if(j == this.colsDraw - 1 || i == this.rowsDraw - 1){noStroke();fill(0);}
				if(j == this.colsDraw - 1){textSize(this.responsiveTextY); text(i, anchoMaze - 25, this.posY + (this.altoCuadrito/2) + (this.altoCuadrito/5));}
				if(i == this.rowsDraw - 1){textSize(this.responsiveTextX); text(j,this.posX + this.anchoCuadrito/2, altoMaze - 10);}

				stroke(0);
				//condiciones para que dibuje las posiciones
				if (i == this.inicialPos.y && j == this.inicialPos.x) fill("#2980b9"); //azul
				else if (i == this.finalPos.y && j == this.finalPos.x) fill("#e67e22"); //naranja
				else (mazeToDraw[i * this.colsDraw + j]) ? fill("#000000") : fill("#ffffff")

				rect(this.posX, this.posY, this.anchoCuadrito, this.altoCuadrito);

				this.posX += this.anchoCuadrito;
			}

			this.posY += this.altoCuadrito;
			this.posX = 0;
		}
	}
}

class MazeController
{
	constructor()
	{
		//
	}

	addPass()
	{

	}
}

/*
|========================|
|=========canvas=========|
|========================|
*/

function setup()
{
	calcularMaze(); // tamaño responsive

	//para posicionarlo desde el dom
	var myCanvas = createCanvas(anchoMaze, altoMaze);
	myCanvas.parent('myContainer');

	//inciar el random walker
	rWalker = new RandomWalker(anchoMaze/2, altoMaze/2, random(16) + 8);

	//iniciar el generador
	mg = new MazeGenerator();

	//iniciar el dibujador
	md = new MazeDraw();

	//iniciar el controlador de leer los datos
	mc = new MazeController();

	//status, empieza en el menu
	stage = 0;
	stageTemp = stage;
	changingStage();

	//medida responsive del maze
	responsiveSize = true;

	//posiciones del maze
	atmPos = true;

	//botones
	generateBtn = select("#generar");
	generateBtn.mouseClicked(tryGenerar);

	exportMazeBtn = select("#mazeExport");
	exportMazeBtn.mouseClicked(tryExportMaze);

	loadMazeBtn = createFileInput(tryLoadMaze);
	loadMazeBtn.parent("loadMaze");

	dropzone = select("#dropzone");
	dropzone.drop(tryLoadMaze);

	photoBtn = select("#photo");
	photoBtn.mousePressed(function (){save('my.png');});

	sizeCheckBtn = select("#sizeCheck");
	sizeCheckBtn.changed(function (){responsiveSize = !responsiveSize; windowResized();});

	changeSizeBtn = select("#sizeBtn");
	changeSizeBtn.mouseClicked(tryChangeSize);

	posCheckBtn = select("#posCheck");
	posCheckBtn.changed(function(){ atmPos = !atmPos });

	setPosBtn = select("#posBtn");
	setPosBtn.mousePressed(trySetPositions);

	restartBtn = select("#reiniciar");
	restartBtn.mouseClicked(tryReloadMaze);

	//los números
	textStyle(NORMAL);
}

function draw()
{
	if(stage == 0) // menu
	{
		rWalker.show();
		rWalker.step();
	}
	else if(stage == 1)
	{
		background(255); // limpiar
		md.drawMaze(currentMaze);
		stage = 2;
	}
	else if(stage == 2) // do not repeat draw
	{
		//noLoop();
	}
}

function windowResized()
{
	if(responsiveSize)
	{
		calcularMaze();
		resizeCanvas(anchoMaze, altoMaze);
		changingStage();
	}

	if(stage == 2) tryReloadMaze();
}


/*
|========================|
|==funciones del canvas==|
|========================|
*/

function calcularMaze()
{
	anchoMaze = innerWidth * (9.5/10) - 140; //ancho de la consola
	altoMaze = innerHeight * (8.8/10);
}

function changingStage()
{
	rectMode(CENTER); // los reactangulos se dibujen desde el centro
	background(255);
	//rectángulo de area principal
	stroke(0);//color
	strokeWeight(8);//ancho del area principal
	rect(anchoMaze/2, altoMaze/2, anchoMaze, altoMaze);
}

/*
|============================|
|===funciones para botones===|
|============================|
*/

function tryGenerar()
{
	var rows = parseInt(document.getElementById('rowsG').value);
	var cols = parseInt(document.getElementById('colsG').value);

	if(rows <= 0 || cols  <= 0 || isNaN(rows) || isNaN(cols))
	{
		//no válido
		document.getElementById('history').value = mg.noValid + "\n\n" + mg.noValidMessage;
	}
	else
	{
		mg.crear(rows, cols);
		document.getElementById('history').value = mg.correctMessage;

		//se muestre lo que acabamos de generar
		tryLoadMaze(mg.exportar(false), true); //regrese un arreglo

	}
}

function tryExportMaze()
{
	if(mg.isGenerado())
	{
		mg.exportar(); // no regresa nada manda a descargar el txt del maze
		document.getElementById('history').value = "Exportado correctamente";
	}
	else document.getElementById('history').value = mg.noExport;
}

function tryLoadMaze(file, creadoAqui)
{
	if(file.type == "text" || creadoAqui !== undefined)
	{
		currentMaze = []; // vaciarlo por si tenia algo

		var matrizLeida;
		if(creadoAqui == undefined)
		{
			//es importado
			 matrizLeida = file.data.split("\n");
			 md.setImportado();
		}
		else
		{
			//generado aqui
			matrizLeida = file.split("\n")
		}

		md.setRows(matrizLeida[0].split(" ")[0]);
		md.setCols(matrizLeida[0].split(" ")[1]);
		var matrizTempCols;

		for(var i = 0; i < md.rowsDraw; i++)
		{
			matrizTempCols = matrizLeida[i+1].split("");
			for(var j = 0; j < md.colsDraw; j++)
			{
				currentMaze.push(matrizTempCols[j] == "1");
			}
		}

		md.chooseInitialPosition();
		md.chooseFinalPosition(currentMaze);

		stage = 1;

	}
	else
	{
		document.getElementById('history').value = "Archivo no válido"
	}
}

function tryChangeSize()
{
	var newAlto = parseInt(document.getElementById('largoM').value);
	var newAncho = parseInt(document.getElementById('altoM').value);

	if(newAlto <= 100 || newAncho <= 100 || isNaN(newAlto) || isNaN(newAncho))
	{
		//no válidas
		document.getElementById('history').value = mg.noValid + "\n\n" + mg.noToResponsive +"\nY ambos deben ser específicados";
	}
	else
	{
		//son validos
		altoMaze = newAlto;
		anchoMaze = newAncho;
		resizeCanvas(anchoMaze, altoMaze);
	}
}

function trySetPositions()
{
	if(mg.isGenerado() || md.isImportado())
	{
		var xS, yS, xE, yE;
		var startPos = document.getElementById('inicioC').value;
		var endPos = document.getElementById('finC').value;

		if(startPos.includes(",") && endPos.includes(","))
		{
			xS = parseInt(startPos.split(",")[0]);
			yS = parseInt(startPos.split(",")[1]);
			xE = parseInt(endPos.split(",")[0]);
			yE = parseInt(endPos.split(",")[1]);

			if
			(
				xS < 0 || yS < 0 || isNaN(xS) || isNaN(yS) ||
				xE < 0 || yE < 0 || isNaN(xE) || isNaN(yE) ||
				xS > md.colsDraw - 1 || xE > md.colsDraw - 1 || //-1 porque empieza en 0
				yS > md.rowsDraw - 1 || yE > md.rowsDraw - 1 || //-1 porque empieza en 0
				(xS == xE && yS == yE)
			)
			{
				//no válido
				document.getElementById('history').value = "No son números válidos";
			}
			else
			{
				//números válidos dentro del maze y distintos a si
				if(!(currentMaze[yS * md.colsDraw + xS]) && !(currentMaze[yE * md.colsDraw + xE]))
				{
					//estan disponibles
					md.setInitialPos(xS,yS);
					md.setFinalPos(xE,yE);
					document.getElementById('history').value = "Nuevas posiciones establecidas";
	
					//para que se vuelva a dibujar
					stage = 1;
				}
				else
				{
					document.getElementById('history').value = "No se puede establecer esta posición";
				}
			}
		}
		else
		{
			document.getElementById('history').value = "Hay un error con las cordenadas";
		}
	
	}
	else
	{
		document.getElementById('history').value = "Debe haber un laberinto en el cavas";
	}
}

function tryReloadMaze()
{
	(mg.isGenerado() || md.isImportado()) ?	stage = 1 : document.getElementById('history').value = mg.noReload;
}
