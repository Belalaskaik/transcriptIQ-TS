'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Stack, Container, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./../app/app.css";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#4e9af1',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h2: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 300,
    },
  },
});

const words = ["Sales Transcript Analysis", "AI-Powered Summaries", "Manage Comments Easily"];

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md" sx={{ padding: 4, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Stack
          width="100%"
          maxWidth="800px"
          bgcolor="rgba(255, 255, 255, 0.1)"
          borderRadius={4}
          padding={5}
          boxShadow="0px 8px 15px rgba(0, 0, 0, 0.3)"
          textAlign="center"
        >
          <Typography
            variant="h2"
            component="div"
            color="secondary.main"
            gutterBottom
          >
            Sales Transcript AI
          </Typography>
          <Typography
            variant="h5"
            component="div"
            color="secondary.main"
            gutterBottom
          >
            <FlipWords words={words} />
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/chat"
            sx={{ marginTop: 3, paddingX: 5, paddingY: 1.5 }}
          >
            Get Started
          </Button>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

function FlipWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  return <span>{words[index]}</span>;
}
