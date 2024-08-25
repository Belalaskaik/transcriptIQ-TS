import { defineFunction } from '@aws-amplify/backend';

export const transcriptHandler = defineFunction({
  name: 'transcriptHandler',
  entry: './handler.ts'
});
