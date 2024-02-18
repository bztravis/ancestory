import { z } from "zod";
import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";

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

// transcript dummy data
const transcript =
  "Back in Mumbai, I dreamed about going to the University of Michigan. Over there, I met JMo and Brian. Brian was cool.";

// Make the request to the AI
try {
  console.log(process.env.TOGETHERAPI_KEY);
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
    model: "meta-llama/Llama-2-13b-chat-hf",
    response_model: {
      schema: StorySchema,
      name: "AnalyzeStory",
    },
    max_tokens: 1000,
    temperature: 0.8,
  });
  // print the response
  // console.log(JSON.stringify(response, null, 2));
  console.log(response);
  // return it
  return response;
} catch (error) {
  console.log("Failed to extract information from the transcript:", error);
  throw error;
}

extractInformation(transcript)
  .then((response) => console.log(response))
  .catch((error) => console.log(error));
