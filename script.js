let jogadores = [];
let nomeAtual = 0;
let historia = [];

document.addEventListener("DOMContentLoaded", () => {
  addToStory("🤖 Narrador: Bem-vindos à *Noite de Mistério*. A escuridão se aproxima, e as sombras ganham vida... Mas antes de revelarmos os segredos ocultos desta noite, diga-me... Qual o seu nome, viajante?");
});

document.getElementById("name-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("name-input");
  const nome = input.value.trim();
  if (!nome) return;

  jogadores.push(nome);
  addToStory(`🧍 ${nome}: ${nome}`);
  input.value = "";

  if (jogadores.length === 1) {
    addToStory(`🤖 Narrador: Muito bem, ${nome}. E quem é essa figura misteriosa ao seu lado? Diga-me, qual o seu nome?`);
  } else if (jogadores.length === 2) {
    addToStory(`🤖 Narrador: ${jogadores[0]} e ${jogadores[1]}, o jogo começou... Sigam suas intuições. Há algo escondido nas sombras desta noite.`);
    document.getElementById("name-form").style.display = "none";
    document.getElementById("input-form").style.display = "flex";
    document.getElementById("input1").placeholder = `${jogadores[0]}`;
    document.getElementById("input2").placeholder = `${jogadores[1]}`;
  }
});

document.getElementById("input-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const input1 = document.getElementById("input1");
  const input2 = document.getElementById("input2");
  const msg1 = input1.value.trim();
  const msg2 = input2.value.trim();
  if (!msg1 && !msg2) return;

  if (msg1) {
    addToStory(`🧍 ${jogadores[0]}: ${msg1}`);
    historia.push({ role: "user", content: `${jogadores[0]}: ${msg1}` });
  }
  if (msg2) {
    addToStory(`🧍 ${jogadores[1]}: ${msg2}`);
    historia.push({ role: "user", content: `${jogadores[1]}: ${msg2}` });
  }

  input1.value = "";
  input2.value = "";

  const response = await fetch("https://misterio.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: historia })
  });

  const data = await response.json();
  historia.push({ role: "assistant", content: data.reply });
  addToStory(`🤖 Narrador: ${data.reply}`);
});

function addToStory(texto) {
  const story = document.getElementById("story");
  story.innerHTML += `<p>${texto}</p>`;
  story.scrollTop = story.scrollHeight;
}
