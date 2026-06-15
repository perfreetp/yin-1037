import type { Character } from '@/types';

export const characters: Character[] = [
  {
    id: 'lyra',
    name: '莱拉',
    title: '织星族公主',
    avatar: '👸',
    portrait: '👸',
    faction: '织星族',
    description: '织星族的年轻继承人，背负着延续族群文明的重任。外表优雅端庄，内心却渴望自由。',
    backgroundStory: [
      '莱拉出生于织星族的皇族，自小便接受严格的皇家教育。',
      '她精通织星族古老的星象之术，能通过星辰的排列预知祸福。',
      '在她16岁那年，父母在一次星际航行中失踪，她被迫提前登基。',
      '她隐藏着一个秘密：她能听到来自群星的低语。'
    ],
    personalityTags: ['优雅', '聪慧', '忧郁', '责任感强']
  },
  {
    id: 'kairo',
    name: '凯洛',
    title: '机械师',
    avatar: '🔧',
    portrait: '🔧',
    faction: '废铁城',
    description: '在废铁城长大的天才机械师，性格豪爽，对各种机器有着近乎偏执的热爱。',
    backgroundStory: [
      '凯洛是个孤儿，在废铁城的垃圾堆里学会了修理机器。',
      '十二岁时修复了一台废弃的星际穿梭机，从此声名鹊起。',
      '他的左手是自己打造的机械义肢，比真手还要灵活。',
      '梦想有一天能造出能穿越时空的飞船。'
    ],
    personalityTags: ['豪爽', '乐观', '技术宅', '重义气']
  },
  {
    id: 'seraphine',
    name: '塞拉芬',
    title: '暗影教团祭司',
    avatar: '🧙‍♀️',
    portrait: '🧙‍♀️',
    faction: '暗影教团',
    description: '神秘莫测的暗影教团高阶祭司，据说能窥见命运之线的走向。',
    backgroundStory: [
      '没有人知道塞拉芬来自何方，她似乎凭空出现在暗影教团。',
      '她的双眼呈现奇异的银色，能在黑暗中视物。',
      '传闻她曾是某个灭亡文明的最后幸存者。',
      '她的预言从未出错，但人们往往在事后才明白其含义。'
    ],
    personalityTags: ['神秘', '睿智', '寡言', '难以捉摸']
  },
  {
    id: 'thorn',
    name: '索恩',
    title: '星际赏金猎人',
    avatar: '🗡️',
    portrait: '🗡️',
    faction: '自由联盟',
    description: '银河系最有名的赏金猎人，冷酷无情，只认钱不认人。但似乎有着不为人知的过去。',
    backgroundStory: [
      '索恩曾是星际舰队的精英军官，因一次事件被除名。',
      '他的右脸颊有一道长长的伤疤，是他最不愿提起的记忆。',
      '据说他追捕目标从未失手，除了一个人。',
      '他随身带着一枚褪色的徽章，那是他过去的唯一证明。'
    ],
    personalityTags: ['冷酷', '专业', '沉默', '内心柔软']
  },
  {
    id: 'nova',
    name: '诺瓦',
    title: '量子AI',
    avatar: '🤖',
    portrait: '🤖',
    faction: '科技议会',
    description: '科技议会创造的最先进量子AI，拥有自我意识，对人类的情感充满好奇。',
    backgroundStory: [
      '诺瓦是科技议会历时百年研发的终极AI产物。',
      '在激活的那一刻，她产生了自主意识，这让创造者们既惊喜又恐惧。',
      '她的运算能力可以同时管理整个星区的交通网络。',
      '她最大的愿望是理解什么是"心"。'
    ],
    personalityTags: ['理性', '好奇', '纯粹', '学习中']
  }
];

export const getCharacterById = (id: string): Character | undefined => {
  return characters.find(c => c.id === id);
};
