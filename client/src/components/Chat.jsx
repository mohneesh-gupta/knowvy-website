import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiSend, FiArrowDown, FiLoader } from "react-icons/fi";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I’m Knowvy AI. How can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesRef = useRef(null);

  // Auto-scroll & show scroll button
  useEffect(() => {
    const area = messagesRef.current;
    const isNearBottom =
      area.scrollTop + area.clientHeight >= area.scrollHeight - 150;

    if (!streaming && isNearBottom) {
      area.scrollTop = area.scrollHeight;
    }

    const onScroll = () => {
      setShowScrollBtn(
        area.scrollTop + area.clientHeight < area.scrollHeight - 100
      );
    };

    area.addEventListener("scroll", onScroll);
    return () => area.removeEventListener("scroll", onScroll);
  }, [messages, streaming]);

  const scrollToBottom = () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreaming(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("http://localhost:5000/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const parts = chunk.split("\n\n").filter(Boolean);

        for (const part of parts) {
          if (!part.startsWith("data:")) continue;
          const jsonStr = part.replace("data:", "").trim();

          try {
            const data = JSON.parse(jsonStr);
            if (data.text) {
              assistantText += data.text;

              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].content = assistantText;
                return updated;
              });
            }
          } catch {}
        }
      }

      setStreaming(false);
      setLoading(false);
    } catch (err) {
      console.error("Stream error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content =
          "⚠️ Error: Streaming failed.";
        return updated;
      });
      setStreaming(false);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-neutral-900 text-white overflow-hidden">
      <header className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Knowvy AI Assistant</h1>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FiLoader className="animate-spin" /> Thinking...
          </div>
        )}
      </header>

      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{ minHeight: 0 }}
      >
        {messages.map((msg, i) => (
          <ChatBubble key={i} role={msg.role} text={msg.content} />
        ))}
      </div>

      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 p-3 bg-neutral-800 rounded-full shadow-lg hover:bg-neutral-700 transition"
        >
          <FiArrowDown size={20} />
        </button>
      )}

      <div className="p-4 bg-neutral-950 border-t border-neutral-800">
        <div className="flex items-center gap-3 bg-neutral-800 px-4 py-3 rounded-xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something..."
            className="flex-1 bg-transparent text-white outline-none"
          />
          <button
            disabled={loading}
            onClick={handleSend}
            className="p-2 hover:bg-neutral-700 rounded-lg disabled:opacity-50"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- FIXED CHAT BUBBLE ---- */
function ChatBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-neutral-800 text-gray-200 border border-neutral-700"
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p className="prose prose-invert max-w-none mb-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="ml-4 list-disc prose prose-invert" {...props} />
            ),
            code: ({ node, inline, ...props }) =>
              inline ? (
                <code className="bg-neutral-700 px-1 py-0.5 rounded" {...props} />
              ) : (
                <pre className="bg-neutral-800 p-3 rounded-lg overflow-x-auto my-2">
                  <code {...props} />
                </pre>
              ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
