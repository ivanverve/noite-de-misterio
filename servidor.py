from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    jogador1 = data.get('jogador1', 'Jogador 1')
    jogador2 = data.get('jogador2', 'Jogador 2')
    msg1 = data.get('mensagem1', '')
    msg2 = data.get('mensagem2', '')

    mensagens = [
        {"role": "system", "content": f"Você é um narrador de RPG psicológico e sombrio, conduzindo uma história interativa com dois jogadores: {jogador1} e {jogador2}. Combine as ações deles e continue a história de forma envolvente, misteriosa e densa."},
        {"role": "user", "content": f"{jogador1}: {msg1}\n{jogador2}: {msg2}"}
    ]

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "gpt-4o",
            "messages": mensagens,
            "temperature": 0.9
        }
    )

    resposta = response.json()
    texto = resposta['choices'][0]['message']['content']
    return jsonify({"reply": texto})
