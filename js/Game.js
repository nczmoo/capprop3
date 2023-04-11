class Game{
	config = new Config();	
	cultureCards = [];
	development = [];
	developing = {};
	labor = [];
	money = this.config.initMoney;
	products = [];
	constructor(){
		for (let i = 0; i < 3; i++){
			this.cultureCards.push(this.createCultureCard());
		}		
		
		let randSkill = this.config.cultures[randNum(0, this.config.cultures.length - 1)];
		;
		let skills = {};
		skills[randSkill] = 1;
		for (let culture of this.config.cultures){
			if (culture != randSkill){
				skills[culture] = randNum(1, 99) / 100;
			}
		}
		this.labor.push({skills: skills, assignedTo: null, paid: 0, wage: randNum(this.config.minWage, this.config.maxWage)});		
		this.config.loopInterval = setInterval(this.looping, 1000);
	}

	addCulturesToDeveloping(culture, goal){
		if (culture == '' || goal == '' || Object.keys(this.developing).includes(culture)){
			return;
		}
		this.developing[culture] = {goal: goal, work: 0};
		
	}

	assign(developmentID, laborID){
		//no error checking
		if (laborID == 'null'){
			return;
		}		
		this.labor[laborID].assignedTo = developmentID;
		ui.refresh();
	}
	
	createCultureCard(){
		let numOfCultures = randNum (1, this.config.maxNumOfCulturesOnCard);
		let cultures = [];
		let req = [];
		while(1){
			let randCulture = this.config.cultures[randNum(0, this.config.cultures.length - 1)];
			if (!cultures.includes(randCulture)){
				cultures.push(randCulture);
				req.push(randNum(1, this.config.maxReqCulture));
			}
			if (cultures.length >= numOfCultures){
				break;
			}
		}
		return {cultures: cultures, req: req};
		
	}

	fetchAssigned(developmentID){
		let assigned = [];
		for (let id in this.labor){
			if (this.labor[id].assignedTo == developmentID){
				assigned.push(id);
			}
		}
		return assigned;
	}

	finishDevelopment(developmentID){
		let assigned = this.fetchAssigned(developmentID);		
		for (let laborID of assigned){
			this.labor[laborID].assignedTo = null;
		}
		this.products.push(this.development.splice(developmentID, 1)[0])
		ui.refresh();
	}

	fire(laborID){
		this.labor.splice(laborID, 1);
		ui.refresh();
	}

	isDevelopmentDone(developmentID){
		for (let culture in this.development[developmentID]){
			if (culture == 'cost'){
				continue;
			}
			let goal = this.development[developmentID][culture].goal;
			let work = this.development[developmentID][culture].work;
			if (work < goal){
				return false;
			}
		}
		return true;
	}

	looping(){
		
		for (let i in game.labor){
			if (game.money < game.labor[i].wage){
				game.fire(i);
				ui.queue("You didn't have money to pay Labor #" + (Number(i) + 1) + " so you fired them.");
				continue;				
			}
			game.money -= game.labor[i].wage;			
			game.labor[i].paid += game.labor[i].wage;
			$("#paid-" + i).html(game.labor[i].paid);
			if (game.labor[i].assignedTo != null){				
				
				game.development[game.labor[i].assignedTo].cost += game.labor[i].wage;
				$("#developmentCost-" + game.labor[i].assignedTo).html(game.development[game.labor[i].assignedTo].cost)
				game.work(game.labor[i].assignedTo, i);
			}
		}
		$("#money").html(game.money);
		
	}
	
	startDevelopment(){
		this.developing.cost = 0;
		this.development.push( this.developing);
		this.developing = {};
		console.log(this.development, this.developing);
	}

	work(developmentID, laborID){
		let development = this.development[developmentID];
		let labor = this.labor[laborID];
		for (let culture in development){
			if (culture == 'cost'){
				continue;
			}
			let goal = development[culture].goal;
			let work = development[culture].work;
			if (work >= goal){
				continue;
			}
			this.development[developmentID][culture].work += (labor.skills[culture] * 10); //* .01);			
			$("#workProgress-" + developmentID + "-" + culture)
				.css('width', Math.round(this.development[developmentID][culture].work 
					/ this.development[developmentID][culture].goal * 100));
			if (this.development[developmentID][culture].work 
				>= this.development[developmentID][culture].goal && this.isDevelopmentDone(developmentID)){
				this.finishDevelopment(developmentID);
			}
		}
	}
}
