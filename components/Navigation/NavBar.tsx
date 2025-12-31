'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { db } from '@/lib/db';
import UserInfo from './UserInfo';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="nav-bar">
      <div className="nav-content">
        <Link href="/" className="logo">
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
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>表情包生成器</h1>
        </Link>
        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            创建
          </Link>
          <Link
            href="/browse"
            className={`nav-link ${pathname === '/browse' ? 'active' : ''}`}
          >
            浏览
          </Link>
          <UserInfo />
        </div>
      </div>
    </nav>
  );
}
