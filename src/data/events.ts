import type { Achievement, Planet, RandomEvent, PlanetRoute, EventChain } from '@/types';

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

export const planetRoutes: PlanetRoute[] = [
  {
    fromPlanetId: 'planet_weaver',
    toPlanetId: 'planet_scrap',
    distance: 3.2,
    riskLevel: 'low',
    estimatedTime: '2小时',
    possibleEvents: ['storm', 'merchant', 'none'],
    routeDescription: '织星族至废铁城的常规贸易航线，沿途有巡逻舰队保护'
  },
  {
    fromPlanetId: 'planet_weaver',
    toPlanetId: 'planet_shadow',
    distance: 5.8,
    riskLevel: 'medium',
    estimatedTime: '4小时',
    possibleEvents: ['storm', 'discovery', 'distress'],
    routeDescription: '穿越星云带的航线，能见度较低，偶有异常能量波动'
  },
  {
    fromPlanetId: 'planet_weaver',
    toPlanetId: 'planet_quantum',
    distance: 4.5,
    riskLevel: 'safe',
    estimatedTime: '3小时',
    possibleEvents: ['merchant', 'none'],
    routeDescription: '织星族与科技议会的外交航线，安全等级最高'
  },
  {
    fromPlanetId: 'planet_scrap',
    toPlanetId: 'planet_shadow',
    distance: 3.8,
    riskLevel: 'high',
    estimatedTime: '3小时',
    possibleEvents: ['pirate', 'storm', 'distress'],
    routeDescription: '黑市商人常用的秘密航线，海盗活动频繁'
  },
  {
    fromPlanetId: 'planet_scrap',
    toPlanetId: 'planet_quantum',
    distance: 2.8,
    riskLevel: 'low',
    estimatedTime: '2小时',
    possibleEvents: ['merchant', 'discovery', 'none'],
    routeDescription: '工业原料运输航线，沿途有大量废弃空间站'
  },
  {
    fromPlanetId: 'planet_shadow',
    toPlanetId: 'planet_quantum',
    distance: 6.2,
    riskLevel: 'medium',
    estimatedTime: '5小时',
    possibleEvents: ['storm', 'distress', 'discovery'],
    routeDescription: '穿越小行星带的航线，需要精确导航'
  },
  {
    fromPlanetId: 'planet_shadow',
    toPlanetId: 'planet_council',
    distance: 4.1,
    riskLevel: 'high',
    estimatedTime: '3.5小时',
    possibleEvents: ['pirate', 'storm', 'distress'],
    routeDescription: '暗影教团与议会的秘密航线，监控严密'
  },
  {
    fromPlanetId: 'planet_quantum',
    toPlanetId: 'planet_council',
    distance: 2.5,
    riskLevel: 'safe',
    estimatedTime: '1.5小时',
    possibleEvents: ['merchant', 'none'],
    routeDescription: '议会与科技议会的直通航线，全程军事保护'
  },
  {
    fromPlanetId: 'planet_quantum',
    toPlanetId: 'planet_void',
    distance: 10.5,
    riskLevel: 'extreme',
    estimatedTime: '12小时',
    possibleEvents: ['storm', 'pirate', 'discovery', 'distress'],
    routeDescription: '通往银河边缘的未知航线，极度危险'
  },
  {
    fromPlanetId: 'planet_council',
    toPlanetId: 'planet_void',
    distance: 8.3,
    riskLevel: 'extreme',
    estimatedTime: '10小时',
    possibleEvents: ['pirate', 'storm', 'distress'],
    routeDescription: '议会封锁的边境航线，传说中有去无回'
  }
];

export const eventChains: EventChain[] = [
  {
    id: 'chain_rescue',
    name: '救命之恩',
    description: '在求救信号中救下的人，后续会带来意想不到的回报',
    startingEventId: 'event_distress',
    subsequentEvents: [
      {
        triggerChoiceId: 'distress_rescue',
        nextEventId: 'mail_event_rescued_thanks',
        delay: 'delayed_mail'
      },
      {
        triggerChoiceId: 'distress_rescue',
        nextEventId: 'event_merchant_discount',
        delay: 'next_travel'
      }
    ]
  },
  {
    id: 'chain_merchant',
    name: '神秘商人的交易',
    description: '与神秘商人的交易可能引发一系列连锁事件',
    startingEventId: 'event_merchant',
    subsequentEvents: [
      {
        triggerChoiceId: 'merchant_buy',
        nextEventId: 'event_merchant_rare',
        delay: 'next_travel'
      }
    ]
  }
];

export const randomEvents: RandomEvent[] = [
  {
    id: 'event_storm',
    title: '离子风暴',
    description: '突如其来的离子风暴袭击了你的飞船！强烈的电磁脉冲让仪表盘疯狂闪烁，你必须立即做出反应。',
    eventType: 'storm',
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
    eventType: 'merchant',
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
    eventType: 'distress',
    chainId: 'chain_rescue',
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
  },
  {
    id: 'event_rescued_thanks',
    title: '来自被救者的感谢',
    description: '你收到了一封邮件，正是你之前在小行星带救下的人发来的。"尊敬的信使大人，感谢您的救命之恩。这是我能拿出的一点心意，请务必收下。"',
    eventType: 'none',
    chainId: 'chain_rescue',
    probability: 1,
    triggerLocation: [],
    choices: [
      {
        id: 'rescued_accept',
        text: '接受感谢',
        isKeyChoice: false,
        nextSceneId: '',
        effects: [
          { type: 'item', value: 'star_crystal' },
          { type: 'reputation', target: '自由联盟', amount: 15 },
          { type: 'clue', value: '被救者的真实身份' }
        ]
      },
      {
        id: 'rescued_decline',
        text: '婉拒，但保留友谊',
        isKeyChoice: true,
        nextSceneId: '',
        effects: [
          { type: 'reputation', target: '自由联盟', amount: 20 },
          { type: 'affection', target: 'kairo', amount: 5 }
        ]
      }
    ]
  },
  {
    id: 'event_merchant_discount',
    title: '神秘商人的折扣',
    description: '你又遇到了那位神秘商人。"哦，是你啊！听说你救了个人，真是个好人。今天的商品，给你打五折！"',
    eventType: 'merchant',
    chainId: 'chain_rescue',
    probability: 1,
    triggerLocation: [],
    choices: [
      {
        id: 'discount_buy',
        text: '购买稀有商品',
        isKeyChoice: false,
        nextSceneId: '',
        effects: [
          { type: 'item', value: 'ancient_tech' },
          { type: 'reputation', target: '自由联盟', amount: 5 }
        ]
      },
      {
        id: 'discount_skip',
        text: '这次不需要，谢谢',
        isKeyChoice: false,
        nextSceneId: '',
        effects: [
          { type: 'reputation', target: '自由联盟', amount: 3 }
        ]
      }
    ]
  },
  {
    id: 'event_merchant_rare',
    title: '神秘商人的稀有商品',
    description: '"嘿，老伙计！上次你买了我的东西，这次我带来了真正的稀有货。看看这个——古代文明的遗物！"',
    eventType: 'merchant',
    chainId: 'chain_merchant',
    probability: 1,
    triggerLocation: [],
    choices: [
      {
        id: 'rare_buy',
        text: '高价购买古代遗物',
        isKeyChoice: true,
        nextSceneId: '',
        effects: [
          { type: 'item', value: 'ancient_tech' },
          { type: 'clue', value: '古代文明的符号' },
          { type: 'reputation', target: '自由联盟', amount: 10 }
        ]
      },
      {
        id: 'rare_pass',
        text: '太贵了，下次再说',
        isKeyChoice: false,
        nextSceneId: '',
        effects: []
      }
    ]
  }
];

export const getRouteBetweenPlanets = (fromId: string, toId: string): PlanetRoute | undefined => {
  return planetRoutes.find(
    (r) => (r.fromPlanetId === fromId && r.toPlanetId === toId) ||
           (r.fromPlanetId === toId && r.toPlanetId === fromId)
  );
};

export const getRiskColor = (level: string): string => {
  const colors: Record<string, string> = {
    safe: '#06d6a0',
    low: '#4cc9f0',
    medium: '#d4a84b',
    high: '#ef476f',
    extreme: '#c77dff'
  };
  return colors[level] || '#666';
};

export const getRiskText = (level: string): string => {
  const texts: Record<string, string> = {
    safe: '安全',
    low: '低风险',
    medium: '中等风险',
    high: '高风险',
    extreme: '极度危险'
  };
  return texts[level] || '未知';
};

export const getEventTypeText = (type: string): string => {
  const texts: Record<string, string> = {
    storm: '离子风暴',
    merchant: '神秘商人',
    distress: '求救信号',
    discovery: '新发现',
    pirate: '海盗袭击',
    none: '平安无事'
  };
  return texts[type] || '未知事件';
};
