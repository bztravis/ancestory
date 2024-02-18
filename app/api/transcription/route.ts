import { NextResponse, type NextRequest } from 'next/server';
const { createClient } = require('@deepgram/sdk');

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export const runtime = 'experimental-edge';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  // query is "hello" for /api/search?query=hello
  // const audio;
  const formData = await request.formData();
  const audio = formData.get('audio');
  console.log('audio', audio);

  const arrayBuffer = await audio.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // console.log('buffer', buffer);

  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    // path to the audio file
    buffer,
    // STEP 3: Configure Deepgram options for audio analysis
    {
      model: 'nova-2',
      smart_format: true,
    }
  );

  console.log('result', result);
  console.log('error', error);

  // console.log(formData);
  // const formData = await request.json();
  // console.log(formData);

  return NextResponse.json({ hello: 'world' });
}
