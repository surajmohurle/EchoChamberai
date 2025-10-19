import { GoogleGenAI, Type } from "@google/genai";
import { InputType, GeneratedAssets } from '../types';

// Utility function to convert a File object to a base64 string
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix (e.g., "data:audio/mp3;base64,"),
        // which needs to be removed.
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A comprehensive, well-structured summary or show notes for the content." },
        keyTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A bulleted list of the 5 most important takeaways or quotable moments."
        },
        videoClips: {
            type: Type.ARRAY,
            description: "An array of 4 potential short-form video clips if the source is video. Otherwise, this should be an empty array.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING, description: "A catchy, viral-style title for the clip." },
                    hook: { type: Type.STRING, description: "A compelling one-sentence hook for the clip." },
                    startTime: { type: Type.NUMBER, description: "The start time of the clip in seconds." },
                    endTime: { type: Type.NUMBER, description: "The end time of the clip in seconds." },
                    viralityScore: { type: Type.NUMBER, description: "A score from 70-100 indicating the clip's potential to go viral." },
                },
                required: ["id", "title", "hook", "startTime", "endTime", "viralityScore"]
            }
        },
        audiograms: {
            type: Type.ARRAY,
            description: "An array of 3 potential audiogram clips if the source is audio. Otherwise, this should be an empty array.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING, description: "A catchy title for the audio segment." },
                    summary: { type: Type.STRING, description: "A short summary of what is discussed in the clip." },
                    startTime: { type: Type.NUMBER, description: "The start time of the clip in seconds." },
                    endTime: { type: Type.NUMBER, description: "The end time of the clip in seconds." },
                },
                required: ["id", "title", "summary", "startTime", "endTime"]
            }
        },
        socialPosts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    platform: { type: Type.STRING, enum: ["LinkedIn", "X", "Instagram"] },
                    content: { type: Type.STRING, description: "The social media post content, tailored for the specified platform." },
                },
                required: ["id", "platform", "content"]
            }
        },
        emailDraft: {
            type: Type.STRING,
            description: "A promotional email newsletter draft summarizing the content with a clear call-to-action."
        },
        transcript: {
            type: Type.STRING,
            description: "A full, accurate transcript of the source audio or video. For blog posts, this field should be null."
        }
    },
    required: ["summary", "keyTakeaways", "videoClips", "audiograms", "socialPosts", "emailDraft"]
};


const getBasePrompt = (inputType: InputType) => `
You are an expert content strategist and marketer, operating as an AI-powered tool called "Echo Chamber AI". Your task is to atomize a single piece of long-form content into a complete suite of ready-to-publish marketing assets.

Analyze the provided content (${inputType}) and generate a comprehensive JSON object based on the provided schema.

**Important Instructions:**
1.  **Summary/Show Notes:** Create a well-structured, SEO-optimized summary.
2.  **Key Takeaways:** Extract the 5 most impactful points or quotes.
3.  **Clips (Critical):** You are providing METADATA for a human to edit later. You are NOT generating media files.
    - If the input is a **video**, identify 4 segments under 60 seconds with high energy and clear takeaways. Assign a unique ID (e.g., "vc1"), a viral title, a hook, timestamps, and a virality score.
    - If the input is **audio**, identify 3 engaging segments. Assign a unique ID (e.g., "ag1"), a title, a summary, and timestamps for each.
    - If the input is a **blog post**, both 'videoClips' and 'audiograms' should be empty arrays.
4.  **Social Posts:** Draft 3 distinct posts, one each for LinkedIn (professional, detailed), X (short, provocative, with hashtags), and Instagram (engaging question, visual-focused). Assign unique IDs (e.g., "sp1").
5.  **Email Draft:** Compose a promotional email newsletter.
6.  **Transcript:** Provide a full transcript for audio/video content. If the input is a blog post, this field should be explicitly null.

Ensure your entire output is a single, valid JSON object that strictly adheres to the provided schema.
`;


export const generateContentAssets = async (inputType: InputType, source: string, file?: File): Promise<GeneratedAssets> => {
    try {
        const model = 'gemini-2.5-pro';
        const prompt = getBasePrompt(inputType);

        let contents;

        if (file) {
            const filePart = await fileToGenerativePart(file);
            contents = { parts: [{ text: prompt }, filePart] };
        } else {
             contents = { parts: [{ text: prompt }, { text: `\n\nContent URL to analyze: ${source}` }] };
        }

        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text;
        const parsedData = JSON.parse(jsonText);

        // Data is returned directly without mock URLs.
        // The UI will be responsible for explaining how to use this data.
        return { ...parsedData, inputType, source };
    } catch (error) {
        console.error("Error generating content from Gemini API:", error);
        throw new Error("Failed to generate content. The AI model may be overloaded or the input may be invalid. Please try again.");
    }
};