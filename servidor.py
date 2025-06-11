from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    jogador1 = data.get("jogador1", "")
    jogador2 = data.get("jogador2", "")
    resposta1 = data.get("resposta1", "")
    resposta2 = data.get("resposta2", "")

    prompt = f"""
Você é um narrador envolvente de uma história de mistério investigativo ambientada no Brasil. Sua missão é construir uma narrativa contínua e coerente, com cenas curtas (máximo 2 parágrafos), baseadas nas respostas dos jogadores.

A história se passa em cidades reais brasileiras, como Belo Horizonte, Aracaju, Pará de Minas ou outras semelhantes. Os nomes dos personagens secundários devem ser brasileiros, como Clarice, Júlio, Mariana, etc.

Evite reiniciar ou reinventar o cenário a cada turno. A história deve sempre **continuar de onde parou**, considerando exatamente o que cada jogador respondeu.

Desenvolva mistérios que envolvam decisões, pistas e investigações. Sempre finalize com uma pergunta ou provocação que exija resposta dos jogadores.

Você pode fazer perguntas separadas ou conjuntas, como:
- "Ivan, o que você faz ao ver a sombra no corredor?"
- "Luísa, você vai abrir o bilhete ou ignorar?"
- "Ambos, confiam em Júlio ou seguem o instinto de se afastar?"

Use linguagem natural, com tom instigante e moderadamente sombrio, mas **sem exageros ou clichês fantasiosos**. Foque mais em suspense do que em sobrenatural.

NUNCA narre o que os jogadores disseram ou decidiram. Apenas **reaja ao que foi informado por eles** nas variáveis abaixo:

Jogadores: {jogador1} e {jogador2}
Respostas: {jogador1}: "{resposta1}", {jogador2}: "{resposta2}"

Continue a narrativa com base nesse contexto.
"""

    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": "Você é um narrador envolvente de uma história misteriosa com dois jogadores."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.9
        }
    )

    data = response.json()
    reply = data['choices'][0]['message']['content']
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
