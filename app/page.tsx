'use client';

import MemeEditor from '@/components/MemeEditor/MemeEditor';
import AuthWrapper from '@/components/Auth/AuthWrapper';

export default function Home() {
  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h1>表情包生成器</h1>
          </div>
          <p className="subtitle">轻松制作专业级表情包</p>
        </div>
      </header>
      <AuthWrapper>
        <MemeEditor />
      </AuthWrapper>
    </>
  );
}
