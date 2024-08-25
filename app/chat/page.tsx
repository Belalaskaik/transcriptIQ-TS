'use client';

import { Box, Button, Stack, TextField, IconButton } from '@mui/material';
import { useState, useRef, useEffect } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Chat() {
  const [transcript, setTranscript] = useState<string>('');
  const [comments, setComments] = useState<Array<{ id: number; text: string; file: File | null }>>([]);
  const [selectedComment, setSelectedComment] = useState<{ id: number; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const addComment = () => {
    if (newComment.trim() !== '') {
      setComments([...comments, { id: comments.length + 1, text: newComment, file: attachedFile }]);
      setNewComment('');
      setAttachedFile(null);
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
          <TextField
            label="Sales Transcript"
            fullWidth
            multiline
            minRows={5}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Enter or paste the sales transcript here..."
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{
              style: { color: 'white', backgroundColor: '#3C3C3C', borderRadius: 4, padding: '10px' },
            }}
          />
          <Stack direction={'row'} spacing={2} justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              onClick={addComment}
              style={{ backgroundColor: '#007ACC', color: 'white' }}
            >
              Add Comment
            </Button>
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

          {isEditing && (
            <Stack direction={'column'} spacing={2} mt={3}>
              <TextField
                label="Edit Comment"
                fullWidth
                multiline
                minRows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: { color: 'white', backgroundColor: '#3C3C3C', borderRadius: 4, padding: '10px' },
                }}
              />
              <Stack direction={'row'} spacing={2} justifyContent="flex-end">
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
                <Button variant="contained" onClick={updateComment} style={{ backgroundColor: '#007ACC', color: 'white' }}>
                  Update
                </Button>
                <Button variant="contained" onClick={cancelEdit} style={{ backgroundColor: '#CC0000', color: 'white' }}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
