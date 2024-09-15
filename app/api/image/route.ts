import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dotenv from 'dotenv';
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"; 

dotenv.config();

console.log("Google API Key:", process.env.GOOGLE_API_KEY);

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution="512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return new NextResponse("Google API Key not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt are required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount are required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("resolution are required", { status: 400 });
    }

    // Initialize the model and generate content
    // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "imagen-1.5-flash" }) as GenerativeModel & { generateImage: (options: { prompt: string; n: number; size: string }) => Promise<any> };

    // const prompt = messages[0].text;

    
    const result = await model.generateImage({
      prompt: prompt,
      n: parseInt(amount,10),
      size: resolution,
    });
  
    // const result = await model.generateContent(prompt);       (for AI Inbuild response)

  
    console.log("API Result:", result);
    console.log("API Result Response:", result?.response);
    console.log("API Result Response Text:", result?.response?.text);
    
    console.log(result.response.text());
    // const response = result.response;
    // const generatedText = response.text();
     
    
    // const generatedText = await result.response.text();
    const imageUrls = result.images.map((image: any) => image.url);

    
    // const generatedText = result?.response?.text || "No response text available";

    return NextResponse.json({ Response });

  } catch (error: unknown) {
    console.log("[IMAGE_ERROR]", error);

    if (error instanceof Error) {
      return new NextResponse(`Google API Error: ${error.message}`, { status: 500 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

