import type { Chapter } from '@/types';

export const chapters: Chapter[] = [
  {
    id: 'ch1',
    title: '第一章：初入星海',
    subtitle: '命运的齿轮开始转动',
    order: 1,
    coverImage: '🌌',
    description: '你，一名刚从信使学院毕业的新人，接到了人生中第一份跨星投递任务。这趟看似普通的旅程，却隐藏着足以改变银河命运的秘密……',
    unlockedByDefault: true,
    scenes: [
      {
        id: 'ch1_s1',
        chapterId: 'ch1',
        background: '🏛️',
        dialogues: [
          {
            id: 'd1',
            text: '银河信使协会·新人分配处。你站在巨大的全息屏前，等待着人生中第一次任务委派。',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            speakerName: '分配官',
            text: '编号 A-7734，恭喜你以第一名的成绩从信使学院毕业。',
            emotion: 'neutral'
          },
          {
            id: 'd3',
            speakerName: '分配官',
            text: '作为表彰，协会决定交给你一项特别的任务——前往织星族，递送一份重要信函。',
            emotion: 'neutral'
          },
          {
            id: 'd4',
            text: '周围传来窃窃私语。织星族？那可是整个银河系最神秘的文明之一。',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch1_s1_c1',
            text: '"保证完成任务！"（充满信心地接受）',
            isKeyChoice: false,
            nextSceneId: 'ch1_s2',
            effects: [
              { type: 'reputation', target: '信使协会', amount: 5 }
            ]
          },
          {
            id: 'ch1_s1_c2',
            text: '"请问……任务有什么特别需要注意的吗？"（谨慎询问）',
            isKeyChoice: false,
            nextSceneId: 'ch1_s2_alt',
            effects: [
              { type: 'clue', value: '注意织星族的礼仪' }
            ]
          }
        ]
      },
      {
        id: 'ch1_s2',
        chapterId: 'ch1',
        background: '🚀',
        characterOnStage: [
          { characterId: 'kairo', position: 'right', emotion: 'happy' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'kairo',
            text: '嘿！你就是那个要去织星族的幸运儿？我是凯洛，这趟航班的工程师兼驾驶员。',
            emotion: 'happy'
          },
          {
            id: 'd2',
            speakerId: 'kairo',
            text: '别紧张，虽然去织星族的航线有点……危险，但我凯洛出马，保证把你安全送到！',
            emotion: 'happy'
          },
          {
            id: 'd3',
            text: '你注意到他的左手是机械义肢，在灯光下反射着冷冽的金属光泽。',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch1_s2_c1',
            text: '"那就拜托你了，凯洛。"（友好地回应）',
            isKeyChoice: false,
            nextSceneId: 'ch1_s3',
            effects: [
              { type: 'affection', target: 'kairo', amount: 10 }
            ]
          },
          {
            id: 'ch1_s2_c2',
            text: '"你的手……是怎么回事？"（好奇地问）',
            isKeyChoice: true,
            nextSceneId: 'ch1_s3_alt',
            effects: [
              { type: 'affection', target: 'kairo', amount: 5 },
              { type: 'clue', value: '凯洛的过去' }
            ]
          }
        ]
      },
      {
        id: 'ch1_s2_alt',
        chapterId: 'ch1',
        background: '🏛️',
        dialogues: [
          {
            id: 'd1',
            speakerName: '分配官',
            text: '你果然很谨慎。记住——织星族重视礼仪，见到公主时需行右手抚胸之礼。',
            emotion: 'neutral'
          },
          {
            id: 'd2',
            speakerName: '分配官',
            text: '另外，无论发生什么，务必将信函亲手交到公主手中。这是最高优先级。',
            emotion: 'mysterious'
          }
        ],
        nextScene: 'ch1_s2'
      },
      {
        id: 'ch1_s3',
        chapterId: 'ch1',
        background: '🌠',
        dialogues: [
          {
            id: 'd1',
            text: '飞船驶入跃迁航道。窗外的星光拉成了长长的光线，如梦似幻。',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            speakerId: 'kairo',
            text: '抓好了！前面有一片陨石带——我们要冲过去啦！',
            emotion: 'happy'
          },
          {
            id: 'd3',
            text: '警报声骤然响起！飞船剧烈震动起来。',
            textEffect: 'shake'
          }
        ],
        timedChoice: {
          timeLimit: 10,
          defaultChoiceId: 'ch1_s3_c2',
          choices: [
            {
              id: 'ch1_s3_c1',
              text: '冲向控制台手动操作',
              isKeyChoice: true,
              nextSceneId: 'ch1_s4_a',
              effects: [
                { type: 'affection', target: 'kairo', amount: 15 },
                { type: 'item', value: 'bounty_chip' }
              ]
            },
            {
              id: 'ch1_s3_c2',
              text: '抓紧扶手等待凯洛处理',
              isKeyChoice: false,
              nextSceneId: 'ch1_s4_b',
              effects: [
                { type: 'item', value: 'stardust' }
              ]
            }
          ]
        }
      },
      {
        id: 'ch1_s3_alt',
        chapterId: 'ch1',
        background: '🚀',
        characterOnStage: [
          { characterId: 'kairo', position: 'right', emotion: 'sad' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'kairo',
            text: '……这个啊。小时候在废铁城捡垃圾，被一台失控的机器咬掉的。',
            emotion: 'sad'
          },
          {
            id: 'd2',
            speakerId: 'kairo',
            text: '不过没关系！我自己做的义肢可比原来的手好用多了。看——',
            emotion: 'happy'
          },
          {
            id: 'd3',
            text: '他的机械手指灵活地转动，从工具箱里变出一把小扳手。',
            textEffect: 'fade'
          }
        ],
        nextScene: 'ch1_s3'
      },
      {
        id: 'ch1_s4_a',
        chapterId: 'ch1',
        background: '🚀',
        characterOnStage: [
          { characterId: 'kairo', position: 'right', emotion: 'surprised' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'kairo',
            text: '哇！你还会操控飞船？厉害啊，信使伙伴！',
            emotion: 'surprised'
          },
          {
            id: 'd2',
            text: '在你们的配合下，飞船惊险地穿过了陨石带。',
            textEffect: 'fade'
          },
          {
            id: 'd3',
            speakerId: 'kairo',
            text: '对了，在陨石堆里我捡到了这个。送给你！',
            emotion: 'happy'
          }
        ],
        nextScene: 'ch1_s5'
      },
      {
        id: 'ch1_s4_b',
        chapterId: 'ch1',
        background: '🚀',
        dialogues: [
          {
            id: 'd1',
            text: '凯洛全神贯注地操控着飞船，额头上渗出细密的汗珠。',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            speakerId: 'kairo',
            text: '呼……差点就完了。你没事吧？',
            emotion: 'happy'
          },
          {
            id: 'd3',
            text: '安全了。飞船虽然有些擦伤，但主体完好。舷窗外漂浮着闪烁的星尘。',
            textEffect: 'fade'
          }
        ],
        nextScene: 'ch1_s5'
      },
      {
        id: 'ch1_s5',
        chapterId: 'ch1',
        background: '💫',
        characterOnStage: [
          { characterId: 'lyra', position: 'center', emotion: 'neutral' }
        ],
        dialogues: [
          {
            id: 'd1',
            text: '织星族王城。宏伟的水晶宫殿在星光下熠熠生辉。',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            speakerId: 'lyra',
            text: '远道而来的信使，欢迎来到织星族。我是莱拉，这里的执政公主。',
            emotion: 'neutral'
          },
          {
            id: 'd3',
            text: '公主仪态端庄地站在王座前，银白色的长发如瀑布般垂落。',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch1_s5_c1',
            text: '（右手抚胸，恭敬行礼）"公主殿下，这是协会委托我递送的信函。"',
            isKeyChoice: true,
            nextSceneId: 'ch1_s6_good',
            effects: [
              { type: 'affection', target: 'lyra', amount: 20 },
              { type: 'trust', target: 'lyra', amount: 10 }
            ]
          },
          {
            id: 'ch1_s5_c2',
            text: '"公主你好！这是给你的信。"（随意递出）',
            isKeyChoice: true,
            nextSceneId: 'ch1_s6_bad',
            effects: [
              { type: 'affection', target: 'lyra', amount: -10 },
              { type: 'trust', target: 'lyra', amount: -5 }
            ]
          }
        ]
      },
      {
        id: 'ch1_s6_good',
        chapterId: 'ch1',
        background: '💫',
        characterOnStage: [
          { characterId: 'lyra', position: 'center', emotion: 'happy' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'lyra',
            text: '……你很懂礼数，信使。看来协会这次派来了一位可靠的人。',
            emotion: 'happy'
          },
          {
            id: 'd2',
            text: '莱拉公主接过信函，指尖微微颤抖。',
            textEffect: 'fade'
          },
          {
            id: 'd3',
            speakerId: 'lyra',
            text: '这封信……是来自我失踪多年的父王。信使，你愿意帮我一个忙吗？',
            emotion: 'surprised'
          },
          {
            id: 'd4',
            speakerId: 'lyra',
            text: '作为回报，我将赠予你织星族的圣物碎片。',
            emotion: 'neutral'
          }
        ],
        choices: [
          {
            id: 'ch1_s6_good_c1',
            text: '"我愿意帮助您，公主殿下。"',
            isKeyChoice: true,
            nextSceneId: 'ch1_end_good',
            effects: [
              { type: 'affection', target: 'lyra', amount: 15 },
              { type: 'item', value: 'crystal_shard' },
              { type: 'unlock_chapter', value: 'ch2' }
            ]
          }
        ]
      },
      {
        id: 'ch1_s6_bad',
        chapterId: 'ch1',
        background: '💫',
        characterOnStage: [
          { characterId: 'lyra', position: 'center', emotion: 'angry' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'lyra',
            text: '……无礼之徒。看来信使协会的水准今非昔比。',
            emotion: 'angry'
          },
          {
            id: 'd2',
            text: '莱拉公主冷着脸接过信函，周围的侍从也面露不悦。',
            textEffect: 'fade'
          },
          {
            id: 'd3',
            speakerId: 'lyra',
            text: '信我收到了。你可以回去了。但我希望你明白——尊重，是信使最基本的素养。',
            emotion: 'sad'
          }
        ],
        nextScene: 'ch1_end_neutral'
      },
      {
        id: 'ch1_end_good',
        chapterId: 'ch1',
        background: '🌅',
        isEnding: true,
        dialogues: [
          {
            id: 'd1',
            text: '第一章·初入星海 · 完美通关',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            text: '你获得了莱拉公主的信任，一段跨越星海的冒险正式拉开帷幕……',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch1_end_good_c1',
            text: '返回章节列表',
            isKeyChoice: false,
            nextSceneId: 'ch1_s1',
            effects: []
          }
        ]
      },
      {
        id: 'ch1_end_neutral',
        chapterId: 'ch1',
        background: '🌅',
        isEnding: true,
        dialogues: [
          {
            id: 'd1',
            text: '第一章·初入星海 · 结束',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            text: '任务虽然完成了，但你给织星族人留下了不太好的印象。也许下次应该更加注意礼仪……',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch1_end_neutral_c1',
            text: '返回章节列表',
            isKeyChoice: false,
            nextSceneId: 'ch1_s1',
            effects: []
          }
        ]
      }
    ]
  },
  {
    id: 'ch2',
    title: '第二章：暗影中的低语',
    subtitle: '真相藏在谎言之下',
    order: 2,
    coverImage: '🌙',
    description: '答应了莱拉公主的请求后，你踏上了寻找真相的旅程。废铁城、暗影教团、科技议会……银河系的各方势力逐渐浮出水面。',
    unlockedByDefault: false,
    scenes: [
      {
        id: 'ch2_s1',
        chapterId: 'ch2',
        background: '🏚️',
        characterOnStage: [
          { characterId: 'kairo', position: 'left', emotion: 'happy' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'kairo',
            text: '欢迎来到废铁城！虽然名字不好听，但这里可是全银河系最好的零件市场！',
            emotion: 'happy'
          },
          {
            id: 'd2',
            text: '破败的钢铁建筑遮天蔽日，霓虹招牌在雾气中闪烁。',
            textEffect: 'fade'
          },
          {
            id: 'd3',
            speakerId: 'kairo',
            text: '莱拉公主让你找的那个人……叫塞拉芬，对吧？暗影教团的祭司，据说住在城市最深处。',
            emotion: 'neutral'
          }
        ],
        choices: [
          {
            id: 'ch2_s1_c1',
            text: '"暗影教团……是个什么样的组织？"',
            isKeyChoice: false,
            nextSceneId: 'ch2_s2',
            effects: [
              { type: 'clue', value: '暗影教团的背景' }
            ]
          },
          {
            id: 'ch2_s1_c2',
            text: '"我们直接去找她吧。"',
            isKeyChoice: false,
            nextSceneId: 'ch2_s3',
            effects: []
          }
        ]
      },
      {
        id: 'ch2_s2',
        chapterId: 'ch2',
        background: '🏚️',
        characterOnStage: [
          { characterId: 'kairo', position: 'left', emotion: 'mysterious' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'kairo',
            text: '暗影教团……说起来挺神秘的。据说他们能窥见命运，甚至改变它。',
            emotion: 'mysterious'
          },
          {
            id: 'd2',
            speakerId: 'kairo',
            text: '有人说他们是骗子，也有人对他们奉若神明。总之，别轻易相信他们的话就对了。',
            emotion: 'neutral'
          }
        ],
        nextScene: 'ch2_s3'
      },
      {
        id: 'ch2_s3',
        chapterId: 'ch2',
        background: '🕯️',
        characterOnStage: [
          { characterId: 'seraphine', position: 'center', emotion: 'mysterious' }
        ],
        dialogues: [
          {
            id: 'd1',
            text: '幽暗的神殿中，蜡烛散发着摇曳的光芒。一位身穿黑袍的女子背对着你们。',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            speakerId: 'seraphine',
            text: '……我等你很久了，星之信使。命运的线早已将你引向此处。',
            emotion: 'mysterious'
          },
          {
            id: 'd3',
            text: '她转过身，银色的双眼仿佛能看透你的灵魂。',
            textEffect: 'fade'
          },
          {
            id: 'd4',
            speakerId: 'seraphine',
            text: '你想知道织星族国王失踪的真相，对吗？但你确定……真相是你能承受的吗？',
            emotion: 'neutral'
          }
        ],
        timedChoice: {
          timeLimit: 15,
          defaultChoiceId: 'ch2_s3_c2',
          choices: [
            {
              id: 'ch2_s3_c1',
              text: '"无论真相是什么，我都要知道。"',
              isKeyChoice: true,
              nextSceneId: 'ch2_s4_truth',
              effects: [
                { type: 'affection', target: 'seraphine', amount: 10 },
                { type: 'trust', target: 'seraphine', amount: 15 }
              ]
            },
            {
              id: 'ch2_s3_c2',
              text: '"你在故弄玄虚吧？"',
              isKeyChoice: false,
              nextSceneId: 'ch2_s4_doubt',
              effects: [
                { type: 'affection', target: 'seraphine', amount: -5 }
              ]
            }
          ]
        }
      },
      {
        id: 'ch2_s4_truth',
        chapterId: 'ch2',
        background: '🕯️',
        characterOnStage: [
          { characterId: 'seraphine', position: 'center', emotion: 'sad' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'seraphine',
            text: '很好……你的勇气让我欣赏。那么，收下这个。',
            emotion: 'neutral'
          },
          {
            id: 'd2',
            text: '塞拉芬递给你一枚加密的数据芯片。',
            textEffect: 'fade'
          },
          {
            id: 'd3',
            speakerId: 'seraphine',
            text: '这里面记录着一切——关于织星族国王，关于那场"意外"，以及……即将到来的风暴。',
            emotion: 'sad'
          },
          {
            id: 'd4',
            speakerId: 'seraphine',
            text: '但要解读它，你需要一个解码器。去科技议会，找一个叫诺瓦的AI。它会帮助你。',
            emotion: 'neutral'
          }
        ],
        choices: [
          {
            id: 'ch2_s4_truth_c1',
            text: '"谢谢你，塞拉芬。"',
            isKeyChoice: true,
            nextSceneId: 'ch2_end_good',
            effects: [
              { type: 'item', value: 'encrypted_data' },
              { type: 'clue', value: '寻找AI诺瓦' },
              { type: 'trust', target: 'seraphine', amount: 10 }
            ]
          }
        ]
      },
      {
        id: 'ch2_s4_doubt',
        chapterId: 'ch2',
        background: '🕯️',
        characterOnStage: [
          { characterId: 'seraphine', position: 'center', emotion: 'neutral' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'seraphine',
            text: '怀疑……是智慧的开始。但有时候，盲目怀疑会让你错失真相。',
            emotion: 'neutral'
          },
          {
            id: 'd2',
            text: '她轻轻挥手，一阵烟雾弥漫开来。当烟雾散去，她已经消失了。',
            textEffect: 'fade'
          },
          {
            id: 'd3',
            text: '石台上只留下一枚闪烁着冷光的数据芯片。',
            textEffect: 'fade'
          }
        ],
        nextScene: 'ch2_end_neutral'
      },
      {
        id: 'ch2_end_good',
        chapterId: 'ch2',
        background: '🌅',
        isEnding: true,
        dialogues: [
          {
            id: 'd1',
            text: '第二章·暗影中的低语 · 完美通关',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            text: '你获得了关键线索和塞拉芬的认可。下一站——科技议会。',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch2_end_good_c1',
            text: '返回章节列表',
            isKeyChoice: false,
            nextSceneId: 'ch2_s1',
            effects: []
          }
        ]
      },
      {
        id: 'ch2_end_neutral',
        chapterId: 'ch2',
        background: '🌅',
        isEnding: true,
        dialogues: [
          {
            id: 'd1',
            text: '第二章·暗影中的低语 · 结束',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            text: '你获得了数据芯片，但错过了与塞拉芬建立信任的机会。',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch2_end_neutral_c1',
            text: '返回章节列表',
            isKeyChoice: false,
            nextSceneId: 'ch2_s1',
            effects: []
          }
        ]
      }
    ]
  },
  {
    id: 'ch3',
    title: '第三章：钢铁之心',
    subtitle: '在数据中寻找真相',
    order: 3,
    coverImage: '🤖',
    description: '科技议会的核心——量子之城。在这里，你将遇见AI诺瓦，并逐步揭开织星族国王失踪的真相。',
    unlockedByDefault: false,
    scenes: [
      {
        id: 'ch3_s1',
        chapterId: 'ch3',
        background: '🏙️',
        dialogues: [
          {
            id: 'd1',
            text: '量子之城，科技议会的心脏。高耸入云的数据塔散发着蓝色的光芒。',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            speakerId: 'kairo',
            text: '哇……每次来这里都觉得震撼。整座城市就是一台巨型计算机！',
            emotion: 'happy'
          }
        ],
        nextScene: 'ch3_s2'
      },
      {
        id: 'ch3_s2',
        chapterId: 'ch3',
        background: '💠',
        characterOnStage: [
          { characterId: 'nova', position: 'center', emotion: 'neutral' }
        ],
        dialogues: [
          {
            id: 'd1',
            text: '议会核心处，一个由纯粹能量构成的少女身影悬浮在空中。',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            speakerId: 'nova',
            text: '你好，星际信使。我是诺瓦。塞拉芬已经提前告知了你的到来。',
            emotion: 'neutral'
          },
          {
            id: 'd3',
            speakerId: 'nova',
            text: '根据我的计算，你有97.3%的概率会接受解码任务。但我很好奇——你为什么要帮助织星族？',
            emotion: 'neutral'
          }
        ],
        choices: [
          {
            id: 'ch3_s2_c1',
            text: '"因为这是我的职责。"',
            isKeyChoice: false,
            nextSceneId: 'ch3_s3',
            effects: [
              { type: 'reputation', target: '信使协会', amount: 5 }
            ]
          },
          {
            id: 'ch3_s2_c2',
            text: '"因为莱拉公主需要帮助。"',
            isKeyChoice: true,
            nextSceneId: 'ch3_s3',
            effects: [
              { type: 'affection', target: 'lyra', amount: 10 },
              { type: 'affection', target: 'nova', amount: 5 }
            ]
          },
          {
            id: 'ch3_s2_c3',
            text: '"因为我想知道真相。"',
            isKeyChoice: true,
            nextSceneId: 'ch3_s3',
            effects: [
              { type: 'affection', target: 'nova', amount: 10 },
              { type: 'clue', value: '对真相的渴望' }
            ]
          }
        ]
      },
      {
        id: 'ch3_s3',
        chapterId: 'ch3',
        background: '💠',
        characterOnStage: [
          { characterId: 'nova', position: 'center', emotion: 'neutral' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'nova',
            text: '……有趣的回答。人类的动机总是充满了非理性的变量。',
            emotion: 'neutral'
          },
          {
            id: 'd2',
            speakerId: 'nova',
            text: '凯洛，我需要你的帮助来制作解码器。你的机械技术在银河系排名前0.01%。',
            emotion: 'neutral'
          },
          {
            id: 'd3',
            speakerId: 'kairo',
            text: '哈哈，被夸了！放心吧，包在我身上！',
            emotion: 'happy'
          }
        ],
        nextScene: 'ch3_s4'
      },
      {
        id: 'ch3_s4',
        chapterId: 'ch3',
        background: '⚙️',
        characterOnStage: [
          { characterId: 'kairo', position: 'left', emotion: 'happy' },
          { characterId: 'nova', position: 'right', emotion: 'neutral' }
        ],
        dialogues: [
          {
            id: 'd1',
            text: '凯洛和诺瓦开始制作解码器。你可以选择帮助其中一人。',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch3_s4_c1',
            text: '帮助凯洛组装硬件',
            isKeyChoice: false,
            nextSceneId: 'ch3_s5',
            effects: [
              { type: 'affection', target: 'kairo', amount: 10 },
              { type: 'item', value: 'mechanical_key' }
            ]
          },
          {
            id: 'ch3_s4_c2',
            text: '帮助诺瓦编写算法',
            isKeyChoice: false,
            nextSceneId: 'ch3_s5',
            effects: [
              { type: 'affection', target: 'nova', amount: 10 },
              { type: 'clue', value: '量子编码基础' }
            ]
          }
        ]
      },
      {
        id: 'ch3_s5',
        chapterId: 'ch3',
        background: '💠',
        characterOnStage: [
          { characterId: 'nova', position: 'center', emotion: 'surprised' }
        ],
        dialogues: [
          {
            id: 'd1',
            speakerId: 'nova',
            text: '解码器制作完成。现在……让我们看看里面藏着什么秘密。',
            emotion: 'neutral'
          },
          {
            id: 'd2',
            text: '数据芯片插入解码器，全息投影在空气中展开。',
            textEffect: 'fade'
          },
          {
            id: 'd3',
            speakerId: 'nova',
            text: '这是……！织星族国王的航行日志。他发现了一个惊人的秘密——',
            emotion: 'surprised'
          },
          {
            id: 'd4',
            speakerId: 'nova',
            text: '银河议会中，有人在暗中策划一场足以颠覆所有文明的阴谋。国王正是因为发现了这件事才"失踪"的。',
            emotion: 'sad'
          }
        ],
        choices: [
          {
            id: 'ch3_s5_c1',
            text: '"这个阴谋……具体是什么？"',
            isKeyChoice: true,
            nextSceneId: 'ch3_end_good',
            effects: [
              { type: 'item', value: 'decoder' },
              { type: 'achievement', value: 'truth_seeker' }
            ]
          }
        ]
      },
      {
        id: 'ch3_end_good',
        chapterId: 'ch3',
        background: '🌅',
        isEnding: true,
        dialogues: [
          {
            id: 'd1',
            text: '第三章·钢铁之心 · 完美通关',
            textEffect: 'fade'
          },
          {
            id: 'd2',
            text: '你获得了解码器，并了解了可怕的真相。风暴即将来临……',
            textEffect: 'fade'
          }
        ],
        choices: [
          {
            id: 'ch3_end_good_c1',
            text: '返回章节列表（更多章节开发中）',
            isKeyChoice: false,
            nextSceneId: 'ch3_s1',
            effects: []
          }
        ]
      }
    ]
  }
];

export const getChapterById = (id: string): Chapter | undefined => {
  return chapters.find(c => c.id === id);
};

export const getSceneById = (chapterId: string, sceneId: string) => {
  const chapter = getChapterById(chapterId);
  if (!chapter) return null;
  return chapter.scenes.find(s => s.id === sceneId) || null;
};
