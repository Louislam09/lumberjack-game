let bestScore;

function saveScore(score) {
	bestScore = score;
	localStorage.setItem('bestScore', JSON.stringify(bestScore));
}

function getScore() {
	let scoreStored = localStorage.getItem('bestScore');

	if (scoreStored === null) {
		scoreStored = 0;
	} else {
		scoreStored = JSON.parse(scoreStored);
	}

	return scoreStored;
}
