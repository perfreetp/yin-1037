import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Package, Trophy, Sparkles, Mail, Star, Info } from 'lucide-react';
import { getItemById, getRarityColor, getRarityName } from '@/data/items';
import { achievements } from '@/data/events';
import { endings } from '@/data/endings';

const iconMap = {
  item: Package,
  achievement: Trophy,
  clue: Sparkles,
  ending: Star,
  mail: Mail,
  info: Info
};

export const NotificationToast = () => {
  const { notifications, removeNotification } = useGameStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-[480px] px-4 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({
  notification,
  onClose
}: {
  notification: ReturnType<typeof useGameStore.getState>['notifications'][0];
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = iconMap[notification.type] || Info;

  let detailText = notification.message;
  if (notification.type === 'item') {
    const item = getItemById(notification.message);
    if (item) {
      detailText = `${item.icon} ${item.name} (${getRarityName(item.rarity)})`;
    }
  } else if (notification.type === 'achievement') {
    const ach = achievements.find((a) => a.id === notification.message);
    if (ach) {
      detailText = `${ach.icon} ${ach.name}`;
    }
  } else if (notification.type === 'ending') {
    const end = endings.find((e) => e.id === notification.message);
    if (end) {
      detailText = `${end.thumbnail} ${end.title}`;
    }
  }

  const colorClass = notification.type === 'item'
    ? getRarityColor(
        getItemById(notification.message)?.rarity || 'common'
      )
    : notification.type === 'achievement'
    ? 'text-amber-400 border-amber-500'
    : notification.type === 'ending'
    ? 'text-purple-400 border-purple-500'
    : notification.type === 'clue'
    ? 'text-cyan-400 border-cyan-500'
    : 'text-blue-400 border-blue-500';

  return (
    <div
      className={`pointer-events-auto backdrop-blur-xl rounded-xl p-3 border ${colorClass} bg-black/60 shadow-lg`}
      style={{ animation: 'slideDown 0.3s ease-out' }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/10`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{notification.title}</p>
          <p className="text-xs text-gray-300 truncate">{detailText}</p>
        </div>
      </div>
    </div>
  );
};
