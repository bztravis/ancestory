import { z } from "zod";
import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";
import { NextResponse } from "next/server";

// client
const togetherai = new OpenAI({
  apiKey: process.env.TOGETHERAPI_KEY,
  baseURL: "https://api.together.xyz/v1",
});

// Instructor to get structured JSON response
const client = Instructor({
  client: togetherai,
  mode: "JSON_SCHEMA",
});

// Schema for information retrieval from transcript
// TODO: character limit on title depending on the css of the graph
const StorySchema = z.object({
  title: z.string().describe("A short descriptive title of the story."),
  summary: z
    .string()
    .describe("A short summary of the story narrated")
    .max(2000),
  year: z.string().describe("The age at which this story took place").max(100),
  place: z.string().describe("The place the story is situated in"),
  characters: z
    .array(z.string())
    .describe("A list of unique names of characters mentioned in the story"),
});

// GET genAI response on information extracted from the story
export async function GET() {
  // transcript dummy data
  const transcript =
    "The summer after the 10th grade was one of the best summers of my life. I became closer to my best friends - Mahima, Sanaya, and Uthkrisht. I have known Mahima and Sanaya since the 5th grade and Uthkrisht since the 7th grade. We went to Acres Club to play badminton for 2 hours, followed by 1 hour of swimming, tasty spring rolls with sauce, and deep conversations on the way home. We would repeat this routine every single day and never get tired of it. On days when the temperature was very high, we'd play a board game at home instead. They're still my besties and I absolutelu love them.";

  // Make the request to the AI
  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "The following is a transcript of an audio recording between an individual and their older family member. This audio recording is a story being shared by the older family member. Extract a title, a summary, and a list of characters (names of people) mentioned in the story. Return it as a JSON object in this format: {title: string, summary: string, characters: [string, string, string, ...]} For any field you didn't get data for from the audio, put the response as 'N/A' in a string. Make sure the 'speaker' is featured as a character in every story narrated. ",
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      response_model: {
        schema: StorySchema,
        name: "AnalyzeStory",
      },
      max_tokens: 1000,
      temperature: 0.6,
    });
    // print the response
    // console.log(response);
    return NextResponse.json({ response });
  } catch (error) {
    //  console.log("Failed to extract information from the transcript:", error);
    throw error;
  }
}
