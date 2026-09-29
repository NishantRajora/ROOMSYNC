import React, { useState, useEffect, useRef } from "react";
import { X, Send, Minus, Maximize2, ShieldCheck, MessageCircle } from "lucide-react";

export interface ChatPopupProps {
  api: string;
  currentUser: string;
  recipient: string;
  listingId: number;
  listingTitle?: string;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

interface Message {
  id: number;
  conversation_id: number;
  sender: string;
  text: string;
  created_at: string;
  read: number;
}

export const ChatPopup: React.FC<ChatPopupProps> = ({
  api,
  currentUser,
  recipient,
  listingId,
  listingTitle,
  onClose,
  onNotify,
}) => {
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const baseApi = api.replace(/\/api\/?$/, "") + "/api";

  // 1. Initialize or find conversation
  useEffect(() => {
    let isMounted = true;
    const initConversation = async () => {
      try {
        const res = await fetch(`${baseApi}/chat/conversations/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participant_1: currentUser || "demo@roomsync.test",
            participant_2: recipient,
            listing_id: listingId,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setConversationId(data.id);
            fetchMessages(data.id);
          }
        }
      } catch (err) {
        console.error("Failed to initialize conversation", err);
      }
    };

    initConversation();
    return () => {
      isMounted = false;
    };
  }, [baseApi, currentUser, recipient, listingId]);

  // 2. Fetch messages
  const fetchMessages = async (convId: number) => {
    try {
      const res = await fetch(
        `${baseApi}/chat/messages/?conversation_id=${convId}&user=${encodeURIComponent(
          currentUser || "demo@roomsync.test"
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  // 3. Poll every 3 seconds
  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(() => {
      fetchMessages(conversationId);
    }, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  // 4. Auto-scroll on new message
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  // 5. Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !conversationId || isSending) return;

    const messageText = inputText.trim();
    setIsSending(true);

    try {
      const res = await fetch(`${baseApi}/chat/messages/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender: currentUser || "demo@roomsync.test",
          text: messageText,
        }),
      });

      if (res.ok) {
        setInputText("");
        fetchMessages(conversationId);
      } else {
        const errData = await res.json();
        onNotify(errData.error || "Failed to send message");
      }
    } catch {
      onNotify("Error sending message. Check connection.");
    } finally {
      setIsSending(false);
    }
  };

  const recipientInitial = recipient ? recipient.charAt(0).toUpperCase() : "?";

  return (
    <aside className={`chat-popup-widget ${isMinimized ? "minimized" : ""}`} aria-label={`Chat with ${recipient}`}>
      {/* Widget Header */}
      <div className="chat-popup-header" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="chat-popup-user">
          <div className="chat-popup-avatar">{recipientInitial}</div>
          <div className="chat-popup-info">
            <strong>{recipient}</strong>
            <span>
              <i className="status-indicator-dot" /> {listingTitle ? listingTitle : `Listing #${listingId}`}
            </span>
          </div>
        </div>
        <div className="chat-popup-controls" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="chat-popup-btn"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Expand chat" : "Minimize chat"}
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
          </button>
          <button
            type="button"
            className="chat-popup-btn close"
            onClick={onClose}
            title="Close chat"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Widget Body & Messages (hidden if minimized) */}
      {!isMinimized && (
        <>
          <div className="chat-popup-safety-banner">
            <ShieldCheck size={14} />
            <span>Keep chats on RoomSync · Verify place before advance</span>
          </div>

          <div className="chat-popup-messages">
            {messages.length === 0 ? (
              <div className="chat-popup-empty">
                <MessageCircle size={28} />
                <p>Say hello to <strong>{recipient}</strong>!</p>
                <small>Ask about room availability, move-in dates, and visit times.</small>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender === (currentUser || "demo@roomsync.test");
                const timeStr = new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={msg.id} className={`chat-popup-bubble-wrap ${isMine ? "mine" : "theirs"}`}>
                    <div className="chat-popup-bubble">
                      <p>{msg.text}</p>
                      <span className="timestamp">{timeStr}</span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Widget Input Form */}
          <form className="chat-popup-input-bar" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder={`Message ${recipient}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isSending || !conversationId}
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending || !conversationId}
              className="chat-popup-send"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </>
      )}
    </aside>
  );
};
