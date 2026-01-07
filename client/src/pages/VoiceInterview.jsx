import { useState } from "react";
import VoiceInput from "../components/voice/VoiceInput";
import { speak, stopSpeaking, isSpeaking } from "../components/voice/VoiceOutput";
import API_BASE_URL from "../config/api";

export default function VoiceInterview() {
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVoiceInput = async (text) => {
    stopSpeaking(); // 🛑 stop AI voice first

    setUserText(text);
    setAiText("");
    setLoading(true);

    const messages = [
      {
        role: "system",
        content:
          "You are a professional technical interviewer. Ask clear follow-ups and give short feedback.",
      },
      { role: "user", content: text },
    ];

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();
      setAiText(data.reply);
      speak(data.reply);
    } catch {
      setAiText("❌ Error contacting AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">
        🎤 Knowvy Voice Interview
      </h1>

      <div className="bg-neutral-800 rounded-2xl p-6 w-full max-w-2xl space-y-4">

        <VoiceInput
          onResult={handleVoiceInput}
          disabled={loading}
        />

        {isSpeaking() && (
          <button
            onClick={stopSpeaking}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            🔇 Stop AI Speaking
          </button>
        )}

        {userText && (
          <div className="bg-neutral-900 p-4 rounded">
            <strong className="text-blue-400">You:</strong>
            <p>{userText}</p>
          </div>
        )}

        {loading && (
          <p className="text-gray-400 animate-pulse">
            🤖 Thinking like an interviewer...
          </p>
        )}

        {aiText && (
          <div className="bg-neutral-900 p-4 rounded">
            <strong className="text-green-400">Interviewer:</strong>
            <p>{aiText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
