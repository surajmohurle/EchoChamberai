import React, { useState } from 'react';
import { SocialPost, VideoClip, Audiogram } from '../types';

const CopyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const formatTime = (seconds: number): string => {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}

export const TextBlock: React.FC<{ content: string, maxHeight?: string }> = ({ content, maxHeight = 'h-full' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`relative bg-slate-100 p-4 rounded-lg text-text-primary text-sm whitespace-pre-wrap font-mono ${maxHeight} ring-1 ring-border-color`}>
      <pre className="h-full overflow-auto text-sm leading-relaxed">{content}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 bg-surface rounded-md hover:bg-primary hover:text-white text-text-secondary transition-all duration-200 shadow-sm ring-1 ring-border-color"
        aria-label="Copy to clipboard"
      >
        {copied ? <CheckIcon/> : <CopyIcon/>}
      </button>
    </div>
  );
};

export const SocialPostDisplay: React.FC<{ post: SocialPost }> = ({ post }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(post.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

  const platformStyles = {
    X: { icon: <svg className="w-5 h-5" viewBox="0 0 1200 1227" fill="currentColor"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.31H892.476L569.165 687.854V687.828Z"/></svg>, color: 'text-text-primary' },
    LinkedIn: { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, color: 'text-blue-600' },
    Instagram: { icon: <svg className="w-5 h-5" fill="url(#ig-gradient)" viewBox="0 0 24 24"><defs><radialGradient id="ig-gradient" cx="0.3" cy="1.2" r="1.2"><stop offset="0" stopColor="#F58529"/><stop offset="0.4" stopColor="#DD2A7B"/><stop offset="0.9" stopColor="#8134AF"/></radialGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-2.163C8.74 0 8.333.011 7.053.069 2.59.285.285 2.59.069 7.053.011 8.333 0 8.74 0 12s.011 3.667.069 4.947c.216 4.46 2.525 6.765 7.004 6.981C8.333 23.989 8.74 24 12 24s3.667-.011 4.947-.069c4.46-.216 6.765-2.525 6.981-7.004.058-1.28.069-1.687.069-4.947s-.011-3.667-.069-4.947C23.715 2.59 21.41.285 16.947.069 15.667.011 15.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>, color: 'text-text-primary' },
  };

  const { icon, color } = platformStyles[post.platform];

  return (
    <div className="bg-surface p-4 rounded-lg h-full flex flex-col ring-1 ring-border-color/70 shadow-sm transition-all duration-300 hover:shadow-md hover:ring-primary/20">
        <div className="flex justify-between items-center mb-3">
             <div className={`flex items-center space-x-2 ${color}`}>
                {icon}
                <span className="font-bold text-sm text-text-primary">{post.platform}</span>
             </div>
             <button
                onClick={handleCopy}
                className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1 p-1 rounded-md"
                >
                {copied ? <CheckIcon/> : <CopyIcon/>}
                <span className={`transition-all duration-200 ${copied ? 'text-secondary' : 'text-primary'}`}>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
        </div>
      <p className="text-text-secondary text-sm flex-grow whitespace-pre-wrap leading-relaxed">{post.content}</p>
    </div>
  );
};

export const VideoClipDisplay: React.FC<{ clip: VideoClip }> = ({ clip }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const textToCopy = `Title: ${clip.title}\nHook: ${clip.hook}\nTimestamp: ${formatTime(clip.startTime)} - ${formatTime(clip.endTime)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-lg ring-1 ring-border-color/50 flex flex-col h-full">
      <div className="p-4 bg-slate-100 border-b border-border-color">
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-text-primary pr-2">{clip.title}</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 flex items-center space-x-1 ${clip.viralityScore > 90 ? 'text-green-100 bg-green-500/80' : 'text-amber-100 bg-amber-500/80'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span>{clip.viralityScore}</span>
            </span>
        </div>
      </div>
      <div className="p-4 space-y-4 flex-grow flex flex-col">
          <p className="text-sm text-text-secondary italic">"{clip.hook}"</p>
          <div className="flex items-center text-sm text-text-primary bg-slate-100 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
              <span className="font-mono">{formatTime(clip.startTime)} - {formatTime(clip.endTime)}</span>
          </div>
          <div className="text-xs text-text-secondary/80 mt-auto pt-2 border-t border-dashed border-border-color">
              <strong>How to use:</strong> Cut a clip from your original video using these timestamps in an editor.
          </div>
      </div>
       <div className="p-2 bg-slate-50">
           <button onClick={handleCopy} className="w-full text-center text-sm font-semibold text-primary hover:bg-primary/10 py-2 rounded-md transition-colors flex items-center justify-center space-x-2">
            {copied ? <CheckIcon/> : <CopyIcon/>}
            <span>{copied ? 'Copied Details!' : 'Copy Details'}</span>
           </button>
       </div>
    </div>
  );
};

export const AudiogramDisplay: React.FC<{ audiogram: Audiogram }> = ({ audiogram }) => {
   const [copied, setCopied] = useState(false);
   const handleCopy = () => {
    const textToCopy = `Title: ${audiogram.title}\nSummary: ${audiogram.summary}\nTimestamp: ${formatTime(audiogram.startTime)} - ${formatTime(audiogram.endTime)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-lg ring-1 ring-border-color/50 flex flex-col h-full">
        <div className="p-4 bg-slate-100 border-b border-border-color">
            <h4 className="font-bold text-text-primary">{audiogram.title}</h4>
        </div>
        <div className="p-4 space-y-4 flex-grow flex flex-col">
            <p className="text-sm text-text-secondary italic">"{audiogram.summary}"</p>
            <div className="flex items-center text-sm text-text-primary bg-slate-100 p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor"><path d="M18 3a1 1 0 00-1.447-.894L4 6.44V17.55a1 1 0 001.447.894l12-6A1 1 0 0018 12V4a1 1 0 000-1z" /></svg>
                <span className="font-mono">{formatTime(audiogram.startTime)} - {formatTime(audiogram.endTime)}</span>
            </div>
            <div className="text-xs text-text-secondary/80 mt-auto pt-2 border-t border-dashed border-border-color">
                <strong>How to use:</strong> Create an audiogram using this clip from your original audio file.
            </div>
        </div>
        <div className="p-2 bg-slate-50">
           <button onClick={handleCopy} className="w-full text-center text-sm font-semibold text-primary hover:bg-primary/10 py-2 rounded-md transition-colors flex items-center justify-center space-x-2">
            {copied ? <CheckIcon/> : <CopyIcon/>}
            <span>{copied ? 'Copied Details!' : 'Copy Details'}</span>
           </button>
       </div>
    </div>
  );
};


export const KeyTakeawaysDisplay: React.FC<{ takeaways: string[] }> = ({ takeaways }) => (
    <ul className="space-y-3.5">
        {takeaways.map((item, index) => (
            <li key={index} className="flex items-start space-x-3">
                 <div className="w-5 h-5 flex-shrink-0 mt-0.5 bg-secondary/10 rounded-full flex items-center justify-center ring-2 ring-secondary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-text-secondary text-sm">{item}</span>
            </li>
        ))}
    </ul>
);