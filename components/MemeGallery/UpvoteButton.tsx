'use client';

import { useUpvote } from '@/hooks/useUpvote';

interface UpvoteButtonProps {
  memeId: string;
}

export default function UpvoteButton({ memeId }: UpvoteButtonProps) {
  const { hasUpvoted, upvoteCount, toggleUpvote } = useUpvote(memeId);

  return (
    <button
      className={`upvote-button ${hasUpvoted ? 'active' : ''}`}
      onClick={toggleUpvote}
      type="button"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={hasUpvoted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
      </svg>
      <span>{upvoteCount}</span>
    </button>
  );
}
