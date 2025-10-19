export enum InputType {
  YOUTUBE = 'YouTube',
  AUDIO = 'Audio File',
  BLOG = 'Blog Post',
  UNKNOWN = 'Unknown'
}

export interface CampaignStrategy {
    targetAudience: string;
    brandVoice: string;
    contentPillars: string[];
    postingSchedule: string;
}

export interface SeoStrategy {
    primaryKeyword: string;
    secondaryKeywords: string[];
    suggestedTags: string[];
    metaDescription: string;
}


export interface VideoClip {
  id: string;
  title: string;
  hook: string;
  startTime: number;
  endTime: number;
  viralityScore: number;
  thumbnailUrl: string;
  videoUrl: string;
  rationale: string;
}

export interface SocialPost {
  id: string;
  platform: 'LinkedIn' | 'X' | 'Instagram';
  postType: string;
  content: string;
  visualSuggestion: string;
  rationale: string;
}

export interface Audiogram {
  id: string;
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
  rationale: string;
}

export interface GeneratedAssets {
  inputType: InputType;
  source: string;
  campaignStrategy?: CampaignStrategy;
  seoStrategy?: SeoStrategy;
  summary?: string;
  transcript?: string;
  keyTakeaways?: string[];
  videoClips?: VideoClip[];
  socialPosts?: SocialPost[];
  emailDraft?: string;
  audiograms?: Audiogram[];
}