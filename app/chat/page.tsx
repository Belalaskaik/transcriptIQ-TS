'use client';

import { Box, Button, Stack, TextField, IconButton, Typography, Checkbox } from '@mui/material';
import { useState, useEffect } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SummarizeIcon from '@mui/icons-material/Summarize';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useRouter } from 'next/navigation';

export default function Chat() {
  const [transcript, setTranscript] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [comments, setComments] = useState<Array<{ id: number; text: string; file: File | null; range: { start: number, end: number } | null }>>([]);
  const [selectedComment, setSelectedComment] = useState<{ id: number; text: string } | null>(null);
  const [selectedComments, setSelectedComments] = useState<Set<number>>(new Set());
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [summary, setSummary] = useState<string>('');
  const [isTextSelected, setIsTextSelected] = useState<boolean>(false);

  const router = useRouter();

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
        setIsTextSelected(false); // Reset after adding a comment
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

  const deleteComments = (idsToDelete: Set<number> | number = selectedComments) => {
    let idsToDeleteSet: Set<number>;

    if (typeof idsToDelete === 'number') {
      idsToDeleteSet = new Set([idsToDelete]);
    } else {
      idsToDeleteSet = idsToDelete;
    }

    setComments(comments.filter(comment => !idsToDeleteSet.has(comment.id)));
    setSelectedComments(new Set());
  };
  
  const deleteSelectedComments = () => {
    setComments(comments.filter(comment => !selectedComments.has(comment.id)));
    setSelectedComments(new Set());
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
      const generatedSummary = "This is a summary of the transcript, including key points from the comments.";
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTranscriptSubmit = () => {
    setIsSubmitted(true);
  };

  const handleGoBack = () => {
    setIsSubmitted(false);
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  const toggleSelectComment = (id: number) => {
    setSelectedComments(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const selectAllComments = () => {
    setSelectedComments(new Set(comments.map(comment => comment.id)));
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData('dragIndex', index.toString());
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    const dragIndex = parseInt(event.dataTransfer.getData('dragIndex'), 10);
    const reorderedComments = [...comments];
    const [draggedComment] = reorderedComments.splice(dragIndex, 1);
    reorderedComments.splice(dropIndex, 0, draggedComment);
    setComments(reorderedComments);
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      setIsTextSelected(selection?.toString().length > 0);
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <Stack direction="row" width={'100vw'} height={'100vh'} bgcolor="#1E1E1E">
      {/* Left Side - Transcript */}
      <Box flex={1} p={4} borderRight="1px solid #ddd">
        <Stack direction={'column'} height="100%" spacing={3}>
          <Stack direction={'row'} justifyContent="space-between" alignItems="center" mb={2}>
            {isSubmitted && (
              <Button onClick={handleGoBack} variant="outlined" color="inherit" startIcon={<ArrowBackIcon />}>
                Back
              </Button>
            )}
            <Button onClick={handleHomeClick} variant="outlined" color="inherit" startIcon={<HomeIcon />}>
              Home
            </Button>
          </Stack>

          <Typography variant="h6" gutterBottom>Transcript IQ</Typography>
          <TextField
            label="Sales Transcript"
            fullWidth
            multiline
            minRows={15}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Enter or paste your sales transcript here..."
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{
              style: { color: 'white', backgroundColor: '#3C3C3C', borderRadius: 4, padding: '10px' },
              readOnly: isSubmitted,
            }}
          />
          {!isSubmitted && (
            <Stack direction={'row'} justifyContent="flex-end" mt={2} spacing={2}>
              <Button
                variant="contained"
                onClick={generateTranscript}
                style={{ backgroundColor: '#007ACC', color: 'white' }}
              >
                Generate AI Transcript
              </Button>
              <Button
                variant="contained"
                onClick={handleTranscriptSubmit}
                style={{ backgroundColor: '#007ACC', color: 'white' }}
              >
                Submit
              </Button>
            </Stack>
          )}

          {/* Instruction Box */}
          <Box mt={3} p={2} bgcolor="#444" borderRadius={2} color="white">
            <Typography variant="h6">Instructions</Typography>
            <Typography variant="body2" mt={1}>
              1. Enter or paste your sales transcript in the provided box.
              <br />
              2. If you want to generate an AI transcript, click the "Generate AI Transcript" button.
              <br />
              3. Click "Submit" to start adding comments.
              <br />
              4. First, type your comment in the "Add Comment" box. Then highlight a part of the transcript and click the Add Comment button.
              <br />
              5. Optionally, attach files to your comments.
              <br />
              6. Use the buttons on the right side to edit, delete, or manage your comments.
              <br />
              7. Once done, click "Generate Summary" to create a summary of the transcript and comments.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Right Side - Comments */}
      <Box flex={1} p={4} bgcolor="#2D2D2D">
        {isSubmitted && (
          <>
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
                <Button component="span" variant="contained" color="primary" disabled={!isTextSelected}>
                  <AttachFileIcon /> Attach File
                </Button>
              </label>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    onClick={updateComment}
                    style={{ backgroundColor: '#007ACC', color: 'white' }}
                  >
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
                  style={{
                    backgroundColor: isTextSelected ? '#007ACC' : '#555', // Regular color when enabled, faded when disabled
                    color: 'white',
                    opacity: isTextSelected ? 1 : 0.5, // Faded appearance when disabled
                    cursor: isTextSelected ? 'pointer' : 'not-allowed' // Change cursor to indicate disabled state
                  }}
                  disabled={!isTextSelected}
                >
                  Add Comment
                </Button>
              )}
            </Stack>

            <Stack direction={'row'} justifyContent="space-between" alignItems="center" mt={3}>
              <Typography variant="h6">Comments</Typography>
              <Button
                variant="outlined"
                onClick={selectAllComments}
                style={{ color: 'white', borderColor: 'white' }}
              >
                Select All
              </Button>
            </Stack>

            <Stack direction={'column'} spacing={2} mt={3}>
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <Box
                    key={comment.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bgcolor="#3C3C3C"
                    borderRadius={2}
                    p={2}
                    draggable
                    onDragStart={(e) => handleDrag(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Checkbox
                        checked={selectedComments.has(comment.id)}
                        onChange={() => toggleSelectComment(comment.id)}
                        color="primary"
                      />
                      <Box color="white">{comment.text}</Box>
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
                      <IconButton color="secondary" onClick={() => deleteComments(comment.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Box color="white" textAlign="center">No comments yet.</Box>
              )}
            </Stack>

            {selectedComments.size > 0 && (
              <Stack direction={'row'} justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  onClick={deleteSelectedComments}
                  style={{ backgroundColor: '#CC0000', color: 'white' }}
                >
                  Delete Selected
                </Button>
              </Stack>
            )}

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
          </>
        )}
      </Box>
    </Stack>
  );
}
