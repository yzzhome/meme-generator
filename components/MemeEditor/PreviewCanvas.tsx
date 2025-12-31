'use client';

import { useRef, useEffect, useState } from 'react';
import { TextElement } from '@/types/meme';
import FullscreenViewer from './FullscreenViewer';

interface PreviewCanvasProps {
  imageSrc: string;
  currentImage: HTMLImageElement | null;
  textElements: TextElement[];
  selectedTextId: string | null;
  onImageContainerRef: (ref: HTMLDivElement | null) => void;
  onCanvasRef: (ref: HTMLCanvasElement | null) => void;
  onTextSelect: (id: string) => void;
  onTextDragStart: (e: React.MouseEvent, id: string) => void;
  onReset: () => void;
}

export default function PreviewCanvas({
  imageSrc,
  currentImage,
  textElements,
  selectedTextId,
  onImageContainerRef,
  onCanvasRef,
  onTextSelect,
  onTextDragStart,
  onReset,
}: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    onImageContainerRef(containerRef.current);
  }, [onImageContainerRef]);

  useEffect(() => {
    console.log('PreviewCanvas: Setting canvas ref', canvasRef.current);
    onCanvasRef(canvasRef.current);
  }, [onCanvasRef, imageSrc]); // 当 imageSrc 改变时也更新 ref

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' && imageSrc) {
      setIsFullscreen(true);
    } else if (target === containerRef.current) {
      onTextSelect('');
    }
  };

  return (
    <>
      <div className="preview-area">
        <div className="preview-header">
          <h3>实时预览</h3>
          <div className="preview-actions">
            <button className="btn-icon" type="button" title="重置" onClick={onReset}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 3L12 6L9 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          id="imageContainer"
          className="image-container"
          onClick={handleContainerClick}
        >
          {!imageSrc ? (
            <div className="placeholder">
              <div className="placeholder-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                  <path
                    d="M21 15L16 10L5 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h4>准备开始创作</h4>
              <p>上传图片或输入图片链接开始制作表情包</p>
            </div>
          ) : (
            <>
              <img id="memeImage" src={imageSrc} alt="表情包图片" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div id="textOverlays" className="text-overlays">
                {textElements.map((textElement) => (
                  <div
                    key={textElement.id}
                    className={`text-overlay ${selectedTextId === textElement.id ? 'selected' : ''}`}
                    style={{
                      left: `${textElement.x}%`,
                      top: `${textElement.y}%`,
                      fontSize: `${textElement.fontSize}px`,
                      color: textElement.color,
                      fontFamily: textElement.fontFamily,
                      fontWeight: textElement.fontWeight,
                      fontStyle: textElement.fontStyle,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTextSelect(textElement.id);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      onTextDragStart(e, textElement.id);
                    }}
                  >
                    {textElement.content}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <FullscreenViewer
        imageSrc={imageSrc}
        textElements={textElements}
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
      />
    </>
  );
}
