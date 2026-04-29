"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function suggestTasksFromPrompt(projectName: string) {
  try {
    // 1.5-flash model zyada fast hai aur tasks suggest karne ke liye perfect hai
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Project Name: "${projectName}". 
    Generate 3 very short and professional tasks for this project. 
    Return ONLY a JSON array of strings. Example: ["Setup Database", "Design UI"]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Markdown aur extra spaces hatane ke liye robust cleanup
    const cleanText = text.replace(/```json|```/g, "").trim();
    
    try {
      return JSON.parse(cleanText) as string[];
    } catch (parseError) {
      console.error("Parse Error, raw text was:", text);
      // Agar JSON parse fail ho jaye to fallback tasks
      return ["Initial documentation", "Review project goals", "Finalize timeline"];
    }
  } catch (error) {
    console.error("AI Error:", error);
    // Network ya API error ke case mein default tasks
    return ["Finish project setup", "Define milestones", "Client meeting"];
  }
}