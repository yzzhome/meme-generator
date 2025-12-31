'use client';

import { useRef, useState } from 'react';

interface ImageUploadProps {
  templateImages: string[];
  onTemplateSelect: (path: string) => void;
  onFileUpload: (file: File) => void;
  onUrlLoad: (url: string) => void;
}

export default function ImageUpload({
  templateImages,
  onTemplateSelect,
  onFileUpload,
  onUrlLoad,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      setSelectedTemplate(null);
    }
  };

  const handleUrlSubmit = () => {
    const url = urlInputRef.current?.value.trim();
    if (url) {
      setIsLoadingUrl(true);
      onUrlLoad(url);
      setTimeout(() => setIsLoadingUrl(false), 1000);
    }
  };

  const handleUrlKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUrlSubmit();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    uploadAreaRef.current?.classList.add('dragover');
  };

  const handleDragLeave = () => {
    uploadAreaRef.current?.classList.remove('dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    uploadAreaRef.current?.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onFileUpload(file);
      setSelectedTemplate(null);
    }
  };

  const handleTemplateClick = (path: string) => {
    setSelectedTemplate(path);
    onTemplateSelect(path);
  };

  return (
    <div className="section-content">
      <div className="template-section">
        <p className="template-label">选择模板：</p>
        <div className="template-grid">
          {templateImages.map((imagePath, index) => (
            <div
              key={index}
              className={`template-item ${selectedTemplate === imagePath ? 'active' : ''}`}
              onClick={() => handleTemplateClick(imagePath)}
            >
              <img src={imagePath} alt={`模板 ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="divider-wrapper">
        <span className="divider-text">或上传自己的图片</span>
      </div>

      <div
        ref={uploadAreaRef}
        className="upload-area"
        onClick={handleFileSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 10L12 15L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15V3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="upload-text">点击上传或拖拽图片</p>
        <button className="btn-upload" type="button">
          选择文件
        </button>
      </div>

      <div className="divider-wrapper">
        <span className="divider-text">或</span>
      </div>

      <div className="url-input-wrapper">
        <input
          ref={urlInputRef}
          type="text"
          placeholder="粘贴图片链接..."
          className="url-input"
          onKeyPress={handleUrlKeyPress}
        />
        <button
          className="btn-url"
          onClick={handleUrlSubmit}
          disabled={isLoadingUrl}
          type="button"
        >
          <span>{isLoadingUrl ? '加载中...' : '加载'}</span>
          {!isLoadingUrl && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
