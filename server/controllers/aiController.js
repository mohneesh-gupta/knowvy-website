import { openai } from "../AI/openaiClient.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Knowvy AI Assistant." },
        { role: "user", content: message }
      ],
      max_tokens: 300
    });

    const reply = response.choices[0].message.content;

    res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI request failed" });
  }
};
