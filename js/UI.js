class UI{	
	statusQueue = '';
	constructor(){

	}
	refresh(){
		$("#money").html("$" + game.money.toLocaleString());
		console.log('refresh');
		this.printCultureCards();
		this.printLabor();
		this.populateDev();
		this.printDevelopment();
		this.printProducts();
	}

	populateDev(){
		let txt = '<option></option>';
		for (let culture of game.config.cultures){
			txt += "<option>" + culture + "</option>"
		}
		$("#devCulture").html(txt);

		txt = '';
		for (let i = 1; i <= game.config.maxReqCulture; i++ ){
			txt += "<option>" +  i + "</option>";
		}
		$("#devGoal").html(txt);
		$("#developing").html('');
		txt = "<div class='ms-3'>Current Project:</div>";
		let n = 0;
		for (let culture in game.developing){
			txt += "<div class='ms-4'>" + culture  + ": " + game.developing[culture].goal + "</div>";
			n++;
		}
		txt += "<div class='ms-5'>" 
			+ "<button id='devStart'>start production</button>"
			+ "</div>";
		if (n > 0){
			$("#developing").html(txt);
		}
	}

	printAssigned(developmentID){
		let assigned = game.fetchAssigned(developmentID);
		let txt = 'Assigned to: ';
		if (assigned.length < 1){
			return '';
		}
		for (let laborID of assigned){
			txt += " Labor #" + (Number(laborID) + 1) + ", ";
		}
		return txt;
	}

	printCard(id){
		let txt = "<div class='text-center mb-3'>$" + game.cultureCards[id].pay.toLocaleString() + "</div>";
		for (let i in game.cultureCards[id].cultures){
			txt += "<div class='text-center'>" 
				+ game.cultureCards[id].cultures[i] + ": " 
				+ game.cultureCards[id].req[i] 
				+ "</div>";
		}
		if (game.products.length > 0){
			txt += "<div class='text-center'>Assign: <select id='assignCultureProduct-" + id + "' "
				+ " class='assignCultureProduct'>"
				+ this.printProductOptions()
				+ "</select></div>"
		}
		txt += "<div id='cultureExp-" + id + "' class='text-center mt-3'>" 
			+ ui.printExp(game.cultureCards[id].exp) + "</div>";
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

	printDevelopment(){
		let txt = "<div class='col card'>";
		for (let i in game.development){
			txt += "<div>Project #" + (Number(i) + 1 )+ "</div>"
				+ "<div class='ms-3'>Cost: $<span id='developmentCost-" + i + "'>" 
				+ game.development[i].cost.toLocaleString() 
				+ "</span></div>"
				+ "<div class='ms-3'>"
				+ " Assign: <select id='devAssign-" + i + "' class='devAssign'>"
				+ this.printLaborOptions()
				+ "</select>"
				+ "</div>";
			txt += "<div class='ms-4'>"
				+ this.printAssigned(i)
				+ "</div>";
			for (let culture in game.development[i]){
				let goal = game.development[i][culture].goal;
				let work = game.development[i][culture].work;			
				let cent = goal / work * 100;
				if (culture == 'cost'){
					continue;
				}
				txt += "<div class='ms-3'>" + culture + ': ' + goal + "</div>"
					
				txt += "<div class='progress' role='progressbar' "
					+ "aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>"
					+ "<div id='workProgress-" + i + "-" + culture
					+ "' class='progress-bar' style='width: " + cent + "%'></div>"
			  		+ "</div>";					
			}
		}
		txt += "</div>";
		$("#development").html(txt);
	}

	printExp(exp){
		let seconds = Math.round((exp - Date.now()) / 1000);
		return  seconds + "s";
	}

	printLabor(){		
		let txt = '';
		for (let i in game.labor){
			txt += "<div>";

			txt += "<div>"
				+ "<span class='fw-bold'>Labor #" + (Number(i) + 1) + "</span>"
				+ " $" + game.labor[i].wage.toLocaleString() + " / s"				
				+ "</div>";
			txt += "<div class='ms-3'>Paid: <span id='paid-" + i + "'>$" 
				+ game.labor[i].paid.toLocaleString()
				+ "</span></div>"
			if (game.labor[i].assignedTo != null){
				txt += "<div class='ms-3'>Assigned To: Project #" 
					+ (Number(game.labor[i].assignedTo) + 1) +"</div>";
			}
			txt += this.printSkills(i);
			txt += "</div>";
		}
		$("#labor").html(txt);
	}

	printLaborOptions(){
		let txt = "<option value='null'></option>";
		for (let i in game.labor){
			if (game.labor[i].assignedTo != null){
				continue;
			}
			txt += "<option value='" + i + "'> Labor #" 
				+ (Number(i) + 1) + "</option>";
		}
		return txt;
	}

	printProductOptions(){
		let txt = "<option></option>";
		for (let i in game.products){
			txt += "<option value='" + i + "'>Product #" 
				+ (Number(i) + 1) + "</option>"			
		}
		return txt;
	}

	printProducts(){
		let txt = "<div class='fw-bold'>Products</div>";
		for (let productID in game.products){
			let product = game.products[productID];
			txt += "<div class='ms-3'>Cost: $" 
				+ product.cost.toLocaleString() 
				+ "</div>"
				+ "<div class='ms-3'>Assigned to: ";
				let assignment = " none";
				if (product.assignedTo != null){
					assignment =  " Culture #" + (Number(product.assignedTo) + 1);
				}
				txt += assignment + "</div>";
			
			for (let culture in product){
				if (culture == 'cost' || culture == "assignedTo"){
					continue;
				}
				let goal = product[culture].goal;
				txt += "<div class='ms-3'>" + culture + ": " + goal + "</div>";
			}
		}
		console.log(txt);
		$("#products").html(txt);
	}

	printSkills(laborID){
		let txt = "<div class='ms-3'>Skills</div>";
		for (let name in game.labor[laborID].skills){
			let rank  = game.labor[laborID].skills[name];
			txt += "<div class='ms-4'>" + name + ": " + rank + "</div>";
		}
		return txt;
	}

	queue(msg){
		this.statusQueue += msg;
	}

	status(){
		if (this.statusQueue.length < 1){
			$("#status").html(this.statusQueue);
		}
	}
}
