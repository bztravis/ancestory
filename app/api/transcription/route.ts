import { NextResponse, type NextRequest } from 'next/server';
const { createClient } = require('@deepgram/sdk');

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // query is "hello" for /api/search?query=hello
  const audio;

  console.log('helo');
  console.log('searchParams', searchParams);

  return NextResponse.json({ hello: 'world' });
}

const transcribeAudio = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await fetch(audio);
  const audioBlob = await response.blob();
  const audioBuffer = await audioBlob.arrayBuffer();
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    // path to the audio file
    // STEP 3: Configure Deepgram options for audio analysis
    audioBuffer,
    {
      model: 'nova-2',
      smart_format: true,
    }
  );
  console.log(result, error);
};
