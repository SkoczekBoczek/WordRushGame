const mode = document.querySelector(".mode");
const randomBtn = document.querySelector("#randomMode");
const rushBtn = document.querySelector("#rushBtn");
const startBtn = document.querySelector(".startGame");

const canvas = document.getElementById("gameCanvas");
const input = document.getElementById("textInput");
const restartBtn = document.getElementById("restartBtn");
const score = document.getElementById("score");
const ctx = canvas.getContext("2d");

import { words } from "./words.js";

let gameOver = false;
let currentMode = "chaos";
let wordInterval = null;

const wordsOnDisplay = [];

function getRandomWord() {
	if (gameOver) return;

	if (currentMode === "chaos" && wordsOnDisplay.length >= 4) {
		endGame();
		return;
	}

	const index = Math.floor(Math.random() * words.length);
	const newWord = words[index];
	const textWidth = ctx.measureText(newWord).width;
	const textHeight = 30;

	const y = Math.random() * (canvas.height - textHeight) + textHeight;

	if (currentMode == "chaos") {
		const x = Math.random() * (canvas.width - textWidth);
		wordsOnDisplay.push({ text: newWord, x, y });
	} else if (currentMode == "rush") {
		const x = 0;
		const speed = 2;
		wordsOnDisplay.push({ text: newWord, x, y, speed });
	}
}

function displayWords() {
	if (gameOver) return;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	for (const word of wordsOnDisplay) {
		ctx.fillText(word.text, word.x, word.y);

		if (currentMode == "rush") {
			word.x += word.speed;

			if (word.x >= canvas.width) {
				endGame();
				return;
			}
		}
	}
	if (!gameOver) {
		requestAnimationFrame(displayWords);
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
	input.value = "";
}

function startGame() {
	wordsOnDisplay.length = 0;
	gameOver = false;
	requestAnimationFrame(displayWords);

	if (currentMode == "chaos") {
		wordInterval = setInterval(getRandomWord, 2000);
	} else if (currentMode == "rush") {
		wordInterval = setInterval(getRandomWord, 2000);
	}
}

function endGame() {
	gameOver = true;
	clearInterval(wordInterval);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.font = "60px Arial";
	ctx.fillText("Koniec gry", 300, 160);
	input.value = "";
}

function countdown() {
	let counter = 4;
	ctx.font = "60px Arial";
	ctx.fillStyle = "white";

	const interval = setInterval(() => {
		counter--;
		if (counter > 0) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillText(counter, 420, 160);
		} else {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			clearInterval(interval);
			ctx.fillText("Start!", 370, 160);
			startGame();
		}
	}, 1000);
}

input.addEventListener("keyup", (e) => {
	if (e.key == "Enter") {
		const typedWord = input.value.toLowerCase().trim();
		checkWord(typedWord);
	}
});

randomBtn.addEventListener("click", () => {
	if (!gameOver) return;
	currentMode = "chaos";
	mode.textContent = "Chaos Mode";
});

rushBtn.addEventListener("click", () => {
	if (!gameOver) return;
	currentMode = "rush";
	mode.textContent = "Rush Mode";
});

startBtn.addEventListener("click", countdown);