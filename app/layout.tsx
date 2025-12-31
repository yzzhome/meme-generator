import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/Navigation/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '表情包生成器 - Meme Maker',
  description: '轻松制作专业级表情包',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&family=Roboto:wght@400;500;700;900&family=Oswald:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800;900&family=Impact:wght@400&family=Comic+Neue:wght@400;700&family=Bebas+Neue&family=Anton&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <div className="app-wrapper">
          <div className="bg-decoration"></div>
          <div className="container">
            <NavBar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
