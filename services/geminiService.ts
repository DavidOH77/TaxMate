import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { InvoiceDraft } from "../types";

export const processWithGemini = async (
  file: File, 
  apiKey: string
): Promise<Partial<InvoiceDraft>> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Convert file to base64
    const base64Data = await fileToGenerativePart(file);
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            // Explicitly ask for the missing fields
            text: `
            Analyze this image and extract the following fields for the 'Buyer' (Customer):
            1. Registration Number (사업자등록번호) - Look for pattern like 123-45-67890.
            2. Company Name (상호) - Look for text next to '상호' or '명칭'.
            3. Representative Name (대표자) - Look for text next to '성명' or '대표'.
            
            Also extract all line items and monetary totals.
            `
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1, // Lower temperature for more deterministic extraction
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issueDate: { type: Type.STRING },
            buyer: {
              type: Type.OBJECT,
              properties: {
                bizNo: { type: Type.STRING },
                name: { type: Type.STRING },
                ceoName: { type: Type.STRING },
                address: { type: Type.STRING },
                email: { type: Type.STRING },
              }
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  spec: { type: Type.STRING },
                  qty: { type: Type.NUMBER },
                  unitPrice: { type: Type.NUMBER },
                  supplyAmount: { type: Type.NUMBER },
                  vatAmount: { type: Type.NUMBER },
                }
              }
            },
            billingType: { type: Type.STRING, enum: ["청구", "영수"] },
            totalSupplyAmount: { type: Type.NUMBER },
            totalVatAmount: { type: Type.NUMBER },
            totalAmount: { type: Type.NUMBER },
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 응답이 비어있습니다.");
    
    // Use the robust JSON repair function
    try {
        return repairJson(text);
    } catch (e) {
        console.error("JSON Repair Failed. Raw text:", text);
        throw new Error("데이터를 해석하는 중 문제가 발생했습니다. (AI 응답 오류)");
    }

  } catch (error) {
    console.error("Gemini processing error:", error);
    throw error;
  }
};

const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * A robust JSON repair function to handle common LLM output errors:
 * 1. Markdown code blocks (```json)
 * 2. Infinite repeating characters (e.g. 11111111...)
 * 3. Truncated JSON (missing closing braces)
 */
const repairJson = (jsonStr: string): any => {
  // 1. Remove Markdown wrapping
  let str = jsonStr.replace(/```json\s*|```/g, '').trim();

  // 2. Fix infinite repeating characters bug (caps repetitions at 15 chars)
  // This turns "109091.0111111111111111..." into "109091.0111111111111111" (manageable length)
  // or better, just condense it if it's digit repetition which breaks number parsing
  str = str.replace(/(\d)\1{15,}/g, '$1');

  // 3. Try parsing immediately (Best case)
  try { return JSON.parse(str); } catch (e) {}

  // 4. Stack-based repair for unclosed JSON
  const stack: string[] = [];
  let inString = false;
  let escape = false;
  
  // Track where the valid content likely ends before any garbage
  // We re-scan the string to build the closing stack
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    if (escape) { 
      escape = false; 
      continue; 
    }
    
    if (char === '\\') { 
      escape = true; 
      continue; 
    }
    
    if (char === '"') { 
      inString = !inString; 
      continue; 
    }

    if (!inString) {
      if (char === '{') {
        stack.push('}');
      } else if (char === '[') {
        stack.push(']');
      } else if (char === '}' || char === ']') {
        if (stack.length > 0 && stack[stack.length - 1] === char) {
          stack.pop();
        }
      }
    }
  }

  // Append missing closing braces/brackets in reverse order
  while (stack.length > 0) {
    str += stack.pop();
  }

  // 5. Final attempt to parse
  return JSON.parse(str);
};