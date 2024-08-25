import type { Handler } from 'aws-lambda';
import type { Schema } from "../../data/resource";

export const handler: Schema["handleTranscript"]["functionHandler"] = async (event) => {
  const { transcriptId } = event.arguments;
  return `Handling transcript with ID: ${transcriptId}`;
};