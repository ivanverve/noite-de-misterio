from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    mensagem_usuario = data.get("mensagem")

    if not mensagem_usuario:
        return jsonify({"resposta": "Mensagem vazia recebida."}), 400

    try:
        resposta = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Você é um narrador misterioso e envolvente. Conduza os jogadores com suspense e criatividade."
                },
                {
                    "role": "user",
                    "content": mensagem_usuario
                }
            ],
            max_tokens=400
        )

        texto_resposta = resposta.choices[0].message.content
        return jsonify({"resposta": texto_resposta})

    except Exception as e:
        return jsonify({"resposta": f"Erro interno do servidor: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
