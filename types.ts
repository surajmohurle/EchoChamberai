export enum InputType {
  YOUTUBE = 'YouTube',
  AUDIO = 'Audio File',
  BLOG = 'Blog Post',
  UNKNOWN = 'Unknown'
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
}

export interface SocialPost {
  id: string;
  platform: 'LinkedIn' | 'X' | 'Instagram';
  content: string;
}

export interface Audiogram {
  id: string;
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
}

export interface GeneratedAssets {
  inputType: InputType;
  source: string;
  summary?: string;
  transcript?: string;
  keyTakeaways?: string[];
  videoClips?: VideoClip[];
  socialPosts?: SocialPost[];
  emailDraft?: string;
  audiograms?: Audiogram[];
}