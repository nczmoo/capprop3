class Game{
	config = new Config();
	cultureCards = [];
	
	constructor(){
		for (let i = 0; i < 3; i++){
			this.cultureCards.push(this.createCultureCard());
		}		
		console.log(this.cultureCards);
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
	
	
}
