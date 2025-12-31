// DOM元素
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadArea = document.getElementById('uploadArea');
const urlInput = document.getElementById('urlInput');
const loadUrlBtn = document.getElementById('loadUrlBtn');
const memeImage = document.getElementById('memeImage');
const imageContainer = document.getElementById('imageContainer');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const textColorPicker = document.getElementById('textColorPicker');
const fontFamilySelect = document.getElementById('fontFamilySelect');
const fontWeightButtons = document.querySelectorAll('.font-weight-btn');
const fontStyleButtons = document.querySelectorAll('.font-style-btn');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const colorPresets = document.querySelectorAll('.color-preset');
const templateGrid = document.getElementById('templateGrid');
const addTextBtn = document.getElementById('addTextBtn');
const textList = document.getElementById('textList');
const textOverlays = document.getElementById('textOverlays');
const textEditor = document.getElementById('textEditor');
const currentTextInput = document.getElementById('currentTextInput');
const currentTextCount = document.getElementById('currentTextCount');
const deleteTextBtn = document.getElementById('deleteTextBtn');

// 当前状态
let currentImage = null;
let currentTextColor = '#ffffff';
let currentFontFamily = 'Arial';
let currentFontWeight = '700';
let currentFontStyle = 'normal';
let textElements = []; // 存储所有文本元素
let selectedTextId = null; // 当前选中的文本ID
let isDragging = false;
let dragOffset = { x: 0, y: 0 };
let nextTextId = 1;

// 模板图片列表（从 assets 文件夹）
const templateImages = [
    'assets/生成表情图片 (1).png',
    'assets/生成表情图片 (2).png',
    'assets/生成表情图片 (3).png',
    'assets/生成表情图片 (4).png',
    'assets/生成表情图片.png'
];

// 初始化
function init() {
    // 加载模板图片
    loadTemplates();
    
    // 文件上传按钮
    uploadBtn.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // 文件输入
    fileInput.addEventListener('change', handleFileUpload);
    
    // 拖拽上传
    setupDragAndDrop();
    
    // URL加载
    loadUrlBtn.addEventListener('click', handleUrlLoad);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUrlLoad();
        }
    });
    
    // 添加文本按钮
    addTextBtn.addEventListener('click', addNewText);
    
    // 当前文本输入
    currentTextInput.addEventListener('input', () => {
        if (selectedTextId !== null) {
            updateTextContent(selectedTextId, currentTextInput.value);
            updateCharCount(currentTextCount, currentTextInput.value.length, 100);
        }
    });
    
    // 删除文本按钮
    deleteTextBtn.addEventListener('click', () => {
        if (selectedTextId !== null) {
            deleteText(selectedTextId);
        }
    });
    
    // 字体大小调整
    fontSizeSlider.addEventListener('input', handleFontSizeChange);
    
    // 文本颜色调整
    textColorPicker.addEventListener('input', handleTextColorChange);
    
    // 字体族调整
    fontFamilySelect.addEventListener('change', handleFontFamilyChange);
    
    // 字体粗细调整
    fontWeightButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFontWeight = btn.dataset.weight;
            fontWeightButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateTextFontStyle();
        });
    });
    
    // 字体样式调整
    fontStyleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFontStyle = btn.dataset.style;
            fontStyleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateTextFontStyle();
        });
    });
    
    // 颜色预设
    colorPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.dataset.color;
            textColorPicker.value = color;
            handleTextColorChange();
            updateColorPresetActive(preset);
        });
    });
    
    // 下载按钮
    downloadBtn.addEventListener('click', downloadMeme);
    
    // 重置按钮
    resetBtn.addEventListener('click', resetAll);
    
    // 初始化字符计数
    updateCharCount(currentTextCount, 0, 100);
    
    // 初始化字体样式
    updateTextFontStyle();
    
    // 点击画布外部取消选择
    imageContainer.addEventListener('click', (e) => {
        if (e.target === imageContainer || e.target === memeImage) {
            deselectText();
        }
    });
}

// 添加新文本
function addNewText() {
    if (!currentImage) {
        showNotification('请先加载一张图片！', 'error');
        return;
    }
    
    const textId = `text-${nextTextId++}`;
    const textElement = {
        id: textId,
        content: '新文本',
        x: 50, // 相对于容器的百分比
        y: 50,
        fontSize: parseInt(fontSizeSlider.value),
        color: currentTextColor,
        fontFamily: currentFontFamily,
        fontWeight: currentFontWeight,
        fontStyle: currentFontStyle
    };
    
    textElements.push(textElement);
    createTextOverlay(textElement);
    updateTextList();
    selectText(textId);
    
    showNotification('文本已添加，可以拖拽移动', 'success');
}

// 创建文本覆盖层
function createTextOverlay(textElement) {
    const overlay = document.createElement('div');
    overlay.className = 'text-overlay';
    overlay.id = textElement.id;
    overlay.textContent = textElement.content;
    overlay.style.left = `${textElement.x}%`;
    overlay.style.top = `${textElement.y}%`;
    overlay.style.fontSize = `${textElement.fontSize}px`;
    overlay.style.color = textElement.color;
    overlay.style.fontFamily = textElement.fontFamily;
    overlay.style.fontWeight = textElement.fontWeight;
    overlay.style.fontStyle = textElement.fontStyle;
    overlay.style.transform = 'translate(-50%, -50%)';
    overlay.style.cursor = 'move';
    overlay.style.userSelect = 'none';
    
    // 拖拽事件
    overlay.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        selectText(textElement.id);
        startDrag(e, textElement.id);
    });
    
    // 点击选择
    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        selectText(textElement.id);
    });
    
    textOverlays.appendChild(overlay);
    updateTextOverlayStyle(overlay, textElement);
}

// 更新文本覆盖层样式
function updateTextOverlayStyle(overlay, textElement) {
    overlay.style.fontSize = `${textElement.fontSize}px`;
    overlay.style.color = textElement.color;
    overlay.style.fontFamily = textElement.fontFamily;
    overlay.style.fontWeight = textElement.fontWeight;
    overlay.style.fontStyle = textElement.fontStyle;
}

// 开始拖拽
function startDrag(e, textId) {
    isDragging = true;
    selectedTextId = textId;
    
    const overlay = document.getElementById(textId);
    const rect = imageContainer.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    
    // 计算鼠标相对于文本中心的偏移
    dragOffset.x = e.clientX - (overlayRect.left + overlayRect.width / 2);
    dragOffset.y = e.clientY - (overlayRect.top + overlayRect.height / 2);
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    
    e.preventDefault();
}

// 处理拖拽
function handleDrag(e) {
    if (!isDragging || selectedTextId === null) return;
    
    const rect = imageContainer.getBoundingClientRect();
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    // 限制在容器内
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    
    const textElement = textElements.find(t => t.id === selectedTextId);
    if (textElement) {
        textElement.x = clampedX;
        textElement.y = clampedY;
        
        const overlay = document.getElementById(selectedTextId);
        overlay.style.left = `${clampedX}%`;
        overlay.style.top = `${clampedY}%`;
    }
}

// 停止拖拽
function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// 选择文本
function selectText(textId) {
    selectedTextId = textId;
    const textElement = textElements.find(t => t.id === textId);
    
    if (textElement) {
        // 移除所有选中状态
        document.querySelectorAll('.text-overlay').forEach(overlay => {
            overlay.classList.remove('selected');
        });
        
        // 添加选中状态
        const overlay = document.getElementById(textId);
        if (overlay) {
            overlay.classList.add('selected');
        }
        
        // 更新编辑器
        currentTextInput.value = textElement.content;
        updateCharCount(currentTextCount, textElement.content.length, 100);
        textEditor.classList.remove('hidden');
        
        // 更新样式控件
        fontSizeSlider.value = textElement.fontSize;
        fontSizeValue.textContent = `${textElement.fontSize}px`;
        textColorPicker.value = textElement.color;
        fontFamilySelect.value = textElement.fontFamily;
        currentFontWeight = textElement.fontWeight;
        currentFontStyle = textElement.fontStyle;
        
        // 更新按钮状态
        fontWeightButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.weight === textElement.fontWeight);
        });
        fontStyleButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.style === textElement.fontStyle);
        });
        
        updateColorPresetActive();
        updateTextFontStyle();
        
        // 更新文本列表高亮
        updateTextList();
    }
}

// 取消选择
function deselectText() {
    selectedTextId = null;
    
    // 移除所有选中状态
    document.querySelectorAll('.text-overlay').forEach(overlay => {
        overlay.classList.remove('selected');
    });
    
    textEditor.classList.add('hidden');
    currentTextInput.value = '';
    updateCharCount(currentTextCount, 0, 100);
    updateTextList();
}

// 更新文本内容
function updateTextContent(textId, content) {
    const textElement = textElements.find(t => t.id === textId);
    if (textElement) {
        textElement.content = content;
        const overlay = document.getElementById(textId);
        if (overlay) {
            overlay.textContent = content;
        }
    }
}

// 删除文本
function deleteText(textId) {
    if (confirm('确定要删除这个文本吗？')) {
        textElements = textElements.filter(t => t.id !== textId);
        const overlay = document.getElementById(textId);
        if (overlay) {
            overlay.remove();
        }
        
        if (selectedTextId === textId) {
            deselectText();
        }
        
        updateTextList();
        showNotification('文本已删除', 'success');
    }
}

// 更新文本列表
function updateTextList() {
    textList.innerHTML = '';
    
    if (textElements.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'text-list-empty';
        emptyMsg.textContent = '暂无文本，点击"添加文本"开始';
        textList.appendChild(emptyMsg);
        return;
    }
    
    textElements.forEach((textElement, index) => {
        const item = document.createElement('div');
        item.className = `text-list-item ${selectedTextId === textElement.id ? 'active' : ''}`;
        item.innerHTML = `
            <span class="text-list-number">${index + 1}</span>
            <span class="text-list-content">${textElement.content || '(空文本)'}</span>
        `;
        item.addEventListener('click', () => selectText(textElement.id));
        textList.appendChild(item);
    });
}

// 加载模板图片
function loadTemplates() {
    templateGrid.innerHTML = '';
    
    templateImages.forEach((imagePath, index) => {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.setAttribute('data-template', imagePath);
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `模板 ${index + 1}`;
        img.loading = 'lazy';
        
        // 图片加载错误处理
        img.onerror = () => {
            templateItem.style.display = 'none';
        };
        
        templateItem.appendChild(img);
        
        // 点击模板图片时加载
        templateItem.addEventListener('click', () => {
            loadImage(imagePath);
            // 移除其他模板的选中状态
            document.querySelectorAll('.template-item').forEach(item => {
                item.classList.remove('active');
            });
            // 添加当前模板的选中状态
            templateItem.classList.add('active');
        });
        
        templateGrid.appendChild(templateItem);
    });
}

// 设置拖拽上传
function setupDragAndDrop() {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                handleFile(file);
            } else {
                showNotification('请选择有效的图片文件！', 'error');
            }
        }
    });
}

// 处理文件上传
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// 处理文件
function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('请选择有效的图片文件！', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        loadImage(event.target.result);
    };
    reader.onerror = () => {
        showNotification('图片读取失败，请重试！', 'error');
    };
    reader.readAsDataURL(file);
}

// 处理URL加载
function handleUrlLoad() {
    const url = urlInput.value.trim();
    if (!url) {
        showNotification('请输入图片URL！', 'error');
        return;
    }
    
    // 显示加载状态
    const originalText = loadUrlBtn.innerHTML;
    loadUrlBtn.innerHTML = '<span>加载中...</span>';
    loadUrlBtn.disabled = true;
    
    loadImage(url, () => {
        // 恢复按钮状态
        loadUrlBtn.innerHTML = originalText;
        loadUrlBtn.disabled = false;
    });
}

// 加载图片
function loadImage(src, onError) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
        currentImage = img;
        memeImage.src = src;
        memeImage.style.display = 'block';
        
        // 隐藏占位符
        const placeholder = imageContainer.querySelector('.placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // 启用下载按钮
        downloadBtn.disabled = false;
        
        // 重置URL按钮状态
        if (onError) {
            onError();
        } else {
            loadUrlBtn.innerHTML = '<span>加载</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            loadUrlBtn.disabled = false;
        }
        
        // 如果是从文件上传加载的，清除模板选中状态
        if (!templateImages.includes(src)) {
            document.querySelectorAll('.template-item').forEach(item => {
                item.classList.remove('active');
            });
        }
        
        showNotification('图片加载成功！', 'success');
    };
    
    img.onerror = () => {
        showNotification('图片加载失败！请检查URL是否正确或图片是否支持跨域访问。', 'error');
        if (onError) {
            onError();
        }
    };
    
    img.src = src;
}

// 更新字符计数
function updateCharCount(element, count, maxLength = 100) {
    element.textContent = count;
    
    // 当接近限制时显示警告（90%时变红）
    const warningThreshold = maxLength * 0.9;
    if (count >= warningThreshold) {
        element.parentElement.style.color = '#ef4444';
    } else {
        element.parentElement.style.color = '';
    }
}

// 处理字体大小变化
function handleFontSizeChange() {
    const fontSize = fontSizeSlider.value;
    fontSizeValue.textContent = `${fontSize}px`;
    
    if (selectedTextId !== null) {
        const textElement = textElements.find(t => t.id === selectedTextId);
        if (textElement) {
            textElement.fontSize = parseInt(fontSize);
            const overlay = document.getElementById(selectedTextId);
            if (overlay) {
                overlay.style.fontSize = `${fontSize}px`;
            }
        }
    }
}

// 处理字体族变化
function handleFontFamilyChange() {
    currentFontFamily = fontFamilySelect.value;
    updateTextFontStyle();
}

// 更新文本字体样式
function updateTextFontStyle() {
    if (selectedTextId !== null) {
        const textElement = textElements.find(t => t.id === selectedTextId);
        if (textElement) {
            textElement.fontFamily = currentFontFamily;
            textElement.fontWeight = currentFontWeight;
            textElement.fontStyle = currentFontStyle;
            
            const overlay = document.getElementById(selectedTextId);
            if (overlay) {
                updateTextOverlayStyle(overlay, textElement);
            }
        }
    }
}

// 处理文本颜色变化
function handleTextColorChange() {
    currentTextColor = textColorPicker.value;
    
    if (selectedTextId !== null) {
        const textElement = textElements.find(t => t.id === selectedTextId);
        if (textElement) {
            textElement.color = currentTextColor;
            const overlay = document.getElementById(selectedTextId);
            if (overlay) {
                overlay.style.color = currentTextColor;
            }
        }
    }
    
    updateColorPresetActive();
}

// 更新颜色预设激活状态
function updateColorPresetActive(clickedPreset) {
    colorPresets.forEach(preset => {
        if (preset.dataset.color === currentTextColor) {
            preset.classList.add('active');
        } else {
            preset.classList.remove('active');
        }
    });
}

// 重置所有
function resetAll() {
    if (confirm('确定要重置所有内容吗？')) {
        // 重置图片
        currentImage = null;
        memeImage.src = '';
        memeImage.style.display = 'none';
        const placeholder = imageContainer.querySelector('.placeholder');
        if (placeholder) {
            placeholder.style.display = 'block';
        }
        
        // 重置文本
        textElements = [];
        selectedTextId = null;
        textOverlays.innerHTML = '';
        updateTextList();
        deselectText();
        
        // 重置样式
        fontSizeSlider.value = 40;
        fontSizeValue.textContent = '40px';
        
        fontFamilySelect.value = 'Arial';
        currentFontFamily = 'Arial';
        currentFontWeight = '700';
        currentFontStyle = 'normal';
        fontWeightButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.weight === '700') {
                btn.classList.add('active');
            }
        });
        fontStyleButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.style === 'normal') {
                btn.classList.add('active');
            }
        });
        updateTextFontStyle();
        
        textColorPicker.value = '#ffffff';
        currentTextColor = '#ffffff';
        updateTextColor();
        updateColorPresetActive();
        
        // 重置文件输入
        fileInput.value = '';
        urlInput.value = '';
        
        // 清除模板选中状态
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 禁用下载按钮
        downloadBtn.disabled = true;
        
        showNotification('已重置所有内容', 'success');
    }
}

// 更新文本颜色（兼容旧代码）
function updateTextColor() {
    // 这个方法现在由 handleTextColorChange 处理
}

// 下载表情包
function downloadMeme() {
    if (!currentImage) {
        showNotification('请先加载一张图片！', 'error');
        return;
    }
    
    // 创建canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    
    // 绘制图片
    ctx.drawImage(currentImage, 0, 0);
    
    // 绘制所有文本
    textElements.forEach(textElement => {
        const fontSize = textElement.fontSize;
        const textColor = textElement.color;
        const fontFamily = textElement.fontFamily;
        const fontWeight = textElement.fontWeight;
        const fontStyle = textElement.fontStyle;
        
        // 构建字体字符串
        let fontString = '';
        if (fontStyle === 'italic') {
            fontString += 'italic ';
        }
        fontString += `${fontWeight} ${fontSize}px "${fontFamily}", Arial, sans-serif`;
        ctx.font = fontString;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const x = (textElement.x / 100) * canvas.width;
        const y = (textElement.y / 100) * canvas.height;
        
        // 绘制黑色描边
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(4, fontSize / 10);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(textElement.content, x, y);
        
        // 绘制文字
        ctx.fillStyle = textColor;
        ctx.fillText(textElement.content, x, y);
    });
    
    // 创建下载链接
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `meme_${Date.now()}.png`;
        link.href = url;
        link.click();
        
        // 清理URL对象
        setTimeout(() => URL.revokeObjectURL(url), 100);
        
        showNotification('表情包下载成功！', 'success');
    }, 'image/png');
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '400px',
        wordWrap: 'break-word'
    });
    
    // 根据类型设置背景色
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1'
    };
    notification.style.background = colors[type] || colors.info;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加通知动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
