const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');
const bgMusic = document.getElementById('bg-music');

const characters = [
  'bolo',
  'biscoito',
  'kirb',
  'pizza',
  'samurai',
  'panqueca',
  'sundae',
  'hamburguer',
  'sushi',
  'pipoca',
  'milka',
  'pringles',
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let firstCard = '';
let secondCard = '';

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');
  if (disabledCards.length === 24) {
    clearInterval(this.loop);

    // Parar música ao final do jogo
    bgMusic.pause();
    bgMusic.currentTime = 0;

    const totalSeconds = parseInt(timer.innerHTML);

    if (!isNaN(totalSeconds)) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      alert(`Parabéns, ${spanPlayer.innerHTML}! Seu tempo foi de: ${formattedTime}`);
        location.reload();

      // Salvar ranking
      const history = JSON.parse(localStorage.getItem('ranking')) || [];
      history.push({
        player: spanPlayer.innerHTML,
        time: formattedTime
      });
      localStorage.setItem('ranking', JSON.stringify(history));
    } else {
      alert(`Parabéns, ${spanPlayer.innerHTML}! (tempo não pôde ser lido)`);
    }
  }
}

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.querySelector('.front').classList.add('disabled-card');
    secondCard.querySelector('.front').classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');
      firstCard = '';
      secondCard = '';
    }, 500);
  }
}

const revealCard = ({ target }) => {
  if (target.parentNode.className.includes('reveal-card')) return;

  if (firstCard === '') {
    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;
  } else if (secondCard === '') {
    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;
    checkCards();
  }
}

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.jfif')`;

  card.appendChild(front);
  card.appendChild(back);
  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
}

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];
  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
}

const startTimer = () => {
  this.loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
}

// ✅ Evento único para carregar o jogo e iniciar a música
window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  startTimer();
  loadGame();

  bgMusic.muted = false;
  bgMusic.play();
}
