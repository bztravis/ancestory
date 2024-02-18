import { v } from "convex/values";
import { query } from "./_generated/server";
import { action } from "./_generated/server";
import { internalQuery, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { EXAMPLE_DATA } from "./constants";

export const similarNodes = action({
  args: {
    descriptionQuery: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Generate an embedding from third party API
    const embedding = await embed(args.descriptionQuery);
    // 2. Then search for similar stories!
    const results = await ctx.vectorSearch("nodes", "by_embedding", {
      vector: embedding,
    });
    const filteredResults = results.filter((result) => result._score >= 0.9);
    console.log(filteredResults.length);
    return filteredResults;
  },
});

export const populate = action({
  args: {},
  handler: async (ctx) => {
    console.log("Inside populate");
    for (const doc of EXAMPLE_DATA) {
      const embedding = await embed(doc.summary);
      console.log(embedding);
      await ctx.runMutation(internal.nodes.insertRow, {
        title: doc.title,
        summary: doc.summary,
        characters: doc.characters, // Defines 'characters' as an array of strings
        place: doc.place, // Defines 'place' as a string
        time: doc.time, // Defines 'time' as a string
        neighbors: doc.neighbors,
        embedding: embedding,
      });
    }
  },
});

export const insertRow = internalMutation({
  args: {
    title: v.string(),
    summary: v.string(),
    characters: v.array(v.string()), // Defines 'characters' as an array of strings
    place: v.string(), // Defines 'place' as a string
    time: v.string(), // Defines 'time' as a string
    neighbors: v.array(v.string()),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("nodes", args);
  },
});

export const insert = action({
  args: {
    title: v.string(),
    summary: v.string(),
    characters: v.array(v.string()), // Defines 'characters' as an array of strings
    place: v.string(), // Defines 'place' as a string
    time: v.string(), // Defines 'time' as a string
    neighbors: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const embedding = await embed(args.summary);
    const doc = {
      summary: args.summary,
      title: args.title,
      time: args.time,
      characters: args.characters,
      place: args.place,
      neighbors: args.neighbors,
      embedding: embedding,
    };
    await ctx.runMutation(internal.nodes.insertRow, doc);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("nodes").collect();
  },
});

export async function embed(text: string) {
  const key = process.env.NEXT_PUBLIC_OPENAI_KEY;
  console.log(key);
  if (!key) {
    throw new Error("OPENAI_KEY environment variable not set!");
  }
  const req = { input: text, model: "text-embedding-ada-002" };
  const resp = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(req),
  });
  if (!resp.ok) {
    const msg = await resp.text();
    throw new Error(`OpenAI API error: ${msg}`);
  }
  const json = await resp.json();
  const vector = json["data"][0]["embedding"];
  console.log(`Computed embedding of "${text}": ${vector.length} dimensions`);
  return vector;
}
