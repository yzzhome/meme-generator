'use client';

interface StyleControlsProps {
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  fontSize: number;
  textColor: string;
  onFontFamilyChange: (family: string) => void;
  onFontWeightChange: (weight: string) => void;
  onFontStyleChange: (style: string) => void;
  onFontSizeChange: (size: number) => void;
  onTextColorChange: (color: string) => void;
}

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial（默认）' },
  { value: 'Impact', label: 'Impact（粗体）' },
  { value: 'Comic Neue', label: 'Comic Neue（漫画）' },
  { value: 'Bebas Neue', label: 'Bebas Neue（无衬线粗体）' },
  { value: 'Anton', label: 'Anton（无衬线）' },
  { value: 'Oswald', label: 'Oswald（压缩）' },
  { value: 'Montserrat', label: 'Montserrat（现代）' },
  { value: 'Roboto', label: 'Roboto（简洁）' },
  { value: 'Noto Sans SC', label: '思源黑体（中文）' },
];

const COLOR_PRESETS = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00'];

export default function StyleControls({
  fontFamily,
  fontWeight,
  fontStyle,
  fontSize,
  textColor,
  onFontFamilyChange,
  onFontWeightChange,
  onFontStyleChange,
  onFontSizeChange,
  onTextColorChange,
}: StyleControlsProps) {
  return (
    <div className="section-content">
      <div className="setting-item">
        <div className="setting-label">
          <span>字体</span>
        </div>
        <select
          className="font-select"
          value={fontFamily}
          onChange={(e) => onFontFamilyChange(e.target.value)}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span>字体粗细</span>
        </div>
        <div className="font-weight-buttons">
          <button
            className={`font-weight-btn ${fontWeight === '400' ? 'active' : ''}`}
            onClick={() => onFontWeightChange('400')}
            type="button"
          >
            常规
          </button>
          <button
            className={`font-weight-btn ${fontWeight === '700' ? 'active' : ''}`}
            onClick={() => onFontWeightChange('700')}
            type="button"
          >
            粗体
          </button>
          <button
            className={`font-weight-btn ${fontWeight === '900' ? 'active' : ''}`}
            onClick={() => onFontWeightChange('900')}
            type="button"
          >
            超粗
          </button>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span>字体样式</span>
        </div>
        <div className="font-style-buttons">
          <button
            className={`font-style-btn ${fontStyle === 'normal' ? 'active' : ''}`}
            onClick={() => onFontStyleChange('normal')}
            type="button"
          >
            正常
          </button>
          <button
            className={`font-style-btn ${fontStyle === 'italic' ? 'active' : ''}`}
            onClick={() => onFontStyleChange('italic')}
            type="button"
          >
            斜体
          </button>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span>字体大小</span>
          <span className="setting-value">{fontSize}px</span>
        </div>
        <div className="slider-wrapper">
          <input
            type="range"
            min="20"
            max="100"
            value={fontSize}
            className="custom-slider"
            onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
          />
          <div className="slider-labels">
            <span>小</span>
            <span>大</span>
          </div>
        </div>
      </div>

      <div className="setting-item">
        <div className="setting-label">
          <span>文本颜色</span>
        </div>
        <div className="color-picker-wrapper">
          <input
            type="color"
            className="color-picker"
            value={textColor}
            onChange={(e) => onTextColorChange(e.target.value)}
          />
          <div className="color-presets">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                className={`color-preset ${textColor === color ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => onTextColorChange(color)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
