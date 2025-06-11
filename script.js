let jogador1 = '';
let jogador2 = '';

document.getElementById("name-form").addEventListener("submit", function(e) {
  e.preventDefault();
  jogador1 = document.getElementById("name1").value.trim();
  jogador2 = document.getElementById("name2").value.trim();
  if (!jogador1 || !jogador2) return;

  document.getElementById("name-form").style.display = "none";
  document.getElementById("input-form").style.display = "flex";

  addToStory(`🤖 Narrador: Bem-vindos à *Noite de Mistério*, ${jogador1} e ${jogador2}. Preparem-se para uma jornada onde cada escolha molda a escuridão...`);
});

document.getElementById("input-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const input1 = document.getElementById("input1").value.trim();
  const input2 = document.getElementById("input2").value.trim();
  if (!input1 && !input2) return;

  if (input1) addToStory(`🧍‍♂️ ${jogador1}: ${input1}`);
  if (input2) addToStory(`🧍‍♀️ ${jogador2}: ${input2}`);

  document.getElementById("input1").value = "";
  document.getElementById("input2").value = "";

  const response = await fetch("https://misterio.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jogador1, jogador2, input1, input2 }),
  });

  const data = await response.json();
  addToStory(`🤖 Narrador: ${data.reply}`);
});

function addToStory(text) {
  const story = document.getElementById("story");
  story.innerHTML += text + "\n\n";
  story.scrollTop = story.scrollHeight;
}
