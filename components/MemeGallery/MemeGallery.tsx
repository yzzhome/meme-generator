'use client';

import { useMemes } from '@/hooks/useMemes';
import MemeCard from './MemeCard';

export default function MemeGallery() {
  const { memes, isLoading, error } = useMemes();

  if (isLoading) {
    return (
      <div className="meme-gallery">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading memes:', error);
    return (
      <div className="meme-gallery">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', color: '#ef4444', marginBottom: '10px' }}>
            加载失败，请重试
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
            {error instanceof Error ? error.message : String(error)}
          </div>
        </div>
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <div className="meme-gallery">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            还没有表情包，快去创建一个吧！
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meme-gallery">
      <div className="meme-grid">
        {memes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </div>
    </div>
  );
}
