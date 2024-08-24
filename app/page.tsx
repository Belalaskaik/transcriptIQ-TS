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
  const [savedTranscript, setSavedTranscript] = useState<string | null>(null);
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
      console.log('Fetched comments:', result.items); // Debugging: Check if comments are fetched
      setComments(result.items);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  async function createComment() {
    const content = window.prompt("Enter your comment:");
    if (selectedText && content) {
      await client.models.Comment.create({
        transcriptText: selectedText,
        content,
      });
      listComments(); // Refresh comments after creation
    }
  }

  async function editComment(id: string, existingContent: string) {
    const newContent = window.prompt("Edit your comment:", existingContent);
    if (newContent) {
      await client.models.Comment.update({
        id,
        content: newContent,
      });
      listComments(); // Refresh comments after editing
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

  function handleTranscriptChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTranscript(event.target.value);
  }

  function handleTranscriptSubmit() {
    setSavedTranscript(transcript);
  }

  function handleTranscriptEdit() {
    setSavedTranscript(null);
  }

  useEffect(() => {
    listComments();
  }, []);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main onMouseUp={handleTextSelection} className="main-container">
          <div className="transcript-input-container">
            <h1>Sales Transcript</h1>
            {savedTranscript ? (
              <div className="saved-transcript">
                <p>{savedTranscript}</p>
                <button onClick={handleTranscriptEdit}>Edit Transcript</button>
              </div>
            ) : (
              <>
                <textarea
                  className="transcript-input"
                  value={transcript}
                  onChange={handleTranscriptChange}
                  placeholder="Paste your transcript here..."
                />
                <button onClick={handleTranscriptSubmit}>Submit Transcript</button>
              </>
            )}
          </div>
          <div className="comments-container">
            <h2>Comments</h2>
            <button onClick={createComment} disabled={!selectedText}>Add Comment</button>
            <ul>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <li key={comment.id} className="comment-item">
                    <p>{comment.transcriptText}</p>
                    <p>{comment.content}</p>
                    <div className="comment-actions">
                      <button onClick={() => editComment(comment.id, comment.content)}>Edit</button>
                      <button onClick={() => deleteComment(comment.id)}>Delete</button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </ul>
          </div>
          <div className="summary-container">
            <h2>Summary</h2>
            <button onClick={generateSummary}>Generate Summary</button>
            <p>{summary}</p>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}
