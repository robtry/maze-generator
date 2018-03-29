class MazeController {
	permitPass() {
		let aux = historial.value().split("\n");
		let pos = aux.length;
		let aux2 = [];
		let quee = "";
		let cont;
		//console.log(aux);
		if(aux[pos-2] == undefined){
			historial.value(historial.value() + "true\n");
		} else {
			if(aux[pos-2].startsWith("true")){
				for(let i = 0; i < pos; i++){
					if(i == (pos-2)) { 
						aux2 = aux[i].split("x");
						if(aux2.length > 1){
							cont = aux2[1];
							cont++;
							quee += "true x"+cont+"\n"
						}else{
							quee += "true x2\n";
						}
					} else if(aux[i] != ""){ quee += (aux[i] + "\n"); }					
				}
				historial.value(quee);
			} else {
				historial.value(historial.value() + "true\n");
			}
		}
	}
	denyPass() {
		let aux = historial.value().split("\n");
		let pos = aux.length;
		let aux2 = [];
		let quee = "";
		let cont;
		//console.log(aux);
		if(aux[pos-2] == undefined){
			historial.value(historial.value() + "false\n");
		} else {
			if(aux[pos-2].startsWith("false")){
				for(let i = 0; i < pos; i++){
					if(i == (pos-2)) { 
						aux2 = aux[i].split("x");
						if(aux2.length > 1){
							cont = aux2[1];
							cont++;
							quee += "false x"+cont+"\n"
						}else{
							quee += "false x2\n";
						}
					} else if(aux[i] != ""){ quee += (aux[i] + "\n"); }					
				}
				historial.value(quee);
			} else {
				historial.value(historial.value() + "false\n");
			}
		}
	}
}