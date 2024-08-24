'use client'

import { Flex, View, TextField, Button, ScrollView } from '@aws-amplify/ui-react'
import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import '@aws-amplify/ui-react/styles.css'

interface Message {
  role: 'assistant' | 'user'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = async () => {
    if (message.trim() === '') return;
    
    const newMessage: Message = { role: 'user', content: message };
    setMessages([...messages, newMessage]);
    setMessage('');
    setIsLoading(true);
    
    // TODO: Implement API call to send message and get response
    // For now, we'll just simulate a response
    setTimeout(() => {
      const assistantMessage: Message = { role: 'assistant', content: 'This is a simulated response.' };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      backgroundColor="#1E1E1E"
    >
      <View
        width="500px"
        height="700px"
        padding="1rem"
        backgroundColor="#2D2D2D"
        borderRadius="medium"
        border="1px solid #3C3C3C"
      >
        <ScrollView height="calc(100% - 60px)">
          <Flex direction="column" gap="medium">
            {messages.map((message, index) => (
              <Flex
                key={index}
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <View
                  backgroundColor={message.role === 'assistant' ? '#3C3C3C' : '#007ACC'}
                  color="white"
                  padding="medium"
                  borderRadius="large"
                >
                  {message.content}
                </View>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </Flex>
        </ScrollView>
        <Flex direction="row" gap="small" marginTop="1rem">
          <TextField
            label="Message"
            labelHidden
            placeholder="Type your message..."
            flex={1}
            value={message}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            isDisabled={isLoading}
            backgroundColor="#3C3C3C"
            color="white"
          />
          <Button
            onClick={sendMessage}
            isDisabled={isLoading}
            backgroundColor="#007ACC"
            color="white"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Flex>
      </View>
    </Flex>
  )
}