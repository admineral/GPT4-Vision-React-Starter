import React, { useState, useCallback } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedOption, setSelectedOption] = useState('low');

  const handleFileChange = useCallback((selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setStatusMessage('Image selected. Click "Analyze Image" to proceed.');
    setUploadProgress(0);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setStatusMessage('No file selected!');
      return;
    }

    setStatusMessage('Sending request...');
    setUploadProgress(10); // Initial progress
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64String = reader.result
        .replace('data:', '')
        .replace(/^.+,/, '');

      const data = {
        model: "gpt-4-vision-preview",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": textInput
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:image/jpeg;base64,${base64String}`,
                  "detail": selectedOption,
                }
              }
            ]
          }
        ],
        max_tokens: 4000
      };

      try {
        const response = await fetch('https://gpt.alizoed.top/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` // Use environment variable for API key
          },
          body: JSON.stringify(data)
        });

        setUploadProgress(50); // Midway progress

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse = await response.json();
        setUploadProgress(100); // Final progress

        if (apiResponse.choices && apiResponse.choices.length > 0) {
          setResult(apiResponse.choices[0].message.content);
          setStatusMessage('Analysis complete.');
        } else {
          console.error('No choices returned from API');
          setStatusMessage('Failed to get a response from the API.');
        }
      } catch (error) {
        console.error('Error:', error);
        setStatusMessage('An error occurred during the analysis.');
      }
    };
    reader.onerror = (error) => {
      console.error('Error:', error);
      setStatusMessage('File reading failed!');
    };
  };

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  return (
    <div className="App">
      <h1>OpenAI 图片分析</h1>

      {/* 添加文本输入框 */}
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="请描述你的问题"
        className="text-input"
      />

      <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className="dropdown">
        <option value="low">Low</option>
        <option value="high">High</option>
        <option value="auto">Auto</option>
      </select>

      <div 
        className={`drop-area ${dragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileUpload').click()}
      >
        <input 
          id="fileUpload"
          type="file" 
          onChange={(e) => handleFileChange(e.target.files[0])} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />
        {preview ? (
          <img src={preview} alt="Preview" className="image-preview" />
        ) : (
          <p>点击上传图片</p>
        )}
      </div>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
      {uploadProgress > 0 && (
        <progress value={uploadProgress} max="100"></progress>
      )}
      <button onClick={handleSubmit} className="analyze-button">
        开始分析
      </button>
      {result && (
        <div className="result">
          <strong>Analysis Result:</strong>
          <textarea value={result} readOnly />
        </div>
      )}
    </div>
  );
}

export default App;
