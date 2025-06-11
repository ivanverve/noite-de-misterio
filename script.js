document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const mensagemInput = document.getElementById("mensagem");
  const chat = document.getElementById("chat");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mensagem = mensagemInput.value.trim();
    if (mensagem === "") return;

    adicionarMensagem("👤 Você", mensagem);
    mensagemInput.value = "";
    
    try {
      const resposta = await fetch("https://misterio.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mensagem })
      });

      const dados = await resposta.json();
      adicionarMensagem("🤖 Narrador", dados.resposta);
    } catch (erro) {
      adicionarMensagem("🤖 Narrador", "Ocorreu um erro ao se comunicar com o servidor.");
    }
  });

  function adicionarMensagem(origem, texto) {
    const paragrafo = document.createElement("p");
    const span = document.createElement("span");
    span.className = origem.includes("Narrador") ? "narrador" : "usuario";
    span.textContent = `${origem}: `;
    paragrafo.appendChild(span);
    paragrafo.append(texto);
    chat.appendChild(paragrafo);
    chat.scrollTop = chat.scrollHeight;
  }
});
