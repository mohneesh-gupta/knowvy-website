let currentAudio = null;

/**
 * Play ElevenLabs voice
 */
export async function speak(text) {
  try {
    stopSpeaking();

    const res = await fetch("http://localhost:5000/api/tts/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error("TTS failed");

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    currentAudio = new Audio(audioUrl);
    currentAudio.play();

    currentAudio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    };
  } catch (err) {
    console.error("Voice output error:", err);
  }
}

/**
 * Force stop AI speaking
 */
export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Check if AI is speaking
 */
export function isSpeaking() {
  return !!currentAudio;
}
