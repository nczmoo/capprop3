class UI{	
	constructor(){

	}
	refresh(){
		this.printCultureCards();
	}

	printCard(id){
		let txt = '';
		for (let i in game.cultureCards[id].cultures){
			txt += "<div class='text-center'>" 
				+ game.cultureCards[id].cultures[i] + ": " 
				+ game.cultureCards[id].req[i] 
				+ "</div>";
		}
		return txt;
	}

	printCultureCards(){
		let txt = '';
		for (let id in game.cultureCards){
			txt += "<div class='card col'><div class='card-body'>";
			txt += this.printCard(id);
			txt += "</div></div>";
		}
		$("#culture").html(txt);
	}
}
