import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

const AudioReactiveButton = ({
  recording,
  handleClick,
}: {
  recording: boolean;
  handleClick: () => void;
}) => {
  const [audioLevel, setAudioLevel] = useState<number>(0);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let animationFrameId: number | null = null;
    let stream: MediaStream | null = null; // Store the stream for cleanup

    // Request access to the microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((mediaStream) => {
        stream = mediaStream; // Assign stream for later cleanup
        audioContext = new window.AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        microphone.connect(analyser);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Function to process the audio data
        const processAudio = () => {
          analyser.getByteFrequencyData(dataArray);

          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setAudioLevel(average);

          animationFrameId = requestAnimationFrame(processAudio);
        };

        processAudio();
      })
      .catch((error) => {
        console.error('Error accessing the microphone', error);
      });

    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (audioContext) {
        audioContext.close();
      }
      // Stop all media tracks to properly release the microphone
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const size = recording
    ? 10 + (audioLevel / 10 > 10 ? 10 : audioLevel / 10)
    : 10; // Ensure a minimum size for visibility

  return (
    <>
      <style>
        {`
        @keyframes pulseShadow {
            0%, 100% {
            box-shadow: 0 0 0px 0px rgba(59, 130, 246, 0.7);
            }
            50% {
            box-shadow: 0 0 15px 15px rgba(59, 130, 246, 0.5);
            }
        }

        .hover-pulse-shadow:hover {
            animation: pulseShadow 3s infinite;
        }
        `}
      </style>
      <div className='flex justify-center items-center h-screen'>
        <div className='text-center'>
          <div
            onClick={handleClick}
            className='rounded-full mx-auto flex justify-center items-center cursor-pointer hover:shadow-xl transition-shadow duration-1000 ease-in-out hover-pulse-shadow'
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%), 
                                radial-gradient(circle at 100% 100%, #ffdde1 0%, #ee9ca7 100%)`,
              backgroundBlendMode: 'screen',
              width: `${size}rem`,
              height: `${size}rem`,
              transition: 'width 0.05s ease-in-out, height 0.05s ease-in-out',
            }}
          >
            {recording ? (
              <PauseIcon className='w-16 h-16' />
            ) : (
              <MicIcon className='w-16 h-16' />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

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

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect width='4' height='16' x='6' y='4' />
      <rect width='4' height='16' x='14' y='4' />
    </svg>
  );
}
export default AudioReactiveButton;
