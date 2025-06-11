from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/api/chat", methods=["POST"])
def chat():
    dados = request.get_json()
    mensagem = dados.get("mensagem")

    if not mensagem:
        return jsonify({"resposta": "Nenhuma mensagem recebida."}), 400

    try:
        resposta = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é o narrador de um jogo de mistério. Responda sempre como se estivesse narrando um RPG sombrio e envolvente."},
                {"role": "user", "content": mensagem}
            ],
            max_tokens=500,
            temperature=0.9
        )

        mensagem_resposta = resposta.choices[0].message.content.strip()
        return jsonify({"resposta": mensagem_resposta})

    except Exception as e:
        return jsonify({"resposta": f"Erro: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
