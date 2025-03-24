let score = 0;
let countries = [];
let currentCountry = null;
let correctFlags = []; // Armazenar as bandeiras corretas
let displayedFlags = []; // Armazenar as bandeiras já exibidas para não repetir

document.addEventListener("DOMContentLoaded", () => {
  startGame();
});

// Função para iniciar o jogo
function startGame() {
  score = 0;
  document.getElementById('score').textContent = `Pontuação: ${score}`;
  correctFlags = []; // Limpa as bandeiras corretas ao reiniciar
  displayedFlags = []; // Limpa as bandeiras já exibidas
  document.getElementById('BandeirasCertas').innerHTML = ''; // Limpa as bandeiras na tela
  fetchCountries();
}

// Função para buscar dados dos países
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    countries = await response.json();
    nextQuestion();
  } catch (error) {
    console.error("Erro ao carregar os dados dos países:", error);
  }
}

// Função para mostrar a próxima bandeira
function nextQuestion() {
  // Escolher um país aleatório que ainda não foi exibido
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * countries.length);
  } while (displayedFlags.includes(countries[randomIndex].name.common));

  currentCountry = countries[randomIndex];

  // Exibir a bandeira
  document.getElementById("flag").src = currentCountry.flags.svg;

  // Adiciona o país à lista de bandeiras exibidas para evitar repetições
  displayedFlags.push(currentCountry.name.common);

  // Gerar opções
  const options = generateOptions(currentCountry.name.common);

  // Embaralhar as opções antes de exibir
  const shuffledOptions = shuffleArray(options);

  // Definir as opções nos botões
  const buttons = document.querySelectorAll(".option");
  buttons.forEach((button, index) => {
    button.textContent = shuffledOptions[index];
  });
}

// Função para gerar opções de resposta
function generateOptions(correctAnswer) {
  const options = new Set();
  options.add(correctAnswer);

  // Adicionar opções incorretas aleatórias
  while (options.size < 4) {
    const randomIndex = Math.floor(Math.random() * countries.length);
    options.add(countries[randomIndex].name.common);
  }

  return Array.from(options);
}

// Função para embaralhar as opções
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Troca de posições
  }
  return array;
}

// Função para verificar a resposta
function checkAnswer(button) {
  const selectedAnswer = button.textContent;

  if (selectedAnswer === currentCountry.name.common) {
    score++;
    correctFlags.push(currentCountry); // Adiciona a bandeira acertada à lista
    alert("Resposta Correta!");

    // Exibe a bandeira na parte inferior esquerda
    const flagImage = document.createElement("img");
    flagImage.src = currentCountry.flags.svg;
    flagImage.classList.add("correct-flag");
  } else {
    score--; // Perde 1 ponto se errar
    alert(`Resposta Errada! A resposta correta era: ${currentCountry.name.common}`);

    // Se errou, remove a última bandeira que foi acertada
    if (correctFlags.length > 0) {
      correctFlags.pop();
      const lastFlag = document.getElementById('BandeirasCertas').lastChild;
      if (lastFlag) {
        lastFlag.remove();
      }
    }
  }

  // Atualiza a pontuação
  document.getElementById('score').textContent = `Pontuação: ${score}`;

  // Exibe a próxima bandeira
  nextQuestion();
}
