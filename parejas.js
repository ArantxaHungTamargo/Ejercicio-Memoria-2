const cardImages = [
    "./imagenes/Ficha 1.png", "./imagenes/Ficha 2.png", "./imagenes/Ficha 3.png", 
    "./imagenes/Ficha 4.png", "./imagenes/Ficha 5.png", "./imagenes/Ficha 6.png", 
    "./imagenes/Ficha 7.png", "./imagenes/Ficha 8.png", "./imagenes/Ficha 9.png", 
    "./imagenes/Ficha 10.png", "./imagenes/Ficha 11.png", "./imagenes/Ficha 12.png"
];

let cards = [...cardImages, ...cardImages];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1Name = '';
let player2Name = '';

const gameBoard = document.querySelector('.game-board');
const currentTurnDisplay = document.getElementById('current-turn');
const score1Display = document.getElementById('score1');
const score2Display = document.getElementById('score2');
const gameOverDisplay = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

function initGame() {
    askPlayerNames();
    resetGame();
}

function askPlayerNames() {
    player1Name = prompt("Jugador 1:");
    player2Name = prompt("Jugador 2:");
    
    document.getElementById('player1-name').innerHTML = `${player1Name}: <span id="score1">0</span>`;
    document.getElementById('player2-name').innerHTML = `${player2Name}: <span id="score2">0</span>`;
}

function resetGame() {
    cards = shuffle([...cardImages, ...cardImages]);
    gameBoard.innerHTML = '';
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    document.getElementById('score1').textContent = player1Score;
    document.getElementById('score2').textContent = player2Score;
    gameOverDisplay.textContent = '';
    currentTurnDisplay.textContent = `Turno de: ${currentPlayer === 1 ? player1Name : player2Name}`;
    document.getElementById('player1-match').innerHTML='';
    document.getElementById('player2-match').innerHTML='';
    
    cards.forEach((imagePath) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="front" style="background-image: url('${imagePath}');"></div>
            <div class="back"></div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

    if (!this.classList.contains('flip')) {
        this.classList.add('flip');
    }

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkForMatch();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showCorrectImage() {
    const correctImagePath = './imagenes/Correcto.png';

    const matchedImagePath = firstCard.querySelector('.front').style.backgroundImage;

    const matchedImageElement = document.createElement('img');
    matchedImageElement.src = matchedImagePath.slice(5, -2);

    if (currentPlayer === 1) {
        document.getElementById('player1-match').appendChild(matchedImageElement);
    } else {
        document.getElementById('player2-match').appendChild(matchedImageElement);
    }

    firstCard.querySelector('.front').style.backgroundImage = `url('${correctImagePath}')`;
    secondCard.querySelector('.front').style.backgroundImage = `url('${correctImagePath}')`;

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    lockBoard = false;
    resetBoard();
}

function checkForMatch() {
    const firstImage = firstCard.querySelector('.front').style.backgroundImage;
    const secondImage = secondCard.querySelector('.front').style.backgroundImage;

    let isMatch = firstImage === secondImage;

    if (isMatch) {
        showCorrectImage(); 
        updateScore();
    } else {
        setTimeout(unflipCards, 1000);
    }
}

function unflipCards() {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    
    lockBoard = false;
    resetBoard();
    switchPlayer();
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
}

function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    currentTurnDisplay.textContent = `Turno de: ${currentPlayer === 1 ? player1Name : player2Name}`;
}

function updateScore() {
    const score1Display = document.getElementById('score1');
    const score2Display = document.getElementById('score2');
    if (currentPlayer === 1) {
        player1Score++;
        score1Display.innerText = player1Score;
    } else {
        player2Score++;
        score2Display.innerText = player2Score;
    }
    
    console.log(player1Score);
    console.log(player2Score);
    checkGameOver();
    resetBoard();
}

function checkGameOver() {
    const matchedCards = document.querySelectorAll('.matched');
    if (matchedCards.length === cards.length) {
        const winner = player1Score > player2Score ? player1Name : player2Name;
        gameOverDisplay.textContent = `¡Juego Terminado! Ganador: ${winner}`;
        
        setTimeout(() => {
            alert(`¡El ganador es ${winner}!`);
            askPlayerNames(); 
            resetGame(); 
        }, 3000);
    }
}

restartBtn.addEventListener('click', resetGame);

initGame();