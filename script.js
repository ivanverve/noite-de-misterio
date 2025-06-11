let jogadores = [];
let etapa = 0;

window.addEventListener("load", async () => {
  await iniciarJogo();
});

async function iniciarJogo() {
  addToStory("🤖 Narrador: Bem-vindos à *Noite de Mistério*. A escuridão se aproxima, e as sombras ganham vida... Mas antes de revelarmos os segredos ocultos desta noite, diga-me... Qual o seu nome, viajante?");
}

document.getElementById("input-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const input1 = document.getElementById("user-input-1");
  const input2 = document.getElementById("user-input-2");

  let resposta = "";
  if (input1 && input1.value.trim()) {
    resposta = `${jogadores[0] || "Jogador 1"}: ${input1.value.trim()}`;
    addToStory("🧍 " + resposta);
    await processarMensagem(input1.value.trim(), 0);
    input1.value = "";
  }

  if (input2 && input2.value.trim()) {
    resposta = `${jogadores[1] || "Jogador 2"}: ${input2.value.trim()}`;
    addToStory("🧍 " + resposta);
    await processarMensagem(input2.value.trim(), 1);
    input2.value = "";
  }
});

async function processarMensagem(mensagem, jogadorIndex) {
  if (etapa === 0) {
    jogadores[0] = mensagem;
    etapa = 1;
    addToStory(`🤖 Narrador: Muito bem, ${jogadores[0]}. E quem é essa figura misteriosa ao seu lado? Diga-me, qual o seu nome?`);
    return;
  }

  if (etapa === 1) {
    jogadores[1] = mensagem;
    etapa = 2;
    criarCamposDuplos();
    addToStory(`🤖 Narrador: Então estamos completos. ${jogadores[0]} e ${jogadores[1]}, preparem-se. A noite está apenas começando...`);
    return;
  }

  const response = await fetch("https://misterio.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: mensagem })
  });

  const data = await response.json();
  addToStory("🤖 Narrador: " + data.reply);
}

function addToStory(text) {
  const story = document.getElementById("story");
  story.innerHTML += text + "\n\n";
  story.scrollTop = story.scrollHeight;
}

function criarCamposDuplos() {
  const form = document.getElementById("input-form");
  form.innerHTML = `
    <input type="text" id="user-input-1" placeholder="${jogadores[0]}" autocomplete="off" />
    <input type="text" id="user-input-2" placeholder="${jogadores[1]}" autocomplete="off" />
    <button type="submit">Enviar</button>
  `;
}
