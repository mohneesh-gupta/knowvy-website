import { useRef, useState } from "react";
import { stopSpeaking } from "./VoiceOutput";
import toast from "react-hot-toast";

export default function VoiceInput({ onResult, disabled }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  const startListening = () => {
    // 🛑 stop AI voice before mic starts
    stopSpeaking();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-semibold transition ${listening
          ? "bg-red-600"
          : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
      {listening ? "🎙️ Listening..." : "🎤 Speak"}
    </button>
  );
}
