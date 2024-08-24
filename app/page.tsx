"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [transcript, setTranscript] = useState<string>("Sample sales transcript text here...");
  const [comments, setComments] = useState<Array<Schema["Comment"]["type"]>>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>("");

  async function deleteComment(id: string) {
    await client.models.Comment.delete({ id });
    listComments(); // Refresh comments after deletion
  }

  async function listComments() {
    try {
      const result = await client.models.Comment.query({});
      setComments(result.items);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  async function createComment() {
    const content = window.prompt("Comment content");
    if (selectedText && content) {
      await client.models.Comment.create({
        transcriptText: selectedText,
        content,
      });
      listComments(); // Refresh comments after creation
    }
  }

  function generateSummary() {
    const generatedSummary = "Generated summary of the transcript and associated comments";
    setSummary(generatedSummary);
  }

  function handleTextSelection() {
    const selected = window.getSelection()?.toString();
    setSelectedText(selected || null);
  }

  useEffect(() => {
    listComments();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main onMouseUp={handleTextSelection}>
          <h1>Sales Transcript</h1>
          <div className="transcript-container">
            <p className="transcript-text">{transcript}</p>
          </div>
          <button onClick={createComment} disabled={!selectedText}>Add Comment</button>
          <h2>Comments</h2>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.transcriptText}</p>
                <p>{comment.content}</p>
                <button onClick={() => deleteComment(comment.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <h2>Summary</h2>
          <button onClick={generateSummary}>Generate Summary</button>
          <p>{summary}</p>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
