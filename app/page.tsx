"use client"


import React, { useState, useCallback } from 'react';
import { convertFileToBase64 } from './utils/convertFileToBase64';

// The main App component
const App: React.FC = () => {
  // State management for various functionalities
  const [file, setFile] = useState<File | null>(null); // Holds the selected image file
  const [preview, setPreview] = useState<string>(''); // URL for the image preview
  const [result, setResult] = useState<string>(''); // Stores the analysis result
  const [statusMessage, setStatusMessage] = useState<string>(''); // Displays status messages to the user
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Manages the upload progress
  const [dragOver, setDragOver] = useState<boolean>(false); // UI state for drag-and-drop
  const [textInput, setTextInput] = useState<string>(''); // Custom text input by the user
  const [selectedOption, setSelectedOption] = useState<string>('off'); // Option for detail level of analysis
  const [maxTokens, setMaxTokens] = useState<number>(50); // Max tokens for analysis

  // Callback for handling file selection changes
  const handleFileChange = useCallback((selectedFile: File) => {
    // Updating state with the new file and its preview URL
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setStatusMessage('Image selected. Click "Analyze Image" to proceed.');
    setUploadProgress(0);
  }, []);

  // Function to handle submission for image analysis
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    if (!file) {
      setStatusMessage('No file selected!');
      return;
    }
  
    setStatusMessage('Converting image...');
    setUploadProgress(20); // Progress after starting image conversion
  
    try {
      // Convert the file to a base64 string
      const base64Image = await convertFileToBase64(file);
  
      setStatusMessage('Sending request...');
      setUploadProgress(40); // Progress after image conversion
  
      // Send a POST request to your API endpoint
      const response = await fetch('/api/upload_gpt4v', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          file: base64Image, 
          prompt: textInput, 
          detail: selectedOption !== 'off' ? selectedOption : undefined, 
          max_tokens: maxTokens 
        }),
      });
  
      setUploadProgress(60); // Progress after sending request
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const apiResponse = await response.json();
      setUploadProgress(80); // Progress after receiving response
  
      if (apiResponse.success) {
        setResult(apiResponse.analysis);
        setStatusMessage('Analysis complete.');
        setUploadProgress(100); // Final progress
      } else {
        setStatusMessage(apiResponse.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('An error occurred during the analysis.');
    }
  };

  // Callbacks for handling drag-and-drop events
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  // JSX for the component rendering

  return (
    <div className="text-center mx-auto my-5 p-5 border border-gray-300 rounded-lg max-w-md">
      <h1 className="text-xl font-bold mb-5">OpenAI Image Analysis</h1>
  
      {/* Text input field for custom question or prompt */}
      <input 
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter a custom question or prompt"
        className="mb-5 p-2 border border-gray-300 rounded-lg w-full"
      />

      {/* Slider to select the max tokens */}
      <p className="text-sm text-gray-600 mb-1">Max tokens: {maxTokens}</p>
      <input 
        type="range" 
        min="50" 
        max="800" 
        value={maxTokens} 
        onChange={(e) => setMaxTokens(Number(e.target.value))} 
        className="mb-5"
      />

      {/* Text above the dropdown menu */}
      <p className="text-sm text-gray-600 mb-1">Select the detail level (optional):</p>
      {/* Dropdown to select the detail level */}
      <select 
        value={selectedOption} 
        onChange={(e) => setSelectedOption(e.target.value)} 
        className="w-20 mb-5 p-2 border border-gray-300 rounded-lg"
      >
        <option value="off">Off</option>
        <option value="low">Low</option>
        <option value="high">High</option>
      </select>
  

  
      <div 
        className={`border-2 border-dashed border-gray-400 rounded-lg p-10 cursor-pointer mb-5 ${dragOver ? 'border-blue-300 bg-gray-100' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileUpload')?.click()}
      >
        <input 
          id="fileUpload"
          type="file" 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileChange(e.target.files[0]);
            }
          }}
          accept="image/*" 
          className="hidden" 
        />
        {preview ? (
          <img src={preview} alt="Preview" className="max-w-full max-h-48 mb-5 mx-auto" />
        ) : (
          <p>Drag and drop an image here, or click to select an image to upload.</p>
        )}
      </div>
      <div className="flex justify-center items-center mb-5">
        {uploadProgress === 0 || uploadProgress === 100 ? (
          <button onClick={handleSubmit} className="bg-blue-500 text-white py-2 px-5 rounded-lg cursor-pointer text-lg hover:bg-blue-700">
            Analyze Image
          </button>
        ) : (
          <progress value={uploadProgress} max="100" className="w-1/2"></progress>
        )}
      </div>
      {statusMessage && <p className="text-gray-600 mb-5">{statusMessage}</p>}
      {result && (
        <div className="mt-5">
          <strong>Analysis Result:</strong>
          <textarea value={result} readOnly className="w-full h-36 p-2 mt-2 border border-gray-300 rounded-lg resize-y" />
        </div>
      )}
    </div>
  );
}

export default App;
