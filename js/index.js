$( document ).ready(function() {
	tamanios();
	//$("#panel-settings").fadeOut(1);
});

window.onresize = function(event) {
	tamanios();
};

function tamanios()
{
	$("#history").css("height", innerHeight * (1/4) + "px");
	$(".separador").css("margin-top", innerHeight * (1/20) + "px");
}


var escondido = true;
$("#ajustesBtn").click(function() {
	(escondido) ? $("#panel-settings").slideDown("medium") : $("#panel-settings").slideUp("medium")
	escondido = !escondido
});
