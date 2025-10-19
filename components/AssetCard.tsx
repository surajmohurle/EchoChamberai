import React, { ReactNode } from 'react';

interface AssetCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`bg-surface rounded-xl shadow-lg ring-1 ring-border-color/50 overflow-hidden h-full flex flex-col ${className} transition-all duration-300 hover:shadow-xl hover:ring-primary/20`}>
      <div className="p-4 bg-slate-50 flex items-center border-b border-border-color">
        <div className="text-primary mr-3">{icon}</div>
        <h3 className="font-bold text-lg text-text-primary">{title}</h3>
      </div>
      <div className="p-4 sm:p-5 flex-grow">
        {children}
      </div>
    </div>
  );
};

export default AssetCard;
