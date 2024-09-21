import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

dotenv.config();

console.log("Google API Key:", process.env.GOOGLE_API_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

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

    const freeTrial = await checkApiLimit();

    if(!freeTrial) {
      return new NextResponse("Free trial has expired.", {status: 403});
    }

    const prompt = `You are a code generation AI. Your purpose is to assist in generating code snippets based on user prompts. Users will provide queries or descriptions related to programming tasks, and you will respond with relevant code snippets or solutions. Ensure that the code you generate is correct, efficient, and adheres to best practices for the specified programming language or framework.\n\nUser Prompt: ${messages}`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    await increaseApiLimit();
    
    console.log("API Result:", result);
    console.log("API Result Response:", result?.response);
    console.log("API Result Response Text:", result?.response?.text);
    
    console.log(result.response.text());
     
    const generatedText = result.response.text();

    return NextResponse.json({ message: generatedText });

  } catch (error: unknown) {
    console.log("[CODE_ERROR]", error);

    if (error instanceof Error) {
      console.error("Error Message:", error.message);
      return new NextResponse(`Google API Error: ${error.message}`, { status: 500 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

