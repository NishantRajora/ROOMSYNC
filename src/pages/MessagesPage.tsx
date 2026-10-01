import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, MessageSquare, Phone, User, CheckCircle, ShieldCheck } from 'lucide-react';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

export const MessagesPage: React.FC = () => {
  const { currentUser, messages, sendMessage, candidates } = useApp();

  const [activePartnerId, setActivePartnerId] = useState<string>(candidates[0]?.id || 'usr_002');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePartner =
    candidates.find((c) => c.id === activePartnerId) || {
      id: 'usr_002',
      fullName: 'Rohan Mehra',
      courseYear: 'B.Tech CSE — 3rd Year',
      college: 'The NorthCap University (NCU)',
      isStudentVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    };

  const partnerMessages = messages.filter(
    (m) =>
      m.conversationId === activePartnerId ||
      m.senderId === activePartnerId ||
      (m.senderId === currentUser.id && m.conversationId === activePartnerId)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartnerId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activePartner.id, activePartner.fullName, inputText.trim());
    setInputText('');
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#17222b] tracking-tight">
          Flatmate & Listing Messages
        </h1>
        <p className="text-xs text-[#5f7572] mt-0.5">
          Real-time conversations with prospective roommates and verified landlords.
        </p>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-[#e2ece9] overflow-hidden shadow-2xs flex">
        {/* Left Conversation List (w-80) */}
        <div className="w-80 border-r border-[#e2ece9] bg-[#f6f9f8] flex flex-col">
          <div className="p-3.5 border-b border-[#e2ece9] bg-white">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5f7572]">
              Active Chats
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#e2ece9]">
            {candidates.map((cand) => {
              const isSelected = cand.id === activePartnerId;
              const lastMsg = messages
                .filter((m) => m.conversationId === cand.id || m.senderId === cand.id)
                .slice(-1)[0];

              return (
                <div
                  key={cand.id}
                  onClick={() => setActivePartnerId(cand.id)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white shadow-2xs' : 'hover:bg-white/60'
                  }`}
                >
                  <img
                    src={cand.avatarUrl}
                    alt={cand.fullName}
                    className="w-10 h-10 rounded-2xl object-cover border border-[#e2ece9]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#17222b] truncate">
                        {cand.fullName}
                      </h4>
                      {lastMsg && (
                        <span className="text-[10px] text-[#5f7572]">
                          {lastMsg.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5f7572] truncate mt-0.5">
                      {lastMsg ? lastMsg.text : 'Tap to start flat discussion'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Conversation Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-[#e2ece9] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activePartner.avatarUrl}
                alt={activePartner.fullName}
                className="w-10 h-10 rounded-2xl object-cover border border-[#e2ece9]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-sm text-[#17222b]">
                    {activePartner.fullName}
                  </h3>
                  {activePartner.isStudentVerified && <VerifiedBadge size="sm" />}
                </div>
                <p className="text-[11px] text-[#5f7572]">
                  {activePartner.courseYear} • {activePartner.college}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#10b981] bg-[#ecfdf5] px-2.5 py-1 rounded-full border border-[#a7f3d0] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" /> Online
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#f6f9f8]/60">
            {partnerMessages.length === 0 ? (
              <div className="text-center py-20 text-xs text-[#5f7572] max-w-sm mx-auto">
                No previous messages with {activePartner.fullName}. Break the ice! Discuss moving dates, Sector 23 flats, or sharing a cook.
              </div>
            ) : (
              partnerMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.isSelf
                        ? 'bg-[#117c74] text-white rounded-br-xs shadow-2xs'
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

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-4 border-t border-[#e2ece9] bg-white flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activePartner.fullName}...`}
              className="flex-1 px-4 py-2.5 text-xs bg-[#f6f9f8] border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#117c74] hover:bg-[#0d635c] text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
