import { GoogleGenAI } from "@google/genai";

export const getCareerAdvice = async (prompt: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful academic and career advisor for mathematics and computer science students in China. You are knowledgeable about 'Baoyan' (postgraduate recommendation), entrance exams (Kaoyan), and job markets. Be encouraging, concise, and practical.",
      }
    });
    return response.text || "Sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while contacting the AI advisor.";
  }
};