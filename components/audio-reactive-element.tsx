import { useEffect, useRef, useState } from 'react';

const AudioReactiveCircle = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const context = new AudioContext();
    const analyserNode = context.createAnalyser();
    setAudioContext(context);
    setAnalyser(analyserNode);

    // Set up audio processing here...

    // Animation loop
    const renderLoop = () => {
      if (!canvasRef.current || !analyser) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(dataArray);

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;

      // Use average to draw a circle
      const radius = average; // Modify this calculation as needed
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
      ctx.fill();

      requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      context.close();
    };
  }, []);

  return <canvas ref={canvasRef} className='w-full h-full'></canvas>;
};

export default AudioReactiveCircle;
