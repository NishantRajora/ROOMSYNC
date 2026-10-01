import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, X, Send, Minus, ChevronUp } from 'lucide-react';

export const FloatingChat: React.FC = () => {
  const {
    isFloatingChatOpen,
    setIsFloatingChatOpen,
    activeChatRecipient,
    messages,
    sendMessage,
    closeFloatingChat,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = messages.filter(
    (m) =>
      m.conversationId === activeChatRecipient?.id ||
      m.senderId === activeChatRecipient?.id
  );

  useEffect(() => {
    if (isFloatingChatOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isFloatingChatOpen, isMinimized]);

  if (!isFloatingChatOpen) {
    return (
      <button
        onClick={() => setIsFloatingChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#117c74] hover:bg-[#0d635c] text-white p-3.5 rounded-full shadow-xl transition-all hover:scale-105 flex items-center gap-2 border border-white/20 cursor-pointer"
        title="Open RoomSync Chat"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs font-semibold pr-1 hidden sm:inline">Messages</span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
      </button>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || !activeChatRecipient) return;
    sendMessage(activeChatRecipient.id, activeChatRecipient.name, inputVal.trim());
    setInputVal('');
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#e2ece9] overflow-hidden transition-all duration-200 flex flex-col ${
        isMinimized ? 'h-14' : 'h-[480px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#117c74] text-white">
        <div className="flex items-center gap-2.5">
          {activeChatRecipient?.avatarUrl ? (
            <img
              src={activeChatRecipient.avatarUrl}
              alt={activeChatRecipient.name}
              className="w-8 h-8 rounded-full object-cover border border-white/40"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {activeChatRecipient?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold leading-tight line-clamp-1">
              {activeChatRecipient?.name || 'Roommate Chat'}
            </h4>
            <span className="text-[10px] text-white/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </button>
          <button
            onClick={closeFloatingChat}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#f6f9f8]">
            {activeMessages.length === 0 ? (
              <div className="text-center py-10 text-xs text-[#5f7572]">
                Start the conversation with {activeChatRecipient?.name}! Discuss flat preferences, visit timings, or college schedule.
              </div>
            ) : (
              activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.isSelf
                        ? 'bg-[#117c74] text-white rounded-br-xs'
                        : 'bg-white text-[#17222b] border border-[#e2ece9] rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#5f7572] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-2.5 bg-white border-t border-[#e2ece9] flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type message..."
              className="flex-1 px-3 py-2 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2 bg-[#117c74] hover:bg-[#0d635c] text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};
