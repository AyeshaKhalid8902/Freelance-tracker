"use server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getChatResponse(message: string) {
  if (!process.env.GROQ_API_KEY) {
    return "Error: Groq API Key missing in .env";
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Ayesha's Freelance Assistant. Help her manage clients like Ammara and track invoices."
        },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return chatCompletion.choices[0]?.message?.content || "No response from AI";
  } catch (error) {
    console.error("Groq Error:", error);
    return "AI Connection Failed. Please check your key or internet.";
  }
}