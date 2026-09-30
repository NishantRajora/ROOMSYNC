import { useState } from "react";
import { CONVERSATIONS } from "../data/mockData";

type Conversation = typeof CONVERSATIONS[0];

export default function Messages() {
  const [active, setActive] = useState<Conversation>(CONVERSATIONS[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(active.messages);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "you", text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setInput("");
  };

  const handleConvSelect = (conv: Conversation) => {
    setActive(conv);
    setMessages(conv.messages);
    setInput("");
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b", letterSpacing: "-0.5px" }}>
          Messages
        </h1>
        <p className="text-sm" style={{ color: "#5f7572" }}>{CONVERSATIONS.reduce((s, c) => s + c.unread, 0)} unread messages</p>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "#e2ece9", height: 620, display: "grid", gridTemplateColumns: "280px 1fr" }}
      >
        {/* Conversation list */}
        <div className="border-r overflow-y-auto" style={{ borderColor: "#e2ece9" }}>
          <div className="p-3 border-b" style={{ borderColor: "#e2ece9" }}>
            <input
              placeholder="Search conversations..."
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              style={{ borderColor: "#e2ece9", background: "#f6f9f8", fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          {CONVERSATIONS.map(conv => (
            <div
              key={conv.id}
              className="flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-all"
              style={{
                borderColor: "#f6f9f8",
                background: active.id === conv.id ? "#ecfdf5" : "transparent",
              }}
              onClick={() => handleConvSelect(conv)}
              onMouseEnter={e => { if (active.id !== conv.id) (e.currentTarget as HTMLElement).style.background = "#f6f9f8"; }}
              onMouseLeave={e => { if (active.id !== conv.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div className="relative flex-shrink-0">
                <img src={conv.photo} alt={conv.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: "#10b981" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold truncate" style={{ color: "#17222b" }}>{conv.name}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: "#5f7572" }}>{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate" style={{ color: "#5f7572" }}>{conv.lastMessage}</span>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "#117c74" }}>
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat panel */}
        <div className="flex flex-col" style={{ background: "#f6f9f8" }}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "#e2ece9", background: "#fff" }}>
            <div className="relative">
              <img src={active.photo} alt={active.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background: "#10b981" }} />
            </div>
            <div>
              <div className="font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#17222b" }}>{active.name}</div>
              <div className="text-xs" style={{ color: "#10b981" }}>Online</div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ borderColor: "#e2ece9", background: "#f6f9f8" }}>📞</button>
              <button className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ borderColor: "#e2ece9", background: "#f6f9f8" }}>⋯</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"}`}>
                {msg.from !== "you" && (
                  <img src={active.photo} alt="" className="w-7 h-7 rounded-full object-cover mr-2 self-end flex-shrink-0" />
                )}
                <div>
                  <div
                    className="rounded-2xl px-4 py-2.5 text-sm max-w-xs"
                    style={{
                      background: msg.from === "you" ? "#117c74" : "#fff",
                      color: msg.from === "you" ? "#fff" : "#17222b",
                      borderBottomRightRadius: msg.from === "you" ? 4 : 16,
                      borderBottomLeftRadius: msg.from !== "you" ? 4 : 16,
                      boxShadow: msg.from !== "you" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#5f7572", textAlign: msg.from === "you" ? "right" : "left" }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 px-5 py-4 border-t" style={{ borderColor: "#e2ece9", background: "#fff" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder={`Message ${active.name.split(" ")[0]}...`}
              className="flex-1 border rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ borderColor: "#e2ece9", background: "#f6f9f8", fontFamily: "'Inter', sans-serif" }}
              onFocus={e => (e.target.style.borderColor = "#117c74")}
              onBlur={e => (e.target.style.borderColor = "#e2ece9")}
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{ background: input.trim() ? "#117c74" : "#e2ece9" }}
            >
              <span className="text-white text-sm">↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
