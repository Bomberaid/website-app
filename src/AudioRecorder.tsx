import React, { useState, useRef } from "react";
import axios from "axios";

import Row from 'react-bootstrap/Row';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  //const [audioURL, setAudioURL] = useState<string | null>(null);
  const [animeFound, setAnimeFound] = useState<string | null>(null);
  const [imageFound, setImageFound] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const headers = {
        "content-type": "multipart/form-data"
      };
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        // const audioUrl = URL.createObjectURL(audioBlob);
        // setAudioURL(audioUrl);

        const formData = new FormData();
        formData.append('audio-file', audioBlob);

        axios
          .post("http://127.0.0.1:5000/recognize", formData, { headers })
          .then((res) => {
            setAnimeFound(res.data[0]);
            setImageFound(res.data[1]);
          })
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="container">
      <Row>
        <button className="btn btn-lg btn-primary" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? <i className="bi bi-mic-mute-fill"></i> : "Find That Anime!"}
        </button>
      </Row>
      {imageFound && (
        <Row>
          <div>
            <img src={imageFound}></img>
          </div>
        </Row>
      )}
      {animeFound && (
        <Row>
          <h2>{animeFound}</h2>
        </Row>
      )}
    </div>
  );
};

export default AudioRecorder;
