import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Poll() {
  const [responses, setResponses] = useState([]);
  const [pollData, setPollData] = useState({});

  useEffect(() => {
    fetch('/poll')
      .then(response => response.json())
      .then(data => setPollData(data));

    socket.on('update', (data) => {
      setResponses(data.newResults);
    });
  }, []);

  const handleVote = (option) => {
    socket.emit('vote', { option });
  };

  return (
    <div>
      <QRCode value="https://your-poll-url.com" />
      <h2>{pollData.pollQuestion}</h2>
      <ul>
        {pollData.options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleVote(option)}>{option}</button>
            <span>{responses[index]} votos</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Poll;