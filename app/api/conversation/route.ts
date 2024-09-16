import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai"; 

dotenv.config();

console.log("Google API Key:", process.env.GOOGLE_API_KEY);

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return new NextResponse("Google API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const prompt = messages.map((msg: any) => msg.content).join('\n');

    // Initialize the model and generate content
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // const prompt = messages[0].text;

    
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      },
    });

    // const result = await model.generateContent(prompt);       (for AI Inbuild response)

  
    console.log("API Result:", result);
    console.log("API Result Response:", result?.response);
    console.log("API Result Response Text:", result?.response?.text);
    
    console.log(result.response.text());
    // const response = result.response;
    // const generatedText = response.text();
     
    
    const generatedText = await result.response.text();

    
    // const generatedText = result?.response?.text || "No response text available";
    
    // API Response Parsing: There might be a problem in how the API response is being parsed and extracted.

    return NextResponse.json({ message: generatedText });

  } catch (error: unknown) {
    console.log("[CONVERSATION_ERROR]", error);

    if (error instanceof Error) {
      return new NextResponse(`Google API Error: ${error.message}`, { status: 500 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

// //OPENAI 
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
// });

// export async function POST(
//     req: Request 
// ) {
//     try {
//         const { userId } = auth();
//         const body = await req.json();
//         const { messages } = body;

//         if (!userId) {
//             return new NextResponse("Unauthorized", { status: 401});
//         }

//         if (!openai.apiKey) {
//             return new NextResponse("OpenAI API Key not configured", { status: 500 });
//         }
       
//         if(!messages) {
//             return new NextResponse("Messages are required", { status: 400 });
//         }
        
//         const chatCompletion = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [{"role": "user", "content": "Hello!"}],
//           });
//           console.log(chatCompletion.choices[0].message);

//         return NextResponse.json(chatCompletion.choices[0].message);


//     } catch (error) {
//         console.log("[CONVERSATION_ERROR]", error);
//         return new NextResponse ("Internal error", {status: 500});
//     }
// }  
