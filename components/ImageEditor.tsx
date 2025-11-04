import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';

interface ImageEditorProps {
  imageData?: string;
  onImageDataChange: (imageData?: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageData, onImageDataChange }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageDataChange(reader.result as string);
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read the file.");
      }
      reader.readAsDataURL(file);
    }
  };

  const handleApplyEdit = async () => {
    if (!imageData || !prompt.trim()) {
      setError("Please upload an image and provide an editing prompt.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const editedImage = await editImage(imageData, prompt);
      onImageDataChange(editedImage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 space-y-4">
      <label className="block text-sm font-medium text-gray-400">
        Task Image (with AI editing)
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="relative w-full aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
          {imageData ? (
            <img src={imageData} alt="Task visual" className="object-contain max-h-full max-w-full rounded-md" />
          ) : (
            <div className="text-center text-gray-500 p-4">
              <p>Upload an image to get started</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              {imageData ? 'Change Image' : 'Upload Image'}
            </button>
             {imageData && (
                <button
                    onClick={() => onImageDataChange(undefined)}
                    className="w-full mt-2 text-sm text-gray-500 hover:text-red-500"
                >
                    Remove Image
                </button>
            )}
          </div>
          {imageData && (
            <>
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-1">
                  Describe your edit:
                </label>
                <input
                  type="text"
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder='e.g., "add a retro filter"'
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleApplyEdit}
                disabled={isLoading || !prompt.trim()}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Apply AI Edit'
                )}
              </button>
            </>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default ImageEditor;