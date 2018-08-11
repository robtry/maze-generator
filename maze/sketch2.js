/*=================================================
#>= Maze Simulator
#>= Author: Roberto Gervacio ~~ Mx ~~
#>= Start Data: 11-03-18
#>= Last Update: 17-06-18
#>= Aditional Comments: using p5.js
# this file describes all a new verson of maze simulator
===================================================*/

/*
|====================================|
|=========Variables globales=========|
|====================================|
*/
let rWalker; // walker de menu [Objeto]
const mg = new MazeGenerator(); //maze generator [Objeto]
const md; //maze draw [Objeto]
const mc; // maze controller [Objeto]
let anchoMaze, altoMaze; //dimesiones dinamicas del canvas
let stage; //status actual
// stage = 0 -> Menu
// stage = 1 -> Maze
let currentMaze = [];
let responsiveSize; // boolean saber de que tamaño hay que dibujar el maze
let atmPos; //boolean para saber que donde poner las posiciones
let clearOnReload //boolean para saber si hay que limpiar todo el maze