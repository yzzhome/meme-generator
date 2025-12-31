'use client';

import { useState } from 'react';
import { Meme } from '@/types/meme';
import UpvoteButton from './UpvoteButton';
import { useFileUrl } from '@/hooks/useFileUrl';

interface MemeCardProps {
  meme: Meme;
}

export default function MemeCard({ meme }: MemeCardProps) {
  const [imageError, setImageError] = useState(false);
  const APP_ID = '19b91701-8651-46f9-8d30-ba85b80e929f';

  // 构造备用 URL
  const fallbackUrl = meme.imageUrl || 
    (meme.imagePath ? `https://cdn.instantdb.com/${APP_ID}/${meme.imagePath}` : '');

  // 使用 useFileUrl hook 获取图片 URL（它会尝试查询 $files，失败则使用备用 URL）
  const imageUrl = useFileUrl(meme.imagePath, fallbackUrl, meme.imageFileId);

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
