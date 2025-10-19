import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface InputFormProps {
  onSubmit: (input: string, file?: File) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setInput(''); // Clear URL input
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': [],
      'video/*': [],
    },
    multiple: false,
    disabled: isLoading,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (file) {
      onSubmit(file.name, file);
    } else if (input) {
      onSubmit(input);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setFile(null); // Clear file input
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-20 md:py-24 animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">
          One Click. A Full Campaign.
        </h2>
        <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
          Enter a YouTube URL, Blog Post, or drop an audio/video file to instantly generate a suite of marketing assets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface shadow-2xl rounded-2xl p-4 lg:p-6 space-y-4 ring-1 ring-border-color/50">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleUrlChange}
            placeholder="Paste a YouTube or Blog URL here..."
            className="w-full pl-12 pr-4 py-4 bg-slate-100 text-text-primary border-2 border-transparent rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 placeholder-text-secondary/70 text-lg focus:bg-surface"
            disabled={isLoading || !!file}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        </div>

        <div className="relative flex items-center">
            <span className="flex-grow border-t border-border-color"></span>
            <span className="flex-shrink mx-4 text-text-secondary text-sm font-medium">OR</span>
            <span className="flex-grow border-t border-border-color"></span>
        </div>

        <div
          {...getRootProps()}
          className={`group relative w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
            ${isLoading ? 'cursor-not-allowed' : 'hover:border-primary'}
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-border-color'}
            ${file ? 'border-secondary bg-secondary/5' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 mb-3 transition-colors duration-300 ${isDragActive ? 'text-primary' : 'text-text-secondary/50 group-hover:text-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-4-4m0 0l4-4m-4 4h12" /></svg>
            {file ? (
              <p className="font-semibold text-secondary">{file.name}</p>
            ) : (
              <p className="text-text-secondary">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop an audio/video file
              </p>
            )}
            <p className="text-xs text-text-secondary/60 mt-1">Max file size: 500MB</p>
          </div>
          {file && !isLoading && (
             <button
              onClick={clearFile}
              className="absolute top-2 right-2 p-1.5 bg-surface rounded-full hover:bg-red-500/10 text-text-secondary hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || (!input && !file)}
          className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-xl disabled:from-slate-300 disabled:to-slate-300 disabled:text-text-secondary/80 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center shadow-lg text-lg space-x-3"
        >
          {isLoading ? (
            <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Atomizing Content...</span>
            </>
          ) : (
            <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm0 6a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2zm0 6a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2z" /></svg>
                <span>Generate My Assets</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
