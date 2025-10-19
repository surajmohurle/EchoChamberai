import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Analyzing content structure...",
  "Identifying key topics and hooks...",
  "Generating transcripts and summaries...",
  "Finding viral clip moments...",
  "Drafting social media posts...",
  "Finalizing your assets...",
];

const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-24 text-center animate-fade-in">
      <div className="relative h-24 w-24">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-primary"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-2 border-b-2 border-accent opacity-75 animate-spin" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <div className="min-h-[56px]">
        <p className="text-text-primary text-xl font-semibold transition-opacity duration-500 animate-fade-in">{loadingMessages[messageIndex]}</p>
      </div>
      <p className="text-text-secondary text-sm max-w-sm">This may take a moment, especially for longer video or audio files. Great things are worth the wait!</p>
    </div>
  );
};

export default Loader;
