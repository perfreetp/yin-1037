import type { Ending } from '@/types';

export const endings: Ending[] = [
  {
    id: 'ending_neutral_1',
    title: '普通信使',
    description: '你完成了任务，但错过了改变命运的机会。',
    type: 'neutral',
    thumbnail: '📬',
    cgImage: '📨',
    storyText: '你完成了所有的投递任务，成为了一名合格的信使。但偶尔你会想，如果当时做出不同的选择，一切会不会不一样？银河仍在运转，星球仍在旋转，而你只是一个普通的信使，穿行在无尽的星海中……',
    routeHint: '完成第一章的所有剧情即可',
    keyChoices: ['ch1_end_neutral_c1'],
    characterRoutes: [],
    unlockConditions: [
      { type: 'chapter_complete', target: 'ch1', value: true }
    ]
  },
  {
    id: 'ending_good_1',
    title: '星之守护者',
    description: '你帮助莱拉公主找回了父亲，守护了织星族的未来。',
    type: 'good',
    thumbnail: '💫',
    cgImage: '💎',
    storyText: '你成功救出了织星族国王，莱拉父女终于团聚。在你的见证下，织星族与其他文明展开了前所未有的合作。虽然银河深处仍有阴影，但至少此刻，群星闪耀着和平的光芒。',
    routeHint: '与莱拉公主建立深厚的信任，持有水晶碎片',
    keyChoices: ['ch1_s5_c1', 'ch1_s6_good_c1'],
    characterRoutes: ['lyra'],
    unlockConditions: [
      { type: 'affection', target: 'lyra', value: 25, operator: '>=' },
      { type: 'has_item', target: 'crystal_shard' }
    ]
  },
  {
    id: 'ending_good_2',
    title: '机械之心',
    description: '你帮助凯洛实现了他的梦想，一起遨游星海。',
    type: 'good',
    thumbnail: '🚀',
    cgImage: '🛸',
    storyText: '凯洛终于造出了他梦寐以求的时空飞船。作为他最好的朋友和搭档，你成为了第一名船员。从此，银河各处都流传着你们冒险的传说……',
    routeHint: '与凯洛建立深厚友谊，在陨石带事件中帮助他操控飞船',
    keyChoices: ['ch1_s3_c1', 'ch3_s4_c1'],
    characterRoutes: ['kairo'],
    unlockConditions: [
      { type: 'affection', target: 'kairo', value: 25, operator: '>=' },
      { type: 'choice_made', target: 'ch1_s3_c1' }
    ]
  },
  {
    id: 'ending_bad_1',
    title: '迷失星海',
    description: '你做出了错误的选择，在星海中迷失了方向。',
    type: 'bad',
    thumbnail: '🌑',
    cgImage: '💀',
    storyText: '信任的崩塌、错误的判断、一次次的失误……最终，你被黑暗吞噬，独自漂流在无尽的星海中，再也没有人听到过你的消息。',
    routeHint: '对莱拉公主表现出无礼，并且没有建立任何信任关系',
    keyChoices: ['ch1_s5_c2'],
    characterRoutes: [],
    unlockConditions: [
      { type: 'chapter_complete', target: 'ch1', value: true },
      { type: 'affection', target: 'lyra', value: 0, operator: '<=' }
    ]
  },
  {
    id: 'ending_hidden_1',
    title: '命运的观测者',
    description: '塞拉芬向你展示了另一种可能性……',
    type: 'hidden',
    thumbnail: '🔮',
    cgImage: '👁️',
    storyText: '"你想看看所有的可能性吗？"塞拉芬的银色双眸注视着你。在那一刻，你窥见了亿万条时间线，看到了无数个自己的选择和结局。你成为了超越时间的存在，永恒地观望着群星的命运……',
    routeHint: '获得塞拉芬的信任，面对真相，持有加密数据',
    keyChoices: ['ch2_s3_c1', 'ch2_s4_truth_c1'],
    characterRoutes: ['seraphine'],
    unlockConditions: [
      { type: 'affection', target: 'seraphine', value: 10, operator: '>=' },
      { type: 'trust', target: 'seraphine', value: 25, operator: '>=' },
      { type: 'has_item', target: 'encrypted_data' }
    ]
  },
  {
    id: 'ending_true',
    title: '群星信使',
    description: '你揭露了阴谋，拯救了银河系，成为了真正的群星信使。',
    type: 'true',
    thumbnail: '⭐',
    cgImage: '🌌',
    storyText: '在你的努力下，银河议会的阴谋被彻底揭露。各大文明联合起来，建立了新的星际秩序。莱拉公主找回了父亲，织星族迎来了新的黄金时代。凯洛建造了他梦想中的时空飞船，诺瓦终于理解了"心"的含义，塞拉芬选择留下帮助你守护银河的和平。而你——这位来自信使学院的普通新人，成为了银河系有史以来最伟大的星际信使。星辰大海，你的传说才刚刚开始……',
    routeHint: '与莱拉和凯洛都建立深厚关系，并完成第二章的剧情',
    keyChoices: ['ch1_s5_c1', 'ch1_s6_good_c1', 'ch1_s3_c1', 'ch2_s3_c1', 'ch2_s4_truth_c1'],
    characterRoutes: ['lyra', 'kairo', 'seraphine'],
    unlockConditions: [
      { type: 'affection', target: 'lyra', value: 25, operator: '>=' },
      { type: 'affection', target: 'kairo', value: 25, operator: '>=' },
      { type: 'chapter_complete', target: 'ch2', value: true }
    ]
  }
];

export const getEndingById = (id: string): Ending | undefined => {
  return endings.find(e => e.id === id);
};
