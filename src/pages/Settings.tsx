import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { getManualSaves, getAutoSave } from '@/utils/storage';
import { achievements } from '@/data/events';
import {
  Volume2,
  VolumeX,
  Gauge,
  Eye,
  EyeOff,
  Save,
  FolderOpen,
  Trash2,
  Trophy,
  Info,
  Clock,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const { settings, updateSettings, manualSave, loadManualSave, newGame, save } = useGameStore();
  const [saves, setSaves] = useState(getManualSaves());
  const autoSave = getAutoSave();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const refreshSaves = () => setSaves(getManualSaves());

  const handleExport = () => {
    const dataStr = JSON.stringify(save, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stellarmail_save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm('确定要导入此存档吗？当前进度将被覆盖。')) {
          useGameStore.getState().loadSave(data);
          alert('导入成功！');
        }
      } catch {
        alert('存档文件格式错误');
      }
    };
    reader.readAsText(file);
  };

  return (
    <PageLayout title="设置">
      <div className="p-4 space-y-4">
        <Section title="游戏体验">
          <SettingRow
            icon={Gauge}
            label="文字速度"
            value={
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => updateSettings({ textSpeed: speed })}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      settings.textSpeed === speed
                        ? 'bg-amber-500/30 text-amber-400 border border-amber-400/50'
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            }
          />

          <SettingRow
            icon={settings.bgmEnabled ? Volume2 : VolumeX}
            label="背景音乐"
            value={
              <ToggleSwitch
                checked={settings.bgmEnabled}
                onChange={(v) => updateSettings({ bgmEnabled: v })}
              />
            }
          />

          <SettingRow
            icon={settings.sfxEnabled ? Volume2 : VolumeX}
            label="音效"
            value={
              <ToggleSwitch
                checked={settings.sfxEnabled}
                onChange={(v) => updateSettings({ sfxEnabled: v })}
              />
            }
          />

          <SettingRow
            icon={settings.spoilerFree ? EyeOff : Eye}
            label="无剧透模式"
            description="隐藏敏感剧情信息"
            value={
              <ToggleSwitch
                checked={settings.spoilerFree}
                onChange={(v) => updateSettings({ spoilerFree: v })}
              />
            }
          />

          <SettingRow
            icon={Save}
            label="自动存档"
            value={
              <ToggleSwitch
                checked={settings.autoSave}
                onChange={(v) => updateSettings({ autoSave: v })}
              />
            }
          />
        </Section>

        <Section title="存档管理">
          {autoSave && (
            <div className="mb-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Clock size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">自动存档</p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(autoSave.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mb-3">
            {[0, 1, 2].map((slot) => {
              const slotSave = saves[slot];
              return (
                <div
                  key={slot}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center"
                >
                  <div className="text-2xl mb-1">
                    {slotSave ? '📁' : '➕'}
                  </div>
                  <p className="text-[10px] text-gray-400 mb-2">
                    存档 {slot + 1}
                  </p>
                  {slotSave ? (
                    <>
                      <p className="text-[9px] text-gray-600 mb-2">
                        {new Date(slotSave.timestamp).toLocaleDateString()}
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            if (confirm('确定读取此存档吗？')) {
                              loadManualSave(slot);
                              refreshSaves();
                            }
                          }}
                          className="flex-1 p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                          title="读取"
                        >
                          <FolderOpen size={14} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        manualSave(slot);
                        refreshSaves();
                      }}
                      className="w-full py-1.5 rounded-lg bg-white/5 text-gray-400 text-[10px] hover:bg-white/10"
                    >
                      保存
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm flex items-center justify-center gap-2 text-gray-300 hover:bg-white/10"
            >
              <Download size={16} />
              导出存档
            </button>
            <label className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm flex items-center justify-center gap-2 text-gray-300 hover:bg-white/10 cursor-pointer">
              <Upload size={16} />
              导入存档
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
            </label>
          </div>
        </Section>

        <Section title="收集">
          <button
            onClick={() => setShowAchievements(true)}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Trophy size={18} className="text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-sm">成就</p>
                <p className="text-[10px] text-gray-500">
                  已解锁 {save.achievements.length} / {achievements.length}
                </p>
              </div>
            </div>
          </button>
        </Section>

        <Section title="其他">
          <button
            onClick={() => setShowAbout(true)}
            className="w-full p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 mb-2"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Info size={18} className="text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm">关于游戏</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              if (confirm('确定要开始新游戏吗？当前进度将丢失！')) {
                if (confirm('再次确认：所有进度将被清除！')) {
                  newGame();
                }
              }
            }}
            className="w-full p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/20"
          >
            <AlertTriangle size={16} />
            重置游戏进度
          </button>
        </Section>

        <p className="text-center text-xs text-gray-700 pt-4">
          v1.0.0 · 群星邮差
        </p>
      </div>

      {showAchievements && (
        <AchievementsModal onClose={() => setShowAchievements(false)} />
      )}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </PageLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 mb-2 px-1 flex items-center gap-1">
        <span className="w-1 h-3 bg-amber-400 rounded-full" />
        {title}
      </h3>
      <div className="p-2 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
        {children}
      </div>
    </div>
  );
}

function SettingRow({
  icon: Icon,
  label,
  description,
  value
}: {
  icon: typeof Volume2;
  label: string;
  description?: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-white/5">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-white/5">
          <Icon size={16} className="text-gray-400" />
        </div>
        <div>
          <p className="text-sm">{label}</p>
          {description && <p className="text-[10px] text-gray-500">{description}</p>}
        </div>
      </div>
      {value}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-all ${
        checked ? 'bg-amber-500' : 'bg-white/10'
      }`}
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all ${
          checked ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

function AchievementsModal({ onClose }: { onClose: () => void }) {
  const { save } = useGameStore();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] max-h-[80vh] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-[#0a1628]">
          <h3 className="font-semibold flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" />
            成就
          </h3>
        </div>
        <div className="p-4 overflow-y-auto max-h-[65vh] space-y-2">
          {achievements.map((ach) => {
            const unlocked = save.achievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3 rounded-xl border flex items-center gap-3 ${
                  unlocked
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-white/[0.02] border-white/5 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                    unlocked ? 'bg-amber-500/20' : 'bg-white/5 grayscale'
                  }`}
                >
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${unlocked ? 'text-white' : 'text-gray-500'}`}>
                    {ach.hidden && !unlocked ? '???' : ach.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {ach.hidden && !unlocked ? '隐藏成就' : ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#0a1628] border border-white/10 p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
          ✉️✨
        </div>
        <h2
          className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent"
          style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
        >
          群星邮差
        </h2>
        <p className="text-sm text-gray-400 mb-4">Stellar Mail v1.0.0</p>
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          在无垠的星海中，每一封信都承载着一份命运。
          你是一名星际信使，你的选择将改变整个银河的走向。
        </p>
        <p className="text-xs text-gray-600">
          纯单机游戏 · 支持离线游玩
        </p>
      </div>
    </div>
  );
}
