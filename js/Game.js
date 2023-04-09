class Game{
	config = new Config();
	cultureQueue = [];

	gameLoop = setInterval(this.looping, 750); // enough time for 4 steps in 3 seconds
	machines = [];
	scrolling = null;
	scrollingPhases = [];
	scrollingLetters = {};
	constructor(){
		for (let i = 0; i < this.config.numOfWordsInQueue; i++){
			this.addToQueue();
		}		
		this.createMachine();
		
	}

	addToQueue(){		
		this.cultureQueue.push(this.config.culture[randNum(0, this.config.culture.length - 1)]);
	}

	changeMachine(id, word){
		if (word == ''){
			word = null;
		}
		this.machines[id].goal = word;
		this.machines[id].req = {};
		this.machines[id].fulfilled = {};
		this.machines[id].letters = [];
		for (let i = 0; i < word.length; i++){
			let char = word[i];
			if (this.machines[id].req[char] == undefined){
				this.machines[id].letters.push(char);
				this.machines[id].fulfilled[char] = 0;
				this.machines[id].req[char] = 1;
				continue;
			}
			this.machines[id].req[char] ++;			
		}
	}

	createMachine(){
		this.machines.push({
			goal: null,
			letters: [],		
			rank: this.machines.length,
			req: {},
			fulfilled: {},
			
		});
		console.log(this.machines);
	}

	fetchNumOfMatches (machineID){
		let machine = this.machines[machineID];
		let n = 0;		
		for (let char in this.scrollingLetters){
			if (machine.req[char] == undefined || machine.req[char] < 1){
				continue;
			}
			if (machine.req[char] > this.scrollingLetters[char]){
				n += this.scrollingLetters[char];
				continue;
			}
			n += machine.req[char];
			
		}		
		return n;
	}

	fetchMatches (machineID){
		let machine = this.machines[machineID];
		let letters = [], n = 0;

		for (let char in this.scrollingLetters){
			if (machine.req[char] == undefined || machine.req[char] < 1){
				continue;
			}
			n = machine.req[char];
			if (machine.req[char] > this.scrollingLetters[char]){
				n = this.scrollingLetters[char];
				
			}
			for (let i = 0; i < n; i++){
				letters.push(char);
			}
			
		}		
		return letters;
	}

	looping (){
		if (game.scrolling == null){
			game.scrollingLetters = [];
			game.scrolling = game.cultureQueue.shift();
			ui.refresh();
			$("#scroll").html(game.scrolling);
			game.addToQueue();
			for (let i = 0; i < game.scrolling.length; i ++){
				let char = game.scrolling[i];
				if (game.scrollingLetters[char] == undefined){
					game.scrollingLetters[char] = 1;
					continue;
				}
				game.scrollingLetters[char]++;
				//game.scrollingLetters.push(game.scrolling[i]);
			}
			for (let id in game.machines){
				let numOfMatches = game.fetchNumOfMatches(id), total = 0;
				let matches = game.fetchMatches(id);
								
				for (let phase = 0; phase < 3; phase ++){
					let increment = Math.round(numOfMatches / 3);
					
					if (phase == 0 && increment < 0){
						increment = 1;
					}
					
					if (total >= numOfMatches){
						continue;						
					}					
					
					game.scrollingPhases[phase] = matches.splice(0, increment);					
					total += increment;
				}
				console.log(game.scrollingPhases);
			}
			
		}

	}

	
}
