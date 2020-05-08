let canvas = document.querySelector('.my_canvas');
let c = canvas.getContext('2d');

let cw = (canvas.width = 500);
let ch = (canvas.height = 550);

let axeSound = new Audio('sound/axe.mp3');
let hachaSound = new Audio('sound/hacha.mp3');
let hitSound = new Audio('sound/hit.mp3');
let dizzySound = new Audio('sound/dizzy.mp3');

let itemContainer = document.querySelector('.item-container');
let timeContainer = document.querySelector('.time-container');
let resultContainer = document.querySelector('.result-container');

let leftButton = document.querySelector('.left-button');
let rightButton = document.querySelector('.right-button');
let restartButton = document.querySelector('.restart-button');

let scoreDiv = document.querySelector('.score');
let bestScoreDiv = document.querySelector('.best-score');
let timeValueDiv = document.querySelector('.time-value');
let levelDiv = document.querySelector('.level');
let resultDiv = document.querySelector('.result');

let branchDir = [ 'branch-left', 'branch-right' ];
let imgShadow = [ 'url(img/truck1.png)', 'url(img/truck2.png)' ];

let trucks = [];
let character;

let loseState = false;

let timeValue = 50;
let score = 0;
let level = 1;
let bestscore;

let plusTime = 5;
let minusTime = 1;

window.addEventListener('load', () => {
	bestScore = getScore();
	bestScoreDiv.innerText = `Best score: ${bestScore}🌳`;
});

function Character() {
	this.div = document.createElement('div');
	this.div.className = 'character';
	itemContainer.append(this.div);

	this.cutLeft = () => {
		// this move the character to left side
		if (this.div.classList.contains('right-side')) this.div.classList.remove('right-side');
		this.div.classList.add('left-side');

		// this allow the character move th axe
		this.div.classList.add('cut-left-side');
		this.div.addEventListener('animationend', () => this.div.classList.remove('cut-left-side'));

		// sound
		hachaSound.currentTime = 0;
		hachaSound.volume = 0.5;
		hachaSound.play();
	};

	this.cutRight = () => {
		// this move the character to right side
		if (this.div.classList.contains('left-side')) this.div.classList.remove('left-side');
		this.div.classList.add('right-side');

		// this allow the character move th axe
		this.div.classList.add('cut-right-side');
		this.div.addEventListener('animationend', () => this.div.classList.remove('cut-right-side'));

		// sound
		hachaSound.currentTime = 0;
		hachaSound.volume = 0.5;
		hachaSound.play();
	};
}

function Truck(className) {
	let randomImg = imgShadow[Math.floor(Math.random() * imgShadow.length)];
	let potluck = Math.floor(Math.random() * 1.5);
	this.className = className;

	this.div = document.createElement('div');
	this.div.classList.add(this.className);
	this.div.style.background = randomImg;

	var newBranch = new Branch('branch');

	if (potluck === 0) {
		this.div.append(newBranch.div);
	}

	itemContainer.append(this.div);

	this.dropLeft = () => {
		this.div.classList.add('drop-truck-left');
		this.div.addEventListener('animationend', () => {
			this.div.classList.remove('drop-truck-left');
		});

		drawScore();

		if (timeValue < 90) timeValue += plusTime;

		this.goDown();
	};

	this.dropRight = () => {
		this.div.classList.add('drop-truck-right');
		this.div.addEventListener('animationend', () => {
			this.div.classList.remove('drop-truck-right');
		});

		drawScore();

		if (timeValue < 90) timeValue += plusTime;

		this.goDown();
	};

	this.goDown = () => {
		if (this.div.classList.contains('truck')) {
			trucks.forEach((el, index) => {
				if (el.div.className === 'truck1') {
					el.div.className = 'truck';
					el.div.style.top = '10%';
				}
				if (el.div.className === 'truck2') {
					el.div.className = 'truck1';
					el.div.style.top = '-48%';
				}
			});
		}
	};
}

function Branch(className) {
	this.className = className;

	let branchSide = branchDir[Math.floor(Math.random() * branchDir.length)];

	this.div = document.createElement('div');
	this.div.className = this.className;
	this.div.classList.add(branchSide);
}

function drawScore() {
	score++;

	if (score % 20 === 0) {
		level++;
		minusTime += 0.5;
		plusTime++;

		levelDiv.innerText = `Level ${level}`;
		levelDiv.style.visibility = 'visible';

		setTimeout(() => (levelDiv.style.visibility = 'hidden'), 3000);
	}

	scoreDiv.innerText = `${score}`;
}

function gameStart() {
	resultContainer.style.visibility = 'hidden';
	itemContainer.style.visibility = 'visible';
	timeContainer.style.visibility = 'visible';

	loseState = false;
	timeValue = 50;
	score = 0;
	level = 1;

	plusTime = 5;
	minusTime = 1;

	character = new Character();

	trucks.push(new Truck('truck'));
	trucks.push(new Truck('truck1'));
	trucks.push(new Truck('truck2'));

	scoreDiv.innerText = `${score}`;
	eventHaddler();
}

function gameOver(branch) {
	try {
		if (branch.div.lastElementChild !== null) {
			if (
				character.div.classList.contains('left-side') &&
				branch.div.lastElementChild.classList.contains('branch-left')
			) {
				loseState = true;
				character.div.classList.replace('character', 'character-shocked');
				character.div.classList.replace('left-side', 'character-fall-left');

				hitSound.play();
				dizzySound.play();

				character.div.addEventListener('animationend', () => {
					setTimeout(() => {
						itemContainer.style.visibility = 'hidden';
						timeContainer.style.visibility = 'hidden';
						resultContainer.style.visibility = 'visible';

						if (bestScore < score) saveScore(score);

						resultDiv.innerHTML = `You scored: <span style="padding: 10px 100px;">${score}🌳</span> </br></br>
						<span style="padding: 0px 10px; color:green;"> You best score:</span> <span style="padding: 0px 10px;"> ${getScore()}🌳</span>`;
					}, 1500);
				});
			}
		}

		if (branch.div.lastElementChild !== null) {
			if (
				character.div.classList.contains('right-side') &&
				branch.div.lastElementChild.classList.contains('branch-right')
			) {
				loseState = true;
				character.div.classList.replace('character', 'character-shocked');
				character.div.classList.replace('right-side', 'character-fall-right');

				hitSound.play();
				dizzySound.play();

				character.div.addEventListener('animationend', () => {
					setTimeout(() => {
						itemContainer.style.visibility = 'hidden';
						timeContainer.style.visibility = 'hidden';
						resultContainer.style.visibility = 'visible';

						if (bestScore < score) saveScore(score);

						resultDiv.innerHTML = `You scored: <span style="padding: 10px 100px;">${score}🌳</span> </br></br>
						<span style="padding: 0px 10px; color:green; "> You best score:</span> <span style="padding: 0px 10px;"> ${getScore()}🌳</span>`;
					}, 1500);
				});
			}
		}
	} catch (e) {
		console.log(e);
	}
}

function restartGame() {
	window.location.reload();
	// gameStart();
}

function timeLoad() {
	setInterval(() => {
		if (!loseState) {
			timeValue -= minusTime;

			if (timeValue < 30) timeValueDiv.style.backgroundColor = 'red';
			if (timeValue > 30) timeValueDiv.style.backgroundColor = 'green';

			timeValueDiv.style.width = `${timeValue}%`;

			if (timeValue < 0) timeOut();
		}
	}, 200);
}

function timeOut() {
	if (character.div.classList.contains('left-side')) {
		loseState = true;
		character.div.classList.replace('character', 'character-shocked');
		character.div.classList.replace('left-side', 'character-fall-left');

		hitSound.play();
		dizzySound.play();
		character.div.addEventListener('animationend', () => {
			setTimeout(() => {
				itemContainer.style.visibility = 'hidden';
				timeContainer.style.visibility = 'hidden';
				resultContainer.style.visibility = 'visible';

				resultDiv.innerHTML = `You scored: <span style="padding: 10px 100px;">${score}🌳</span>`;
			}, 1500);
		});
	}

	if (character.div.classList.contains('right-side')) {
		loseState = true;
		character.div.classList.replace('character', 'character-shocked');
		character.div.classList.replace('right-side', 'character-fall-right');

		hitSound.play();
		dizzySound.play();

		character.div.addEventListener('animationend', () => {
			setTimeout(() => {
				itemContainer.style.visibility = 'hidden';
				timeContainer.style.visibility = 'hidden';
				resultContainer.style.visibility = 'visible';

				resultDiv.innerHTML = `You scored: <span style="padding: 10px 100px;">${score}🌳</span>`;
			}, 1500);
		});
	}
}

function eventHaddler() {
	document.addEventListener('keydown', (e) => {
		if (e.keyCode === 37) {
			character.cutLeft();

			trucks.forEach((tr, index) => {
				if (index === 0) {
					gameOver(tr);

					if (!loseState) {
						tr.dropLeft();

						trucks[index].div.addEventListener('animationend', () => {
							trucks[index].div.classList.remove('drop-truck-left');
							trucks[index].div.remove();
							trucks.splice(index, 1);
						});

						trucks.push(new Truck('truck2'));
					}
				}
			});
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.keyCode === 39) {
			character.cutRight();

			trucks.forEach((tr, index) => {
				if (index === 0) {
					gameOver(tr);

					if (!loseState) {
						tr.dropRight();

						trucks[index].div.addEventListener('animationend', () => {
							trucks[0].div.classList.remove('drop-truck-right');
							trucks[0].div.remove();
							trucks.splice(index, 1);
						});

						trucks.push(new Truck('truck2'));
					}
				}
			});
		}
	});

	leftButton.addEventListener('click', () => {
		character.cutLeft();

		trucks.forEach((tr, index) => {
			if (index === 0) {
				gameOver(tr);

				if (!loseState) {
					tr.dropLeft();

					trucks[index].div.addEventListener('animationend', () => {
						trucks[index].div.classList.remove('drop-truck-left');
						trucks[index].div.remove();
						trucks.splice(index, 1);
					});

					trucks.push(new Truck('truck2'));
				}
			}
		});
	});

	rightButton.addEventListener('click', () => {
		character.cutRight();

		trucks.forEach((tr, index) => {
			if (index === 0) {
				gameOver(tr);

				if (!loseState) {
					tr.dropRight();

					trucks[index].div.addEventListener('animationend', () => {
						trucks[0].div.classList.remove('drop-truck-right');
						trucks[0].div.remove();
						trucks.splice(index, 1);
					});

					trucks.push(new Truck('truck2'));
				}
			}
		});
	});

	restartButton.addEventListener('click', restartGame);

	window.addEventListener(
		'keydown',
		(e) => {
			if (e.keyCode === 37 || e.keyCode === 39) {
				timeLoad();

				console.log('once');
			}
		},
		{ once: true }
	);

	rightButton.addEventListener(
		'click',
		() => {
			timeLoad();

			console.log('once');
		},
		{ once: true }
	);
	leftButton.addEventListener(
		'click',
		() => {
			timeLoad();

			console.log('once');
		},
		{ once: true }
	);
}

gameStart();
