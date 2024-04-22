import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css'; // Import the CSS file for styling

const socket = io('http://localhost:8080');

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = () => {
    const newMessage = {
      sender: 'You',
      message: input
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    socket.emit('chat message', input);
    setInput('');
  };

  return (
    <div className="container">
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}
            >
              <span className="sender">{msg.sender}</span>
              <span className="message">{msg.message}</span>
            </div>
          ))}
        </div>
        <input
          type="text"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
