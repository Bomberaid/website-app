import React, { useState, useRef } from "react";
import axios from "axios";

import Row from 'react-bootstrap/Row';
import { Stack } from "react-bootstrap";
import { LiveAudioVisualizer } from "react-audio-visualize";

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  let found: boolean = false;
  const [animeFound, setAnimeFound] = useState<string | null>(null);
  const [imageFound, setImageFound] = useState<string | null>(null);
  const [songFound, setSongFound] = useState<string | null>(null);
  const [artistFound, setArtistFound] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  
  const startRecording = async () => {
    try {
      const headers = {
        "content-type": "multipart/form-data"
      };
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      setMediaRecorder(mediaRecorder);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      let timeout: number = 0;
      let timeoutThreshold: number = 5;

      mediaRecorder.ondataavailable = (event) => {
        if (timeout < timeoutThreshold) {
          timeout += 1;
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
          
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          const formData = new FormData();
          formData.append('audio-file', audioBlob);
          
          if (found == false) {
            axios
            .post("https://bomberaid.pythonanywhere.com/recognize", formData, { headers }) //.post("http://127.0.0.1:5000/recognize", formData, { headers })
            .then((res) => {
              if (res.status == 200) {
                setAnimeFound(res.data[0]);
                setImageFound(res.data[1]);
                setSongFound(res.data[2]);
                setArtistFound(res.data[3]);
                
                stopRecording();
                found = true;     // This boolean has to be after the stopRecording()
              }
            })}
          }
        else {
          stopRecording();
          found = true;
          setAnimeFound("Could not Find Song");
          setImageFound(null);
          setSongFound(null);
          setArtistFound(null);
        }
      };
        
        
      mediaRecorder.start(2000);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    found = false;
  };

  return (
    <Stack className="container" gap={2}>
      {(!animeFound && !isRecording) && (
        <Row>
        <h2>What is that anime?</h2>
      </Row>
    )}
      {(imageFound && !isRecording) && (
        <Row className="mb-4">
          <div>
            <img src={imageFound}></img>
          </div>
        </Row>
      )}
      {(animeFound && !isRecording) && (
        <Row className="mb-4">
          <h1>{animeFound}</h1>
        </Row>
      )}
      {(songFound && !isRecording) && (
        <Row>
          <h4>{songFound}</h4>
        </Row>
      )}
      {(artistFound && !isRecording) && (
        <Row>
          <h5>{artistFound}</h5>
        </Row>
      )}
      {(mediaRecorder && isRecording) && (
        <div>
          <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            width={1000}
            height={500}
            barWidth={8}
            barColor="rgb(0, 77, 157)"
            gap={3}
        />
        </div>
      )}
      <Row>
        <button className="btn btn-lg btn-primary p-3 mt-4" onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop" : "Find That Anime!"}
        </button>
      </Row>
    </Stack>
  );
};

export default AudioRecorder;
