import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});


export async function POST(
    req: Request 
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { prompt } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401});
        }
       
        if(!prompt) {
            return new NextResponse("Prompt is  required", { status: 400 });
        }

        const input = {
          prompt_b: prompt
      };
       // Video API Pending
       const response = await replicate.run("riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05", { input });

       console.log(response);


    return NextResponse.json( response);

  } catch (error: unknown) {
    console.log("[VIDEO_ERROR]", error);

    if (error instanceof Error) {
      return new NextResponse(`Google API Error: ${error.message}`, { status: 500 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}



