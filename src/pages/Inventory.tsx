import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { items, getItemById, getRarityColor, getRarityName } from '@/data/items';
import { tryCombineItems } from '@/utils/conditions';
import type { ItemCategory } from '@/types';
import { Package, Sparkles, Combine, X, Check, AlertCircle } from 'lucide-react';

const categoryTabs: { key: ItemCategory | 'all'; label: string; icon: typeof Package }[] = [
  { key: 'all', label: '全部', icon: Package },
  { key: 'item', label: '物品', icon: Package },
  { key: 'clue', label: '线索', icon: Sparkles },
  { key: 'letter', label: '信件', icon: Package },
  { key: 'key', label: '钥匙', icon: Package }
];

export default function Inventory() {
  const { save, combineItems: storeCombineItems } = useGameStore();
  const [activeTab, setActiveTab] = useState<ItemCategory | 'all'>('all');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [combineMode, setCombineMode] = useState(false);
  const [combineItems, setCombineItems] = useState<string[]>([]);
  const [combineResult, setCombineResult] = useState<{
    success: boolean;
    description?: string;
    itemName?: string;
    itemIcon?: string;
  } | null>(null);

  const filteredInventory = save.inventory.filter(
    (inv) => activeTab === 'all' || (getItemById(inv.itemId)?.category === activeTab)
  );

  const handleItemClick = (itemId: string) => {
    if (combineMode) {
      if (combineItems.includes(itemId)) {
        setCombineItems(combineItems.filter((id) => id !== itemId));
      } else if (combineItems.length < 2) {
        const newCombine = [...combineItems, itemId];
        setCombineItems(newCombine);

        if (newCombine.length === 2) {
          const result = tryCombineItems(newCombine[0], newCombine[1]);
          if (result.success && result.result) {
            const item1 = getItemById(newCombine[0]);
            const item2 = getItemById(newCombine[1]);
            const description = `合成 ${item1?.name || '物品'} + ${item2?.name || '物品'}`;

            const success = storeCombineItems(
              newCombine[0],
              newCombine[1],
              result.result.id,
              description
            );

            if (success) {
              setCombineResult({
                success: true,
                description: result.description,
                itemName: result.result.name,
                itemIcon: result.result.icon
              });
            } else {
              setCombineResult({
                success: false,
                description: '合成失败，请重试...'
              });
            }
          } else {
            setCombineResult({
              success: false,
              description: '这两个物品无法组合...'
            });
          }
        }
      }
    } else {
      setSelectedItem(itemId);
    }
  };

  const resetCombine = () => {
    setCombineItems([]);
    setCombineResult(null);
  };

  const selectedItemData = selectedItem ? getItemById(selectedItem) : null;

  return (
    <PageLayout title="物品袋">
      <div className="p-4">
        <div className="flex gap-1 p-1 mb-3 rounded-xl bg-white/5 border border-white/10">
          {categoryTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === key
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => {
              setCombineMode(!combineMode);
              resetCombine();
            }}
            className={`flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
              combineMode
                ? 'bg-amber-500/20 text-amber-400 border border-amber-400/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Combine size={14} />
            合成
          </button>
        </div>

        {combineMode && (
          <div className="mb-3 p-3 rounded-xl border border-amber-400/30 bg-amber-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-amber-400 font-medium">选择两个物品进行组合</span>
              <button
                onClick={resetCombine}
                className="text-xs text-gray-400 hover:text-white"
              >
                重置
              </button>
            </div>
            <div className="flex items-center gap-2">
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl ${
                    combineItems[idx]
                      ? getRarityColor(getItemById(combineItems[idx])?.rarity || 'common')
                      : 'border-dashed border-gray-600'
                  } bg-white/5`}
                >
                  {combineItems[idx] ? getItemById(combineItems[idx])?.icon : '?'}
                </div>
              ))}
              <span className="text-gray-500 text-lg">+</span>
              <div className="w-14 h-14 rounded-xl border border-dashed border-gray-600 flex items-center justify-center text-gray-600">
                ?
              </div>
            </div>

            {combineResult && (
              <div
                className={`mt-3 p-3 rounded-xl border ${
                  combineResult.success
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-red-500/30 bg-red-500/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  {combineResult.success ? (
                    <Check size={16} className="text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400 mt-0.5" />
                  )}
                  <div>
                    {combineResult.success ? (
                      <>
                        <p className="text-sm text-emerald-300 font-medium">
                          {combineResult.itemIcon} {combineResult.itemName}
                        </p>
                        <p className="text-xs text-emerald-400/70 mt-1">
                          {combineResult.description}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-red-300">{combineResult.description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {filteredInventory.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <Package size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无物品</p>
            <p className="text-xs text-gray-600 mt-1">推进剧情以获得更多物品</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {filteredInventory.map((inv) => {
              const item = getItemById(inv.itemId);
              if (!item) return null;
              const isSelected = combineMode
                ? combineItems.includes(inv.itemId)
                : selectedItem === inv.itemId;

              return (
                <button
                  key={inv.itemId}
                  onClick={() => handleItemClick(inv.itemId)}
                  className={`relative aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all hover:scale-105 active:scale-95 ${getRarityColor(
                    item.rarity
                  )} ${isSelected ? 'ring-2 ring-white bg-white/10' : 'bg-white/5'}`}
                >
                  <span className="text-3xl mb-1">{item.icon}</span>
                  <span className="text-[10px] text-center leading-tight line-clamp-1">
                    {item.name}
                  </span>
                  {inv.quantity > 1 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-black/60 text-[10px] flex items-center justify-center">
                      x{inv.quantity}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {save.clues.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-1">
              <Sparkles size={14} className="text-cyan-400" />
              已收集线索 ({save.clues.length})
            </h3>
            <div className="space-y-2">
              {save.clues.map((clue, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-sm text-cyan-100"
                >
                  {clue}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedItemData && !combineMode && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setSelectedItem(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[480px] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10"
            style={{ animation: 'slideUp 0.3s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold">物品详情</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl border-2 ${getRarityColor(
                    selectedItemData.rarity
                  )} bg-white/5`}
                >
                  {selectedItemData.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
                    {selectedItemData.name}
                  </h2>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(selectedItemData.rarity)} bg-white/5`}>
                      {getRarityName(selectedItemData.rarity)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full text-gray-400 border border-gray-600">
                      {selectedItemData.category === 'item' ? '物品' :
                       selectedItemData.category === 'clue' ? '线索' :
                       selectedItemData.category === 'letter' ? '信件' : '钥匙'}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedItemData.description}
              </p>
              {selectedItemData.combinable && (
                <p className="text-xs text-amber-400/70 mt-3">
                  提示：此物品可能可以与其他物品组合
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
