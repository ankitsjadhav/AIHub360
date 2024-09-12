// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import dotenv from 'dotenv';
// import { GoogleGenerativeAI } from "@google/generative-ai"; 

// dotenv.config();

// console.log("Google API Key:", process.env.GOOGLE_API_KEY);

// // Initialize the Google Generative AI client
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth(); // Await the auth function
//     const body = await req.json();
//     const { messages } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!process.env.GOOGLE_API_KEY) {
//       return new NextResponse("Google API Key not configured", { status: 500 });
//     }

//     if (!messages) {
//       return new NextResponse("Messages are required", { status: 400 });
//     }

//     const prompt = messages.map((msg: any) => msg.content).join('\n');
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(prompt);
//     const generatedText = result.response.text();

//     return NextResponse.json({ message: generatedText });

//   } catch (error: unknown) {
//     console.log("[CONVERSATION_ERROR]", error);

//     if (error instanceof Error) {
//       console.error("Error Message:", error.message);
//       return new NextResponse(`Google API Error: ${error.message}`, { status: 500 });
//     }

//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

export async function POST(
    req: Request 
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401});
        }

        if (!openai.apiKey) {
            return new NextResponse("OpenAI API Key not configured", { status: 500 });
        }
       
        if(!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }
        
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": "Hello!"}],
          });
          console.log(chatCompletion.choices[0].message);

        return NextResponse.json(chatCompletion.choices[0].message);


    } catch (error) {
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse ("Internal error", {status: 500});
    }
}  
