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
const StorySchema = z.object({
  title: z.string().describe("A short descriptive title of the story."),
  summary: z
    .string()
    .describe("A short summary of the story narrated")
    .max(1000),
  year: z.string().describe("The year the story took place").max(100),
  place: z.string().describe("The place the story is situated in"),
  characters: z
    .array(z.string())
    .describe("A list of unique names of characters mentioned in the story"),
});

export async function GET() {
  // transcript dummy data
  const transcript =
    "The 10th grade was one of my best years of my life. I became even closer with my best friends Mahima, Sanaya, Uthkrisht ";

  // Make the request to the AI
  try {
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "The following is a transcript of an audio recording between an individual and their older family member. This audio recording is a story being shared by the older family member. Extract a title, a summary, and a list of characters (names of people) mentioned in the story. Return it as a JSON object in this format: {title: string, summary: string, characters: [string, string, string, ...]}  ",
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
    console.log(response);
    return NextResponse.json({ response });
  } catch (error) {
    console.log("Failed to extract information from the transcript:", error);
    throw error;
  }
}
