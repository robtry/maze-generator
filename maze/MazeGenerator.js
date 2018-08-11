
class MazeGenerator {
	//https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker
	constructor() {
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
	exportar(send) {
		var writer;
		//si el argumento esta vacio entonces debe imprimirlo
		(send == undefined) ? writer = createWriter('currentMaze.txt') : writer = "";
		//[top, rigth, bottom, left];
		var cadena = "";
		var toPrintCols, toPrintRows;
		if (this.realRows % 2 == 0)
			toPrintRows = this.rowsGen * 2;
		else
			toPrintRows = (this.rowsGen * 2) - 1;
		if (this.realCols % 2 == 0)
			toPrintCols = this.colsGen * 2;
		else
			toPrintCols = (this.colsGen * 2) - 1;
		(send == undefined) ? writer.print(toPrintRows + " " + toPrintCols) : writer += toPrintRows + " " + toPrintCols + "\n";
		for (var i = 0; i < this.rowsGen; i++) {
			//top
			cadena = "";
			for (var j = 0; j < this.colsGen; j++) {
				if (i == 0 && this.realRows % 2 == 0) {
					//son tops ver si el de la derecha solo entra cuando sea par
					(this.cuadritosAll[i * this.colsGen + j].walls[1]) ? cadena += "01" : cadena += "11";
				}
				else {
					if (j != this.colsGen - 1) {
						if (this.cuadritosAll[i * this.colsGen + j].walls[0])
							cadena += "11";
						else
							(this.cuadritosAll[(i - 1) * this.colsGen + j].walls[1] || this.cuadritosAll[i * this.colsGen + j].walls[1]) ? cadena += "01" : cadena += "00";
					}
					else {
						//es la última columna
						if (this.realCols % 2 == 0)
							(this.cuadritosAll[i * this.colsGen + (j - 1)].walls[1]) ? cadena += "01" : cadena += "00";
						else
							(this.cuadritosAll[i * this.colsGen + j].walls[0]) ? cadena += "1" : cadena += "0";
					}
				}
			}
			if (i != 0 || this.realRows % 2 == 0) {
				(send == undefined) ? writer.print(cadena) : writer += cadena + "\n";
			}
			//derechas
			cadena = "";
			for (var j = 0; j < this.colsGen; j++) {
				if (j != this.colsGen - 1)
					(this.cuadritosAll[i * this.colsGen + j].walls[1]) ? cadena += "01" : cadena += "00";
				else {
					//es la última columna
					//(this.realCols % 2 == 0) ? cadena += "00" : cadena += "0"
					if (this.realCols % 2 == 0)
						(this.cuadritosAll[i * this.colsGen + (j - 1)].walls[1]) ? cadena += "01" : cadena += "00";
					else
						cadena += "0";
				}
			}
			(send == undefined) ? writer.print(cadena) : writer += cadena + "\n";
		}
		if (send == undefined)
			writer.close();
		else
			return writer;
	}
	crear(r, c) {
		this.realRows = r;
		this.realCols = c;
		if (r % 2 == 0)
			this.rowsGen = r / 2;
		else
			this.rowsGen = (r + 1) / 2;
		if (c % 2 == 0)
			this.colsGen = c / 2;
		else
			this.colsGen = (c + 1) / 2;
		//print(this.colsGen + " " + this.rowsGen);
		//borrar todo
		//this.cuadritosAll = [];
		while (this.cuadritosAll.length > 0) {
			this.cuadritosAll.pop();
		}
		for (var i = 0; i < this.rowsGen; i++) {
			for (var j = 0; j < this.colsGen; j++) {
				this.cuadritosAll.push(new Cuadro(i, j)); // arreglo con todos los cuadritos
			}
		}
		//1.- Make the initial cell the current cell and mark it as visited
		this.currentCelda = this.cuadritosAll[0];
		this.currentCelda.visited = true;
		//2.- While there are unvisited cells
		while (this.areUnVisited()) {
			//2.1.- If the current cell has any neighbours which have not been visited || lo hace el metodo checkVecinos()
			//2.1.1.- Choose randomly one of the unvisited neighbours || lo hace el metodo checkVecinos()
			this.nextCelda = this.currentCelda.checkVecinos(this.colsGen, this.rowsGen, this.cuadritosAll);
			if (this.nextCelda) // si no regreso undefined, o sea hay un vecino que no ha sido visitado
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
			else if (this.stack.length > 0) {
				//2.2.1.- Pop a cell from the stack
				this.cell = this.stack.pop();
				//2.2.2.- Make it the current cell
				this.currentCelda = this.cell;
			}
		}
		//print("terminado");
		this.generado = true;
	}
	areUnVisited() {
		var seguir = false;
		for (var i = 0; i < this.cuadritosAll.length && !seguir; i++) {
			if (!this.cuadritosAll[i].visited)
				seguir = true;
			//print(this.cuadritosAll[i].visited);
		}
		return seguir;
	}
}

class Cuadro {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.walls = [true, true, true, true];
		//...........[top, rigth, bottom, left];
		this.visited = false;
	}
	index(i, j, c, r) {
		if (i < 0 || j < 0 || i > r - 1 || j > c - 1) {
			//son index invalidos
			return -1;
		}
		else {
			//indexFila*numeroColums + indexColum
			return i * c + j;
			// la formula anterior regresa la posicion, como si fuera un arreglo bidemsional
			//siendo unidimensional
		}
	}
	checkVecinos(c, r, cuadritosAllC) {
		//cada celda tiene 4 vecinos
		//        [i-1,j]
		// [i,j-1] [i,j] [i,j+1]
		//        [i+1,j]
		var vecinos = [];
		// como es de una sola dimension
		var top = cuadritosAllC[this.index(this.i - 1, this.j, c, r)];
		var right = cuadritosAllC[this.index(this.i, this.j + 1, c, r)];
		var bottom = cuadritosAllC[this.index(this.i + 1, this.j, c, r)];
		var left = cuadritosAllC[this.index(this.i, this.j - 1, c, r)];
		//si reciben -1, toman el valor de undefined,entonces hay que ver que sean validos:
		//2.1.- If the current cell has any neighbours which have not been visited
		if (top && !top.visited)
			vecinos.push(top);
		if (right && !right.visited)
			vecinos.push(right);
		if (bottom && !bottom.visited)
			vecinos.push(bottom);
		if (left && !left.visited)
			vecinos.push(left);
		//2.1.1.- Choose randomly one of the unvisited neighbours
		if (vecinos.length > 0) {
			var r = Math.floor(random(0, vecinos.length));
			return vecinos[r];
		}
		else {
			return undefined;
		}
	}
	removeWalls(next) {
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
		if (x == 1) {
			this.walls[3] = false;
			next.walls[1] = false;
		}
		else if (x == -1) {
			this.walls[1] = false;
			next.walls[3] = false;
		}
		var y = this.i - next.i;
		if (y == 1) {
			this.walls[0] = false;
			next.walls[2] = false;
		}
		else if (y == -1) {
			this.walls[2] = false;
			next.walls[0] = false;
		}
	}
}