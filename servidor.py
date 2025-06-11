from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')

    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'gpt-4o',
            'messages': [
                {'role': 'system', 'content': 'Você é um narrador de um jogo de mistério psicológico, sensual, interativo e envolvente. Conduza a história com clima, descrição, tensão e inteligência. Interaja com os jogadores como um mestre de RPG.'},
                {'role': 'user', 'content': user_input}
            ],
            'temperature': 0.8
        }
    )

    result = response.json()
    return jsonify({'reply': result['choices'][0]['message']['content']})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
