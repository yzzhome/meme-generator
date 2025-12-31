'use client';

import { useState, useMemo } from 'react';
import { Meme } from '@/types/meme';
import UpvoteButton from './UpvoteButton';
import { db } from '@/lib/db';

interface MemeCardProps {
  meme: Meme;
}

export default function MemeCard({ meme }: MemeCardProps) {
  const [imageError, setImageError] = useState(false);
  const APP_ID = '19b91701-8651-46f9-8d30-ba85b80e929f';
  
  // 查询 $files 命名空间获取文件 URL
  // 只使用 fileId 查询（path 查询可能有类型问题）
  const { data: fileData, isLoading: fileLoading, error: fileError } = db.useQuery(
    meme.imageFileId
      ? {
          $files: {
            $: {
              where: { id: meme.imageFileId },
            },
          },
        }
      : {}
  );

  // 调试信息
  if (fileData) {
    console.log('File query result:', {
      memeId: meme.id,
      imagePath: meme.imagePath,
      imageFileId: meme.imageFileId,
      fileData: fileData,
      $files: fileData.$files,
    });
  }
  if (fileError) {
    console.error('File query error:', fileError);
  }

  // 从 $files 查询获取 URL，或使用备用 URL
  const imageUrl = useMemo(() => {
    // 优先使用从 $files 查询得到的 URL
    const files = fileData?.$files;
    if (files) {
      // $files 可能是数组或对象
      const fileArray = Array.isArray(files) ? files : Object.values(files);
      if (fileArray.length > 0) {
        const file = fileArray[0];
        if (file?.url) {
          console.log('Using URL from $files:', file.url);
          return file.url;
        }
      }
    }
    
    // 如果有存储的 URL，使用它（兼容旧数据）
    if (meme.imageUrl) {
      // 如果是旧的错误格式，尝试修复
      if (meme.imageUrl.includes('storage.instantdb.com') && 
          !meme.imageUrl.includes('instant-storage.s3.amazonaws.com') && 
          !meme.imageUrl.includes('cdn.instantdb.com')) {
        // 尝试从路径提取并构造正确的 URL
        const pathMatch = meme.imageUrl.match(/storage\.instantdb\.com\/(.+)/);
        if (pathMatch && pathMatch[1]) {
          return `https://cdn.instantdb.com/${APP_ID}/${pathMatch[1]}`;
        }
      }
      return meme.imageUrl;
    }
    
    // 最后使用路径构造 URL
    if (meme.imagePath) {
      return `https://cdn.instantdb.com/${APP_ID}/${meme.imagePath}`;
    }
    
    return '';
  }, [fileData, meme.imageUrl, meme.imagePath, meme.imageFileId]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="meme-card">
      {imageError ? (
        <div className="meme-card-image-error" style={{
          width: '100%',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
          color: '#6b7280',
        }}>
          图片加载失败
        </div>
      ) : imageUrl ? (
        <img 
          src={imageUrl} 
          alt="表情包" 
          className="meme-card-image"
          onError={(e) => {
            console.error('Image load error:', imageUrl);
            console.error('Meme data:', meme);
            console.error('File data:', fileData);
            console.error('File loading:', fileLoading);
            console.error('File error:', fileError);
            setImageError(true);
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', imageUrl);
            setImageError(false);
          }}
        />
      ) : fileLoading ? (
        <div className="meme-card-image-error" style={{
          width: '100%',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
          color: '#6b7280',
        }}>
          加载中...
        </div>
      ) : (
        <div className="meme-card-image-error" style={{
          width: '100%',
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f3f4f6',
          color: '#6b7280',
        }}>
          无法加载图片
        </div>
      )}
      <div className="meme-card-footer">
        <div className="meme-card-info">
          <div className="meme-card-date">{formatDate(meme.createdAt)}</div>
          {meme.authorName && <div className="meme-card-author">@{meme.authorName}</div>}
        </div>
        <UpvoteButton memeId={meme.id} />
      </div>
    </div>
  );
}
