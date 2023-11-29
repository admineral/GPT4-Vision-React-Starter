import {
  OpenAIStream,
  StreamingTextResponse,
  experimental_StreamData,
} from 'ai';
import OpenAI from 'openai';
import { ChatCompletionCreateParams } from "openai/resources/chat/index";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: 'get_custom_description',
    description: 'Get a custom description of the image.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The custom prompt for the image analysis.',
        },
      },
      required: ['prompt'],
    },
  },
];

export async function POST(req: Request) {
  let { messages } = await req.json();

  console.log('Received messages:', messages); // Log the received messages

  // Add a system message at the beginning
  messages = [
    {
      role: 'system',
      content: 'You are a Helpfull Assistant who can get a description of the image with the function call `get_custom_description`. Every question from the user can be answeres with the function call. Instead of answering +++ Im sorry, but as an AI language model, I dont have access to real-time data or the ability to analyze images.+++ just use the function call to get a description of the image.',
    },
    ...messages,
  ];
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    stream: true,
    messages,
    functions,
  });

  //console.log('OpenAI response:', response); // Log the response from OpenAI


  const data = new experimental_StreamData();
  const stream = OpenAIStream(response, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      console.log('Function call name:', name); // Log the function call name
      console.log('Function call arguments:', args); // Log the function call arguments
    },
    onCompletion(completion) {
      console.log('completion', completion);
    },
    onFinal(completion) {
      data.close();
    },
    experimental_streamData: true,
  });

  data.append({
    text: 'Hello, how are you?',
  });

  return new StreamingTextResponse(stream, {}, data);
}