import React, { useState } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { GeneratedAssets, InputType } from '../types';
import AssetCard from './AssetCard';
import { TextBlock, SocialPostDisplay, VideoClipDisplay, KeyTakeawaysDisplay, AudiogramDisplay, StrategyCard, Pill } from './GeneratedContentDisplay';

interface DashboardProps {
  assets: GeneratedAssets;
}

type Tab = 'strategy' | 'overview' | 'clips' | 'social' | 'text';

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  const [activeTab, setActiveTab] = useState<Tab>('strategy');
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadAll = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("EchoChamberAI_Assets");

      if (!folder) {
        throw new Error("Could not create zip folder.");
      }

      // 1. Add Strategy files
      if (assets.campaignStrategy) {
        const { targetAudience, brandVoice, contentPillars, postingSchedule } = assets.campaignStrategy;
        const strategyText = `
# Campaign Strategy

## Target Audience
${targetAudience}

## Brand Voice
${brandVoice}

## Content Pillars
- ${contentPillars.join('\n- ')}

## Posting Schedule
${postingSchedule}
        `;
        folder.file("campaign_strategy.md", strategyText.trim());
      }
      if (assets.seoStrategy) {
         const { primaryKeyword, secondaryKeywords, suggestedTags, metaDescription } = assets.seoStrategy;
         const seoText = `
# SEO & Discovery Strategy

## Primary Keyword
${primaryKeyword}

## Secondary Keywords
- ${secondaryKeywords.join('\n- ')}

## Suggested Tags / Hashtags
- ${suggestedTags.join('\n- ')}

## Meta Description
${metaDescription}
         `;
         folder.file("seo_strategy.md", seoText.trim());
      }

      // 2. Add content files
      if (assets.summary) folder.file("summary.txt", assets.summary);
      if (assets.transcript) folder.file("transcript.txt", assets.transcript);
      if (assets.emailDraft) folder.file("email_draft.txt", assets.emailDraft);
      if (assets.keyTakeaways?.length) {
        folder.file("key_takeaways.txt", `- ${assets.keyTakeaways.join("\n- ")}`);
      }
      if (assets.socialPosts?.length) {
          const socialPostsText = assets.socialPosts
              .map(p => `--- ${p.platform.toUpperCase()} POST (${p.postType}) ---\n\n${p.content}\n\nRationale: ${p.rationale}\nVisual: ${p.visualSuggestion}\n\n`)
              .join('');
          folder.file("social_posts.md", socialPostsText);
      }
      
      const metadata = {
        videoClips: assets.videoClips?.map(({ thumbnailUrl, videoUrl, ...meta }) => meta) || [],
        audiograms: assets.audiograms || []
      };
      folder.file("clips_metadata.json", JSON.stringify(metadata, null, 2));


      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `EchoChamberAI_Assets_${new Date().toISOString().split('T')[0]}.zip`);

    } catch (error) {
      console.error("Error creating zip file:", error);
    } finally {
      setIsZipping(false);
    }
  };


  const tabs: { id: Tab; label: string; icon: React.ReactNode; disabled: boolean }[] = [
    { id: 'strategy', label: 'Campaign Strategy', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>, disabled: !assets.campaignStrategy },
    { id: 'overview', label: 'Summary', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7.5a.5.5 0 01-.5.5H5.5a.5.5 0 01-.5-.5V5z" /></svg>, disabled: false },
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
                 <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">Your AI Marketing Campaign is Ready</h2>
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
            {activeTab === 'strategy' && assets.campaignStrategy && assets.seoStrategy && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                {/* Campaign Strategy Column */}
                <div className="space-y-6">
                    <StrategyCard title="Target Audience" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-3 5a5 5 0 00-5 5v1h10v-1a5 5 0 00-5-5zm5.707-2.293a1 1 0 010 1.414L10.414 13H15a1 1 0 110 2H10a1 1 0 01-1-1v-4.586l1.293-1.293a1 1 0 011.414 0z" /></svg>}>
                       <p>{assets.campaignStrategy.targetAudience}</p>
                    </StrategyCard>
                    <StrategyCard title="Brand Voice" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L4 6.44V17.55a1 1 0 001.447.894l12-6A1 1 0 0018 12V4a1 1 0 000-1z" clipRule="evenodd" /></svg>}>
                        <p>{assets.campaignStrategy.brandVoice}</p>
                    </StrategyCard>
                     <StrategyCard title="Content Pillars" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>}>
                        <ul className="list-disc list-inside">
                            {assets.campaignStrategy.contentPillars.map(pillar => <li key={pillar}>{pillar}</li>)}
                        </ul>
                    </StrategyCard>
                     <StrategyCard title="Posting Schedule" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}>
                        <p className="whitespace-pre-wrap">{assets.campaignStrategy.postingSchedule}</p>
                    </StrategyCard>
                </div>
                 {/* SEO Strategy Column */}
                <div className="space-y-6">
                   <StrategyCard title="SEO & Discovery" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>}>
                        <div>
                            <p className="font-semibold text-text-primary mb-1">Primary Keyword:</p>
                            <Pill text={assets.seoStrategy.primaryKeyword} />
                        </div>
                        <div>
                            <p className="font-semibold text-text-primary mb-2">Secondary Keywords:</p>
                            <div className="flex flex-wrap gap-2">
                                {assets.seoStrategy.secondaryKeywords.map(kw => <Pill key={kw} text={kw} />)}
                            </div>
                        </div>
                         <div>
                            <p className="font-semibold text-text-primary mb-2">Suggested Tags:</p>
                            <div className="flex flex-wrap gap-2">
                                {assets.seoStrategy.suggestedTags.map(tag => <Pill key={tag} text={tag} />)}
                            </div>
                        </div>
                   </StrategyCard>
                   <StrategyCard title="Meta Description" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 3.293A1 1 0 0118 4v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1H17a1 1 0 01.293.293zM11 8a1 1 0 10-2 0v4a1 1 0 102 0V8z" /></svg>}>
                        <p className="italic">"{assets.seoStrategy.metaDescription}"</p>
                   </StrategyCard>
                </div>
              </div>
            )}
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