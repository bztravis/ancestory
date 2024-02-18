import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  nodes: defineTable({
    title: v.string(),
    summary: v.string(),
    characters: v.array(v.string()), // Defines 'characters' as an array of strings
    place: v.string(), // Defines 'place' as a string
    time: v.string(), // Defines 'time' as a string
  }),
});
