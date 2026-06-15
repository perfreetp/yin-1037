import type { Item } from '@/types';

export const items: Item[] = [
  {
    id: 'star_compass',
    name: '星辰罗盘',
    description: '一个古老的导航仪器，指针永远指向心灵最想去的地方。',
    icon: '🧭',
    rarity: 'epic',
    category: 'item',
    combinable: true
  },
  {
    id: 'crystal_shard',
    name: '水晶碎片',
    description: '织星族圣物的一部分，在月光下会发出柔和的光芒。',
    icon: '💎',
    rarity: 'rare',
    category: 'item',
    combinable: true
  },
  {
    id: 'old_letter',
    name: '泛黄的信件',
    description: '一封多年前的旧信，墨水已经有些模糊，但字迹依然优雅。',
    icon: '✉️',
    rarity: 'rare',
    category: 'letter',
    combinable: false
  },
  {
    id: 'mechanical_key',
    name: '机械钥匙',
    description: '一把做工精密的金属钥匙，上面刻着陌生的符文。',
    icon: '🗝️',
    rarity: 'common',
    category: 'key',
    combinable: true
  },
  {
    id: 'encrypted_data',
    name: '加密数据芯片',
    description: '存储着神秘信息的数据芯片，似乎需要特殊手段才能解码。',
    icon: '💾',
    rarity: 'epic',
    category: 'clue',
    combinable: true
  },
  {
    id: 'decoder',
    name: '解码器',
    description: '凯洛制作的简易解码器，可以解读大多数加密信息。',
    icon: '📟',
    rarity: 'rare',
    category: 'item',
    combinable: true
  },
  {
    id: 'secret_document',
    name: '解密文件',
    description: '从加密芯片中解码出的文件，内容令人震惊。',
    icon: '📄',
    rarity: 'legendary',
    category: 'clue',
    combinable: false,
    combineRecipes: [
      {
        ingredients: ['encrypted_data', 'decoder'],
        result: 'secret_document',
        resultType: 'item',
        description: '你用解码器成功解读了加密数据芯片中的内容！'
      }
    ]
  },
  {
    id: 'star_crystal',
    name: '完整圣晶',
    description: '当水晶碎片与星辰罗盘结合，它们产生了神奇的共鸣，恢复了织星族圣物的完整形态。',
    icon: '🔮',
    rarity: 'legendary',
    category: 'item',
    combinable: false,
    combineRecipes: [
      {
        ingredients: ['star_compass', 'crystal_shard'],
        result: 'star_crystal',
        resultType: 'item',
        description: '星辰罗盘与水晶碎片产生了神圣的共鸣，织星族的圣物重现人间！'
      }
    ]
  },
  {
    id: 'bounty_chip',
    name: '悬赏芯片',
    description: '记录着高额悬赏目标信息的芯片，赏金猎人的标配。',
    icon: '🎯',
    rarity: 'common',
    category: 'item',
    combinable: false
  },
  {
    id: 'silver_feather',
    name: '银色羽毛',
    description: '一根散发着淡淡银光的羽毛，似乎来自某种传说中的生物。',
    icon: '🪶',
    rarity: 'rare',
    category: 'item',
    combinable: false
  },
  {
    id: 'worn_badge',
    name: '褪色的徽章',
    description: '一枚老旧的星际舰队徽章，上面的编号已经被磨损得看不清了。',
    icon: '🎖️',
    rarity: 'rare',
    category: 'clue',
    combinable: false
  },
  {
    id: 'stardust',
    name: '星尘',
    description: '从超新星遗迹中收集的稀有物质，闪烁着梦幻般的光芒。',
    icon: '✨',
    rarity: 'epic',
    category: 'item',
    combinable: true
  }
];

export const getItemById = (id: string): Item | undefined => {
  return items.find(i => i.id === id);
};

export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return 'text-gray-400 border-gray-500';
    case 'rare': return 'text-cyan-400 border-cyan-500';
    case 'epic': return 'text-purple-400 border-purple-500';
    case 'legendary': return 'text-amber-400 border-amber-500';
    default: return 'text-gray-400 border-gray-500';
  }
};

export const getRarityName = (rarity: string): string => {
  switch (rarity) {
    case 'common': return '普通';
    case 'rare': return '稀有';
    case 'epic': return '史诗';
    case 'legendary': return '传说';
    default: return '普通';
  }
};
