$( document ).ready(function() {
	tamanios();
	$("#panel-settings").fadeOut(1);
});

window.onresize = function(event) {
	tamanios();
};

function tamanios()
{
	$("#history").css("height", innerHeight + "px");
	$(".separador").css("margin-top", innerHeight * (1/20) + "px");
}

var escondidoSetting = true;
$("#ajustesBtn").click(function() {
	(escondidoSetting) ? $("#panel-settings").slideDown("medium") : $("#panel-settings").slideUp("medium")
	escondidoSetting = !escondidoSetting
});

var escondidoConsole = false
$("#consoleBtn").click(function() {
	(escondidoConsole) ? $("#consola").slideDown("fast") : $("#consola").slideUp("fast")
	escondidoConsole = !escondidoConsole;	
});

$("#clearConsole").click(function() {
	$("#history").val('');
});
