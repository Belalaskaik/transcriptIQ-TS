'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Stack, Link, Container, Typography } from "@mui/material";
import Image from "next/image";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./../app/app.css";

const defaultTheme = createTheme();

const words = ["Sales Transcript Analysis", "AI-Powered Summaries", "Manage Comments Easily"];

export default function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Stack
          width={"100%"}
          height={"60px"}
          direction={"row"}
          gap={2}
          padding={1}
          fontSize={15}
          justifyContent="space-between"
        >
          <Stack
            height={"40px"}
            width={"10%"}
            bgcolor={"#000000"}
            borderRadius={2}
            justifyContent={"center"}
            alignItems={"center"}
            direction={"row"}
            gap={1}
            paddingX={1}
          >
            <Stack width={"20%"}>
              <Image src={"/logo2.png"} alt="logo" width={30} height={30} />
            </Stack>
            <Stack
              height={"100%"}
              width={"80%"}
              color={"white"}
              justifyContent={"center"}
              alignItems={"center"}
              textAlign={"center"}
            >
              SalesTranscriptAI
            </Stack>
          </Stack>
          <Stack
            direction="row"
            height={"40px"}
            gap={2}
            alignItems={"center"}
          >
            <Stack
              height={"100%"}
              width={"100px"}
              bgcolor={"#000000"}
              borderRadius={2}
              justifyContent={"center"}
              alignItems={"center"}
              color={"white"}
              sx={{
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              <Link href="/">Home</Link>
            </Stack>
            <Stack
              height={"100%"}
              width={"100px"}
              bgcolor={"#000000"}
              borderRadius={2}
              justifyContent={"center"}
              alignItems={"center"}
              color={"white"}
              sx={{
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              <Link href="/chat">Get Started</Link>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          width={"100%"}
          height={"100vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Stack
            width={"100%"}
            maxWidth={"600px"}
            height={"auto"}
            bgcolor={"black"}
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={2}
            padding={4}
            spacing={2}
          >
            <Typography
              variant="h2"
              component="div"
              color="white"
              textAlign="center"
              fontWeight={900}
            >
              Sales Transcript AI
            </Typography>
            <Typography
              variant="h5"
              component="div"
              color="white"
              textAlign="center"
              fontWeight={200}
            >
              <FlipWords words={words} />
            </Typography>
            <Stack
              bgcolor={"white"}
              color={"black"}
              width={140}
              height={40}
              justifyContent={"center"}
              alignItems={"center"}
              borderRadius={2}
              sx={{
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                  border: 2,
                  borderColor: "white",
                },
              }}
            >
              <Link href="/chat" color="inherit" underline="none">
                Get Started
              </Link>
            </Stack>
          </Stack>
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
