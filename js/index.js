$( document ).ready(function() {
	tamanios();
});

window.onresize = function(event) {
	tamanios();
};

function tamanios()
{
	$("#history").css("height", innerHeight * (1/3) + "px");
}