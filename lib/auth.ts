'use client';

export function getUserId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const stored = localStorage.getItem('meme_user_id');
  if (stored) {
    return stored;
  }

  // 生成新的用户ID
  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('meme_user_id', newId);
  return newId;
}

export function getUserName(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('meme_user_name');
}

export function setUserName(name: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('meme_user_name', name);
}
