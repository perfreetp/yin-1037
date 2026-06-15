import { ReactNode } from 'react';
import { StarfieldBackground } from './StarfieldBackground';
import { BottomNav } from './BottomNav';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  hideNav?: boolean;
  hideTitle?: boolean;
}

export const PageLayout = ({
  children,
  title,
  showBack = false,
  hideNav = false,
  hideTitle = false
}: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isChapterPlay = location.pathname.startsWith('/chapters/') && location.pathname !== '/chapters';

  const shouldShowNav = !hideNav && !isHome && !isChapterPlay;
  const shouldShowTitle = !hideTitle && title && !isChapterPlay;

  return (
    <div className="relative min-h-screen text-white">
      <StarfieldBackground />
      <div className="relative mx-auto max-w-[480px] min-h-screen">
        {shouldShowTitle && (
          <header className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/10 bg-[#0a1628]/80">
            <div className="flex items-center h-14 px-4">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 -ml-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h1 className="text-lg font-semibold tracking-wide flex-1 text-center" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
                {title}
              </h1>
              {showBack && <div className="w-8" />}
            </div>
          </header>
        )}
        <main className={`relative ${shouldShowNav ? 'pb-24' : ''}`}>
          {children}
        </main>
        {shouldShowNav && <BottomNav />}
      </div>
    </div>
  );
};
