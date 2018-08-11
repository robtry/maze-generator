/*=================================================
#>= Maze Simulator
#>= Author: Roberto Gervacio ~~ Mx ~~
#>= Start Data: 11-03-18
#>= Last Update: 11-08-18
#>= Aditional Comments: using p5.js
# this file describes all a new verson of maze simulator
===================================================*/

/*
|====================================|
|=========Variables globales=========|
|====================================|
*/

const anchoConsola = 140; //ancho de la consola en px para que se vea el maze
let anchoMaze = 0, altoMaze = 0; //dimesiones dinamicas del canvas
let stage = 0; //status actual #stage = 0 -> Menu #stage = 1 -> Maze
let currentMaze = [];
let responsiveSize = true; // boolean saber de que tamaño hay que dibujar el maze
let atmPos = true; //boolean para saber que donde poner las posiciones de los controladores
let clearOnReload = true; //boolean para saber si hay que limpiar todo el maze, al redibujar, se limpie o no
let historial; //textbox con el historial
let rw; // walker de menu [Objeto], es let para que se inicialice centrado
const mg = new MazeGenerator(); //maze generator [Objeto]
const md = new MazeDraw(); //maze draw [Objeto]
const mc = new MazeController();

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
	rw = new RandomWalker(anchoMaze / 2, altoMaze / 2, Math.round(Math.random() * 16 + 8)); 

    //botones
    select("#generar").mouseClicked(tryGenerar);
    select("#mazeExport").mouseClicked(tryExportMaze);
    createFileInput(tryLoadMaze).parent("loadMaze");
    select("#dropzone").drop(tryLoadMaze);
    select("#photo").mousePressed(function (){save('my.png');});
    select("#sizeCheck").changed(function (){responsiveSize = !responsiveSize; windowResized();});
    select("#sizeBtn").mouseClicked(tryChangeSize);
    select("#posCheck").changed(function(){ atmPos = !atmPos; tryReloadMaze() });
    select("#posBtn").mousePressed(trySetPositions);
    select("#reiniciar").mouseClicked(function(){ clearOnReload = true; tryReloadMaze();});
    historial = select("#history");

    //los numeros
    textStyle(NORMAL);
}

function draw() {
    if(stage == 0) 	{
		rw.show();
		rw.step();
	} else if(stage == 1) {
		if(clearOnReload) {
			md.setMaze();
			clearOnReload = false;
		}
		md.drawMaze();
		stage = 2;
	} else if(stage == 2) { // do not repeat draw
		noLoop();
	}
}

function windowResized() {
	if(responsiveSize) {
		calcularMaze();
		resizeCanvas(anchoMaze, altoMaze);
		clearStage();
	}

	if(stage == 2) tryReloadMaze();
}

/*
|===================================|
|==funciones auxiliares del canvas==|
|===================================|
*/

function calcularMaze() {
	anchoMaze = innerWidth * (9.5/10) - anchoConsola;
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

function tryGenerar() {
	let rows = parseInt(document.getElementById('rowsG').value);
	let cols = parseInt(document.getElementById('colsG').value);

	if(rows <= 0 || cols  <= 0 || isNaN(rows) || isNaN(cols)) {
		//no válido
		document.getElementById('history').value = mg.noValid + "\n\n" + mg.noValidMessage;
	}
	else {
		mg.crear(rows, cols);
		historial.value(historial.value() + mg.correctMessage + "\n");

		//se muestre lo que acabamos de generar
		tryLoadMaze(mg.exportar(false), true); //regrese un arreglo

	}
}

function tryExportMaze() {
	if(mg.generado) {
		mg.exportar(); // no regresa nada manda a descargar el txt del maze
        historial.value(historial.value() + "Exportado correctamente\n");
	}
	else historial.value(historial.value() + mg.noExport + "\n");
}

function tryLoadMaze(file, creadoAqui) {
	if(file.type == "text" || creadoAqui !== undefined) {
		currentMaze = []; // vaciarlo por si tenia algo
		while(currentMaze.length > 0) {
            console.log("no funciono la asignacion al vacio");
			currentMaze.pop();
		}

		let matrizLeida;
		if(creadoAqui == undefined)	{
			//es importado
			 matrizLeida = file.data.split("\n");
			 md.importado = true;
		} else {
			//generado aqui
			matrizLeida = file.split("\n")
		}

		md.rowsDraw = matrizLeida[0].split(" ")[0];
        md.colsDraw = matrizLeida[0].split(" ")[1];
        
		let matrizTempCols;

		for(let i = 0; i < md.rowsDraw; i++)
		{
			matrizTempCols = matrizLeida[i+1].split("");
			for(let j = 0; j < md.colsDraw; j++)
			{
				currentMaze.push(matrizTempCols[j] == "1");
			}
		}

		md.chooseInitialPosition();
		md.chooseFinalPosition(currentMaze);

		//corrige el bug
		clearOnReload = true;
		tryReloadMaze();

		stage = 1;

	} else {
        historial.value(historial.value() + "Archivo no válido\n");
	}
}

function tryChangeSize() {
	let newAlto = parseInt(document.getElementById('largoM').value);
	let newAncho = parseInt(document.getElementById('altoM').value);

	if(newAlto <= 100 || newAncho <= 100 || isNaN(newAlto) || isNaN(newAncho)) {
		//no válidas
		historial.value(historial.value() + mg.noValid + "\n\n" + mg.noToResponsive +"\nY ambos deben ser específicados");
	} else {
		//son validos
		altoMaze = newAlto;
		anchoMaze = newAncho;
		resizeCanvas(anchoMaze, altoMaze);
	}
}

function trySetPositions() {
	if(mg.generado || md.importado)	{
		let xS, yS, xE, yE;
		let startPos = document.getElementById('inicioC').value;
		let endPos = document.getElementById('finC').value;

		if(startPos.includes(",") && endPos.includes(",")){
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
                historial.value(historial.value() + "No son números válidos\n");
			}
			else
			{
				//números válidos dentro del maze y distintos a si
				if(!(currentMaze[yS * md.colsDraw + xS]) && !(currentMaze[yE * md.colsDraw + xE])) {
					//estan disponibles
					md.setInitialPos(xS,yS);
					md.setFinalPos(xE,yE);
                    historial.value(historial.value() + "Nuevas posiciones establecidas\n");
	
					//para que se vuelva a dibujar
					clearOnReload = true;
                    stage = 1;
                    
				} else {
                    historial.value(historial.value() + "No se puede establecer esta posición\n");
				}
			}
		} else { historial.value(historial.value() + "Hay un error con las cordenadas\n");	}
	} else {
        historial.value(historial.value() + "Debe haber un laberinto en el cavas\n");
	}
}

function tryReloadMaze()
{
	loop();
	loop();
	if(mg.generado || md.importado)	{
        if (clearOnReload) md.currentPosition = createVector(md.inicialPos.x, md.inicialPos.y);
        
		stage = 1;
	}
	else historial.value(historial.value() + mg.noReload + "\n");
}

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