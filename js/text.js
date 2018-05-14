var cadenas = [
	"<span><b>{Maze</b>.show()<b>}</b></span>",
	"<span><b>{Maze</b>.create()<b>}</b></span>",
	"<span><b>{Maze</b>.down()<b>}</b></span>",
	"<span><b>{Maze</b>.paint()<b>}</b></span>",
	"<span><b>{Maze</b>.hack()<b>}</b></span>",
	"<span><b>{Maze</b>.begin()<b>}</b></span>",
	"<span><b>{Maze</b>.left()<b>}</b></span>",
	"<span><b>{Maze</b>.right()<b>}</b></span>",
	"<span><b>{Maze</b>.up()<b>}</b></span>",
	"<span><b>{Maze</b>.solve()<b>}</b></span>",
	"<span><b>{Maze</b>.stop()<b>}</b></span>",
	"<span><b>{Maze</b>.hide()<b>}</b></span>",
	"<span><b>{Maze</b>.hurry()<b>}</b></span>",
	"<span><b>{Maze</b>.giveUp()<b>}</b></span>",
	"<span><b>{Maze</b>.check()<b>}</b></span>",
	"<span><b>{Maze</b>.retry()<b>}</b></span>",
	"<span><b>{Maze</b>.easy()<b>}</b></span>",
	"<span><b>{Maze</b>.hard()<b>}</b></span>"
	];

var cadena = Math.floor((Math.random() * cadenas.length));

var data = [
	{
		AboutDevTypeText: cadenas[cadena]
	}
];

var allElements = document.getElementsByClassName("typeing");
for (var j = 0; j < allElements.length; j++) {
	var currentElementId = allElements[j].id;
	var currentElementIdContent = data[0][currentElementId];
	var element = document.getElementById(currentElementId);
	var devTypeText = currentElementIdContent;

	// type code
	var i = 0, isTag, text;
	(function type() {
		text = devTypeText.slice(0, ++i);
		if (text === devTypeText) return;
		element.innerHTML = text + `<span class='blinker'>&#32;</span>`;
		var char = text.slice(-1);
		if (char === "<") isTag = true;
		if (char === ">") isTag = false;
		if (isTag) return type();
		setTimeout(type, 150);
	})();
}