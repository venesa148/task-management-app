"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { sendMessage } from "@/services/chat";

export default function ChatbotPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content: "Tanya data task di sini.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Tampilkan semua task yang statusnya belum selesai.",
    "Berapa jumlah task yang sudah selesai?",
    "Tugas apa saja yang deadlinenya hari ini?",
    "Siapa assignee dari task [judul task]?",
  ];

  async function handleSend(prompt?: string) {
    const text = (prompt ?? message).trim();

    if (!text) {
      alert("Masukkan pertanyaan terlebih dahulu.");
      return;
    }

    setMessages((current) => [...current, { role: "user", content: text }]);

    if (!message.trim()) {
      setMessage("");
    }

    try {
      setLoading(true);

      const result = await sendMessage(text);

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result },
      ]);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "Maaf, saya gagal mendapatkan jawaban dari AI saat ini.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="page-grid">
        <section className="hero">
          <div className="hero__copy">
            <span className="hero__badge">AI assistant</span>
            <h2 className="hero__title">Chat data task.</h2>
            <p className="hero__text">Tanya status, deadline, atau assignee.</p>
          </div>
        </section>

        <section className="chat-layout">
          <aside className="chat-side">
               <div className="section-header">
              <span className="badge">Prompt</span>
               </div>

            <div className="quick-pills">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSend(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </aside>

          <section className="chat-card">
            <div className="section-header">
              <span className="badge">Conversation</span>
            </div>

            <div className="chat-history">
              {messages.map((item, index) => (
                <div
                  key={`${item.role}-${index}`}
                  className={`chat-bubble ${item.role === "user" ? "chat-bubble--user" : "chat-bubble--assistant"}`}
                >
                  {item.content}
                </div>
              ))}

              {loading && (
                <div className="chat-bubble chat-bubble--assistant">
                  Thinking...
                </div>
              )}
            </div>

            <form
              className="chat-input"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <textarea
                className="textarea"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis pertanyaan mengenai task..."
              />

              <div className="auth-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setMessage("")}
                >
                  Clear
                </button>

                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Thinking..." : "Send"}
                </button>
              </div>
            </form>
          </section>
        </section>
      </div>
    </AppShell>
  );
}
