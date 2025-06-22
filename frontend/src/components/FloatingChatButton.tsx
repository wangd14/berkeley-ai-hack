import React, { useState, useEffect } from 'react';
import './FloatingChatButton.css';

const GREETING = "Hi! I'm your AI math helper. How can I assist you today?";

const FloatingChatButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: GREETING }]);
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [
      ...msgs,
      { role: 'user', content: input },
      { role: 'assistant', content: 'This is a mock LLM response.' }
    ]);
    setInput('');
  };

  return (
    <>
      {!open && (
        <button className="floating-chat-btn" onClick={() => setOpen(true)}>
          💬
        </button>
      )}
      {open && (
        <div className="chat-side-window">
          <div className="chat-header">
            <span>AI Chat</span>
            <button onClick={() => setOpen(false)} className="close-btn">×</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-msg ${msg.role}`}>{msg.content}</div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatButton;
