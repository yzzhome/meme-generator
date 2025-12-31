'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { TextElement } from '@/types/meme';
import { uploadMemeImage } from '@/lib/storage';
import { db } from '@/lib/db';
import { id } from '@instantdb/react';

const TEMPLATE_IMAGES = [
  '/assets/生成表情图片 (1).png',
  '/assets/生成表情图片 (2).png',
  '/assets/生成表情图片 (3).png',
  '/assets/生成表情图片 (4).png',
  '/assets/生成表情图片.png',
];

export function useMemeEditor() {
  // 使用 useAuth 来安全地获取用户信息
  const { user } = db.useAuth();
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [currentTextColor, setCurrentTextColor] = useState('#ffffff');
  const [currentFontFamily, setCurrentFontFamily] = useState('Arial');
  const [currentFontWeight, setCurrentFontWeight] = useState('700');
  const [currentFontStyle, setCurrentFontStyle] = useState('normal');
  const [fontSize, setFontSize] = useState(40);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPublishing, setIsPublishing] = useState(false);
  
  const nextTextIdRef = useRef(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addNewText = useCallback(() => {
    if (!currentImage) {
      return;
    }

    const textId = `text-${nextTextIdRef.current++}`;
    const newText: TextElement = {
      id: textId,
      content: '新文本',
      x: 50,
      y: 50,
      fontSize,
      color: currentTextColor,
      fontFamily: currentFontFamily,
      fontWeight: currentFontWeight,
      fontStyle: currentFontStyle,
    };

    setTextElements((prev) => [...prev, newText]);
    setSelectedTextId(textId);
  }, [currentImage, fontSize, currentTextColor, currentFontFamily, currentFontWeight, currentFontStyle]);

  const updateTextContent = useCallback((textId: string, content: string) => {
    setTextElements((prev) =>
      prev.map((text) => (text.id === textId ? { ...text, content } : text))
    );
  }, []);

  const deleteText = useCallback((textId: string) => {
    if (confirm('确定要删除这个文本吗？')) {
      setTextElements((prev) => prev.filter((text) => text.id !== textId));
      if (selectedTextId === textId) {
        setSelectedTextId(null);
      }
    }
  }, [selectedTextId]);

  const updateSelectedTextStyle = useCallback(() => {
    if (!selectedTextId) return;

    setTextElements((prev) =>
      prev.map((text) =>
        text.id === selectedTextId
          ? {
              ...text,
              fontSize,
              color: currentTextColor,
              fontFamily: currentFontFamily,
              fontWeight: currentFontWeight,
              fontStyle: currentFontStyle,
            }
          : text
      )
    );
  }, [selectedTextId, fontSize, currentTextColor, currentFontFamily, currentFontWeight, currentFontStyle]);

  useEffect(() => {
    updateSelectedTextStyle();
  }, [updateSelectedTextStyle]);

  const startDrag = useCallback((e: React.MouseEvent, textId: string) => {
    setIsDragging(true);
    setSelectedTextId(textId);

    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const textElement = textElements.find((t) => t.id === textId);
    if (!textElement) return;

    // 计算鼠标相对于文本中心的偏移
    const offsetX = e.clientX - (rect.left + (rect.width * textElement.x) / 100);
    const offsetY = e.clientY - (rect.top + (rect.height * textElement.y) / 100);
    setDragOffset({ x: offsetX, y: offsetY });

    e.preventDefault();
  }, [textElements]);

  const handleDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !selectedTextId || !imageContainerRef.current) return;

      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
      const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

      const clampedX = Math.max(5, Math.min(95, x));
      const clampedY = Math.max(5, Math.min(95, y));

      setTextElements((prev) =>
        prev.map((text) =>
          text.id === selectedTextId ? { ...text, x: clampedX, y: clampedY } : text
        )
      );
    },
    [isDragging, selectedTextId, dragOffset]
  );

  const stopDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
      };
    }
  }, [isDragging, handleDrag, stopDrag]);

  const loadImage = useCallback((src: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      setCurrentImage(img);
      setImageSrc(src);
    };

    img.onerror = () => {
      console.error('Failed to load image');
    };

    img.src = src;
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        loadImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }, [loadImage]);

  const handleUrlLoad = useCallback((url: string) => {
    if (!url.trim()) {
      return;
    }
    loadImage(url);
  }, [loadImage]);

  const loadTemplate = useCallback((templatePath: string) => {
    loadImage(templatePath);
  }, [loadImage]);

  const resetAll = useCallback(() => {
    if (confirm('确定要重置所有内容吗？')) {
      setCurrentImage(null);
      setImageSrc('');
      setTextElements([]);
      setSelectedTextId(null);
      setFontSize(40);
      setCurrentFontFamily('Arial');
      setCurrentFontWeight('700');
      setCurrentFontStyle('normal');
      setCurrentTextColor('#ffffff');
      nextTextIdRef.current = 1;
    }
  }, []);

  const downloadMeme = useCallback(() => {
    if (!currentImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = currentImage.width;
    canvas.height = currentImage.height;

    ctx.drawImage(currentImage, 0, 0);

    textElements.forEach((textElement) => {
      const fontSize = textElement.fontSize;
      const textColor = textElement.color;
      const fontFamily = textElement.fontFamily;
      const fontWeight = textElement.fontWeight;
      const fontStyle = textElement.fontStyle;

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

      ctx.strokeStyle = '#000';
      ctx.lineWidth = Math.max(4, fontSize / 10);
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(textElement.content, x, y);

      ctx.fillStyle = textColor;
      ctx.fillText(textElement.content, x, y);
    });

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `meme_${Date.now()}.png`;
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }, 'image/png');
  }, [currentImage, textElements]);

  const publishMeme = useCallback(async () => {
    console.log('publishMeme called', {
      currentImage: !!currentImage,
      canvasRef: !!canvasRef.current,
      canvasRefCurrent: canvasRef.current,
      isPublishing,
    });
    
    if (!currentImage) {
      console.error('Publish blocked: No current image');
      alert('请先上传一张图片！');
      return;
    }
    
    if (!canvasRef.current) {
      console.error('Publish blocked: Canvas ref is null');
      alert('Canvas 未初始化，请刷新页面重试');
      return;
    }
    
    if (isPublishing) {
      console.log('Publish blocked: Already publishing');
      return;
    }

    console.log('Starting publish...');
    setIsPublishing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = currentImage.width;
      canvas.height = currentImage.height;

      ctx.drawImage(currentImage, 0, 0);

      textElements.forEach((textElement) => {
        const fontSize = textElement.fontSize;
        const textColor = textElement.color;
        const fontFamily = textElement.fontFamily;
        const fontWeight = textElement.fontWeight;
        const fontStyle = textElement.fontStyle;

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

        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(4, fontSize / 10);
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(textElement.content, x, y);

        ctx.fillStyle = textColor;
        ctx.fillText(textElement.content, x, y);
      });

      console.log('Canvas rendered, converting to blob...');
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error('Failed to convert canvas to blob');
          setIsPublishing(false);
          alert('生成图片失败，请重试');
          return;
        }

        console.log('Blob created, size:', blob.size);

        try {
          console.log('Uploading image...');
          const file = new File([blob], `meme_${Date.now()}.png`, { type: 'image/png' });
          const { path, fileId } = await uploadMemeImage(file);
          console.log('Image uploaded:', { path, fileId });

          if (!user) {
            throw new Error('用户未登录，请先登录');
          }

          console.log('Creating meme record...', { userId: user.id, userEmail: user.email });

          await db.transact([
            db.tx.memes[id()].update({
              imagePath: path,
              imageFileId: fileId,
              createdAt: Date.now(),
              upvotes: 0,
              authorId: user.id,
              authorName: user.email?.split('@')[0] || undefined,
            }),
          ]);

          console.log('Meme published successfully!');
          alert('表情包发布成功！');
          resetAll();
        } catch (error) {
          console.error('Error in publish process:', error);
          console.error('Error details:', {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
          alert(`发布失败: ${error instanceof Error ? error.message : '未知错误'}，请查看控制台获取详细信息`);
        } finally {
          setIsPublishing(false);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error in publishMeme:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      alert(`发布失败: ${error instanceof Error ? error.message : '未知错误'}，请查看控制台获取详细信息`);
      setIsPublishing(false);
    }
  }, [currentImage, textElements, isPublishing, resetAll, user]);

  const setImageContainerRef = useCallback((ref: HTMLDivElement | null) => {
    imageContainerRef.current = ref;
  }, []);

  const setCanvasRef = useCallback((ref: HTMLCanvasElement | null) => {
    console.log('Setting canvas ref:', ref);
    canvasRef.current = ref;
  }, []);

  return {
    // State
    currentImage,
    imageSrc,
    textElements,
    selectedTextId,
    currentTextColor,
    currentFontFamily,
    currentFontWeight,
    currentFontStyle,
    fontSize,
    isDragging,
    isPublishing,
    templateImages: TEMPLATE_IMAGES,
    
    // Refs
    imageContainerRef,
    canvasRef,
    
    // Actions
    addNewText,
    updateTextContent,
    deleteText,
    selectText: setSelectedTextId,
    setCurrentTextColor,
    setCurrentFontFamily,
    setCurrentFontWeight,
    setCurrentFontStyle,
    setFontSize,
    startDrag,
    handleFileUpload,
    handleUrlLoad,
    loadTemplate,
    resetAll,
    downloadMeme,
    publishMeme,
    setImageContainerRef,
    setCanvasRef,
  };
}
