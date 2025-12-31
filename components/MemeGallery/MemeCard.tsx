'use client';

import { useState, useMemo } from 'react';
import { Meme } from '@/types/meme';
import UpvoteButton from './UpvoteButton';

interface MemeCardProps {
  meme: Meme;
}

export default function MemeCard({ meme }: MemeCardProps) {
  const [imageError, setImageError] = useState(false);
  const APP_ID = '19b91701-8651-46f9-8d30-ba85b80e929f';

  // 构造图片 URL（不使用 $files 查询，因为 InstantDB 类型系统不支持 id 查询）
  const imageUrl = useMemo(() => {
    // 优先使用存储的 URL（兼容旧数据）
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
    
    // 使用路径构造 CDN URL
    if (meme.imagePath) {
      return `https://cdn.instantdb.com/${APP_ID}/${meme.imagePath}`;
    }
    
    return '';
  }, [meme.imageUrl, meme.imagePath]);

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
            setImageError(true);
          }}
          onLoad={() => {
            console.log('Image loaded successfully:', imageUrl);
            setImageError(false);
          }}
        />
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
