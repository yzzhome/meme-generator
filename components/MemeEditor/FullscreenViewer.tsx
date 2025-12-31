'use client';

import { useEffect } from 'react';

interface FullscreenViewerProps {
  imageSrc: string;
  textElements: Array<{
    id: string;
    content: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenViewer({
  imageSrc,
  textElements,
  isOpen,
  onClose,
}: FullscreenViewerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fullscreen-viewer" onClick={onClose}>
      <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
        <button className="fullscreen-close" onClick={onClose} type="button" aria-label="关闭全屏">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="fullscreen-image-wrapper">
          <img src={imageSrc} alt="全屏表情包" className="fullscreen-image" />
          <div className="fullscreen-text-overlays">
            {textElements.map((textElement) => (
              <div
                key={textElement.id}
                className="fullscreen-text-overlay"
                style={{
                  left: `${textElement.x}%`,
                  top: `${textElement.y}%`,
                  fontSize: `${textElement.fontSize}px`,
                  color: textElement.color,
                  fontFamily: textElement.fontFamily,
                  fontWeight: textElement.fontWeight,
                  fontStyle: textElement.fontStyle,
                }}
              >
                {textElement.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
