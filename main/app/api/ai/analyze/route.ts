import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("[AI API] Received request to analyze logs");
    const { logs, conclusion } = await request.json();
    console.log(
      "[AI API] Logs length:",
      logs?.length || 0,
      "Conclusion:",
      conclusion,
    );

    if (!logs) {
      console.error("[AI API] Logs are required but not provided");
      return NextResponse.json({ error: "Logs are required" }, { status: 400 });
    }

    console.log("[AI API] Initializing GoogleGenAI with API key");
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    let prompt = "";
    if (conclusion === "success") {
      prompt = `Please provide a brief summary of these successful GitHub Actions workflow logs:\n\n${logs}\n\nKeep the summary concise and highlight the key steps that were executed successfully.`;
    } else if (conclusion === "failure") {
      prompt = `Please analyze these failed GitHub Actions workflow logs and provide:\n\n1. A brief explanation of what the error is\n2. How to resolve this error\n\nLogs:\n${logs}\n\nBe specific and actionable in your recommendations.`;
    } else {
      prompt = `Please provide a brief summary of these GitHub Actions workflow logs:\n\n${logs}\n\nKeep the summary concise and highlight what the workflow is doing or has done.`;
    }

    console.log("[AI API] Sending request to Gemini API");
    console.log("[AI API] Model: gemini-3.1-pro-preview");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
    });

    console.log("[AI API] Response received from Gemini API");
    console.log("[AI API] Response text length:", response.text?.length || 0);

    console.log("[AI API] Returning response");
    return NextResponse.json({
      analysis: response.text,
    });
  } catch (error) {
    console.error("[AI API] Error occurred:", error);
    console.error(
      "[AI API] Error type:",
      error instanceof Error ? error.name : typeof error,
    );
    if (error instanceof Error) {
      console.error("[AI API] Error message:", error.message);
      console.error("[AI API] Error stack:", error.stack);
    }

    // Check if it's a quota/rate limit error
    const errorString = JSON.stringify(error);
    if (
      errorString.includes("429") ||
      errorString.includes("RESOURCE_EXHAUSTED") ||
      errorString.includes("quota")
    ) {
      console.error("[AI API] Quota exceeded - returning graceful error");
      return NextResponse.json(
        {
          error: "AI analysis quota exceeded",
          message:
            "The AI analysis service has reached its daily limit. Please try again later.",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze logs with AI" },
      { status: 500 },
    );
  }
}
