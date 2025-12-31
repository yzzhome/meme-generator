import MemeGallery from '@/components/MemeGallery/MemeGallery';

export default function BrowsePage() {
  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <h1>浏览表情包</h1>
          <p className="subtitle">发现精彩的表情包作品</p>
        </div>
      </header>
      <MemeGallery />
    </>
  );
}
