'use client';

import { Box, Button, Stack, TextField, IconButton, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SummarizeIcon from '@mui/icons-material/Summarize';

export default function Chat() {
  const [transcript, setTranscript] = useState<string>('');
  const [comments, setComments] = useState<Array<{ id: number; text: string; file: File | null; range: { start: number, end: number } | null }>>([]);
  const [selectedComment, setSelectedComment] = useState<{ id: number; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');

  const addComment = () => {
    if (newComment.trim() !== '') {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        const start = range.startOffset;
        const end = range.endOffset;
        setComments([...comments, { id: comments.length + 1, text: newComment, file: attachedFile, range: { start, end } }]);
        setNewComment('');
        setAttachedFile(null);
      }
    }
  };

  const editComment = (id: number) => {
    const commentToEdit = comments.find(comment => comment.id === id);
    if (commentToEdit) {
      setSelectedComment(commentToEdit);
      setNewComment(commentToEdit.text);
      setIsEditing(true);
    }
  };

  const deleteComment = (id: number) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  const updateComment = () => {
    if (selectedComment) {
      setComments(
        comments.map(comment =>
          comment.id === selectedComment.id ? { ...comment, text: newComment, file: attachedFile } : comment
        )
      );
      setSelectedComment(null);
      setIsEditing(false);
      setNewComment('');
      setAttachedFile(null);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedComment(null);
    setNewComment('');
    setAttachedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setAttachedFile(event.target.files[0]);
    }
  };

  const generateTranscript = async () => {
    setIsGenerating(true);
    try {
      // Placeholder for OpenAI API call
      const generatedTranscript = "Generated transcript text from OpenAI will appear here.";
      setTranscript(generatedTranscript);
    } catch (error) {
      console.error('Error generating transcript:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      // Placeholder for API call
      const generatedSummary = "This is a summary of the transcript, including key points from the comments.";
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const highlightTranscript = () => {
    let highlightedTranscript = transcript;
    comments.forEach(comment => {
      if (comment.range) {
        highlightedTranscript = highlightedTranscript.substring(0, comment.range.start) +
          `<span style="background-color: yellow;">` +
          highlightedTranscript.substring(comment.range.start, comment.range.end) +
          `</span>` +
          highlightedTranscript.substring(comment.range.end);
      }
    });
    return { __html: highlightedTranscript };
  };

  return (
    <Stack
      width={'100vw'}
      height={'100vh'}
      justifyContent={'center'}
      alignItems={'center'}
      bgcolor="#1E1E1E"
    >
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#1E1E1E"
      >
        <Stack
          direction={'column'}
          width="600px"
          height="auto"
          border="1px solid #3C3C3C"
          p={2}
          spacing={3}
          bgcolor="#2D2D2D"
          color="white"
          borderRadius={2}
        >
          <Stack direction={'row'} spacing={2} justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Sales Transcript</Typography>
            <Button
              variant="contained"
              onClick={generateTranscript}
              disabled={isGenerating}
              style={{ backgroundColor: '#007ACC', color: 'white' }}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </Stack>
          <TextField
            label="Sales Transcript"
            fullWidth
            multiline
            minRows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Generate, enter or paste your sales transcript here..."
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{
              style: { color: 'white', backgroundColor: '#3C3C3C', borderRadius: 4, padding: '10px' },
            }}
          />
          <TextField
            label="Add Comment"
            fullWidth
            multiline
            minRows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Select text in the transcript and add your comment..."
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{
              style: { color: 'white', backgroundColor: '#3C3C3C', borderRadius: 4, padding: '10px' },
            }}
          />
          <Stack direction={'row'} spacing={2} justifyContent="flex-end" mt={2}>
            <input
              accept="*"
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button component="span" variant="contained" color="primary">
                <AttachFileIcon /> Attach File
              </Button>
            </label>
            {isEditing ? (
              <>
                <Button variant="contained" onClick={updateComment} style={{ backgroundColor: '#007ACC', color: 'white' }}>
                  Update
                </Button>
                <Button variant="contained" onClick={cancelEdit} style={{ backgroundColor: '#CC0000', color: 'white' }}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={addComment}
                style={{ backgroundColor: '#007ACC', color: 'white' }}
              >
                Submit Comment
              </Button>
            )}
          </Stack>

          <Stack direction={'column'} spacing={2} mt={3}>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Box
                  key={comment.id}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  bgcolor="#3C3C3C"
                  borderRadius={2}
                  p={2}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box>{comment.text}</Box>
                    {comment.file && (
                      <a
                        href={URL.createObjectURL(comment.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007ACC', textDecoration: 'underline' }}
                      >
                        {comment.file.name}
                      </a>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => editComment(comment.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => deleteComment(comment.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Box>
              ))
            ) : (
              <Box color="white" textAlign="center">No comments yet.</Box>
            )}
          </Stack>

          {summary && (
            <Box mt={3} p={2} bgcolor="#444" borderRadius={2}>
              <Typography variant="h6">Transcript Summary</Typography>
              <Typography variant="body1">{summary}</Typography>
            </Box>
          )}

          <Stack direction={'row'} spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              onClick={generateSummary}
              disabled={isGenerating || !transcript}
              style={{ backgroundColor: '#FF9800', color: 'white' }}
              startIcon={<SummarizeIcon />}
            >
              {isGenerating ? 'Generating...' : 'Generate Summary'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
