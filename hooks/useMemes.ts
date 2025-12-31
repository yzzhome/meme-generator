'use client';

import { db } from '@/lib/db';

export function useMemes() {
  // 先尝试不使用排序，看看是否能加载
  const { data, isLoading, error } = db.useQuery({
    memes: {},
  });

  // 调试信息
  if (error) {
    console.error('useMemes error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }

  // 在客户端对结果进行排序（按创建时间降序）
  const sortedMemes = (data?.memes || []).sort((a, b) => {
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  return {
    memes: sortedMemes,
    isLoading,
    error,
  };
}
