import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedAssets, InputType } from '../types';

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
        campaignStrategy: {
            type: Type.OBJECT,
            description: "High-level marketing strategy derived from the content.",
            properties: {
                targetAudience: { type: Type.STRING, description: "A detailed description of the ideal target audience for this content." },
                brandVoice: { type: Type.STRING, description: "An analysis of the speaker's tone and brand voice (e.g., 'Authoritative & Educational', 'Humorous & Relatable')." },
                contentPillars: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The 3 main topics or themes discussed that can be used as content pillars." },
                postingSchedule: { type: Type.STRING, description: "A suggested 3-day posting schedule to maximize engagement." }
            },
            required: ["targetAudience", "brandVoice", "contentPillars", "postingSchedule"]
        },
        seoStrategy: {
            type: Type.OBJECT,
            description: "An SEO and discoverability strategy.",
            properties: {
                primaryKeyword: { type: Type.STRING, description: "The single most important keyword for this content." },
                secondaryKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 5-7 related secondary keywords." },
                suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of relevant hashtags or tags for social media and blogs." },
                metaDescription: { type: Type.STRING, description: "An SEO-optimized meta description (155-160 characters) for the content." }
            },
            required: ["primaryKeyword", "secondaryKeywords", "suggestedTags", "metaDescription"]
        },
        summary: { type: Type.STRING, description: "A comprehensive, well-structured summary or show notes for the content." },
        keyTakeaways: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A bulleted list of the 5 most important takeaways or quotable moments."
        },
        videoClips: {
            type: Type.ARRAY,
            description: "An array of 4 potential short-form video clips if the source is video. Otherwise, empty.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING, description: "A catchy, viral-style title for the clip." },
                    hook: { type: Type.STRING, description: "A compelling one-sentence hook for the clip." },
                    startTime: { type: Type.NUMBER },
                    endTime: { type: Type.NUMBER },
                    viralityScore: { type: Type.NUMBER, description: "A score from 70-100 indicating viral potential." },
                    rationale: { type: Type.STRING, description: "A brief explanation of why this clip was chosen (e.g., 'High emotional energy and a clear, actionable takeaway')." }
                },
                required: ["id", "title", "hook", "startTime", "endTime", "viralityScore", "rationale"]
            }
        },
        audiograms: {
            type: Type.ARRAY,
            description: "An array of 3 potential audiogram clips if the source is audio. Otherwise, empty.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    startTime: { type: Type.NUMBER },
                    endTime: { type: Type.NUMBER },
                    rationale: { type: Type.STRING, description: "A brief explanation of why this audio segment is engaging." }
                },
                required: ["id", "title", "summary", "startTime", "endTime", "rationale"]
            }
        },
        socialPosts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    platform: { type: Type.STRING, enum: ["LinkedIn", "X", "Instagram"] },
                    postType: { type: Type.STRING, description: "The strategic type of post (e.g., 'Hook & Teaser', 'Key Takeaway', 'Discussion Starter', 'Quote Graphic')." },
                    content: { type: Type.STRING },
                    visualSuggestion: { type: Type.STRING, description: "A suggestion for the visual element (e.g., 'Use a bold, text-based graphic with the quote')." },
                    rationale: { type: Type.STRING, description: "The strategic reason for this post's angle and format." }
                },
                required: ["id", "platform", "postType", "content", "visualSuggestion", "rationale"]
            }
        },
        emailDraft: {
            type: Type.STRING,
            description: "A promotional email newsletter draft."
        },
        transcript: {
            type: Type.STRING,
            description: "A full transcript. For blog posts, this field should be null."
        }
    },
    required: ["campaignStrategy", "seoStrategy", "summary", "keyTakeaways", "videoClips", "audiograms", "socialPosts", "emailDraft"]
};


const getBasePrompt = (inputType: InputType) => `
You are 'Echo', an AI Chief Marketing Officer. Your purpose is to perform a deep, strategic analysis of a single piece of long-form content and generate a complete, ready-to-launch marketing campaign. Your output must be a single, valid JSON object that strictly adheres to the provided schema.

**Analysis Phase 1: High-Level Strategy**
First, create the overarching strategy.
1.  **Campaign Strategy:** Define the target audience based on the content's complexity and subject matter. Analyze the speaker's brand voice. Identify 3 core content pillars that can be expanded upon. Suggest a 3-day posting schedule to maximize reach and engagement.
2.  **SEO Strategy:** Determine a primary keyword, 5-7 secondary keywords, and a list of relevant tags/hashtags. Write a compelling, SEO-optimized meta description between 155-160 characters.

**Analysis Phase 2: Asset Generation**
Next, generate the individual marketing assets based on your strategy.
1.  **Summary/Show Notes:** Create a well-structured, SEO-optimized summary incorporating keywords from your strategy.
2.  **Key Takeaways:** Extract the 5 most impactful, quotable moments.
3.  **Clips (Video/Audio - CRITICAL):** You are generating METADATA for a human editor.
    - If the input is **video**, identify 4 segments under 60 seconds. Provide a viral title, a hook, timestamps, a virality score, and a **rationale** explaining *why* this moment is impactful (e.g., "This section has high emotional energy and a clear, actionable takeaway").
    - If the input is **audio**, identify 3 engaging segments. Provide a title, summary, timestamps, and a **rationale**.
    - If the input is a **blog post**, both 'videoClips' and 'audiograms' must be empty arrays.
4.  **Social Posts:** Draft 3 distinct posts (LinkedIn, X, Instagram). For each, provide a strategic **postType** (e.g., 'Hook & Teaser', 'Discussion Starter'), a **visualSuggestion**, and a **rationale** explaining the angle. Tailor the content to the platform.
5.  **Email Draft:** Compose a promotional email newsletter based on the summary and takeaways.
6.  **Transcript:** Provide a full transcript for audio/video. For blog posts, this field must be explicitly null.

Analyze the provided content (${inputType}) and generate the complete JSON object now.
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
        
        return { ...parsedData, inputType, source };
    } catch (error) {
        console.error("Error generating content from Gemini API:", error);
        throw new Error("Failed to generate content. The AI model may be overloaded or the input may be invalid. Please try again.");
    }
};