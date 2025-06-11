from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    input1 = data.get("input1", "")
    input2 = data.get("input2", "")
    jogador1 = data.get("jogador1", "Jogador 1")
    jogador2 = data.get("jogador2", "Jogador 2")

    prompt = (
        f"{jogador1} respondeu: {input1 or '[em silêncio]'}.\n"
        f"{jogador2} respondeu: {input2 or '[em silêncio]'}.\n"
        "Com base nessas ações, continue a história de mistério de forma envolvente:"
    )

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": "Você é um narrador de um jogo de mistério psicológico e interativo. Continue a história com base nas ações dos jogadores, mantendo suspense e imersão."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.8
        }
    )

    result = response.json()
    reply = result["choices"][0]["message"]["content"]
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
