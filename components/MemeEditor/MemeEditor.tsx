'use client';

import { useMemeEditor } from '@/hooks/useMemeEditor';
import ImageUpload from './ImageUpload';
import TextEditor from './TextEditor';
import StyleControls from './StyleControls';
import PreviewCanvas from './PreviewCanvas';

export default function MemeEditor() {
  const editor = useMemeEditor();

  const selectedText = editor.textElements.find((t) => t.id === editor.selectedTextId);
  const currentTextContent = selectedText?.content || '';

  return (
    <div className="main-content">
      <aside className="control-panel">
        <div className="panel-header">
          <h2>编辑工具</h2>
        </div>

        <div className="panel-body">
          <div className="control-section">
            <div className="section-header">
              <span className="section-icon">📷</span>
              <h3>选择图片</h3>
            </div>
            <ImageUpload
              templateImages={editor.templateImages}
              onTemplateSelect={editor.loadTemplate}
              onFileUpload={editor.handleFileUpload}
              onUrlLoad={editor.handleUrlLoad}
            />
          </div>

          <div className="control-section">
            <div className="section-header">
              <span className="section-icon">✏️</span>
              <h3>编辑文本</h3>
            </div>
            <TextEditor
              textElements={editor.textElements}
              selectedTextId={editor.selectedTextId}
              currentTextContent={currentTextContent}
              onAddText={editor.addNewText}
              onSelectText={editor.selectText}
              onUpdateTextContent={editor.updateTextContent}
              onDeleteText={editor.deleteText}
            />
          </div>

          <div className="control-section">
            <div className="section-header">
              <span className="section-icon">🎨</span>
              <h3>样式设置</h3>
            </div>
            <StyleControls
              fontFamily={editor.currentFontFamily}
              fontWeight={editor.currentFontWeight}
              fontStyle={editor.currentFontStyle}
              fontSize={editor.fontSize}
              textColor={editor.currentTextColor}
              onFontFamilyChange={editor.setCurrentFontFamily}
              onFontWeightChange={editor.setCurrentFontWeight}
              onFontStyleChange={editor.setCurrentFontStyle}
              onFontSizeChange={editor.setFontSize}
              onTextColorChange={editor.setCurrentTextColor}
            />
          </div>

          <div className="control-section">
            <button
              className="btn-download"
              onClick={editor.downloadMeme}
              disabled={!editor.currentImage}
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <span>下载表情包</span>
            </button>
            <button
              className="btn-publish"
              onClick={(e) => {
                e.preventDefault();
                console.log('Publish button clicked', {
                  currentImage: !!editor.currentImage,
                  canvasRef: !!editor.canvasRef.current,
                  isPublishing: editor.isPublishing,
                });
                editor.publishMeme();
              }}
              disabled={!editor.currentImage || editor.isPublishing}
              type="button"
            >
              {editor.isPublishing ? (
                <span>发布中...</span>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>发布表情包</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      <PreviewCanvas
        imageSrc={editor.imageSrc}
        currentImage={editor.currentImage}
        textElements={editor.textElements}
        selectedTextId={editor.selectedTextId}
        onImageContainerRef={editor.setImageContainerRef}
        onCanvasRef={editor.setCanvasRef}
        onTextSelect={editor.selectText}
        onTextDragStart={editor.startDrag}
        onReset={editor.resetAll}
      />
    </div>
  );
}
