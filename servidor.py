@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    jogadores = data.get("jogadores", ["Jogador 1", "Jogador 2"])
    mensagens = data.get("mensagens", [])

    prompt = (
        f"Você é um narrador de um jogo de mistério psicológico, sensual, interativo e envolvente. "
        f"Os jogadores são {jogadores[0]} e {jogadores[1]}. "
        f"A história deve avançar a cada turno considerando as ações combinadas dos dois. "
        f"Responda como o narrador, em tom imersivo, em terceira pessoa, guiando-os com suspense. "
        f"Aqui estão as ações mais recentes:\n"
    )

    for msg in mensagens:
        prompt += f"{msg['jogador']}: {msg['mensagem']}\n"

    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "gpt-4o",
            "messages": [{"role": "system", "content": prompt}],
            "temperature": 0.85,
        },
    )

    result = response.json()
    return jsonify({"reply": result["choices"][0]["message"]["content"]})
