'use client';

import { Card } from '@/components/ui/card';
import { useState, useRef } from 'react';

type Props = {
  params: { relativeId: string };
};

const Page = ({ params }: Props) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [permission, setPermission] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorder = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

  const getMicPerm = async () => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await window.navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error('Microphone is not supported in your browser.');
    }
  };

  const handleStartRecording = () => {
    if (!permission) {
      getMicPerm();
      return;
    }
    setRecording(true);
    // star recording
  };

  const handleStopRecording = () => {
    setRecording(false);
    // end recording
    // now start transcribing
  };

  return (
    <div>
      <h1>record {params.relativeId}</h1>
      <button
        onClick={() => {
          recording ? handleStopRecording() : handleStartRecording();
        }}
      >
        {recording ? 'Stop' : 'Record'}
      </button>
      {/* <RecordButton /> */}
    </div>
  );
};

export default Page;

function handleRecordButtonClick() {
  console.log('Record button clicked');
}

type RecordButtonProps = {
  recording: boolean;
};

export function RecordButton() {
  return (
    <Card className='w-full max-w-3xl'>
      <div className='p-4 grid gap-4'>
        <div className='flex items-center justify-center'>
          <button
            onClick={handleRecordButtonClick}
            className='h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center'
          >
            <MicIcon className='h-16 w-16 text-white' />
          </button>
        </div>
        <div className='text-center'>
          <p className='text-lg font-medium'>Ready to record?</p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Click the button below to start recording.
          </p>
        </div>
      </div>
    </Card>
  );
}

function ResumeIcon(props: React.SVGProps<SVGSVGElement>) {}

function MicIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z' />
      <path d='M19 10v2a7 7 0 0 1-14 0v-2' />
      <line x1='12' x2='12' y1='19' y2='22' />
    </svg>
  );
}
