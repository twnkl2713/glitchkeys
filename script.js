const sentenceElement = document.getElementById("sentence");
const userInput = document.getElementById("user-input");
const restartButton = document.getElementById("restart");
const timeElement = document.getElementById("time");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const roundNumberElement = document.getElementById("round-number");
const aiCommentElement = document.getElementById("ai-comment");

let sentences = [
    "AI is transforming the world.",
    "Neural networks are inspired by the human brain.",
    "ML models improve with data.",
    "DL requires large amounts of data.",
    "AI can recognize patterns and make predictions.",
    "Robotics and AI are revolutionizing industries.",
    "Technology is evolving at an unprecedented rate.",
    "Automation increases efficiency in various fields."
];

let timeLeft = 30;
let score = 0;
let highScore = 0;
let round = 1;
let sabotageInterval;
let gameActive = false;
let countdownInterval;


const fakeCorrections = {
    "technology": "tecnology",
    "intelligence": "inteligence",
    "machine": "mashine",
    "learning": "lurning",
    "artificial": "artifical",
    "automation": "automashion"
};

const aiTrashTalk = {
    early: [
        "Oh, this is gonna be fun! 😈",
        "Let’s see how long you last...",
        "I’ll go easy on you... for now. 🤖"
    ],
    mid: [
        "Oh? You’re actually trying?",
        "Not bad… but I’m just warming up! 😏",
        "Your fingers look tired. Want me to slow down?"
    ],
    late: [
        "Okay, I’m actually impressed. 😳",
        "Alright, I admit—you're persistent.",
        "How are you still going?!"
    ],
    fail: [
        "Hah! I knew you'd fail. Try again? 😂",
        "Game over, human. Better luck next time. 🤖",
        "Aww, did the big bad AI beat you?"
    ]
};

function startGame() {
    round = 1;
    score = 0;
    timeLeft = 40;
    gameActive = true;
    updateUI();
    startRound();
    showAIComment(aiTrashTalk.early);
}

function startRound() {
    if (!gameActive) return;

    timeLeft = 30; 
    roundNumberElement.innerText = `🏁 Round ${round}`;
    sentenceElement.innerText = sentences[Math.floor(Math.random() * sentences.length)];
    userInput.value = "";
    updateUI();

    clearInterval(sabotageInterval);
    let sabotageFrequency = Math.max(4000 - round * 500, 1000); 
    sabotageInterval = setInterval(sabotagePlayer, sabotageFrequency);

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(countdownInterval);
            return;
        }
        timeLeft--;
        updateUI();

        if (timeLeft <= 0) {
            gameOver();
            clearInterval(countdownInterval);
        }
    }, 1000);

    if (round === 3) showAIComment(aiTrashTalk.mid);
    if (round === 6) showAIComment(aiTrashTalk.late);
}

userInput.addEventListener("input", () => {
    if (userInput.value.trim() === sentenceElement.innerText.trim()) {
        score += 10;
        round++;
        startRound(); 
    }
});

function sabotagePlayer() {
    if (!gameActive) return;

    let sabotageType = Math.floor(Math.random() * 4);

    switch (sabotageType) {
        case 0: //last word reverse
            let words = userInput.value.split(" ");
            if (words.length > 1) {
                let lastWord = words.pop().split("").reverse().join("");
                words.push(lastWord);
                userInput.value = words.join(" ");
            }
            break;
        case 1: //random character insertion
            userInput.value += String.fromCharCode(33 + Math.random() * 20);
            break;
        case 2: //input freeze
            userInput.disabled = true;
            setTimeout(() => {
                userInput.disabled = false;
            }, 1000);
            break;
        case 3: //fake auto correct
            let wordsArr = userInput.value.split(" ");
            for (let i = 0; i < wordsArr.length; i++) {
                if (fakeCorrections[wordsArr[i]]) {
                    wordsArr[i] = fakeCorrections[wordsArr[i]];
                }
            }
            userInput.value = wordsArr.join(" ");
            break;
    }
}

function showAIComment(messages) {
    let randomMessage = messages[Math.floor(Math.random() * messages.length)];
    aiCommentElement.innerText = randomMessage;
}

function updateUI() {
    timeElement.innerText = timeLeft;
    scoreElement.innerText = score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.innerText = highScore;
    }
}

//khatam tata bye bye
function gameOver() {
    gameActive = false;
    clearInterval(countdownInterval);
    clearInterval(sabotageInterval);
    showAIComment(aiTrashTalk.fail);
    alert(`Game Over! Your final score: ${highScore}`);
}

restartButton.addEventListener("click", () => {
    gameActive = true;
    startGame();
});

startGame();
