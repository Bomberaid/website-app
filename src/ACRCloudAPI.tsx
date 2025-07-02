import React, { useState, useRef } from "react";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import CryptoJS from "crypto-js";

const ACRCloudAPI: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioBase64 = await blobToBase64(audioBlob);
        await identifyAudio(audioBase64);
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

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Encodes the blob as Base64
    });
  };

  const identifyAudio = async (audioBase64: string) => {
    const ACR_API_URL = "https://identify-us-west-2.acrcloud.com/v1/identify";
    const ACR_ACCESS_KEY = "4c43af6b5d8b839f10026cdf995834fd";
    const ACR_ACCESS_SECRET = "VHYljck7Y3rSjShGCzDwXuPcIT7pnDj6rZTSS7Ow";
    const timestamp = Math.floor(Date.now() / 1000);

    // Generate signature
    const stringToSign = `POST\n/v1/identify\n${ACR_ACCESS_KEY}\naudio\n1\n${timestamp}`;
    const signature = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA1(stringToSign, ACR_ACCESS_SECRET)
    );

    try {
      console.log({
        access_key: ACR_ACCESS_KEY,
        sample: audioBase64.replace(/^data:audio\/\w+;base64,/, ""),
        sample_bytes: audioBase64.length,
        signature,
        timestamp,
      });
      const response = await axios.post(
        ACR_API_URL,
        {
          access_key: ACR_ACCESS_KEY,
          sample: audioBase64.replace(/^data:audio\/\w+;base64,/, ""),
          sample_bytes: audioBase64.length,
          signature: signature,
          timestamp: timestamp,
          data_type: "audio",
          signature_version: 1
        },
      );

      console.log("API Response:", response.data);
      setResult(JSON.stringify(response.data, null, 2));
    } 
    catch (error) {
      console.error("Error identifying audio:", error);
      setResult("Failed to identify audio.");
    }
  };

  return (
    <div>
      <h1>ACRCloud Audio Recognition</h1>
      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
      {result && (
        <div>
          <h2>Result:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default ACRCloudAPI;
