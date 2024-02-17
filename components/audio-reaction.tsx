import { useEffect, useRef } from 'react';

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        draw();
      })
      .catch((err) => console.error('Error accessing microphone:', err));

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      audioContext.close();
    };
  }, []);

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;

    if (ctx) {
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const averageVolume = sum / bufferLength;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the circle
      const radius = averageVolume; // Adjust as needed
      conso;
      ctx.beginPath();
      ctx.arc(canvas.width / 4, canvas.height / 4, radius, 0, 2 * Math.PI);
      ctx.fill();
    }

    animationFrameIdRef.current = requestAnimationFrame(draw);
  };

  return (
    <canvas
      ref={canvasRef}
      width='800'
      height='600'
      className='border'
    ></canvas>
  );
};

export default AudioVisualizer;
