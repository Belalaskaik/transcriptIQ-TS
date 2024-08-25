import { defineFunction } from '@aws-amplify/backend';

export const generateTranscript = defineFunction({
  name: 'generateTranscript',
  entry: './handler.ts'
});
