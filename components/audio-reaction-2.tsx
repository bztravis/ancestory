import React, { useEffect, useState } from 'react';

const AudioReactiveElement = () => {
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    // Check if the browser supports getUserMedia
    if (!navigator.mediaDevices?.getUserMedia) {
      console.error(
        'Media Devices API or getUserMedia is not supported in this browser.'
      );
      return;
    }

    // Request access to the microphone
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        microphone.connect(analyser);
        analyser.fftSize = 256; // You can adjust this value
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Function to process the audio data
        const processAudio = () => {
          analyser.getByteFrequencyData(dataArray);

          // Simple volume calculation
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;

          // Update the audio level state
          setAudioLevel(average);

          // Call the function repeatedly
          requestAnimationFrame(processAudio);
        };

        processAudio();
      })
      .catch((error) => {
        console.error('Error accessing the microphone', error);
      });

    // Cleanup function
    return () => {
      audioContext?.close();
    };
  }, []);

  return (
    <div>
      <h2>Audio Level: {audioLevel}</h2>
      {/* Visualize audio level - you can customize this part */}
      <div
        style={{ width: '100%', height: '10px', backgroundColor: 'lightgrey' }}
      >
        <div
          style={{
            width: `${audioLevel}px`,
            height: '10px',
            backgroundColor: 'green',
          }}
        ></div>
      </div>
    </div>
  );
};

export default AudioReactiveElement;
