// ============================================================
// services/geminiService.js - Google Gemini AI Integration
// ============================================================
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the older, more permissive SDK that accepts the AQ. token format
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askGemini = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      `You are EventOps AI, a helpful assistant for an event management platform. ${prompt}`
    ]);
    
    return result.response.text();
  } catch (error) {
    console.error('Gemini AI error:', error.message);
    throw new Error('AI service is currently unavailable. Please try again later.');
  }
};
