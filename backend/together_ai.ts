import OpenAI from "openai";
import Instructor from "@instructor-ai/instructor";
import { z } from "zod";

//const TOGETHERAPI_KEY =
//"f3bfe8246f4a072fe28fbe19c44ededf93a530d15c6dbc0be8974e80c8c97ba2";

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
  year: z.string().describe("The year the story took place").max(500),
  place: z.string().describe("The place the story is situated in"),
  characters: z
    .array(z.string())
    .describe("A list of unique names of characters mentioned in the story"),
});
