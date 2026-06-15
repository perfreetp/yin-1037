import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  Mail,
  Globe2,
  Users,
  Package,
  History,
  Trophy,
  Settings
} from 'lucide-react';

const navItems = [
  { to: '/chapters', icon: BookOpen, label: '章节' },
  { to: '/mailbox', icon: Mail, label: '信箱' },
  { to: '/starmap', icon: Globe2, label: '星图' },
  { to: '/characters', icon: Users, label: '角色' },
  { to: '/inventory', icon: Package, label: '物品' },
  { to: '/choices', icon: History, label: '抉择' },
  { to: '/endings', icon: Trophy, label: '结局' },
  { to: '/settings', icon: Settings, label: '设置' }
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-40">
      <div
        className="mx-2 mb-2 rounded-2xl backdrop-blur-xl border border-white/10"
        style={{ background: 'rgba(10, 22, 40, 0.9)' }}
      >
        <div className="grid grid-cols-8 gap-0 p-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-amber-400 bg-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={20} strokeWidth={2} />
              <span className="text-[10px] mt-0.5 font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="h-2" />
    </nav>
  );
};
