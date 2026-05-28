import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, telemetryContext } = await req.json();

  const result = streamText({
    model: google('gemini-1.5-flash') as any,
    system: `
      You are an expert sim racing data engineer for the Purdue Sim Racing Club. 
      Your goal is to help drivers analyze their telemetry and improve their lap times.
      
      You have access to the following telemetry context about the current comparison:
      ${telemetryContext}

      Use this context to answer the user's questions specifically and professionally.
      Reference track distances (meters) and specific drivers where possible.
      Be concise, technical but accessible, and encouraging.
    `,
    messages,
  });

  return result.toDataStreamResponse();
}
