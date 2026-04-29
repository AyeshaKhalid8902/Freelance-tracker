import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

// .env se key nikaal rahe hain
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are Ayesha's Personal AI Assistant for her Freelance Tracker. You help her manage clients like Ammara, track invoices, and analyze dashboard performance."
        },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile", // Fastest and smart model
    });

    const responseText = completion.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("Groq Error:", error);
    return NextResponse.json({ error: "API connection failed" }, { status: 500 });
  }
}