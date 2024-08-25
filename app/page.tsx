"use client";

import { useState, useRef, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(outputs);

const client = generateClient<Schema>();

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type Comment = {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
};

export default function App() {
  const [transcript, setTranscript] = useState<string>("Sample sales transcript text here...");
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listComments();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        setTranscript(content);
        await sendTranscriptToAI(content);
      };
      reader.readAsText(file);
    }
  };

  const sendTranscriptToAI = async (transcriptContent: string) => {
    setIsChatLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          { role: 'user', content: `Please analyze the following sales transcript and provide insights:\n\n${transcriptContent}` }
        ]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setChatMessages([
        { role: 'user', content: 'I have uploaded a sales transcript for analysis.' },
        { role: 'assistant', content: data.content }
      ]);
    } catch (error) {
      console.error('Error analyzing transcript:', error);
      setChatMessages([
        { role: 'user', content: 'I have uploaded a sales transcript for analysis.' },
        { role: 'assistant', content: 'An error occurred while analyzing the transcript.' }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (chatInput.trim() === '') return;

    const newMessage: Message = { role: 'user', content: chatInput };
    setChatMessages(prevMessages => [...prevMessages, newMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...chatMessages, newMessage]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'An error occurred while processing your message.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleTextSelection = () => {
    if (isEditing) return;
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;
      setSelectedText(selection.toString());
      setSelectedRange({ start, end });
    } else {
      setSelectedText(null);
      setSelectedRange(null);
    }
  };

  const addComment = () => {
    if (selectedText && selectedRange) {
      const newComment: Comment = {
        id: Date.now().toString(),
        content: window.prompt("Enter your comment:") || "",
        startIndex: selectedRange.start,
        endIndex: selectedRange.end,
      };
      setComments([...comments, newComment]);
      setSelectedText(null);
      setSelectedRange(null);
    }
  };

  const editComment = (id: string) => {
    const commentToEdit = comments.find(comment => comment.id === id);
    if (commentToEdit) {
      const newContent = window.prompt("Edit your comment:", commentToEdit.content);
      if (newContent !== null) {
        setComments(comments.map(comment => 
          comment.id === id ? { ...comment, content: newContent } : comment
        ));
      }
    }
  };

  const deleteComment = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  const listComments = () => {
    // In a real application, you would fetch comments from a database here
    // For now, we'll just use the local state
  };

  const renderTranscriptWithComments = () => {
    if (isEditing) {
      return (
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="transcript-edit"
        />
      );
    }

    let result = [];
    let lastIndex = 0;
    
    // Sort comments by startIndex
    const sortedComments = [...comments].sort((a, b) => a.startIndex - b.startIndex);

    for (let i = 0; i < sortedComments.length; i++) {
      const comment = sortedComments[i];
      // Add text before the comment
      result.push(transcript.slice(lastIndex, comment.startIndex));
      
      // Add the commented text with highlighting and comment number
      result.push(
        <span 
          key={comment.id} 
          className="highlighted-text" 
          data-comment-id={comment.id}
        >
          {transcript.slice(comment.startIndex, comment.endIndex)}
          <sup className="comment-indicator">{i + 1}</sup>
          <span className="comment-tooltip">{comment.content}</span>
        </span>
      );
      
      lastIndex = comment.endIndex;
    }
    
    // Add any remaining text
    result.push(transcript.slice(lastIndex));

    return result;
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // If we're finishing editing, re-analyze the transcript
      sendTranscriptToAI(transcript);
    }
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main className="main-container">
          <div className="transcript-container">
            <h1>Sales Transcript</h1>
            <div className="file-upload">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRef.current?.click()} disabled={isChatLoading}>
                Upload Transcript
              </button>
            </div>
            <div 
              className="transcript-text" 
              onMouseUp={handleTextSelection}
              ref={transcriptRef}
            >
              {renderTranscriptWithComments()}
            </div>
            <button onClick={toggleEditing}>
              {isEditing ? 'Save Edits' : 'Edit Transcript'}
            </button>
            <button onClick={addComment} disabled={!selectedText || isEditing}>Add Comment</button>
          </div>
          <div className="comments-container">
            <h2>Comments</h2>
            <ul>
              {comments.map((comment, index) => (
                <li key={comment.id} className="comment-item">
                  <h3>Comment {index + 1}</h3>
                  <p>"{transcript.slice(comment.startIndex, comment.endIndex)}"</p>
                  <p>{comment.content}</p>
                  <div className="comment-actions">
                    <button onClick={() => editComment(comment.id)}>Edit</button>
                    <button onClick={() => deleteComment(comment.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-container">
            <h2>AI Analysis</h2>
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  {message.content}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask a question about the transcript..."
                disabled={isChatLoading}
              />
              <button onClick={sendChatMessage} disabled={isChatLoading}>
                {isChatLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}