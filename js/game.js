const canvas = document.getElementById("gameCanvas");
const input = document.getElementById("textInput");
const restartBtn = document.getElementById("restartBtn");
const score = document.getElementById("score");
const ctx = canvas.getContext("2d");

import { words } from "./words.js";

let gameOver = false;

const wordsOnDisplay = [];

const wordInterval = setInterval(getRandomWord, 1000);

function getRandomWord() {
	if (gameOver) return;

	if (wordsOnDisplay.length >= 15) {
		endGame();
		return;
	}

	const index = Math.floor(Math.random() * words.length);
	const newWord = words[index];
	const textWidth = ctx.measureText(newWord).width;
	const textHeight = 30;

	const x = Math.random() * (canvas.width - textWidth);
	const y = Math.random() * (canvas.height - textHeight) + textHeight;

	wordsOnDisplay.push({ text: newWord, x, y });
	displayWords();
}

function displayWords() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	for (const word of wordsOnDisplay) {
		ctx.fillText(word.text, word.x, word.y);
	}
}

function checkWord(typedWord) {
	if (gameOver) return;

	const index = wordsOnDisplay.findIndex(
		(w) => w.text.toLowerCase() === typedWord
	);
	if (index !== -1) {
		wordsOnDisplay.splice(index, 1);
	}
	displayWords();
	input.value = "";
}

input.addEventListener("keyup", (e) => {
	if (e.key == "Enter") {
		const typedWord = input.value.toLowerCase().trim();
		checkWord(typedWord);
	}
});

function endGame() {
	gameOver = true;
	clearInterval(wordInterval);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "60px Arial";
	ctx.fillText("Koniec gry", 300, 160);
	input.value = "";
}
