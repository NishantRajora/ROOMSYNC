import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Send, MessageSquare, Plus, Search, X, Users, Compass, ShieldCheck } from 'lucide-react';
import { VerifiedBadge } from '../components/common/VerifiedBadge';
import { ChatMessage, UserProfile } from '../types';
import { isMessageInConversation } from '../utils/chatUtils';

interface ActiveConversationPartner {
  id: string;
  fullName: string;
  avatarUrl?: string;
  subtitle: string;
  isVerified: boolean;
  isStudentVerified?: boolean;
  isLandlord?: boolean;
  lastMsg?: ChatMessage;
}

// Robust message matching between two users across symmetric and legacy conversation IDs
const isMsgBetween = isMessageInConversation;

export const MessagesPage: React.FC = () => {
  const {
    currentUser,
    messages,
    sendMessage,
    candidates,
    listings,
    activeChatRecipient,
    setActiveChatRecipient,
    setActiveTab,
    registeredAccounts,
  } = useApp();

  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Filter messages strictly for the current user
  const userMessages = useMemo(() => {
    return messages.filter((m) => {
      if (!m || m.id === 'msg_1' || m.id === 'msg_2') return false;
      return (
        m.senderId === currentUser.id ||
        m.recipientId === currentUser.id ||
        (m.conversationId && (
          m.conversationId === currentUser.id ||
          m.conversationId.includes(currentUser.id) ||
          m.senderId === currentUser.id
        ))
      );
    });
  }, [messages, currentUser.id]);

  // 2. Identify only those users with whom a conversation has been started
  const activeConversations = useMemo<ActiveConversationPartner[]>(() => {
    const partnerIds = new Set<string>();

    // If an active chat recipient was opened via "Chat" button elsewhere, include them
    if (activeChatRecipient?.id && activeChatRecipient.id !== currentUser.id) {
      partnerIds.add(activeChatRecipient.id);
    }

    // Include all partners from exchanged messages
    userMessages.forEach((m) => {
      let partnerId: string | undefined;
      if (m.senderId === currentUser.id) {
        partnerId = m.recipientId;
        if (!partnerId && m.conversationId) {
          const parts = m.conversationId.split('_');
          partnerId = parts.find((p) => p !== currentUser.id);
        }
      } else {
        partnerId = m.senderId;
      }
      if (partnerId && partnerId !== currentUser.id) {
        partnerIds.add(partnerId);
      }
    });

    const list: ActiveConversationPartner[] = [];

    partnerIds.forEach((id) => {
      const candidate = candidates.find((c) => c.id === id);
      const registered = registeredAccounts.find((a) => a.id === id || a.profile?.id === id)?.profile;
      const listing = listings.find((l) => l.ownerId === id);
      const recipientMatch = activeChatRecipient?.id === id ? activeChatRecipient : null;

      const msgsForPartner = userMessages.filter((m) => isMsgBetween(m, currentUser.id, id));
      const lastMsg = msgsForPartner[msgsForPartner.length - 1];

      let fullName = candidate?.fullName || registered?.fullName || listing?.landlordName || recipientMatch?.name;
      if (!fullName) {
        const namedMsg = msgsForPartner.find((m) => m.senderId === id || m.recipientId === id);
        fullName = (namedMsg?.senderId === id ? namedMsg?.senderName : namedMsg?.recipientName) || 'Roommate Match';
      }

      let subtitle = 'Flatmate Candidate';
      if (candidate) {
        subtitle = `${candidate.courseYear || 'Student'} • ${candidate.college || 'College'}`;
      } else if (registered) {
        subtitle = `${registered.courseYear || registered.company || 'Student'} • ${registered.college || registered.userType || 'Verified'}`;
      } else if (listing) {
        subtitle = `Verified Landlord • ${listing.locality}`;
      }

      const avatarUrl = candidate?.avatarUrl || registered?.avatarUrl || recipientMatch?.avatarUrl;
      const isVerified = Boolean(
        candidate?.isStudentVerified || candidate?.isProfessionalVerified ||
        registered?.isStudentVerified || registered?.isProfessionalVerified ||
        listing?.landlordVerified
      );

      list.push({
        id,
        fullName,
        avatarUrl,
        subtitle,
        isVerified,
        isStudentVerified: Boolean(candidate?.isStudentVerified || registered?.isStudentVerified),
        isLandlord: Boolean(listing),
        lastMsg,
      });
    });

    return list;
  }, [userMessages, activeChatRecipient, candidates, registeredAccounts, listings, currentUser.id]);

  // Sync selected partner ID
  useEffect(() => {
    if (activeChatRecipient?.id && activeConversations.some((c) => c.id === activeChatRecipient.id)) {
      setSelectedPartnerId(activeChatRecipient.id);
    } else if (selectedPartnerId && activeConversations.some((c) => c.id === selectedPartnerId)) {
      // keep current selection
    } else if (activeConversations.length > 0) {
      setSelectedPartnerId(activeConversations[0].id);
    } else {
      setSelectedPartnerId(null);
    }
  }, [activeConversations, activeChatRecipient]);

  const activePartner = useMemo(() => {
    if (!selectedPartnerId) return null;
    return activeConversations.find((c) => c.id === selectedPartnerId) || null;
  }, [activeConversations, selectedPartnerId]);

  const partnerMessages = useMemo(() => {
    if (!activePartner) return [];
    return userMessages.filter((m) => isMsgBetween(m, currentUser.id, activePartner.id));
  }, [userMessages, activePartner, currentUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [partnerMessages, activePartner]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePartner) return;
    sendMessage(activePartner.id, activePartner.fullName, inputText.trim());
    setInputText('');
  };

  const startChatWith = (partner: { id: string; name: string; avatarUrl?: string }) => {
    setActiveChatRecipient(partner);
    setSelectedPartnerId(partner.id);
    setIsNewChatModalOpen(false);
  };

  // Filter candidates & registered accounts for the New Chat Modal
  const availableCandidates = useMemo(() => {
    const map = new Map<string, { id: string; fullName: string; email?: string; avatarUrl?: string; subtitle: string; isVerified: boolean }>();

    candidates.forEach((c) => {
      if (c.id !== currentUser.id) {
        map.set(c.id, {
          id: c.id,
          fullName: c.fullName,
          email: c.email,
          avatarUrl: c.avatarUrl,
          subtitle: `${c.courseYear || 'Student'} • ${c.college || 'College'}`,
          isVerified: Boolean(c.isStudentVerified || c.isProfessionalVerified),
        });
      }
    });

    registeredAccounts.forEach((acc) => {
      const p = acc.profile;
      if (p && p.id && p.id !== currentUser.id) {
        map.set(p.id, {
          id: p.id,
          fullName: p.fullName,
          email: p.email,
          avatarUrl: p.avatarUrl,
          subtitle: `${p.courseYear || p.company || 'Student'} • ${p.college || p.userType || 'Verified'}`,
          isVerified: Boolean(p.isStudentVerified || p.isProfessionalVerified),
        });
      }
    });

    return Array.from(map.values()).filter(
      (c) =>
        c.fullName.toLowerCase().includes(newChatSearch.toLowerCase()) ||
        c.email?.toLowerCase().includes(newChatSearch.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(newChatSearch.toLowerCase())
    );
  }, [candidates, registeredAccounts, currentUser.id, newChatSearch]);

  const availableLandlords = useMemo(() => {
    const map = new Map<string, { id: string; name: string; locality: string }>();
    listings.forEach((l) => {
      if (l.ownerId && l.ownerId !== currentUser.id && !map.has(l.ownerId)) {
        if (
          l.landlordName.toLowerCase().includes(newChatSearch.toLowerCase()) ||
          l.locality.toLowerCase().includes(newChatSearch.toLowerCase())
        ) {
          map.set(l.ownerId, {
            id: l.ownerId,
            name: l.landlordName,
            locality: l.locality,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [listings, currentUser.id, newChatSearch]);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#17222b] tracking-tight">
            Flatmate & Listing Messages
          </h1>
          <p className="text-xs text-[#5f7572] mt-0.5">
            Real-time conversations with prospective roommates and verified landlords.
          </p>
        </div>

        <button
          onClick={() => setIsNewChatModalOpen(true)}
          className="px-3.5 py-2 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-[#e2ece9] overflow-hidden shadow-2xs flex">
        {/* Left Conversation List (w-80) */}
        <div className="w-80 border-r border-[#e2ece9] bg-[#f6f9f8] flex flex-col">
          <div className="p-3.5 border-b border-[#e2ece9] bg-white flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5f7572]">
              Active Chats ({activeConversations.length})
            </span>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="text-[#117c74] hover:text-[#0d635c] text-xs font-medium flex items-center gap-1 cursor-pointer"
              title="Start a new chat"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#e2ece9]">
            {activeConversations.length === 0 ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e2ece9]/60 flex items-center justify-center mx-auto text-[#5f7572]">
                  <MessageSquare className="w-6 h-6 opacity-60" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#17222b]">No active chats yet</h4>
                  <p className="text-[11px] text-[#5f7572] mt-1 leading-relaxed">
                    Conversations you start with flatmates or landlords will appear here.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="w-full py-2 bg-white hover:bg-[#117c74] hover:text-white text-[#117c74] border border-[#117c74] text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Start a Conversation
                </button>
              </div>
            ) : (
              activeConversations.map((cand) => {
                const isSelected = cand.id === selectedPartnerId;
                const lastMsg = cand.lastMsg;

                return (
                  <div
                    key={cand.id}
                    onClick={() => {
                      setSelectedPartnerId(cand.id);
                      setActiveChatRecipient({
                        id: cand.id,
                        name: cand.fullName,
                        avatarUrl: cand.avatarUrl,
                      });
                    }}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'bg-white shadow-2xs border-l-4 border-l-[#117c74]' : 'hover:bg-white/60'
                      }`}
                  >
                    {cand.avatarUrl ? (
                      <img
                        src={cand.avatarUrl}
                        alt={cand.fullName}
                        className="w-10 h-10 rounded-2xl object-cover border border-[#e2ece9] shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-2xl bg-[#117c74]/10 text-[#117c74] font-bold text-xs flex items-center justify-center border border-[#117c74]/20 shrink-0">
                        {cand.fullName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#17222b] truncate flex items-center gap-1">
                          {cand.fullName}
                          {cand.isVerified && <VerifiedBadge size="sm" />}
                        </h4>
                        {lastMsg && (
                          <span className="text-[10px] text-[#5f7572] shrink-0 ml-1">
                            {lastMsg.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#5f7572] truncate mt-0.5">
                        {lastMsg
                          ? (lastMsg.senderId === currentUser.id ? `You: ${lastMsg.text}` : lastMsg.text)
                          : 'Conversation initiated'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Conversation Area */}
        <div className="flex-1 flex flex-col bg-white">
          {!activePartner ? (
            /* Empty State when no conversation has been started yet */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#f6f9f8]/40">
              <div className="w-16 h-16 rounded-3xl bg-[#117c74]/10 text-[#117c74] flex items-center justify-center mb-4 border border-[#117c74]/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#17222b]">
                No conversations started yet
              </h3>
              <p className="text-xs text-[#5f7572] max-w-md mt-1.5 leading-relaxed">
                Connect with compatible flatmates or verified property landlords. Reach out to discuss move-in dates, rent splitting, flat visits, or shared routines!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 max-w-lg w-full">
                <button
                  onClick={() => setActiveTab('matches')}
                  className="p-3 bg-white hover:border-[#117c74] border border-[#e2ece9] rounded-2xl flex flex-col items-center text-center transition-all shadow-2xs group cursor-pointer"
                >
                  <Users className="w-5 h-5 text-[#117c74] mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#17222b]">Find Flatmates</span>
                  <span className="text-[10px] text-[#5f7572] mt-0.5">Roommate Matches</span>
                </button>

                <button
                  onClick={() => setActiveTab('discover')}
                  className="p-3 bg-white hover:border-[#117c74] border border-[#e2ece9] rounded-2xl flex flex-col items-center text-center transition-all shadow-2xs group cursor-pointer"
                >
                  <Compass className="w-5 h-5 text-[#117c74] mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#17222b]">Discover Flats</span>
                  <span className="text-[10px] text-[#5f7572] mt-0.5">Verified Listings</span>
                </button>

                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="p-3 bg-[#117c74] hover:bg-[#0d635c] text-white rounded-2xl flex flex-col items-center text-center transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-bold">Start a Chat</span>
                  <span className="text-[10px] text-white/80 mt-0.5">Pick candidate</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 border-b border-[#e2ece9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activePartner.avatarUrl ? (
                    <img
                      src={activePartner.avatarUrl}
                      alt={activePartner.fullName}
                      className="w-10 h-10 rounded-2xl object-cover border border-[#e2ece9]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-[#117c74]/10 text-[#117c74] font-bold text-xs flex items-center justify-center border border-[#117c74]/20">
                      {activePartner.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-sm text-[#17222b]">
                        {activePartner.fullName}
                      </h3>
                      {activePartner.isVerified && <VerifiedBadge size="sm" />}
                    </div>
                    <p className="text-[11px] text-[#5f7572]">
                      {activePartner.subtitle}
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
                  <div className="text-center py-20 text-xs text-[#5f7572] max-w-sm mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#117c74]/10 text-[#117c74] flex items-center justify-center mx-auto">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-[#17222b]">
                      No messages with {activePartner.fullName} yet
                    </p>
                    <p className="text-[11px] text-[#5f7572]">
                      Break the ice! Discuss moving dates, flat sharing, bills, or schedule an in-person flat visit.
                    </p>
                  </div>
                ) : (
                  partnerMessages.map((msg) => {
                    const isSelf = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed ${isSelf
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
                    );
                  })
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
            </>
          )}
        </div>
      </div>

      {/* Start New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#e2ece9] max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#e2ece9] flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-base text-[#17222b]">Start a Conversation</h3>
                <p className="text-xs text-[#5f7572]">Select a flatmate candidate or landlord to message</p>
              </div>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-1 text-[#5f7572] hover:text-[#17222b] hover:bg-[#f6f9f8] rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-3 border-b border-[#e2ece9] bg-[#f6f9f8]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#5f7572]" />
                <input
                  type="text"
                  value={newChatSearch}
                  onChange={(e) => setNewChatSearch(e.target.value)}
                  placeholder="Search by name, college, or locality..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#e2ece9] rounded-xl focus:outline-none focus:border-[#117c74] text-[#17222b]"
                />
              </div>
            </div>

            {/* Modal List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Roommate Candidates */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5f7572] mb-2">
                  Flatmate Candidates
                </h4>
                {availableCandidates.length === 0 ? (
                  <p className="text-xs text-[#5f7572] py-2">No matching flatmates found.</p>
                ) : (
                  <div className="space-y-2">
                    {availableCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        className="p-2.5 rounded-2xl border border-[#e2ece9] hover:border-[#117c74] hover:bg-[#f6f9f8] flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {cand.avatarUrl ? (
                            <img
                              src={cand.avatarUrl}
                              alt={cand.fullName}
                              className="w-9 h-9 rounded-xl object-cover border border-[#e2ece9] shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-[#117c74]/10 text-[#117c74] font-bold text-xs flex items-center justify-center border border-[#117c74]/20 shrink-0">
                              {cand.fullName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-[#17222b] truncate flex items-center gap-1">
                              {cand.fullName}
                              {cand.isVerified && <VerifiedBadge size="sm" />}
                            </h5>
                            <p className="text-[11px] text-[#5f7572] truncate">
                              {cand.subtitle}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            startChatWith({
                              id: cand.id,
                              name: cand.fullName,
                              avatarUrl: cand.avatarUrl,
                            })
                          }
                          className="px-3 py-1.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all shrink-0 cursor-pointer"
                        >
                          Chat
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Landlords */}
              {availableLandlords.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5f7572] mb-2 mt-4">
                    Verified Landlords
                  </h4>
                  <div className="space-y-2">
                    {availableLandlords.map((landlord) => (
                      <div
                        key={landlord.id}
                        className="p-2.5 rounded-2xl border border-[#e2ece9] hover:border-[#117c74] hover:bg-[#f6f9f8] flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#117c74]/10 text-[#117c74] font-bold text-xs flex items-center justify-center border border-[#117c74]/20 shrink-0">
                            {landlord.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-[#17222b] truncate flex items-center gap-1">
                              {landlord.name}
                              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                            </h5>
                            <p className="text-[11px] text-[#5f7572] truncate">
                              Property in {landlord.locality}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            startChatWith({
                              id: landlord.id,
                              name: landlord.name,
                            })
                          }
                          className="px-3 py-1.5 bg-[#117c74] hover:bg-[#0d635c] text-white text-xs font-semibold rounded-xl transition-all shrink-0 cursor-pointer"
                        >
                          Contact
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
