import { useState } from 'react'
import axios from 'axios';

export default function TextToSpeech() {
    const [text, setText] = useState("");
    const [audioSrc, setAudioSrc] = useState(null);

    const handleInputChange = (event) => {
        setText(event.target.value);
    }

    const handleGenerateSpeech = async () => {
        try {
            const endPoint = `${import.meta.env.VITE_BACKEND_URL}/text-to-speech`;
            console.log(endPoint);
            console.log(text);
            const res = await axios.post(endPoint, { text });
            setAudioSrc(`data:audio/mp3;base64,${res.data.audioContent}`);
        }
        catch (err) {
            console.log(err.message);
        }
    }

    return (
        <>
            <div>
                <input type="text" onChange={handleInputChange} />
                <button onClick={handleGenerateSpeech}>Generate Speech</button>
            </div>
            {audioSrc && <audio src={audioSrc} controls />}
        </>
    )
}