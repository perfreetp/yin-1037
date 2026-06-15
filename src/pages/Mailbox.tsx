import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { Mail as MailIcon, MailOpen, Star, Eye, Reply, X } from 'lucide-react';
import type { Mail, MailType as MailTypeEnum } from '@/types';
import { getCharacterById } from '@/data/characters';

export default function Mailbox() {
  const { save, markMailRead, replyMail } = useGameStore();
  const [activeTab, setActiveTab] = useState<MailTypeEnum | 'all'>('all');
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);

  const filteredMails = save.mails.filter(
    (m) => activeTab === 'all' || m.type === activeTab
  ).sort((a, b) => b.timestamp - a.timestamp);

  const unreadCount = save.mails.filter((m) => !m.read).length;

  const handleSelectMail = (mail: Mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      markMailRead(mail.id);
    }
  };

  const tabs: { key: MailTypeEnum | 'all'; label: string; icon: typeof MailIcon }[] = [
    { key: 'all', label: '全部', icon: MailIcon },
    { key: 'main', label: '主线', icon: Star },
    { key: 'side', label: '支线', icon: Eye },
    { key: 'hidden', label: '隐藏', icon: Star }
  ];

  return (
    <PageLayout title="信箱">
      <div className="p-4">
        <div className="flex gap-1 p-1 mb-4 rounded-xl bg-white/5 border border-white/10">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === key
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
              {key === 'all' && unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filteredMails.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <MailIcon size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">暂无邮件</p>
            </div>
          ) : (
            filteredMails.map((mail) => {
              const fromChar = mail.fromCharacterId
                ? getCharacterById(mail.fromCharacterId)
                : null;
              return (
                <button
                  key={mail.id}
                  onClick={() => handleSelectMail(mail)}
                  className={`w-full p-4 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    mail.read
                      ? 'bg-white/[0.02] border-white/5'
                      : 'bg-white/5 border-white/15'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                      {fromChar?.avatar || '📨'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!mail.read && (
                          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm font-medium ${mail.read ? 'text-gray-400' : 'text-white'}`}>
                          {mail.from}
                        </span>
                        {mail.replied && (
                          <span className="text-[10px] text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-400/10">
                            已回复
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${mail.read ? 'text-gray-500' : 'text-gray-300'}`}>
                        {mail.subject}
                      </p>
                    </div>
                    {mail.read ? (
                      <MailOpen size={16} className="text-gray-600 flex-shrink-0" />
                    ) : (
                      <MailIcon size={16} className="text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {selectedMail && (
        <MailDetailModal
          mail={selectedMail}
          onClose={() => setSelectedMail(null)}
          onReply={(replyId, effects) => {
            replyMail(selectedMail.id, replyId, effects);
            setSelectedMail({ ...selectedMail, replied: true, selectedReply: replyId });
          }}
        />
      )}
    </PageLayout>
  );
}

function MailDetailModal({
  mail,
  onClose,
  onReply
}: {
  mail: Mail;
  onClose: () => void;
  onReply: (replyId: string, effects: unknown[]) => void;
}) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] max-h-[85vh] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-[#0a1628]">
          <h3 className="font-semibold text-sm" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
            {mail.subject}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
              {mail.fromCharacterId ? getCharacterById(mail.fromCharacterId)?.avatar : '📨'}
            </div>
            <div>
              <p className="font-medium text-sm">{mail.from}</p>
              <p className="text-xs text-gray-500">
                {new Date(mail.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="text-sm leading-relaxed text-gray-200 whitespace-pre-wrap">
            {mail.content}
          </div>

          {mail.replied && mail.selectedReply && (
            <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <p className="text-xs text-cyan-400 mb-1">已回复：</p>
              <p className="text-sm text-gray-300">
                {mail.replyOptions?.find((r) => r.id === mail.selectedReply)?.text}
              </p>
            </div>
          )}
        </div>

        {mail.replyOptions && !mail.replied && !showReply && (
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => setShowReply(true)}
              className="w-full py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Reply size={18} />
              回复此信
            </button>
          </div>
        )}

        {mail.replyOptions && !mail.replied && showReply && (
          <div className="p-4 border-t border-white/10 space-y-2">
            <p className="text-xs text-gray-400 mb-2">选择回复内容：</p>
            {mail.replyOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onReply(option.id, option.effects)}
                className="w-full p-3 rounded-xl text-left text-sm bg-white/5 border border-white/10 hover:bg-white/10 active:scale-[0.98] transition-all"
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
