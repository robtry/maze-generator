function setup()
{
	//var myCanvas = createCanvas(600, 400);
	//myCanvas.parent('myContainer');
}

function draw()
{
	if (mouseIsPressed) fill(0);
	else fill(255);

	ellipse(mouseX, mouseY, 80, 80);
}