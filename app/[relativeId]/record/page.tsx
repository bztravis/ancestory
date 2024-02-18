'use client';

import AudioReactiveElement from '@/components/audio-reaction-2';
import { Card } from '@/components/ui/card';
import { useState, useRef } from 'react';

type Props = {
  params: { relativeId: string };
};

const Page = ({ params }: Props) => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audio, setAudio] = useState<string | null>(null);

  const getStream = async () => {
    console.log('perm');
    if ('MediaRecorder' in window) {
      try {
        const streamData = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        return streamData;
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error('Microphone is not supported in your browser.');
    }
  };

  const startRecording = async () => {
    const streamData = await getStream();

    if (!streamData) return;

    setRecording(true);
    const media = new MediaRecorder(streamData, { mimeType: 'audio/webm' });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    const localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async () => {
    setRecording(false);
    if (!mediaRecorder.current) return;
    let audioUrl = null;
    mediaRecorder.current.onstop = async () => {
      const audioBlob1 = new Blob(audioChunks, { type: 'audio/webm' });
      audioUrl = URL.createObjectURL(audioBlob1);
      setAudio(audioUrl);
      setAudioChunks([]);

      console.log('audioUrl', audioUrl);

      const response = await fetch(`${audioUrl}`);
      const audioBlob = await response.blob();
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('url', `blob:${audioUrl}`);
      console.log('audioBlob', audioBlob);

      const res = await fetch('/api/transcription', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log(data);
    };
    mediaRecorder.current.stop();
  };

  return (
    <div>
      <h1 className='font-bold text-xl text-center'>
        Record {params.relativeId}
      </h1>
      {audio}
      <AudioReactiveElement
        recording={recording}
        handleClick={handleRecordButtonClick}
      />
    </div>
  );

  function handleRecordButtonClick() {
    if (recording) stopRecording();
    else startRecording();
  }
};

export default Page;
