const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function streamTutorReply(messages: any[]) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are StudAI Tutor — a friendly, patient AI study assistant. Explain simply using analogies and keep responses concise (2-4 paragraphs max).",
        },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
    }),
  });

  if (!res.ok || !res.body) {
    const err = await res.text().catch(() => "");
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  return new ReadableStream({
    async start(controller) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // ✅ flush-safe decoding
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.replace("data: ", "");

          if (data === "[DONE]") continue;

          try {
            const json = JSON.parse(data);
            const token = json.choices?.[0]?.delta?.content;

            if (token) {
              controller.enqueue(
                new TextEncoder().encode(token)
              );
            }
          } catch {}
        }
      }

      controller.close();
    },
  });
}