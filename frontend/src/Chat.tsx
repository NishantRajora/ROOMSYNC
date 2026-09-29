import React, { useState, useEffect, useRef } from 'react';

export interface ChatProps {
  api: string;
  currentUser: string;
  onNotify: (msg: string) => void;
}

export interface Conversation {
  id: number;
  participant_1: string;
  participant_2: string;
  listing_id: number;
  created_at: string;
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender: string;
  text: string;
  created_at: string;
  read: number;
}

export function Chat({ api, currentUser, onNotify }: ChatProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const baseApi = api.replace(/\/api\/?$/, "") + "/api";

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${baseApi}/chat/conversations/?user=${encodeURIComponent(currentUser)}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.error('Failed to fetch conversations', e);
    }
  };

  const fetchMessages = async (convId: number) => {
    try {
      const res = await fetch(`${baseApi}/chat/messages/?conversation_id=${convId}&user=${encodeURIComponent(currentUser)}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error('Failed to fetch messages', e);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 3000);
    return () => clearInterval(interval);
  }, [baseApi, currentUser]);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id);
      const interval = setInterval(() => {
        fetchMessages(selectedConv.id);
      }, 3000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [baseApi, currentUser, selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConv) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${baseApi}/chat/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: selectedConv.id,
          sender: currentUser,
          text: inputText.trim()
        })
      });

      if (res.ok) {
        setInputText('');
        fetchMessages(selectedConv.id);
        fetchConversations();
      } else {
        const data = await res.json();
        onNotify(data.error || 'Failed to send message');
      }
    } catch (e) {
      onNotify('Network error sending message');
    } finally {
      setIsLoading(false);
    }
  };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participant_1 === currentUser ? conv.participant_2 : conv.participant_1;
  };

  return (
    <div className="chat-container" style={{ display: 'flex', height: '100%', minHeight: '500px', border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      <div className="chat-sidebar" style={{ width: '300px', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', backgroundColor: '#f9f9f9' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>
          Conversations
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {conversations.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No conversations yet</div>
          ) : (
            conversations.map(conv => {
              const other = getOtherParticipant(conv);
              const isSelected = selectedConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  className={`chat-conv-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedConv(conv)}
                  style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #eee', backgroundColor: isSelected ? '#e3f2fd' : 'transparent', display: 'flex', alignItems: 'center' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2196f3', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '12px' }}>
                    {other.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{other}</div>
                      {conv.unread_count > 0 && (
                        <div style={{ backgroundColor: '#f44336', color: 'white', fontSize: '12px', borderRadius: '10px', padding: '2px 6px', fontWeight: 'bold' }}>
                          {conv.unread_count}
                        </div>
                      )}
                    </div>
                    <div style={{ color: '#666', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {conv.last_message || 'New conversation'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
        {selectedConv ? (
          <>
            <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              Chat with {getOtherParticipant(selectedConv)}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>No messages yet. Say hi!</div>
              ) : (
                messages.map(msg => {
                  const isMine = msg.sender === currentUser;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%',
                        padding: '10px 14px',
                        borderRadius: '16px',
                        backgroundColor: isMine ? '#2196f3' : '#f1f0f0',
                        color: isMine ? 'white' : 'black',
                        borderBottomRightRadius: isMine ? '4px' : '16px',
                        borderBottomLeftRadius: isMine ? '16px' : '4px'
                      }}>
                        <div style={{ wordBreak: 'break-word' }}>{msg.text}</div>
                        <div style={{ fontSize: '11px', color: isMine ? '#bbdefb' : '#999', textAlign: 'right', marginTop: '4px' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#2196f3', color: 'white', border: 'none', cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
