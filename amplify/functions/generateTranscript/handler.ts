import { Handler } from 'aws-lambda';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load .env.local file
dotenv.config({ path: '.env.local' });

const systemPrompt = `You are a sales pitch generator. Your task is to generate a compelling sales pitch based on the given product or service. Follow these guidelines:
1. Highlight the key features and benefits of the product or service.
2. Address potential customer pain points and how the product or service solves them.
3. Use persuasive language to engage the audience.
4. Include a clear call to action.
5. Keep the pitch concise and to the point.
6. Tailor the pitch to the target audience.
7. Use real-world examples or testimonials if available.
8. Ensure the pitch is professional and polished.
9. Aim to create a pitch that is both informative and convincing.
10. Only generate one sales pitch.
Return in the following JSON format:
{
    "salesPitch": str
}`;

export const handler: Handler = async (event) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenAI API key is not set" }),
    };
  }
  const openai = new OpenAI({ apiKey });
  const data = event.body;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: 'json_object' },
  });

  const messageContent = completion.choices[0].message.content;
  if (!messageContent) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "No content returned from OpenAI" }),
    };
  }

  const salesPitch = JSON.parse(messageContent);
  return {
    statusCode: 200,
    body: JSON.stringify(salesPitch.salesPitch),
  };
};