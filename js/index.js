$( document ).ready(function() {
	tamanios();
	//$("#panel-settings").fadeOut(1);
	togglePositionMaze(true);
	toggleSizeMaze(true);
	$('#sizeCheck').prop('checked', true);
	$('#posCheck').prop('checked', true);
	
});

window.onresize = function(event) {
	tamanios();
};

//separador de los controles en el panel
function tamanios()
{
	$("#history").css("height", innerHeight + "px");
	if(innerHeight <= 606)
		$(".separador").css("margin-top", innerHeight * (1/50) + "px");
	else
		$(".separador").css("margin-top", innerHeight * (1/35) + "px");
}

//habilitrar y deshabilitar controles para cambiar tamaño
function toggleSizeMaze(status) {
	$('#largoM').prop('disabled', status);
	$('#altoM').prop('disabled', status);
	$('#sizeBtn').prop('disabled', status);
	$('#largoM').val('');
	$('#altoM').val('');
}

//habilitar y deshabilitar controles para escribir una poscisión
function togglePositionMaze(status) {
	$("#inicioC").val('');
	$("#finC").val('');
	$('#inicioC').prop('disabled', status);
	$('#finC').prop('disabled', status);
	$('#posBtn').prop('disabled', status);
}

$("#ajustesBtn").click(function() {
	$("#panel-settings").slideDown("medium");
});

$("#subir").click(function () {
	 $("#panel-settings").slideUp("medium");
});

var escondidoConsole = false
$("#consoleBtn").click(function() {
	(escondidoConsole) ? $("#consola").slideDown("fast") : $("#consola").slideUp("fast")
	escondidoConsole = !escondidoConsole;	
});

$("#clearConsole").click(function() {
	$("#history").val('');
});

$('#posCheck').change(function(){
	(this.checked) ? togglePositionMaze(true) : togglePositionMaze(false)
});

$('#sizeCheck').change(function(){
	(this.checked) ? toggleSizeMaze(true) : toggleSizeMaze(false)
});

$('#dropzone').on('dragenter', function() {
	$(this).css({'background-color' : 'rgba(255,255,255,0.1)'});
});

$('#dropzone').on('dragleave', function() {
	$(this).css({'background-color' : 'transparent'});
});