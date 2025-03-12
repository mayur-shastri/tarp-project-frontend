import React, { useState } from 'react';
import axios from 'axios';
import './inputPage.css';

const InputPage = () => {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  const handleInputChange = (event) => {
    setText(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // First, call the /generate-text endpoint to get the response text
      const generateTextEndPoint = `${import.meta.env.VITE_BACKEND_URL}/gcp/generate-text`;
      const generateTextRes = await axios.post(generateTextEndPoint, { prompt : text });
      const responseText = generateTextRes.data.text;
      setResponse(responseText);
      // Then, call the /text-to-speech endpoint to generate the audio
      const textToSpeechEndPoint = `${import.meta.env.VITE_BACKEND_URL}/gcp/text-to-speech`;
      const textToSpeechRes = await axios.post(textToSpeechEndPoint, { text: responseText });
      setAudioSrc(`data:audio/mp3;base64,${textToSpeechRes.data.audioContent}`);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the backend server.');
    }
  }

  return (
    <div className="input-page">
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={text} 
          onChange={handleInputChange} 
          placeholder="Type your message here..." 
        />
        <button type="submit">Send</button>
      </form>
      {response && <div className="response">{response}</div>}
      {audioSrc && <audio src={audioSrc} controls />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default InputPage;