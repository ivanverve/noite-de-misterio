let player1 = "";
let player2 = "";

function addToStory(text) {
  const story = document.getElementById("story");
  story.innerHTML += text + "\n\n";
  story.scrollTop = story.scrollHeight;
}

function startGame() {
  player1 = document.getElementById("name1").value.trim();
  player2 = document.getElementById("name2").value.trim();
  if (!player1 || !player2) return;

  document.getElementById("name-inputs").style.display = "none";
  document.getElementById("input-form").style.display = "flex";

  addToStory(`🤖 *Narrador*: Uma névoa espessa cobre o vilarejo abandonado... Vocês se aproximam da entrada principal da mansão esquecida pelo tempo.\n\n👥 ${player1} e ${player2}, a aventura começa agora. Respondam com coragem...`);
}

document.getElementById("input-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const input1 = document.getElementById("input1");
  const input2 = document.getElementById("input2");
  const val1 = input1.value.trim();
  const val2 = input2.value.trim();

  if (!val1 && !val2) return;

  if (val1) addToStory(`🧍 ${player1}: ${val1}`);
  if (val2) addToStory(`🧍 ${player2}: ${val2}`);

  input1.value = "";
  input2.value = "";

  const response = await fetch("https://misterio.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jogador1: player1,
      jogador2: player2,
      resposta1: val1,
      resposta2: val2
    })
  });

  const data = await response.json();
  addToStory(`🤖 *Narrador*: ${data.reply}`);
});
