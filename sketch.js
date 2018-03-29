function setup()
{
	var width = window.innerWidth,
		height = window.innerHeight;
	createCanvas(width/1.5, height/1.5);
	background(255);
}

function draw()
{
	if (mouseIsPressed)	fill(0);
	else fill(255);
	ellipse(mouseX, mouseY, 80, 80);
}