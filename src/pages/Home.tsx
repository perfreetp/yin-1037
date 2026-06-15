import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { Play, RotateCcw, BookOpen, Star } from 'lucide-react';
import { chapters } from '@/data/chapters';
import { endings } from '@/data/endings';

export default function Home() {
  const navigate = useNavigate();
  const { save, newGame } = useGameStore();

  const completedChapters = Object.values(save.chapterProgress).filter(
    (p) => p.completed
  ).length;
  const totalChapters = chapters.length;
  const unlockedEndings = save.unlockedEndings.length;
  const totalEndings = endings.length;

  const hasSave = save.currentChapterId || save.choices.length > 0;

  return (
    <PageLayout hideNav hideTitle>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4" style={{ animation: 'float 4s ease-in-out infinite' }}>✉️✨</div>
          <h1
            className="text-4xl font-bold tracking-widest mb-2 bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent"
            style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
          >
            群星邮差
          </h1>
          <p className="text-sm text-gray-400 tracking-wider">STELLAR MAIL</p>
        </div>

        <div className="w-full max-w-sm space-y-3 mb-10">
          {hasSave && (
            <button
              onClick={() => {
                if (save.currentChapterId) {
                  navigate(`/chapters/${save.currentChapterId}`);
                } else {
                  navigate('/chapters');
                }
              }}
              className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-white"
              style={{
                background: 'linear-gradient(135deg, #5b4b8a 0%, #d4a84b 100%)',
                boxShadow: '0 0 30px rgba(91, 75, 138, 0.4)'
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Play size={22} fill="currentColor" />
                继续游戏
              </span>
            </button>
          )}

          <button
            onClick={() => navigate('/chapters')}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/15 bg-white/5 backdrop-blur-xl text-white hover:bg-white/10"
          >
            <span className="flex items-center justify-center gap-2">
              <BookOpen size={22} />
              章节选择
            </span>
          </button>

          {hasSave && (
            <button
              onClick={() => {
                if (window.confirm('确定要开始新游戏吗？当前进度将丢失。')) {
                  newGame();
                }
              }}
              className="w-full py-3 px-6 rounded-2xl font-medium text-sm transition-all duration-300 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
            >
              <span className="flex items-center justify-center gap-2">
                <RotateCcw size={18} />
                重新开始
              </span>
            </button>
          )}
        </div>

        {hasSave && (
          <div className="w-full max-w-sm grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <BookOpen size={16} />
                <span className="text-xs">章节进度</span>
              </div>
              <p className="text-2xl font-bold">
                {completedChapters}/{totalChapters}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Star size={16} />
                <span className="text-xs">结局解锁</span>
              </div>
              <p className="text-2xl font-bold">
                {unlockedEndings}/{totalEndings}
              </p>
            </div>
          </div>
        )}

        <p className="mt-10 text-xs text-gray-600 text-center">
          在无垠星海中，每一封信都承载着命运
        </p>
      </div>
    </PageLayout>
  );
}
