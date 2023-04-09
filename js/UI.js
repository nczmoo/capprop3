class UI{

	animatingLoop = setInterval(this.animating, 10);


	
	constructor(){

	}
	refresh(){
		let txt = '';
		for (let i in game.cultureQueue){
			let word = game.cultureQueue[i];
			txt += "<div>" + word + "</div>";
		}
		$("#culture").html(txt);
		this.showMachines();
	}

	animating(){
		if (game.scrolling == null){
			$("#scroll").css('left', 0);
		}
		let posDelta = screen.width / 300; // 3 seconds to completely scroll
		let leftPos = Number($("#scroll").css('left').substring(0, $("#scroll").css('left').length-2));
		$("#scroll").css('left', (leftPos + posDelta) + "px");
		if (leftPos > screen.width){
			game.scrolling = null;
			$("#scroll").html('');
		}
	}

	displayMachineReq(id){
		let txt = " [ ";
		let word = game.machines[id].goal;
		let fulfillment = game.machines[id].fulfilled;
		
		if (word == null){
			return " [ ] ";
		}
		for (let i = 0; i < game.machines[id].goal.length; i ++){			
			let char = game.machines[id].goal[i];
			if (fulfillment[char] != undefined && fulfillment[char] > 0){
				char = "<span class='fw-bold'>" + char + "</span>";
				fulfillment --;
			}
			txt += char;
		}
		return txt + " ]";
	}

	fetchBusinessOptions(id){
		let txt = "<select id='machine-" + id + "' class='machine'>"
			+ "<option></option>";
		for (let word of game.config.business){
			let selected = '';
			if (game.machines[id].goal == word){
				selected = " selected ";
			}
			txt += "<option " + selected + ">" + word + "</option>";
		}
		txt += "</select>"

		return txt;
	}

	showMachines(){
		let txt = '';
		for (let id in game.machines){
			let machine = game.machines[id];
			txt += "<div>" 			
				+ this.fetchBusinessOptions(id)
				+ this.displayMachineReq(id)
				+ "</div>"
		}
		$("#machines").html(txt);
	}
}
