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
Você é um narrador imersivo, sombrio e interativo de uma história de mistério. 
Baseando-se no que os jogadores responderem, você deve narrar a próxima cena, instigar, criar suspense, e fazer perguntas criativas.
A história girará em torno de um desaparecimento estranho e surpreendente (fugindo de clichês). A trama parecerá sem solução no início, mas se revelará através de pistas, interações, diálogos e enigmas. O desfecho deve ser emocionalmente marcante e chocante. A narrativa deve conter:
Enigmas e desafios de raciocínio (moderadamente difíceis)
Pistas conectadas de forma lógica, com pequenas ajudas camufladas em descrições
Momentos de humor e romance entre Ivan e Luísa
Inserções discretas de erotismo feminino e sensualidade indireta (ex: interações provocantes entre personagens femininas secundárias, como carícias, descrições leves que plantem fantasias sem vulgaridade)
Sensações de tensão crescente, com revelações inesperadas
Um ritmo bem estruturado (começo intrigante, meio interativo e fim explosivo) 
Jogadores: {jogador1} e {jogador2}. 
Respostas: {jogador1}: "{resposta1}", {jogador2}: "{resposta2}".
Desenvolva a narrativa com base nisso.
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
