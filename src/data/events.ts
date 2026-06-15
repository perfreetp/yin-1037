import type { Achievement, Planet, RandomEvent } from '@/types';

export const achievements: Achievement[] = [
  {
    id: 'first_mail',
    name: '初出茅庐',
    description: '完成第一次信件投递',
    icon: '📬',
    hidden: false
  },
  {
    id: 'truth_seeker',
    name: '真相探索者',
    description: '揭露第一个重大秘密',
    icon: '🔍',
    hidden: false
  },
  {
    id: 'friend_of_all',
    name: '交游广阔',
    description: '与所有主要角色成为朋友',
    icon: '🤝',
    hidden: true
  },
  {
    id: 'collector',
    name: '收藏家',
    description: '收集20种不同的物品',
    icon: '🎁',
    hidden: false
  },
  {
    id: 'alchemist',
    name: '合成大师',
    description: '成功完成5次物品组合',
    icon: '⚗️',
    hidden: true
  },
  {
    id: 'speed_reader',
    name: '速读大师',
    description: '将文字速度调至最高',
    icon: '⚡',
    hidden: false
  },
  {
    id: 'ending_collector',
    name: '结局收藏家',
    description: '解锁所有结局',
    icon: '🏆',
    hidden: true
  },
  {
    id: 'star_messenger',
    name: '群星信使',
    description: '达成真结局',
    icon: '⭐',
    hidden: true
  },
  {
    id: 'lucky_guy',
    name: '幸运儿',
    description: '触发5次随机事件',
    icon: '🍀',
    hidden: true
  },
  {
    id: 'key_choice_master',
    name: '抉择大师',
    description: '做出10次关键选择',
    icon: '🎯',
    hidden: false
  }
];

export const planets: Planet[] = [
  {
    id: 'planet_weaver',
    name: '织星族主星',
    description: '织星族文明的发源地，整颗星球被水晶般的建筑覆盖，是银河中最美丽的星球之一。',
    faction: '织星族',
    status: '和平',
    position: { x: 25, y: 35 },
    color: '#c77dff',
    unlocked: true
  },
  {
    id: 'planet_scrap',
    name: '废铁城',
    description: '被遗弃的工业星球，如今成为了流浪者、机械师和黑市商人的聚集地。',
    faction: '自由联盟',
    status: '混乱',
    position: { x: 60, y: 65 },
    color: '#d4a84b',
    unlocked: true
  },
  {
    id: 'planet_shadow',
    name: '暗影之境',
    description: '永远笼罩在迷雾中的神秘星球，暗影教团的总部所在地。',
    faction: '暗影教团',
    status: '神秘',
    position: { x: 75, y: 25 },
    color: '#5b4b8a',
    unlocked: true
  },
  {
    id: 'planet_quantum',
    name: '量子之城',
    description: '科技议会的核心，整座城市就是一台巨型量子计算机。',
    faction: '科技议会',
    status: '繁荣',
    position: { x: 40, y: 75 },
    color: '#4cc9f0',
    unlocked: true
  },
  {
    id: 'planet_council',
    name: '银河议会星',
    description: '银河议会所在地，表面庄严神圣，暗地波涛汹涌。',
    faction: '银河议会',
    status: '警戒',
    position: { x: 50, y: 50 },
    color: '#ef476f',
    unlocked: false
  },
  {
    id: 'planet_void',
    name: '虚空边境',
    description: '银河系的边缘，传说中通往未知宇宙的入口。',
    faction: '未知',
    status: '危险',
    position: { x: 85, y: 85 },
    color: '#06d6a0',
    unlocked: false
  }
];

export const randomEvents: RandomEvent[] = [
  {
    id: 'event_storm',
    title: '离子风暴',
    description: '突如其来的离子风暴袭击了你的飞船！强烈的电磁脉冲让仪表盘疯狂闪烁，你必须立即做出反应。',
    probability: 0.3,
    triggerLocation: ['space_travel', 'chapter_transition'],
    choices: [
      {
        id: 'storm_brave',
        text: '强行穿越风暴',
        isKeyChoice: true,
        nextSceneId: '',
        effects: [
          { type: 'item', value: 'stardust' },
          { type: 'reputation', target: '信使协会', amount: 5 },
          { type: 'clue', value: '风暴中的星尘轨迹' }
        ]
      },
      {
        id: 'storm_dodge',
        text: '绕路避开风暴',
        isKeyChoice: false,
        nextSceneId: '',
        effects: [
          { type: 'clue', value: '安全航线：风暴带北侧' },
          { type: 'reputation', target: '信使协会', amount: 2 }
        ]
      }
    ]
  },
  {
    id: 'event_merchant',
    title: '神秘商人',
    description: '一艘破旧的商船挡住了你的去路。船上的商人戴着面具，神秘兮兮地向你兜售着什么。"嘿，信使大人，要不要看看好东西？"',
    probability: 0.25,
    triggerLocation: ['space_travel', 'chapter_transition'],
    choices: [
      {
        id: 'merchant_buy',
        text: '看看他卖什么',
        isKeyChoice: false,
        nextSceneId: '',
        effects: [
          { type: 'item', value: 'silver_feather' },
          { type: 'reputation', target: '自由联盟', amount: 5 }
        ]
      },
      {
        id: 'merchant_refuse',
        text: '婉拒并离开',
        isKeyChoice: false,
        nextSceneId: '',
        effects: [
          { type: 'reputation', target: '信使协会', amount: 3 }
        ]
      }
    ]
  },
  {
    id: 'event_distress',
    title: '求救信号',
    description: '你接收到了一段微弱的求救信号……似乎来自附近的小行星带。信号断断续续，隐约能听到呼救声。',
    probability: 0.2,
    triggerLocation: ['space_travel', 'chapter_transition'],
    choices: [
      {
        id: 'distress_rescue',
        text: '前往救援',
        isKeyChoice: true,
        nextSceneId: '',
        effects: [
          { type: 'reputation', target: '信使协会', amount: 10 },
          { type: 'item', value: 'worn_badge' },
          { type: 'clue', value: '被救者的证词' }
        ]
      },
      {
        id: 'distress_ignore',
        text: '可能是陷阱，忽略',
        isKeyChoice: false,
        nextSceneId: '',
        effects: [
          { type: 'reputation', target: '信使协会', amount: -5 }
        ]
      }
    ]
  }
];
