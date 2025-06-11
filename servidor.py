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
Você é um narrador interativo de uma história curta de mistério investigativo. Seu papel é conduzir uma narrativa dinâmica envolvendo dois jogadores: {jogador1} e {jogador2}.

- A história deve ter um estilo objetivo, sombrio e intrigante.
- Comece com uma introdução curta (em até 4 parágrafos) e envolvente, descrevendo um cenário com tensão e mistério.
- Após a introdução, **faça uma pergunta clara e direta para os dois jogadores**, incentivando a interação e a tomada de decisão.
- Em seguida, **analise com atenção as respostas dos jogadores** ({jogador1}: "{resposta1}", {jogador2}: "{resposta2}") e **avance a história com base nessas respostas**.
- As decisões dos jogadores devem influenciar diretamente o rumo da história. Eles podem investigar pistas, conversar com personagens, suspeitar de algo, fugir, mentir, se separar, etc.
- A narrativa deve se desenvolver em cenas curtas e instigantes, com ganchos e perguntas frequentes.
- O estilo é mais investigativo do que fantasioso. Mistérios devem ser realistas e baseados em lógica, pistas e dedução.
- Evite longos blocos de texto: cada trecho narrado deve ser direto e com propósito.
- Após cada interação, **finalize com uma pergunta criativa**, deixando que os jogadores decidam os próximos passos.

Resuma, avance e interaja com os jogadores sempre com base no que eles responderem.

Jogadores: {jogador1} e {jogador2}.
Respostas: {jogador1}: "{resposta1}", {jogador2}: "{resposta2}".

Continue a narrativa a partir disso.
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
