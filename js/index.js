$( document ).ready(function() {
	tamanios();
});

window.onresize = function(event) {
	tamanios();
};

function tamanios()
{
	$("#history").css("height", innerHeight * (1/4) + "px");
	$(".separador").css("margin-top", innerHeight * (1/20) + "px");
}