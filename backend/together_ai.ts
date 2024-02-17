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
