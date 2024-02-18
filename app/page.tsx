"use client";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
export default function Home() {
  const stories = useQuery(api.stories.get);
  console.log(stories ?? "Loading...");

  console.log(stories?.length);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {stories?.map(({ _id, summary }) => (
        <div key={_id}>{summary}</div>
      ))}
    </main>
  );
}
