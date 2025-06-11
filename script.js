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

  const input1 = document.getElementById("user-input-1") || document.getElementById("user-input");
  const input2 = document.getElementById("user-input-2");

  if (etapa === 0 && input1.value.trim()) {
    jogadores[0] = input1.value.trim();
    addToStory(`🧍 ${jogadores[0]}: ${input1.value}`);
    etapa = 1;
    input1.value = "";
    input1.placeholder = "";
    addToStory(`🤖 Narrador: Muito bem, ${jogadores[0]}. E quem é essa figura misteriosa ao seu lado? Diga-me, qual o seu nome?`);
    return;
  }

  if (etapa === 1 && input1.value.trim()) {
    jogadores[1] = input1.value.trim();
    addToStory(`🧍 ${jogadores[1]}: ${input1.value}`);
    etapa = 2;
    criarCamposDuplos();
    addToStory(`🤖 Narrador: Então estamos completos. ${jogadores[0]} e ${jogadores[1]}, preparem-se. A noite está apenas começando...`);
    return;
  }

  const mensagens = [];
  if (input1 && input1.value.trim()) {
    mensagens.push({ jogador: jogadores[0], texto: input1.value.trim() });
    input1.value = "";
  }

  if (input2 && input2.value.trim()) {
    mensagens.push({ jogador: jogadores[1], texto: input2.value.trim() });
    input2.value = "";
  }

  for (const msg of mensagens) {
    addToStory(`🧍 ${msg.jogador}: ${msg.texto}`);
    const resposta = await fetch("https://misterio.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg.texto })
    });

    const data = await resposta.json();
    addToStory("🤖 Narrador: " + data.reply);
  }
});

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

