// DOM元素
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadArea = document.getElementById('uploadArea');
const urlInput = document.getElementById('urlInput');
const loadUrlBtn = document.getElementById('loadUrlBtn');
const memeImage = document.getElementById('memeImage');
const imageContainer = document.getElementById('imageContainer');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const topTextOverlay = document.getElementById('topTextOverlay');
const bottomTextOverlay = document.getElementById('bottomTextOverlay');
const topTextCount = document.getElementById('topTextCount');
const bottomTextCount = document.getElementById('bottomTextCount');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const fontSizeValue = document.getElementById('fontSizeValue');
const textColorPicker = document.getElementById('textColorPicker');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const colorPresets = document.querySelectorAll('.color-preset');
const templateGrid = document.getElementById('templateGrid');

// 当前状态
let currentImage = null;
let currentTextColor = '#ffffff';

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
    
    // 文本输入和字符计数
    topTextInput.addEventListener('input', () => {
        updateTextOverlay(topTextOverlay, topTextInput.value);
        updateCharCount(topTextCount, topTextInput.value.length, 100);
    });
    
    bottomTextInput.addEventListener('input', () => {
        updateTextOverlay(bottomTextOverlay, bottomTextInput.value);
        updateCharCount(bottomTextCount, bottomTextInput.value.length, 100);
    });
    
    // 字体大小调整
    fontSizeSlider.addEventListener('input', handleFontSizeChange);
    
    // 文本颜色调整
    textColorPicker.addEventListener('input', handleTextColorChange);
    
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
    
    // 初始化文本显示
    topTextOverlay.classList.add('hidden');
    bottomTextOverlay.classList.add('hidden');
    
    // 初始化字符计数
    updateCharCount(topTextCount, 0, 100);
    updateCharCount(bottomTextCount, 0, 100);
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
        
        // 显示文本覆盖层（如果有文本）
        if (topTextInput.value.trim()) {
            topTextOverlay.classList.remove('hidden');
        }
        if (bottomTextInput.value.trim()) {
            bottomTextOverlay.classList.remove('hidden');
        }
        
        // 更新文本颜色
        updateTextColor();
        
        // 启用下载按钮
        downloadBtn.disabled = false;
        
        // 重置URL按钮状态
        if (onError) {
            onError();
        } else {
            loadUrlBtn.innerHTML = '<span>加载</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            loadUrlBtn.disabled = false;
        }
        
        // 更新文本位置
        updateTextPosition();
        
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

// 更新文本覆盖层
function updateTextOverlay(overlay, text) {
    if (text.trim()) {
        overlay.textContent = text;
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
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

// 更新文本位置
function updateTextPosition() {
    // 文本位置会根据CSS自动调整
    // 如果需要根据图片大小动态调整位置，可以在这里添加逻辑
}

// 处理字体大小变化
function handleFontSizeChange() {
    const fontSize = fontSizeSlider.value;
    fontSizeValue.textContent = `${fontSize}px`;
    
    topTextOverlay.style.fontSize = `${fontSize}px`;
    bottomTextOverlay.style.fontSize = `${fontSize}px`;
}

// 处理文本颜色变化
function handleTextColorChange() {
    currentTextColor = textColorPicker.value;
    updateTextColor();
    updateColorPresetActive();
}

// 更新文本颜色
function updateTextColor() {
    topTextOverlay.style.color = currentTextColor;
    bottomTextOverlay.style.color = currentTextColor;
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
        topTextInput.value = '';
        bottomTextInput.value = '';
        topTextOverlay.classList.add('hidden');
        bottomTextOverlay.classList.add('hidden');
        updateCharCount(topTextCount, 0, 100);
        updateCharCount(bottomTextCount, 0, 100);
        
        // 重置样式
        fontSizeSlider.value = 40;
        fontSizeValue.textContent = '40px';
        topTextOverlay.style.fontSize = '40px';
        bottomTextOverlay.style.fontSize = '40px';
        
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
    
    // 获取当前字体大小和颜色
    const fontSize = parseInt(fontSizeSlider.value);
    const textColor = textColorPicker.value;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // 绘制顶部文本
    if (topTextInput.value.trim()) {
        const topText = topTextInput.value;
        const x = canvas.width / 2;
        const y = 30;
        
        // 绘制黑色描边
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(4, fontSize / 10);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(topText, x, y);
        
        // 绘制文字
        ctx.fillStyle = textColor;
        ctx.fillText(topText, x, y);
    }
    
    // 绘制底部文本
    if (bottomTextInput.value.trim()) {
        const bottomText = bottomTextInput.value;
        const x = canvas.width / 2;
        
        // 测量文本高度以确定y位置
        ctx.textBaseline = 'bottom';
        const metrics = ctx.measureText(bottomText);
        const y = canvas.height - 30;
        
        // 绘制黑色描边
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(4, fontSize / 10);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(bottomText, x, y);
        
        // 绘制文字
        ctx.fillStyle = textColor;
        ctx.fillText(bottomText, x, y);
    }
    
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
