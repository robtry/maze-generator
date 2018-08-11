class MazeController {
	constructor() {
		//
	}
	permitPass() {
		historial.value(historial.value() + "true\n");
	}
	denyPass() {
		historial.value(historial.value() + "false\n");
	}
}