import React from 'react';
import InputForm from './InputForm';

interface HomePageProps {
  onSubmit: (input: string, file?: File) => void;
  isLoading: boolean;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CrossIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const ComparisonSection: React.FC = () => {
    const features = [
        {
            name: 'Input Source Flexibility',
            generic: 'Often single format (text only or audio only).',
            echo: 'Truly multimodal: YouTube, Blogs, Audio & Video files.',
            genericSupports: false,
            echoSupports: true
        },
        {
            name: 'Content Output',
            generic: 'A single asset type (e.g., just a transcript or summary).',
            echo: 'A full suite of assets: Clips, social posts, emails, and more.',
            genericSupports: false,
            echoSupports: true
        },
        {
            name: 'Workflow Efficiency',
            generic: 'Requires multiple tools and manual copy-pasting.',
            echo: 'One-click automation. A full campaign in seconds.',
            genericSupports: false,
            echoSupports: true
        },
        {
            name: 'Strategic AI Insights',
            generic: 'Provides raw, uncontextualized output.',
            echo: 'Delivers actionable insights like virality scores & hooks.',
            genericSupports: false,
            echoSupports: true
        },
        {
            name: 'Repurposing Speed',
            generic: 'Slow. Manual work required to find clips and write posts.',
            echo: 'Near-instant. Go from long-form to campaign immediately.',
            genericSupports: false,
            echoSupports: true
        },
        {
            name: 'Cost-Effectiveness',
            generic: 'Requires separate subscriptions for 3-5+ different tools.',
            echo: 'All-in-one platform, consolidating costs.',
            genericSupports: false,
            echoSupports: true
        },
    ];

    return (
        <div className="py-16 md:py-24 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
                    Stop Juggling. Start Dominating.
                </h2>
                <p className="mt-4 text-lg text-text-secondary max-w-3xl mx-auto">
                    Generic tools create more work. Echo Chamber AI is your force multiplier, turning one piece of content into a complete, strategic campaign.
                </p>
            </div>
            <div className="max-w-4xl mx-auto bg-surface shadow-xl rounded-2xl overflow-hidden ring-1 ring-border-color/50">
                <div className="grid grid-cols-5 text-sm font-bold text-text-primary text-center bg-slate-50 border-b border-border-color">
                    <div className="col-span-3 p-4">Feature</div>
                    <div className="col-span-1 p-4 border-l border-border-color">Generic Tools</div>
                    <div className="col-span-1 p-4 border-l border-border-color bg-primary/5 text-primary">Echo Chamber AI</div>
                </div>
                <div>
                    {features.map((feature, index) => (
                        <div key={index} className={`grid grid-cols-5 items-center text-center transition-colors hover:bg-slate-50/50 ${index < features.length - 1 ? 'border-b border-border-color' : ''}`}>
                            <div className="col-span-3 text-left p-4">
                                <p className="font-semibold text-text-primary">{feature.name}</p>
                                <p className="text-xs text-text-secondary mt-1 sm:hidden">
                                    <span className="font-bold">Generic:</span> {feature.generic}
                                    <br/>
                                    <span className="font-bold text-primary">Echo:</span> {feature.echo}
                                </p>
                            </div>
                            <div className="col-span-1 p-4 border-l border-border-color flex justify-center">
                                {feature.genericSupports ? <CheckIcon className="text-secondary/70"/> : <CrossIcon className="text-red-400/70"/>}
                            </div>
                            <div className="col-span-1 p-4 border-l border-border-color bg-primary/5 flex justify-center">
                                 {feature.echoSupports ? <CheckIcon className="text-primary"/> : <CrossIcon className="text-red-500"/>}
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="p-4 text-center bg-slate-50 border-t border-border-color text-xs text-text-secondary">
                    You've already made the smart choice. Now let's create something amazing.
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ onSubmit, isLoading }) => {
    return (
        <div>
            <InputForm onSubmit={onSubmit} isLoading={isLoading} />
            <ComparisonSection />
        </div>
    )
}

export default HomePage;
