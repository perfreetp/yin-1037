import type { Mail } from '@/types';

export interface MailTemplate {
  id: string;
  from: string;
  fromCharacterId?: string;
  subject: string;
  content: string;
  type: 'main' | 'side' | 'hidden';
  replyOptions?: Array<{
    id: string;
    text: string;
    effects: Array<{
      type: 'affection' | 'trust' | 'reputation' | 'item' | 'clue' | 'ending' | 'unlock_chapter' | 'achievement';
      target?: string;
      value?: string;
      amount?: number;
    }>;
  }>;
  triggerCondition?: {
    type: 'chapter_complete' | 'has_item' | 'choice_made' | 'affection' | 'clue' | 'reputation';
    target?: string;
    value?: string | number | boolean;
    operator?: '>' | '<' | '>=' | '<=' | '==';
  };
}

export const mailTemplates: MailTemplate[] = [
  {
    id: 'welcome_mail',
    from: '银河信使协会',
    subject: '欢迎加入群星邮差！',
    content: `亲爱的新人信使：\n\n恭喜你从信使学院以第一名的成绩毕业！从今天起，你就是一名光荣的星际信使了。\n\n你的第一个任务已经分配：前往织星族，将一封重要信函亲手交到莱拉公主手中。\n\n记住，每一封信都承载着一份希望，每一次投递都可能改变命运。\n\n愿星辰指引你的道路。\n\n银河信使协会`,
    type: 'main',
    replyOptions: [
      {
        id: 'reply_enthusiastic',
        text: '回信："感谢协会的信任！我一定不辱使命！"',
        effects: [
          { type: 'reputation', target: '信使协会', amount: 5 },
          { type: 'clue', value: '协会的期待' }
        ]
      },
      {
        id: 'reply_calm',
        text: '回信："收到任务，将按规定执行。"',
        effects: [
          { type: 'reputation', target: '信使协会', amount: 2 }
        ]
      }
    ]
  },
  {
    id: 'lyra_after_ch1',
    from: '莱拉公主',
    fromCharacterId: 'lyra',
    subject: '感谢你的帮助',
    content: `亲爱的信使朋友：\n\n父王的来信让我看到了希望。在这个混乱的时代，像你这样愿意伸出援手的人已经不多了。\n\n塞拉芬祭司的话让我很在意——"即将到来的风暴"究竟是什么意思？\n\n如果你在废铁城发现了什么线索，请务必告诉我。\n\n另外……谢谢你那天对织星族礼仪的尊重。很少有外来者能做到这一点。\n\n期待你的好消息。\n\n莱拉\n织星族执政公主`,
    type: 'main',
    triggerCondition: {
      type: 'chapter_complete',
      target: 'ch1',
      value: true
    },
    replyOptions: [
      {
        id: 'reply_support',
        text: '回信："公主殿下放心，我一定会查明真相。"',
        effects: [
          { type: 'affection', target: 'lyra', amount: 10 },
          { type: 'trust', target: 'lyra', amount: 5 }
        ]
      },
      {
        id: 'reply_question',
        text: '回信："殿下，能告诉我更多关于您父王的事吗？"',
        effects: [
          { type: 'affection', target: 'lyra', amount: 5 },
          { type: 'clue', value: '国王失踪的细节' }
        ]
      }
    ]
  },
  {
    id: 'kairo_friendship',
    from: '凯洛',
    fromCharacterId: 'kairo',
    subject: '嘿，搭档！',
    content: `伙计：\n\n今天在陨石带的配合真不错！你那手飞船操控技术，比很多老飞行员都强！\n\n我已经在准备解码器了，诺瓦说还需要一些特殊零件。等我搞定了就通知你。\n\n对了，下次回废铁城的时候，我带你去看看我的秘密基地——那里有我珍藏的零件和图纸！\n\n顺便说一句，你人真的不错。在这一行，能交个真心朋友不容易。\n\n你的机械师搭档\n凯洛`,
    type: 'side',
    triggerCondition: {
      type: 'choice_made',
      target: 'ch1_s3_c1'
    },
    replyOptions: [
      {
        id: 'reply_excited',
        text: '回信："太棒了！我已经等不及想看你的秘密基地了！"',
        effects: [
          { type: 'affection', target: 'kairo', amount: 15 },
          { type: 'item', value: 'star_compass' }
        ]
      },
      {
        id: 'reply_thanks',
        text: '回信："谢谢你，凯洛。能认识你我也很高兴。"',
        effects: [
          { type: 'affection', target: 'kairo', amount: 10 }
        ]
      }
    ]
  },
  {
    id: 'seraphine_hint',
    from: '塞拉芬',
    fromCharacterId: 'seraphine',
    subject: '命运的低语',
    content: `星之信使：\n\n当你读到这封信时，命运的齿轮已经转动了。\n\n你是否想过，为什么是你被选中来递送那封信？\n\n银河议会的阴影远比你想象的更深。诺瓦知道真相，但它被编程限制，无法直接告诉你。\n\n去寻找三块"星之碎片"吧——它们是打开真相之门的钥匙。\n\n第一块碎片，就在你获得的水晶之中。\n\n在群星之间\n塞拉芬`,
    type: 'hidden',
    triggerCondition: {
      type: 'affection',
      target: 'seraphine',
      value: 10,
      operator: '>='
    },
    replyOptions: [
      {
        id: 'reply_trust',
        text: '回信："我相信你说的话。我会去寻找碎片。"',
        effects: [
          { type: 'trust', target: 'seraphine', amount: 15 },
          { type: 'clue', value: '星之碎片的秘密' }
        ]
      },
      {
        id: 'reply_doubt',
        text: '回信："你到底是谁？为什么要告诉我这些？"',
        effects: [
          { type: 'affection', target: 'seraphine', amount: 5 },
          { type: 'clue', value: '塞拉芬的身份疑云' }
        ]
      }
    ]
  },
  {
    id: 'nova_data',
    from: '诺瓦',
    fromCharacterId: 'nova',
    subject: '数据分析完成',
    content: `信使先生/女士：\n\n我已经完成了对你提供的加密数据的初步分析。\n\n分析结果显示，这些数据中包含银河议会高层的秘密通信记录。其中多次提到一个代号为"黎明"的计划。\n\n遗憾的是，由于数据损坏严重，我无法获取完整内容。\n\n但有一点我可以确定：织星族国王的"失踪"与这个计划有关。\n\n需要我继续深入分析吗？这可能需要一定时间，并且存在被发现的风险。\n\n诺瓦\n科技议会核心AI`,
    type: 'main',
    triggerCondition: {
      type: 'chapter_complete',
      target: 'ch2',
      value: true
    },
    replyOptions: [
      {
        id: 'reply_continue',
        text: '回信："请继续分析，无论有什么风险。"',
        effects: [
          { type: 'affection', target: 'nova', amount: 10 },
          { type: 'clue', value: '"黎明"计划' }
        ]
      },
      {
        id: 'reply_careful',
        text: '回信："先暂停分析，我们需要更谨慎地计划。"',
        effects: [
          { type: 'trust', target: 'nova', amount: 10 },
          { type: 'clue', value: '谨慎行事' }
        ]
      }
    ]
  },
  {
    id: 'thorn_chance',
    from: '索恩',
    fromCharacterId: 'thorn',
    subject: '关于你的悬赏',
    content: `小子/丫头：\n\n有人悬赏你的信息。金额很高。\n\n但我不会接这个活——你让我想起了以前的自己。\n\n提醒你一句：有人不想让你继续调查织星族国王的事。最近小心点。\n\n如果你遇到麻烦，可以到废铁城的第三区找我。提我的名字就行。\n\n别问我为什么帮你。也许我只是看银河议会不顺眼。\n\n索恩`,
    type: 'hidden',
    triggerCondition: {
      type: 'has_item',
      target: 'bounty_chip'
    },
    replyOptions: [
      {
        id: 'reply_thanks',
        text: '回信："谢谢你的提醒，索恩。"',
        effects: [
          { type: 'affection', target: 'thorn', amount: 10 },
          { type: 'clue', value: '索恩的过去' }
        ]
      },
      {
        id: 'reply_question',
        text: '回信："你到底是谁？为什么知道这么多？"',
        effects: [
          { type: 'item', value: 'worn_badge' }
        ]
      }
    ]
  },
  {
    id: 'council_warning',
    from: '银河议会',
    subject: '正式警告',
    content: `星际信使 A-7734：\n\n有报告称你正在进行未经授权的调查活动。\n\n银河议会在此正式警告你：立即停止一切与织星族相关的调查，否则将面临严重后果。\n\n你是一名信使，不是侦探。做好你的本职工作。\n\n如果你放弃调查，议会可以考虑给予你丰厚的奖励。\n\n银河议会 安全部`,
    type: 'main',
    triggerCondition: {
      type: 'clue',
      target: '星之碎片的秘密'
    },
    replyOptions: [
      {
        id: 'reply_defy',
        text: '回信："我会继续调查，不会被你们吓倒。"',
        effects: [
          { type: 'reputation', target: '银河议会', amount: -20 },
          { type: 'achievement', value: 'truth_seeker' }
        ]
      },
      {
        id: 'reply_negotiate',
        text: '回信："我需要考虑一下。"',
        effects: [
          { type: 'reputation', target: '银河议会', amount: -5 },
          { type: 'clue', value: '议会的虚张声势' }
        ]
      },
      {
        id: 'reply_agree',
        text: '回信："好吧，我接受你们的条件。"',
        effects: [
          { type: 'reputation', target: '银河议会', amount: 10 },
          { type: 'item', value: 'stardust' },
          { type: 'affection', target: 'lyra', amount: -20 }
        ]
      }
    ]
  },
  {
    id: 'true_ending_hint',
    from: '???',
    subject: '最后的真相',
    content: `阅读此信前，请确保四周无人。\n\n我知道你在找什么。我也知道银河议会想掩盖什么。\n\n织星族国王没有死——他被囚禁在虚空边境的秘密监狱里。\n\n"黎明"计划的真相，是银河议会议长想要用织星族的圣晶力量控制整个银河系。\n\n你需要做三件事：\n1. 集齐三块星之碎片，重铸圣晶\n2. 获得诺瓦的系统权限\n3. 联系暗影教团，他们有国王的确切位置\n\n时间不多了。议长的仪式将在三个月后举行。\n\n你是唯一能阻止他的人。\n\n一个知情者`,
    type: 'hidden',
    triggerCondition: {
      type: 'clue',
      target: '"黎明"计划'
    },
    replyOptions: [
      {
        id: 'reply_accept',
        text: '回信："我会阻止这一切。"',
        effects: [
          { type: 'clue', value: '真结局路线开启' },
          { type: 'achievement', value: '命运的使者' }
        ]
      }
    ]
  },
  {
    id: 'mail_event_rescued_thanks',
    from: '被救者·艾伦',
    subject: '来自被救者的感谢',
    content: `尊敬的信使大人：\n\n我是您在小行星带救下的那个人。我叫艾伦，是一名自由商人。\n\n那天如果没有您，我可能已经死在那片冰冷的虚空中了。\n\n这枚星晶是我祖父传下来的，据说蕴含着古代文明的力量。请收下它，这是我能拿出的最贵重的东西。\n\n另外，我在废铁城有一些朋友，如果您需要什么帮助，尽管提我的名字。\n\n从今以后，您的事就是我的事。\n\n永远感激您的\n艾伦·史密斯`,
    type: 'side',
    replyOptions: [
      {
        id: 'reply_accept',
        text: '回信："感谢你的心意，我收下了。"',
        effects: [
          { type: 'item', value: 'star_crystal' },
          { type: 'reputation', target: '自由联盟', amount: 15 },
          { type: 'clue', value: '被救者的真实身份' }
        ]
      },
      {
        id: 'reply_decline',
        text: '回信："救你只是举手之劳，礼物太贵重了。"',
        effects: [
          { type: 'reputation', target: '自由联盟', amount: 20 },
          { type: 'affection', target: 'kairo', amount: 5 }
        ]
      }
    ]
  }
];

export const getMailTemplateById = (id: string): MailTemplate | undefined => {
  return mailTemplates.find((m) => m.id === id);
};

export const checkMailTrigger = (
  template: MailTemplate,
  save: Parameters<typeof import('@/utils/conditions').checkCondition>[1]
): boolean => {
  if (!template.triggerCondition) return false;
  if (save.mails.some((m) => m.id === template.id)) return false;

  const cond = template.triggerCondition;

  switch (cond.type) {
    case 'chapter_complete': {
      const progress = save.chapterProgress[cond.target || ''];
      return progress?.completed === Boolean(cond.value);
    }
    case 'has_item': {
      return save.inventory.some((i) => i.itemId === cond.target);
    }
    case 'choice_made': {
      return save.choices.some((c) => c.choiceId === cond.target);
    }
    case 'affection': {
      const relation = save.characterRelations[cond.target || ''];
      const actual = relation?.affection || 0;
      const op = cond.operator || '>=';
      const val = Number(cond.value) || 0;
      switch (op) {
        case '>': return actual > val;
        case '<': return actual < val;
        case '>=': return actual >= val;
        case '<=': return actual <= val;
        default: return actual === val;
      }
    }
    case 'clue': {
      return save.clues.includes(cond.target || '');
    }
    case 'reputation': {
      const actual = save.factionReputation[cond.target || ''] || 0;
      const op = cond.operator || '>=';
      const val = Number(cond.value) || 0;
      switch (op) {
        case '>': return actual > val;
        case '<': return actual < val;
        case '>=': return actual >= val;
        case '<=': return actual <= val;
        default: return actual === val;
      }
    }
    default:
      return false;
  }
};

export const createMailFromTemplate = (template: MailTemplate): Mail => {
  return {
    id: template.id,
    from: template.from,
    fromCharacterId: template.fromCharacterId,
    subject: template.subject,
    content: template.content,
    type: template.type,
    read: false,
    replied: false,
    replyOptions: template.replyOptions?.map((r) => ({
      id: r.id,
      text: r.text,
      effects: r.effects
    })),
    timestamp: Date.now()
  };
};
