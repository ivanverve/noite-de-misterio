let jogadores = [];
let etapa = 0;

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("input-form");
  const input1 = document.getElementById("user-input-1");
  const input2 = document.getElementById("user-input-2");
  const story = document.getElementById("story");

  // Mostrar introdução
  addToStory("🤖 Narrador: Bem-vindos à *Noite de Mistério*. A escuridão se aproxima, e as sombras ganham vida... Mas antes de revelarmos os segredos ocultos desta noite, diga-me... Qual o seu nome, viajante?");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const msg1 = input1.value.trim();
    const msg2 = input2?.value.trim(); // Pode ser undefined se input2 ainda não existe

    if (etapa === 0 && msg1) {
      jogadores.push(msg1);
      addToStory(`🧍 ${msg1}: ${msg1}`);
      input1.value = "";
      etapa = 1;
      addToStory(`🤖 Narrador: Muito bem, ${msg1}. E quem é essa figura misteriosa ao seu lado? Diga-me, qual o seu nome?`);
      return;
    }

    if (etapa === 1 && msg1) {
      jogadores.push(msg1);
      addToStory(`🧍 ${msg1}: ${msg1}`);
      input1.value = "";
      etapa = 2;

      // Trocar os campos de entrada por dois inputs com nomes definidos
      form.innerHTML = `
        <input type="text" id="user-input-1" placeholder="${jogadores[0]}" autocomplete="off" />
        <input type="text" id="user-input-2" placeholder="${jogadores[1]}" autocomplete="off" />
        <button type="submit">Enviar</button>
      `;
      addToStory(`🤖 Narrador: ${jogadores[0]} e ${jogadores[1]}, o jogo começou... Sigam suas intuições. Há algo escondido nas sombras desta noite.`);

      return;
    }

    // A partir daqui é a fase do jogo
    const input1Atual = document.getElementById("user-input-1");
    const input2Atual = document.getElementById("user-input-2");

    const cmd1 = input1Atual.value.trim();
    const cmd2 = input2Atual.value.trim();

    if (!cmd1 && !cmd2) return;

    if (cmd1) addToStory(`🧍 ${jogadores[0]}: ${cmd1}`);
    if (cmd2) addToStory(`🧍 ${jogadores[1]}: ${cmd2}`);

    input1Atual.value = "";
    input2Atual.value = "";

    try {
      const response = await fetch("https://misterio.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Jogador 1 (${jogadores[0]}) disse: "${cmd1}". Jogador 2 (${jogadores[1]}) disse: "${cmd2}". Continue a história de forma misteriosa e coerente.`
        })
      });

      const data = await response.json();
      addToStory("🤖 Narrador: " + data.reply);
    } catch (err) {
      addToStory("⚠️ Erro ao contatar o servidor.");
    }
  });

  // ENTER funciona no form padrão
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });

  function addToStory(texto) {
    story.innerHTML += texto + "<br><br>";
    story.scrollTop = story.scrollHeight;
  }
});
