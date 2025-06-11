let jogadores = [];
let etapa = 0;

const form = document.getElementById("input-form");
const input1 = document.getElementById("input1");
const input2 = document.getElementById("input2");
const story = document.getElementById("story");

addToStory("🤖 Narrador: Bem-vindos à *Noite de Mistério*. A escuridão se aproxima, e as sombras ganham vida... Mas antes de revelarmos os segredos ocultos desta noite, diga-me... Qual o seu nome, viajante?");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const v1 = input1.value.trim();
  const v2 = input2.value.trim();

  if (etapa === 0 && v1) {
    jogadores.push(v1);
    addToStory(`🧍 ${v1}: ${v1}`);
    input1.value = "";
    input1.placeholder = "Jogador 2";
    etapa = 1;
    addToStory(`🤖 Narrador: Muito bem, ${jogadores[0]}. E quem é essa figura misteriosa ao seu lado? Diga-me, qual o seu nome?`);
    return;
  }

  if (etapa === 1 && v1) {
    jogadores.push(v1);
    addToStory(`🧍 ${v1}: ${v1}`);
    input1.style.display = "none";
    input2.style.display = "inline-block";
    input1.placeholder = `👤 ${jogadores[0]}`;
    input2.placeholder = `👤 ${jogadores[1]}`;
    etapa = 2;
    addToStory(`🤖 Narrador: ${jogadores[0]} e ${jogadores[1]}, o jogo começou... Sigam suas intuições. Há algo escondido nas sombras desta noite.`);
    return;
  }

  if (etapa >= 2) {
    const msg1 = input1.value.trim();
    const msg2 = input2.value.trim();
    if (!msg1 && !msg2) return;

    if (msg1) addToStory(`🧍 ${jogadores[0]}: ${msg1}`);
    if (msg2) addToStory(`🧍 ${jogadores[1]}: ${msg2}`);

    input1.value = "";
    input2.value = "";

    const response = await fetch("https://misterio.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jogador1: jogadores[0],
        jogador2: jogadores[1],
        mensagem1: msg1,
        mensagem2: msg2
      })
    });

    const data = await response.json();
    addToStory(`🤖 Narrador: ${data.reply}`);
  }
});

function addToStory(texto) {
  story.innerHTML += texto + "\n\n";
  story.scrollTop = story.scrollHeight;
}
