'use client';

import { TextElement } from '@/types/meme';

interface TextEditorProps {
  textElements: TextElement[];
  selectedTextId: string | null;
  currentTextContent: string;
  onAddText: () => void;
  onSelectText: (id: string) => void;
  onUpdateTextContent: (id: string, content: string) => void;
  onDeleteText: (id: string) => void;
}

export default function TextEditor({
  textElements,
  selectedTextId,
  currentTextContent,
  onAddText,
  onSelectText,
  onUpdateTextContent,
  onDeleteText,
}: TextEditorProps) {
  const selectedText = textElements.find((t) => t.id === selectedTextId);

  return (
    <div className="section-content">
      <button className="btn-add-text" onClick={onAddText} type="button">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>添加文本</span>
      </button>

      <div className="text-list">
        {textElements.length === 0 ? (
          <div className="text-list-empty">暂无文本，点击"添加文本"开始</div>
        ) : (
          textElements.map((textElement, index) => (
            <div
              key={textElement.id}
              className={`text-list-item ${selectedTextId === textElement.id ? 'active' : ''}`}
              onClick={() => onSelectText(textElement.id)}
            >
              <span className="text-list-number">{index + 1}</span>
              <span className="text-list-content">{textElement.content || '(空文本)'}</span>
            </div>
          ))
        )}
      </div>

      <div className={`text-editor ${selectedTextId ? '' : 'hidden'}`}>
        {selectedText && selectedTextId && (
          <>
            <div className="input-field">
              <label className="input-label">文本内容</label>
              <textarea
                className="text-input textarea-input"
                placeholder="输入文字..."
                maxLength={100}
                rows={3}
                value={currentTextContent}
                onChange={(e) => onUpdateTextContent(selectedTextId!, e.target.value)}
              />
              <span className="char-count">
                <span>{currentTextContent.length}</span>/100
              </span>
            </div>
            <button
              className="btn-delete-text"
              onClick={() => selectedTextId && onDeleteText(selectedTextId)}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>删除文本</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
