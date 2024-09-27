// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import dotenv from 'dotenv';
// import { Leap } from "@leap-ai/sdk";

// import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit"; 

// dotenv.config();

// console.log("Leap API Key:", process.env.LEAP_API_KEY);

// const leap = new Leap({
//   apiKey: process.env.LEAP_API_KEY,
// });

// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth();
//     const body = await req.json();
//     const { prompt, amount = 1, resolution="512x512" } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!process.env.LEAP_API_KEY) {
//       return new NextResponse("Google API Key not configured", { status: 500 });
//     }

//     if (!prompt) {
//       return new NextResponse("Prompt are required", { status: 400 });
//     }

//     if (!amount) {
//       return new NextResponse("Amount are required", { status: 400 });
//     }

//     if (!resolution) {
//       return new NextResponse("resolution are required", { status: 400 });
//     }

//     const freeTrial = await checkApiLimit();

//     if(!freeTrial) {
//       return new NextResponse("Free trial has expired.", {status: 403});
//     }

//     // Initialize the model and generate content
//     // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     // const genAI = new GoogleGenerativeAI(process.env.LEAP_API_KEY);
//     // const model = genAI.getGenerativeModel({ model: "SDXL" }) as GenerativeModel & { generateImage: (options: { prompt: string; n: number; size: string }) => Promise<any> };

//     const model = leap.getGenerativeModel({ model: "SDXL" });

//     // const prompt = messages[0].text;

    
//     const result = await model.generateImage({
//       prompt: prompt,
//       n: parseInt(amount,10),
//       size: resolution,
//     });

//     await increaseApiLimit();
  
//     // const result = await model.generateContent(prompt);       (for AI Inbuild response)

  
//     console.log("API Result:", result);
//     console.log("API Result Response:", result?.response);
//     console.log("API Result Response Text:", result?.response?.text);
    
//     console.log(result.response.text());
//     // const response = result.response;
//     // const generatedText = response.text();
     
    
//     // const generatedText = await result.response.text();
//     const imageUrls = result.images.map((image: any) => image.url);

    
//     // const generatedText = result?.response?.text || "No response text available";

//     return NextResponse.json({ Response });

//   } catch (error: unknown) {
//     console.log("[IMAGE_ERROR]", error);

//     if (error instanceof Error) {
//       return new NextResponse(`Leap API Error: ${error.message}`, { status: 500 });
//     }

//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { Leap } from "@leap-ai/sdk";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

dotenv.config();

console.log("Leap API Key:", process.env.LEAP_API_KEY);

// Initialize Leap with the correct client
const leap = new Leap({
  apiKey: process.env.LEAP_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    // Authorization checks
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // API key check
    if (!process.env.LEAP_API_KEY) {
      return new NextResponse("Leap API Key not configured", { status: 500 });
    }

    // Input validation
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    // Check if the free trial is still available
    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }

    // Set parameters for the image generation
    const params = {
      prompt: prompt,
      numberOfImages: parseInt(amount, 10),
      resolution: resolution,
    };

    // Make the request to the correct endpoint
    const result = await leap.images.generate({
      ...params,
      modelId: "SDXL", // Replace with your actual model ID
    });

    // Increase API usage limit
    await increaseApiLimit();

    // Extract URLs from the generated images
    const imageUrls = result.data.images.map((image: any) => image.url);

    // Return image URLs as JSON response
    return NextResponse.json({ imageUrls });
  } catch (error: unknown) {
    console.log("[IMAGE_ERROR]", error);

    if (error instanceof Error) {
      return new NextResponse(`Leap API Error: ${error.message}`, { status: 500 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}