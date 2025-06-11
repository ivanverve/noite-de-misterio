const form = document.getElementById("input-form");
const chatBox = document.getElementById("chat-box");
const nomeInputs = document.getElementById("input-nomes");
const comandoInputs = document.getElementById("input-comandos");

let jogadores = [];
let etapa = 0;

function adicionarMensagem(personagem, mensagem) {
  const msg = document.createElement("p");
  msg.innerHTML = `<span>${personagem}:</span> ${mensagem}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function enviarParaServidor(msgJogador1, msgJogador2) {
  fetch("https://misterio.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jogadores,
      mensagens: [
        { jogador: jogadores[0], mensagem: msgJogador1 },
        { jogador: jogadores[1], mensagem: msgJogador2 }
      ]
    })
  })
    .then((res) => res.json())
    .then((data) => {
      adicionarMensagem("🤖 Narrador", data.reply);
    })
    .catch((err) => {
      console.error("Erro:", err);
      adicionarMensagem("Erro", "Não foi possível se comunicar com o servidor.");
    });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (etapa === 0) {
    const nome1 = document.getElementById("jogador1").value.trim();
    const nome2 = document.getElementById("jogador2").value.trim();
    if (!nome1 || !nome2) return;

    jogadores = [nome1, nome2];
    nomeInputs.style.display = "none";
    comandoInputs.style.display = "flex";
    document.getElementById("resposta1").placeholder = `${nome1}`;
    document.getElementById("resposta2").placeholder = `${nome2}`;
    adicionarMensagem("🤖 Narrador", `Muito bem, ${nome1} e ${nome2}, o jogo começou... Sigam suas intuições.`);
    etapa++;
  } else {
    const msg1 = document.getElementById("resposta1").value.trim();
    const msg2 = document.getElementById("resposta2").value.trim();
    if (!msg1 && !msg2) return;

    if (msg1) adicionarMensagem(`🧍 ${jogadores[0]}`, msg1);
    if (msg2) adicionarMensagem(`🧍‍♀️ ${jogadores[1]}`, msg2);

    enviarParaServidor(msg1, msg2);

    document.getElementById("resposta1").value = "";
    document.getElementById("resposta2").value = "";
  }
});

// Mensagem inicial automática
window.onload = () => {
  adicionarMensagem("🤖 Narrador", "Bem-vindos à *Noite de Mistério*. A escuridão se aproxima, e as sombras ganham vida... Mas antes de revelarmos os segredos ocultos desta noite, diga-me... Qual o seu nome, viajante?");
};
