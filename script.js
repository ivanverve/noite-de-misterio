let jogadores = [];
let etapa = 0;

document.getElementById("input-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const input1 = document.getElementById("player1-input");
  const input2 = document.getElementById("player2-input");
  const msg1 = input1.value.trim();
  const msg2 = input2.value.trim();

  if (etapa === 0 && msg1) {
    jogadores.push(msg1);
    addToStory(`🧍 ${msg1}: ${msg1}`);
    input1.value = "";
    input1.placeholder = "Nome do segundo jogador...";
    return;
  }

  if (etapa === 0 && msg2) {
    jogadores.push(msg2);
    addToStory(`🧍 ${msg2}: ${msg2}`);
    etapa = 1;
    input1.value = "";
    input2.value = "";
    input1.placeholder = jogadores[0];
    input2.placeholder = jogadores[1];
    addToStory(`🤖 Narrador: ${jogadores[0]} e ${jogadores[1]}, o jogo começou... Sigam suas intuições. Há algo escondido nas sombras desta noite.`);
    return;
  }

  if (etapa >= 1) {
    const comandos = [];

    if (msg1) {
      comandos.push(`${jogadores[0]}: ${msg1}`);
      addToStory(`🧍 ${jogadores[0]}: ${msg1}`);
    }

    if (msg2) {
      comandos.push(`${jogadores[1]}: ${msg2}`);
      addToStory(`🧍 ${jogadores[1]}: ${msg2}`);
    }

    input1.value = "";
    input2.value = "";

    if (comandos.length === 0) return;

    const response = await fetch("https://mist3rio.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: comandos.join("\n") })
    });

    const data = await response.json();
    addToStory(`🤖 Narrador: ${data.reply}`);
  }
});

function addToStory(text) {
  const story = document.getElementById("story");
  story.innerHTML += text + "\n\n";
  story.scrollTop = story.scrollHeight;
}

// Mensagem inicial
window.onload = () => {
  addToStory("🤖 Narrador: Bem-vindos à *Noite de Mistério*. A escuridão se aproxima, e as sombras ganham vida... Mas antes de revelarmos os segredos ocultos desta noite, diga-me... Qual o seu nome, viajante?");
};
