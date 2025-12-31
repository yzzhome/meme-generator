'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { id } from '@instantdb/react';

export function useUpvote(memeId: string) {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  
  // 使用 useAuth 来安全地获取用户信息（可以在任何地方使用）
  const { user } = db.useAuth();

  // 查询表情包信息（所有用户都可以查看）
  const { data } = db.useQuery({
    memes: {
      $: {
        where: { id: memeId },
      },
    },
  });

  // 查询点赞状态（只有登录用户才查询）
  const { data: upvoteData } = db.useQuery(
    user
      ? {
          upvotes: {
            $: {
              where: { memeId, userId: user.id },
            },
          },
        }
      : {}
  );

  useEffect(() => {
    if (data) {
      const meme = data.memes?.[0]; // 使用数组索引而不是对象键
      setUpvoteCount(meme?.upvotes || 0);
    }
  }, [data]);

  useEffect(() => {
    if (upvoteData && user) {
      setHasUpvoted((upvoteData.upvotes || []).length > 0);
    } else {
      setHasUpvoted(false);
    }
  }, [upvoteData, user]);

  const toggleUpvote = async () => {
    if (!user) {
      alert('请先登录才能点赞');
      return;
    }

    try {
      const currentMeme = data?.memes?.[0]; // 使用数组索引
      if (!currentMeme) {
        console.error('Meme not found:', memeId);
        return;
      }

      if (hasUpvoted) {
        // 取消点赞
        const upvoteId = upvoteData?.upvotes?.[0]?.id;
        if (upvoteId) {
          const newUpvotes = Math.max(0, (currentMeme.upvotes || 0) - 1);
          await db.transact([
            db.tx.upvotes[upvoteId].delete(),
            db.tx.memes[memeId].update({ upvotes: newUpvotes }),
          ]);
        }
      } else {
        // 添加点赞
        const newUpvotes = (currentMeme.upvotes || 0) + 1;
        await db.transact([
          db.tx.upvotes[id()].update({
            memeId,
            userId: user.id,
            createdAt: Date.now(),
          }),
          db.tx.memes[memeId].update({ upvotes: newUpvotes }),
        ]);
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
    }
  };

  return {
    hasUpvoted: user ? hasUpvoted : false,
    upvoteCount,
    toggleUpvote: user ? toggleUpvote : () => alert('请先登录才能点赞'),
  };
}
