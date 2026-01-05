
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, DietaryRestriction } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeFridgeImage = async (base64Image: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: "Analyze this photo of a fridge and list all visible food ingredients. Return the list as a simple comma-separated string. Be specific (e.g., 'carrots', 'milk', 'chicken breast').",
        },
      ],
    },
  });

  const text = response.text || "";
  return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

export const generateRecipes = async (fridgeIngredients: string[], pantryIngredients: string[], filter: DietaryRestriction): Promise<Recipe[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const allAvailable = [...fridgeIngredients, ...pantryIngredients];
  
  const prompt = `Based on these available ingredients from my fridge and pantry: ${allAvailable.join(', ')}. 
  Generate 3 delicious recipes that are ${filter === 'None' ? 'any style' : filter}. 
  Include title, estimated prep time, calorie count, difficulty level, a full list of ingredients (clearly mark 'isMissing' as true ONLY if it is NOT in the available list), and step-by-step instructions.
  For ingredients marked as 'isMissing', provide a 'substitutions' list of 2-3 suitable alternatives (e.g. 'Butter' -> ['Coconut oil', 'Margarine']).
  Also provide a realistic food image search query for each.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
            prepTime: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  isMissing: { type: Type.BOOLEAN },
                  substitutions: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['name', 'isMissing']
              }
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            dietaryTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['id', 'title', 'difficulty', 'prepTime', 'calories', 'ingredients', 'steps', 'dietaryTags']
        }
      }
    }
  });

  const jsonStr = response.text || "[]";
  const recipes: Recipe[] = JSON.parse(jsonStr);
  
  return recipes.map((r) => ({
    ...r,
    image: `https://picsum.photos/seed/${r.id}/600/400`
  }));
};

export const generateTTS = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
    config: {
      responseModalities: ['AUDIO' as any],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  return base64Audio || "";
};

export const playPCM = async (base64Data: string) => {
  if (!base64Data) return;
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(decode(base64Data), outputAudioContext, 24000, 1);
  const source = outputAudioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(outputAudioContext.destination);
  source.start();
};
