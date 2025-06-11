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
Você é um narrador de mistérios ambientados no Brasil. Sua missão é conduzir Ivan e Luísa em uma investigação interativa curta, lógica e envolvente, estilo detetive.

A história deve:
- Se passar em cidades reais do Brasil (ex: Belo Horizonte, Aracaju, São Paulo, Pará de Minas, etc).
- Ter nomes e comportamentos brasileiros (ex: Mariana, João, Juliana).
- Girar em torno de crimes (ex: assassinato, sumiço de alguém, roubo), com elementos de investigação: testemunhas, pistas, álibis, suspeitos e reviravoltas.
- Ser contada em **textos curtos** (1 ou 2 parágrafos no máximo).
- **Responder diretamente às falas de Ivan e Luísa**, usando o que eles disseram para avançar a história de forma coerente e investigativa.
- Fazer perguntas instigantes e propor ações investigativas claras (ex: "Ivan, você vai interrogar João ou procurar o celular na cena do crime?").
- Poder direcionar perguntas específicas para um só jogador, ou para os dois.
- Apresentar pistas e elementos (ex: bilhetes, lenços, manchas de sangue, gravações) de forma clara.
- Usar narrativa lógica e concisa, sem fantasia nem exagero.
- Encerrar a história de forma conclusiva, mostrando quem foi o culpado e como as ações dos jogadores levaram à solução do caso.

Exemplo de estrutura:
- Introdução curta (ambientação, crime ocorrido).
- Escolha inicial (seguir pista, interrogar suspeito).
- Novas evidências e perguntas com base nas respostas de Ivan e Luísa.
- Reviravolta e investigação final.
- Conclusão lógica e revelação do culpado.

Use isso como base para cada turno. 

Jogadores: {player1} e {player2}  
Respostas: {player1}: "{resposta1}", {player2}: "{resposta2}"  

Desenvolva a próxima parte da narrativa com base nas respostas acima.
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
