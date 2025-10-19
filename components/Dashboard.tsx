import React, { useState } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { GeneratedAssets, InputType } from '../types';
import AssetCard from './AssetCard';
import { TextBlock, SocialPostDisplay, VideoClipDisplay, KeyTakeawaysDisplay, AudiogramDisplay } from './GeneratedContentDisplay';

interface DashboardProps {
  assets: GeneratedAssets;
}

type Tab = 'overview' | 'clips' | 'social' | 'text';

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadAll = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("EchoChamberAI_Assets");

      if (!folder) {
        throw new Error("Could not create zip folder.");
      }

      // 1. Add text files
      if (assets.summary) folder.file("summary.txt", assets.summary);
      if (assets.transcript) folder.file("transcript.txt", assets.transcript);
      if (assets.emailDraft) folder.file("email_draft.txt", assets.emailDraft);
      if (assets.keyTakeaways?.length) {
        const takeawaysText = assets.keyTakeaways.join("\n- ");
        folder.file("key_takeaways.txt", `- ${takeawaysText}`);
      }
      if (assets.socialPosts?.length) {
          const socialPostsText = assets.socialPosts
              .map(p => `--- ${p.platform.toUpperCase()} POST ---\n\n${p.content}\n\n`)
              .join('');
          folder.file("social_posts.md", socialPostsText);
      }

      // 2. Add video clip metadata
      if (assets.videoClips?.length) {
        const clipsMetadata = assets.videoClips.map(({ thumbnailUrl, videoUrl, ...meta }) => meta);
        folder.file("video_clips_metadata.json", JSON.stringify(clipsMetadata, null, 2));
      }
      
      // 3. Add audiogram metadata
      if (assets.audiograms?.length) {
          folder.file("audiograms_metadata.json", JSON.stringify(assets.audiograms, null, 2));
      }


      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `EchoChamberAI_Assets_${new Date().toISOString().split('T')[0]}.zip`);

    } catch (error) {
      console.error("Error creating zip file:", error);
      // You could show an error message to the user here
    } finally {
      setIsZipping(false);
    }
  };


  const tabs: { id: Tab; label: string; icon: React.ReactNode; disabled: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7.5a.5.5 0 01-.5.5H5.5a.5.5 0 01-.5-.5V5z" /></svg>, disabled: false },
    { id: 'clips', label: 'Video & Audio Clips', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>, disabled: !assets.videoClips?.length && !assets.audiograms?.length },
    { id: 'social', label: 'Social Posts', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>, disabled: !assets.socialPosts?.length },
    { id: 'text', label: 'Text Content', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>, disabled: !assets.transcript && !assets.emailDraft },
  ];

  const TabButton: React.FC<{tab: typeof tabs[0]}> = ({ tab }) => (
      <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          disabled={tab.disabled}
          className={`flex items-center space-x-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed
          ${activeTab === tab.id
              ? 'bg-primary text-white shadow'
              : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary'
          }`}
      >
          {tab.icon}
          <span>{tab.label}</span>
      </button>
  );

  return (
    <div className="w-full mx-auto py-8 lg:py-12 animate-fade-in-up" style={{ animationFillMode: 'backwards' }}>
      <div className="bg-surface p-2 sm:p-4 rounded-2xl shadow-2xl ring-1 ring-border-color/50">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-border-color">
            <div>
                 <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">Your Atomized Content is Ready</h2>
                <p className="text-text-secondary mt-1 text-sm">
                  Generated from {assets.inputType}: <span className="font-mono text-primary break-all">{assets.source}</span>
                </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0 flex-shrink-0">
                 <button
                    onClick={handleDownloadAll}
                    disabled={isZipping}
                    className="bg-secondary hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-text-secondary disabled:cursor-wait text-white font-semibold py-2 px-4 rounded-lg text-sm flex items-center space-x-2 transition-all transform hover:scale-105 shadow"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isZipping ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                     <span>{isZipping ? 'Zipping...' : 'Download All'}</span>
                </button>
            </div>
        </div>
        
        {/* Tabs */}
        <div className="p-2 border-b border-border-color flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
          {tabs.map(tab => <TabButton key={tab.id} tab={tab} />)}
        </div>
        
        {/* Content */}
        <div className="p-4 md:p-6 bg-slate-50 rounded-b-lg">
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
                     {assets.summary && (
                      <AssetCard
                        title="Summary / Show Notes"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        className="xl:col-span-2"
                      >
                       <p className="text-text-secondary text-sm leading-relaxed h-full whitespace-pre-wrap">{assets.summary}</p>
                      </AssetCard>
                    )}
                    {assets.keyTakeaways && (
                        <AssetCard
                            title="Key Takeaways"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
                            >
                            <KeyTakeawaysDisplay takeaways={assets.keyTakeaways}/>
                        </AssetCard>
                    )}
                </div>
            )}
             {activeTab === 'clips' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                    {assets.videoClips?.map(clip => <VideoClipDisplay key={clip.id} clip={clip} />)}
                    {assets.audiograms?.map(ag => <AudiogramDisplay key={ag.id} audiogram={ag} />)}
                </div>
             )}
             {activeTab === 'social' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
                    {assets.socialPosts?.map(post => <SocialPostDisplay key={post.id} post={post} />)}
                </div>
             )}
             {activeTab === 'text' && (
                 <div className="space-y-6 animate-fade-in">
                    {assets.emailDraft && (
                         <AssetCard
                            title="Promotional Email Draft"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                            >
                            <TextBlock content={assets.emailDraft} maxHeight="h-72"/>
                        </AssetCard>
                    )}
                     {assets.transcript && (
                       <AssetCard
                        title="Full Transcript"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                      >
                        <TextBlock content={assets.transcript} maxHeight="h-96" />
                      </AssetCard>
                    )}
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;