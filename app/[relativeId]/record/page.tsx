'use client';

import AudioReactiveElement from '@/components/audio-reaction-2';
import { Card } from '@/components/ui/card';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';

type Props = {
  params: { relativeId: string };
};

const Page = ({ params }: Props) => {
  const [recording, setRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [parseData, setParseData] = useState<any>(null);

  const [setItem, getItem, removeItem] = useLocalStorage('stories', {
    nodes: [],
    links: [],
  });

  const router = useRouter();

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
      const { transcript } = await res.json();
      console.log('transcript', transcript);

      setLoading(true);
      const url = new URL('http://localhost:3000/api/parse');
      url.searchParams.append('transcript', transcript);
      const parseRes = await fetch(url);
      const parseData = await parseRes.json();
      console.log('parseData', parseData);
      setParseData(parseData);
      setLoading(false);
    };
    mediaRecorder.current.stop();
  };

  return (
    <div>
      {loading ? (
        <p className='w-screen h-screen flex justify-center items-center'>
          Loading...
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src='https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca.gif'
            alt='loading'
          />
        </p>
      ) : !parseData ? (
        <>
          <h1 className='font-bold text-xl text-center'>
            Record {params.relativeId}
          </h1>
          <AudioReactiveElement
            recording={recording}
            handleClick={handleRecordButtonClick}
          />
        </>
      ) : (
        <div className='m-[100px] flex flex-col justify-center items-center gap-4'>
          <h1 className='text-lg font-bold'>{`${params.relativeId}'s Story:`}</h1>
          <p>{`${parseData.title}`}</p>
          <p>{`${parseData.time}`}</p>
          <p>{`${parseData.place}`}</p>
          <p>{`Summary: ${parseData.summary}`}</p>
          <button
            onClick={() => {
              const prev = getItem();
              const newNode = {
                id: prev.nodes.length,
                name: parseData.title,
                val: 10,
                neighbors: [],
                links: [],
              };
              const randomIds = getRandomIdsInRange(
                0,
                prev.nodes.length - 1,
                3
              );
              const newLinks = randomIds.map((id) => ({
                source: newNode.id,
                target: id,
              }));
              console.log('newLinks', newLinks);
              setItem({
                nodes: [...prev.nodes, newNode],
                links: [...prev.links, ...newLinks],
              });
              router.push(`/${params.relativeId}`);
            }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );

  function handleRecordButtonClick() {
    if (recording) stopRecording();
    else startRecording();
  }
};

function getRandomIdsInRange(min, max, count) {
  const randomIds = [];
  while (randomIds.length < count) {
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randomIds.indexOf(randomId) === -1) {
      randomIds.push(randomId);
    }
  }
  return randomIds;
}

export default Page;
