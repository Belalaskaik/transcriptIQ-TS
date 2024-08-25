import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import React from 'react';
import Navbar from './components/Navbar/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TranscriptIQ",
  description: "Your sales analysis tool",
  icons: {
    icon: '/logo3.ico',
    apple: '/logo3.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo3.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
          }}>{children}
          </main>
        </div>
      </body>
    </html>
  );
}