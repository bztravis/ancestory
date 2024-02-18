'use client';

import AudioReactiveElement from '@/components/audio-reaction-2';
const { createClient } = require('@deepgram/sdk');
import { Card } from '@/components/ui/card';
import { useState, useRef } from 'react';

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

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

  const stopRecording = () => {
    setRecording(false);
    if (!mediaRecorder.current) return;
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const transcribeAudio = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await fetch(audio!);
    const audioBlob = await response.blob();
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      // path to the audio file
      // STEP 3: Configure Deepgram options for audio analysis
      {
        model: 'nova-2',
        smart_format: true,
      }
    );
  };

  return (
    <div>
      <h1>record {params.relativeId}</h1>
      <button
        onClick={() => {
          recording ? stopRecording() : startRecording();
        }}
      >
        {recording ? 'Stop' : 'Record'}
      </button>
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
