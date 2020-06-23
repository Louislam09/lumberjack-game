let bestScore;

function saveScore(score) {
	bestScore = score;
	localStorage.setItem('best_score', JSON.stringify(bestScore));
}

function getScore() {
	let scoreStored = localStorage.getItem('best_score');

	if (scoreStored === null) {
		scoreStored = 0;
	} else {
		scoreStored = JSON.parse(scoreStored);
	}

	return scoreStored;
}
