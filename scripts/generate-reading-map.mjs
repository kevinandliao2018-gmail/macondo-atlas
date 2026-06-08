import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const chapterNames = [
  '',
  '第一',
  '第二',
  '第三',
  '第四',
  '第五',
  '第六',
  '第七',
  '第八',
  '第九',
  '第十',
  '第十一',
  '第十二',
  '第十三',
  '第十四',
  '第十五',
  '第十六',
  '第十七',
  '第十八',
  '第十九',
  '第二十'
];

const chapters = [
  {
    chapter: 1,
    subtitle: '由冰块开始，到冰块结束',
    phase: '创世期',
    summary: '马孔多仍处于万物未命名的原初状态，冰块、吉卜赛人和家族原型共同启动全书循环。',
    keywords: ['冰块', '创世', '时间折叠', '梅尔基亚德斯', '马孔多'],
    characters: ['jose-arcadio-buendia', 'ursula-iguaran', 'melquiades', 'aureliano-buendia-colonel', 'jose-arcadio'],
    motifs: ['ice', 'solitude', 'time', 'family'],
    themes: ['time', 'genesis', 'family']
  },
  {
    chapter: 2,
    subtitle: '猪尾巴恐惧与马孔多命名',
    phase: '创世期',
    summary: '德雷克炮火、近亲婚姻、普鲁邓希奥鬼魂和翻山迁徙，把家族罪责推向马孔多的命名时刻。',
    keywords: ['德雷克', '猪尾巴', '普鲁邓希奥', '迁徙', '镜墙城市'],
    characters: ['jose-arcadio-buendia', 'ursula-iguaran', 'prudentio-aguilar', 'jose-arcadio', 'pilar-ternera'],
    motifs: ['family', 'pig-tail', 'solitude', 'mirror', 'ice'],
    themes: ['origin', 'guilt', 'migration']
  },
  {
    chapter: 3,
    subtitle: '失眠症、丽贝卡与记忆标签',
    phase: '扩张期',
    summary: '丽贝卡把异乡骨殖和失眠症带入马孔多，标签、记忆机器和梅尔基亚德斯归来共同对抗遗忘。',
    keywords: ['丽贝卡', '失眠症', '记忆标签', '梅尔基亚德斯', '政府进入'],
    characters: ['ursula-iguaran', 'jose-arcadio-buendia', 'aureliano-buendia-colonel', 'rebecca', 'arcadio', 'amaranta', 'melquiades'],
    motifs: ['insomnia', 'memory', 'time', 'family', 'solitude'],
    themes: ['memory', 'expansion', 'state']
  },
  {
    chapter: 4,
    subtitle: '自动钢琴与爱情病',
    phase: '扩张期',
    summary: '新居、自动钢琴、皮埃特罗和三条爱情线使布恩迪亚家的体面生活变成欲望、死亡和时间崩坏的舞台。',
    keywords: ['自动钢琴', '皮埃特罗', '爱情病', '梅尔基亚德斯之死', '栗树'],
    characters: ['rebecca', 'amaranta', 'aureliano-buendia-colonel', 'remedios-moscote', 'pietro-crespi', 'ursula-iguaran', 'melquiades', 'jose-arcadio-buendia'],
    motifs: ['music', 'death', 'desire', 'family', 'time'],
    themes: ['love', 'modernity', 'death']
  },
  {
    chapter: 5,
    subtitle: '婚礼、死亡与政治暴力',
    phase: '战争开端',
    summary: '奥雷里亚诺的婚姻与蕾梅黛丝之死，让私人激情转入政治暴力和内战秩序。',
    keywords: ['蕾梅黛丝', '内战', '阿尔卡蒂奥', '摩斯科特', '政治暴力'],
    characters: ['aureliano-buendia-colonel', 'remedios-moscote', 'arcadio', 'pilar-ternera', 'apolinar-moscote', 'ursula-iguaran'],
    motifs: ['war', 'death', 'solitude', 'power', 'family'],
    themes: ['war', 'marriage', 'power']
  },
  {
    chapter: 6,
    subtitle: '权力异化与阿尔卡蒂奥之死',
    phase: '战争期',
    summary: '阿尔卡蒂奥在马孔多复制战争权力的残酷逻辑，独裁、恐惧和枪决把创世村镇推入暴力循环。',
    keywords: ['阿尔卡蒂奥', '独裁', '枪决', '桑塔索菲亚', '战争'],
    characters: ['arcadio', 'santa-sofia-de-la-piedad', 'aureliano-buendia-colonel', 'ursula-iguaran', 'gerineldo-marquez'],
    motifs: ['war', 'power', 'death', 'solitude', 'family'],
    themes: ['dictatorship', 'violence', 'legacy']
  },
  {
    chapter: 7,
    subtitle: '枪决、归来与三重死亡',
    phase: '战争期',
    summary: '奥雷里亚诺面对枪决又被救回，长子归来、丽贝卡婚姻和死亡事件把家族推向更深孤绝。',
    keywords: ['行刑队', '长子归来', '丽贝卡', '枪声', '小金鱼'],
    characters: ['aureliano-buendia-colonel', 'jose-arcadio', 'rebecca', 'ursula-iguaran', 'amaranta', 'gerineldo-marquez'],
    motifs: ['war', 'death', 'solitude', 'gold-fish', 'family'],
    themes: ['return', 'execution', 'mourning']
  },
  {
    chapter: 8,
    subtitle: '禁忌爱情与蒙卡达之死',
    phase: '战争期',
    summary: '战争中的友情、拒绝和处决彼此纠缠，奥雷里亚诺在权力道路上越过良知边界。',
    keywords: ['蒙卡达', '阿玛兰妲', '赫里内勒多', '拒绝', '处决'],
    characters: ['aureliano-buendia-colonel', 'amaranta', 'gerineldo-marquez', 'pietro-crespi', 'rebecca', 'ursula-iguaran'],
    motifs: ['war', 'desire', 'death', 'solitude', 'power'],
    themes: ['war', 'betrayal', 'refusal']
  },
  {
    chapter: 9,
    subtitle: '马孔多在下雨',
    phase: '战争终章',
    summary: '战争理想瓦解成权力游戏，雨中的电报、粉笔圈和停战协定共同写出上校的精神破产。',
    keywords: ['马孔多在下雨', '粉笔圈', '尼兰迪亚协定', '小金鱼', '战争虚无'],
    characters: ['aureliano-buendia-colonel', 'gerineldo-marquez', 'amaranta', 'ursula-iguaran', 'remedios-the-beauty'],
    motifs: ['rain', 'war', 'solitude', 'gold-fish', 'time'],
    themes: ['war', 'power', 'emptiness']
  },
  {
    chapter: 10,
    subtitle: '身份错位与生命狂欢',
    phase: '繁荣期',
    summary: '双胞胎的错位、佩特拉的繁殖魔力和狂欢节屠杀，宣告战后马孔多进入喧闹而失控的繁荣。',
    keywords: ['双胞胎', '佩特拉', '繁殖', '狂欢节', '费尔南达'],
    characters: ['aureliano-segundo', 'jose-arcadio-segundo', 'petra-cotes', 'remedios-the-beauty', 'fernanda-del-carpio', 'ursula-iguaran'],
    motifs: ['family', 'desire', 'power', 'death', 'train'],
    themes: ['prosperity', 'identity', 'carnival']
  },
  {
    chapter: 11,
    subtitle: '黄色火车驶入马孔多',
    phase: '外来秩序期',
    summary: '铁路、香蕉公司、外来制度和费尔南达的规训秩序，把马孔多从家族空间推入殖民式现代化。',
    keywords: ['黄色火车', '香蕉公司', '费尔南达', '外来秩序', '美国人'],
    characters: ['fernanda-del-carpio', 'aureliano-segundo', 'jose-arcadio-segundo', 'remedios-the-beauty', 'mr-brown'],
    motifs: ['train', 'banana-company', 'power', 'family', 'solitude'],
    themes: ['modernity', 'foreign-order', 'colonialism']
  },
  {
    chapter: 12,
    subtitle: '升天与屠杀的对位',
    phase: '香蕉公司期',
    summary: '美人儿蕾梅黛丝升天与香蕉公司秩序并置，纯洁神话和殖民机器在同一章内彼此照亮。',
    keywords: ['美人儿蕾梅黛丝', '升天', '黄色蝴蝶', '香蕉公司', '美国人'],
    characters: ['remedios-the-beauty', 'meme', 'mauricio-babilonia', 'fernanda-del-carpio', 'aureliano-segundo', 'mr-brown'],
    motifs: ['yellow-butterflies', 'banana-company', 'desire', 'death', 'solitude'],
    themes: ['beauty', 'colonialism', 'desire']
  },
  {
    chapter: 13,
    subtitle: '失明中的洞察与上校之死',
    phase: '衰败前夜',
    summary: '乌尔苏拉在失明中看清家族循环，上校在小金鱼的重复劳动中走完战争之后的孤独。',
    keywords: ['乌尔苏拉失明', '上校之死', '小金鱼', '重复', '家族循环'],
    characters: ['ursula-iguaran', 'aureliano-buendia-colonel', 'fernanda-del-carpio', 'aureliano-segundo', 'meme'],
    motifs: ['gold-fish', 'death', 'memory', 'solitude', 'family'],
    themes: ['aging', 'memory', 'repetition']
  },
  {
    chapter: 14,
    subtitle: '阿玛兰妲之死与黄蝴蝶',
    phase: '衰败期',
    summary: '阿玛兰妲从容赴死，梅梅与马乌里肖的黄蝴蝶爱情则在费尔南达的规训中走向枪声。',
    keywords: ['阿玛兰妲之死', '梅梅', '马乌里肖', '黄蝴蝶', '禁闭'],
    characters: ['amaranta', 'meme', 'mauricio-babilonia', 'fernanda-del-carpio', 'ursula-iguaran', 'aureliano-segundo'],
    motifs: ['yellow-butterflies', 'death', 'desire', 'solitude', 'family'],
    themes: ['death', 'love', 'discipline']
  },
  {
    chapter: 15,
    subtitle: '香蕉园大屠杀',
    phase: '历史创伤期',
    summary: '梅梅沉默、婴儿奥雷里亚诺归来、工人大罢工和车站屠杀，使历史创伤进入官方否认和集体遗忘。',
    keywords: ['香蕉园大屠杀', '罢工', '运尸火车', '三千人', '官方否认'],
    characters: ['meme', 'mauricio-babilonia', 'fernanda-del-carpio', 'jose-arcadio-segundo', 'aureliano-segundo', 'mr-brown'],
    motifs: ['banana-company', 'train', 'rain', 'war', 'memory', 'death'],
    themes: ['massacre', 'memory', 'historical-trauma']
  },
  {
    chapter: 16,
    subtitle: '雨下了四年十一个月零两天',
    phase: '衰败期',
    summary: '香蕉园大屠杀之后，马孔多进入漫长暴雨与集体遗忘，时间被潮湿和衰败囚禁。',
    keywords: ['雨', '遗忘', '衰败', '香蕉公司', '时间停滞'],
    characters: ['ursula-iguaran', 'aureliano-segundo', 'jose-arcadio-segundo', 'fernanda-del-carpio', 'petra-cotes'],
    motifs: ['rain', 'solitude', 'memory', 'decay', 'time'],
    themes: ['memory', 'decay', 'historical-trauma']
  },
  {
    chapter: 17,
    subtitle: '乌尔苏拉之死与双胞胎误葬',
    phase: '衰败期',
    summary: '雨停后的热风、乌尔苏拉之死、丽贝卡死亡和双胞胎误葬，把家族时间推入不可挽回的混乱。',
    keywords: ['乌尔苏拉之死', '热风', '丽贝卡', '双胞胎误葬', '羊皮卷'],
    characters: ['ursula-iguaran', 'aureliano-segundo', 'jose-arcadio-segundo', 'petra-cotes', 'fernanda-del-carpio', 'aureliano-babilonia', 'amaranta-ursula'],
    motifs: ['rain', 'death', 'memory', 'family', 'parchment'],
    themes: ['death', 'memory', 'inheritance']
  },
  {
    chapter: 18,
    subtitle: '守护者离去与家宅空洞',
    phase: '空屋期',
    summary: '桑塔索菲亚离开、费尔南达死亡、何塞·阿尔卡蒂奥归来又被杀，家宅在蚂蚁和遗忘中空洞化。',
    keywords: ['桑塔索菲亚', '费尔南达之死', '何塞·阿尔卡蒂奥', '红蚂蚁', '羊皮卷'],
    characters: ['santa-sofia-de-la-piedad', 'jose-arcadio-rome', 'fernanda-del-carpio', 'aureliano-babilonia', 'melquiades'],
    motifs: ['parchment', 'ants', 'memory', 'death', 'solitude', 'family'],
    themes: ['abandonment', 'decay', 'reading']
  },
  {
    chapter: 19,
    subtitle: '阿玛兰妲·乌尔苏拉归来',
    phase: '末世复兴期',
    summary: '阿玛兰妲·乌尔苏拉带来最后一次复兴幻梦，奥雷里亚诺在文学、欲望和身世疑云中走向禁忌爱情。',
    keywords: ['阿玛兰妲·乌尔苏拉', '加斯通', '加泰罗尼亚智者', '禁忌爱情', '金童乐园'],
    characters: ['amaranta-ursula', 'aureliano-babilonia', 'gaston', 'catalan-wise-man', 'pilar-ternera', 'nigromanta'],
    motifs: ['ants', 'desire', 'memory', 'family', 'pig-tail', 'solitude'],
    themes: ['return', 'love', 'literature']
  },
  {
    chapter: 20,
    subtitle: '羊皮卷破译与飓风终结',
    phase: '终结期',
    summary: '最后的奥雷里亚诺破译羊皮卷，家族历史与文本同时闭合，马孔多被飓风抹去。',
    keywords: ['羊皮卷', '飓风', '终结', '孤独', '元叙事'],
    characters: ['aureliano-babilonia', 'amaranta-ursula', 'melquiades', 'catalan-wise-man', 'gaston', 'pilar-ternera'],
    motifs: ['solitude', 'parchment', 'hurricane', 'ants', 'pig-tail', 'mirror'],
    themes: ['ending', 'fate', 'metafiction']
  }
];

const articleSources = {
  1: '章节解读/《百年孤独》章节分析-第一章全面深度分析.md',
  2: '章节解读/《百年孤独》章节分析-第二章全面深度分析.md',
  3: '章节解读/《百年孤独》章节分析-第三章全面深度分析.md',
  4: '章节解读/《百年孤独》章节分析-第四章全面深度分析.md',
  5: '章节解读/《百年孤独》章节分析-第五章深度分析.md',
  6: '章节解读/《百年孤独》章节分析-第六章深度分析.md',
  7: '章节解读/《百年孤独》章节分析-第七章深度分析.md',
  8: '章节解读/《百年孤独》章节分析-第八章深度分析.md',
  9: '章节解读/《百年孤独》章节分析-第九章深度分析-孤独的永恒象征与虚无的觉醒.md',
  10: '章节解读/《百年孤独》章节分析-第十章深度分析-身份的错位与生命的狂欢.md',
  11: '章节解读/《百年孤独》章节分析-第十一章深度解读：外来秩序的入侵与命运的预言.md',
  12: '章节解读/《百年孤独》章节分析-第十二章深度解读：升天与屠杀的对位.md',
  13: '章节解读/《百年孤独》章节分析-第十三章深度解读：失明中的洞察与平静的死亡.md',
  14: '章节解读/《百年孤独》章节分析-第十四章深度解读：死亡的从容与爱情的疯狂.md',
  15: '章节解读/《百年孤独》章节分析-第十五章深度解读：历史的掩盖与见证的孤独.md',
  16: '章节解读/《百年孤独》章节分析-第十六章深度解读：时间的囚禁与生命的韧性.md',
  17: '章节解读/《百年孤独》章节分析-第十七章深度解读：死亡的尊严与暮年的真爱.md',
  18: '章节解读/《百年孤独》章节分析-第十八章深度解读：守护者的离去与执念的毁灭.md',
  19: '章节解读/《百年孤独》章节分析-第十九章深度解读：复兴的短暂与爱情的宿命.md',
  20: '章节解读/《百年孤独》章节分析-第二十章深度解读：终结的循环与永恒的孤独.md'
};

const characterSeed = [
  ['jose-arcadio-buendia', 'jose-arcadio-buendia', '何塞·阿尔卡蒂奥·布恩迪亚', ['创始人', '老布恩迪亚'], 1, 'founder', '马孔多创始人', '科学狂热、迁徙梦和家族孤独的第一代源头。', ['ice', 'time', 'family', 'solitude']],
  ['ursula-iguaran', 'ursula-iguaran', '乌尔苏拉·伊瓜兰', ['乌尔苏拉'], 1, 'female-pillar', '家族支柱', '贯穿七代的母系守护者，以劳动、记忆和现实感支撑布恩迪亚家。', ['family', 'memory', 'rain', 'solitude']],
  ['melquiades', 'melquiades', '梅尔基亚德斯', ['吉卜赛人', '羊皮卷书写者'], 1, 'outsider', '时间之外的书写者', '带来科学、魔法、文字和预言的外来智者。', ['parchment', 'time', 'memory']],
  ['aureliano-buendia-colonel', 'aureliano-buendia-colonel', '奥雷里亚诺·布恩迪亚上校', ['奥雷里亚诺上校'], 2, 'aureliano-line', '战争与孤独的化身', '从冰块记忆走向三十二场战争，又回到小金鱼循环的孤独者。', ['war', 'gold-fish', 'solitude', 'rain']],
  ['jose-arcadio', 'jose-arcadio', '何塞·阿尔卡蒂奥', ['长子'], 2, 'jose-arcadio-line', '身体、欲望与出走', '创始夫妻的长子，代表外向身体、冲动出走和不可驯服的归来。', ['family', 'desire', 'solitude']],
  ['pilar-ternera', 'pilar-ternera', '庇拉尔·特尔内拉', ['庇拉尔'], 1, 'oracle', '欲望与纸牌的预言者', '在欲望、占卜和家族血脉之间反复充当命运中介。', ['desire', 'family', 'solitude']],
  ['prudentio-aguilar', 'prudentio-aguilar', '普鲁邓希奥·阿基拉尔', ['普鲁邓希奥'], 1, 'ghost', '旧村罪责的鬼魂', '被长矛杀死后以孤独鬼魂推动创始夫妻离开旧村。', ['death', 'solitude', 'family']],
  ['rebecca', 'rebecca', '丽贝卡', ['丽贝卡'], 2, 'outsider', '食土者与被放逐者', '带着骨殖来到布恩迪亚家，在爱情、吃土和幽闭中成为外来者。', ['memory', 'death', 'desire', 'family']],
  ['arcadio', 'arcadio', '阿尔卡蒂奥', ['何塞·阿尔卡蒂奥第二代'], 3, 'jose-arcadio-line', '被遮蔽身世的独裁者', '庇拉尔与长子的儿子，在权力幻觉中复制战争暴力。', ['power', 'war', 'family']],
  ['amaranta', 'amaranta', '阿玛兰妲', ['阿玛兰妲'], 2, 'female-line', '拒绝与自我惩罚者', '以拒绝、怨恨和孤独守住一生未完成的爱情。', ['desire', 'death', 'solitude']],
  ['remedios-moscote', 'remedios-moscote', '蕾梅黛丝·摩斯科特', ['小蕾梅黛丝'], 2, 'moscote-line', '纯真短暂的新娘', '奥雷里亚诺等待长大的新娘，她的死亡改变战争前夜的家庭温度。', ['death', 'family']],
  ['pietro-crespi', 'pietro-crespi', '皮埃特罗·克雷斯皮', ['皮埃特罗'], 2, 'outsider', '音乐与礼仪的来客', '自动钢琴技师，把舞步、礼仪和爱情病带入布恩迪亚家。', ['music', 'desire']],
  ['apolinar-moscote', 'apolinar-moscote', '堂阿波利纳尔·摩斯科特', ['摩斯科特'], 1, 'state-agent', '政府秩序进入马孔多的代表', '以地方官身份把外部国家权力带入原本自治的马孔多。', ['power', 'family']],
  ['gerineldo-marquez', 'gerineldo-marquez', '赫里内勒多·马尔克斯', ['赫里内勒多'], 2, 'war-companion', '战争中的温柔见证者', '上校的战友和阿玛兰妲的求爱者，最早听见战争虚无的雨声。', ['war', 'rain', 'solitude']],
  ['jose-arcadio-segundo', 'jose-arcadio-segundo', '何塞·阿尔卡蒂奥第二', ['双胞胎之一'], 4, 'jose-arcadio-line', '大屠杀的幸存见证者', '从航路、斗鸡和工人运动走向羊皮卷房间，守住被否认的三千死者。', ['banana-company', 'train', 'memory', 'parchment']],
  ['aureliano-segundo', 'aureliano-segundo', '奥雷里亚诺第二', ['双胞胎之一'], 4, 'aureliano-line', '财富狂欢与衰败承担者', '在佩特拉的繁殖魔力、费尔南达的规训和暴雨贫困之间摇摆。', ['desire', 'rain', 'family']],
  ['santa-sofia-de-la-piedad', 'santa-sofia-de-la-piedad', '桑塔索菲亚·德拉·彼达', ['桑塔索菲亚'], 3, 'caretaker', '沉默的家宅守护者', '长期照料布恩迪亚家，最后在家宅空洞化前无声离去。', ['family', 'solitude', 'memory']],
  ['remedios-the-beauty', 'remedios-the-beauty', '美人儿蕾梅黛丝', ['美人儿'], 4, 'female-line', '致命而无辜的美', '以不理解欲望的纯洁引发迷狂，并以升天离开马孔多秩序。', ['desire', 'death', 'solitude']],
  ['fernanda-del-carpio', 'fernanda-del-carpio', '费尔南达·德尔·卡皮奥', ['费尔南达'], 4, 'foreign-order', '礼仪与禁闭秩序的代表', '把贵族幻觉、宗教规训和家庭遮蔽带入布恩迪亚家。', ['family', 'power', 'solitude']],
  ['petra-cotes', 'petra-cotes', '佩特拉·科特斯', ['佩特拉'], 4, 'life-force', '繁殖力与温情的化身', '让牲畜和财富疯狂繁殖，又在衰败中与奥雷里亚诺第二相互扶持。', ['desire', 'rain', 'family']],
  ['meme', 'meme', '梅梅', ['蕾娜塔·蕾梅黛丝'], 5, 'female-line', '被沉默封存的女儿', '在黄蝴蝶爱情与费尔南达禁闭之间被送入终生沉默。', ['yellow-butterflies', 'desire', 'solitude']],
  ['mauricio-babilonia', 'mauricio-babilonia', '马乌里肖·巴比伦', ['马乌里肖'], 5, 'outsider', '黄蝴蝶环绕的恋人', '以黄色蝴蝶成为梅梅爱情的标记，也以枪伤终止这段关系。', ['yellow-butterflies', 'desire', 'death']],
  ['aureliano-babilonia', 'aureliano-babilonia', '奥雷里亚诺·巴比伦', ['最后的奥雷里亚诺'], 6, 'aureliano-line', '最后的破译者', '在密室、书店和禁忌爱情中走到羊皮卷的最终阅读。', ['parchment', 'ants', 'pig-tail', 'solitude']],
  ['amaranta-ursula', 'amaranta-ursula', '阿玛兰妲·乌尔苏拉', ['最后的阿玛兰妲'], 6, 'female-line', '最后的复兴者', '带着欧洲行李和青春精力返乡，制造马孔多最后一次复兴幻梦。', ['ants', 'desire', 'family']],
  ['jose-arcadio-rome', 'jose-arcadio-rome', '何塞·阿尔卡蒂奥（罗马归来）', ['罗马归来的何塞·阿尔卡蒂奥'], 5, 'jose-arcadio-line', '体面幻觉的继承者', '被寄望成为教皇，却在返乡后暴露空洞、孤独和暴力结局。', ['family', 'death', 'solitude']],
  ['gaston', 'gaston', '加斯通', ['加斯通'], 6, 'outsider', '航空计划与温和退场者', '阿玛兰妲·乌尔苏拉的丈夫，以航空计划和书信延宕留在故事边缘。', ['train', 'time', 'solitude']],
  ['catalan-wise-man', 'catalan-wise-man', '加泰罗尼亚智者', ['智者', '书店老人'], 6, 'literary-guide', '末世书店的文学导师', '在古籍书店中引导最后的奥雷里亚诺进入文学和世界末日的阅读。', ['memory', 'parchment', 'solitude']],
  ['mr-brown', 'mr-brown', '布朗先生', ['布朗'], 4, 'company-agent', '香蕉公司权力代表', '以公司、律师和雨季操控马孔多的殖民秩序。', ['banana-company', 'rain', 'power']],
  ['nigromanta', 'nigromanta', '尼格罗曼妲', ['尼格罗曼妲'], 6, 'outsider', '末世欲望的照料者', '在奥雷里亚诺的情欲启蒙和最后痛苦中提供短暂庇护。', ['desire', 'solitude']]
];

const motifSeed = [
  ['ice', 'ice', '冰块', '冰块是科学启蒙、童年奇迹和时间凝固的起源意象。', 1, ['科学启蒙', '童年奇迹', '时间凝固']],
  ['solitude', 'solitude', '孤独', '孤独是布恩迪亚家族的存在本质，也是全书循环的终极命名。', 1, ['存在本质', '家族诅咒', '人类处境']],
  ['time', 'time', '时间', '时间在小说中折叠、回旋、停滞，并最终被羊皮卷压缩到同一瞬间。', 1, ['圆形时间', '预叙', '循环']],
  ['family', 'family', '家族', '家族以血脉、名字、禁忌和重复构成百年循环的容器。', 1, ['血脉传承', '名字重复', '乱伦禁忌']],
  ['pig-tail', 'pig-tail', '猪尾巴', '猪尾巴是近亲恐惧的身体化预言，直到终章才彻底应验。', 2, ['乱伦诅咒', '身体预言', '家族终结']],
  ['mirror', 'mirror', '镜子', '镜子连接马孔多命名、幻觉之城和终章中会说话的命运文本。', 2, ['虚幻', '自我认知', '镜子之城']],
  ['insomnia', 'insomnia', '失眠症', '失眠症把清醒变成遗忘危机，迫使马孔多人给世界贴上标签。', 3, ['记忆危机', '语言标签', '集体遗忘']],
  ['memory', 'memory', '记忆与遗忘', '记忆与遗忘贯穿失眠症、香蕉园大屠杀、羊皮卷和末世阅读。', 3, ['历史书写', '集体失忆', '见证']],
  ['music', 'music', '音乐与自动机械', '自动钢琴、手风琴和发条玩具让现代器物以魔法般方式进入马孔多。', 4, ['现代性', '机械魔法', '舞会']],
  ['death', 'death', '死亡', '死亡在马孔多既是日常事件，也是家族记忆与时间边界的显影。', 4, ['葬礼', '预告', '告别']],
  ['desire', 'desire', '欲望与爱情', '欲望是布恩迪亚家族对抗孤独的方式，也常把人物推向毁灭。', 2, ['情欲', '禁忌', '生命力']],
  ['war', 'war', '战争', '战争把理想、权力、暴力和虚无纠缠为上校一生的巨大循环。', 5, ['暴力循环', '革命异化', '虚无']],
  ['power', 'power', '权力', '权力以政府、独裁、公司和家庭规训多次侵入马孔多。', 3, ['外部秩序', '独裁', '规训']],
  ['gold-fish', 'gold-fish', '小金鱼', '小金鱼是上校战后孤独劳动和循环虚无的精确象征。', 7, ['重复劳动', '孤独艺术', '战争余烬']],
  ['train', 'train', '火车', '火车带来香蕉公司、外来商品和屠杀后的运尸黑夜。', 10, ['现代性', '殖民通道', '运尸火车']],
  ['banana-company', 'banana-company', '香蕉公司', '香蕉公司将新殖民秩序、法律诡辩和历史抹除压进马孔多。', 11, ['殖民资本', '法律诡辩', '历史创伤']],
  ['yellow-butterflies', 'yellow-butterflies', '黄色蝴蝶', '黄色蝴蝶围绕马乌里肖与梅梅，成为爱情和灾难的双重预兆。', 12, ['爱情标记', '死亡预兆', '秘密幽会']],
  ['rain', 'rain', '雨', '雨是孤独、遗忘、历史创伤和时间停滞的复合意象。', 9, ['孤独', '遗忘', '时间停滞']],
  ['decay', 'decay', '衰败', '衰败让家宅、街道、器物和记忆一起腐烂，直到自然重新占领马孔多。', 16, ['家宅腐朽', '物质崩坏', '末世']],
  ['parchment', 'parchment', '羊皮卷', '羊皮卷是命运、预言、元叙事和阅读本身的最终装置。', 1, ['命运文本', '元叙事', '破译']],
  ['ants', 'ants', '红蚂蚁', '红蚂蚁是自然反攻与家族终结的微小军队。', 18, ['自然反攻', '家宅崩塌', '终结']],
  ['hurricane', 'hurricane', '飓风', '飓风在终章抹去马孔多，使阅读、预言和毁灭同时完成。', 20, ['终结', '抹除', '启示录']]
];

function padChapter(chapter) {
  return String(chapter).padStart(2, '0');
}

function chapterTitle(chapter) {
  return `${chapterNames[chapter]}章`;
}

function chapterReadingSlug(chapter) {
  return `chapter-${padChapter(chapter)}-deep-reading`;
}

function sourceTimelinePath(chapter) {
  return `情节顺序/《百年孤独》${chapterNames[chapter]}章完整时间顺序主要事件情节.md`;
}

function ensureDir(dir) {
  fs.mkdirSync(path.join(root, dir), { recursive: true });
}

function cleanMarkdownDir(dir) {
  const absolute = path.join(root, dir);
  ensureDir(dir);
  for (const file of fs.readdirSync(absolute)) {
    if (file.endsWith('.md') || file.endsWith('.mdx')) {
      fs.rmSync(path.join(absolute, file));
    }
  }
}

function readSource(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function yamlValue(value, indent = 0) {
  const pad = ' '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return `\n${value.map((item) => `${pad}- ${yamlScalar(item)}`).join('\n')}`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    return `\n${entries.map(([key, nested]) => `${pad}${key}: ${yamlValue(nested, indent + 2)}`).join('\n')}`;
  }
  return yamlScalar(value);
}

function yamlScalar(value) {
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(String(value));
}

function frontmatter(data) {
  return `---\n${Object.entries(data)
    .map(([key, value]) => `${key}: ${yamlValue(value, 2)}`)
    .join('\n')}\n---\n\n`;
}

function writeMarkdown(relativePath, data, body) {
  const target = path.join(root, relativePath);
  ensureDir(path.dirname(relativePath));
  fs.writeFileSync(target, `${frontmatter(data)}${body.trim()}\n`, 'utf8');
}

function firstMarkdownHeading(markdown, fallback) {
  const heading = markdown.split('\n').find((line) => line.startsWith('# '));
  return heading ? heading.replace(/^#\s+/, '').trim() : fallback;
}

function extractSection(markdown, patterns) {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => /^##\s+/.test(line) && patterns.some((pattern) => pattern.test(line)));
  if (start < 0) return '';
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join('\n').trim();
}

function paragraphsFromBlock(block) {
  return block
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join('')
    )
    .filter(Boolean);
}

function compactText(value) {
  return value.replace(/[#*_>`|]/g, '').replace(/\s+/g, ' ').trim();
}

function summaryFromBlock(block, fallback) {
  const paragraphs = paragraphsFromBlock(block)
    .map(compactText)
    .filter((paragraph) => paragraph && !/^[-\d.、]+$/.test(paragraph));
  const summary = paragraphs.find((paragraph) => !/^###\s+/.test(paragraph)) ?? fallback;
  return trimSentence(summary, fallback);
}

function trimSentence(value, fallback) {
  const clean = compactText(value || fallback);
  if (clean.length <= 96) return clean;
  const sentenceEnd = clean.search(/[。！？]/);
  if (sentenceEnd > 18 && sentenceEnd < 96) return clean.slice(0, sentenceEnd + 1);
  return `${clean.slice(0, 94)}…`;
}

function titleFromSummary(summary, order) {
  const clean = compactText(summary).replace(/[。！？]$/, '');
  const cut = clean.split(/[，；。]/)[0];
  const title = cut.length > 30 ? `${cut.slice(0, 28)}…` : cut;
  return title || `第 ${order} 条主线`;
}

function parseHeadingEvents(section) {
  const lines = section.split('\n');
  const items = [];
  let current = null;

  for (const line of lines) {
    const match = line.match(/^###\s+(?:\d+[.、]\s*)?(.+?)\s*$/);
    if (match) {
      if (current) items.push(current);
      current = { title: compactText(match[1]), block: [] };
      continue;
    }
    if (current) current.block.push(line);
  }
  if (current) items.push(current);

  return items.map((item) => ({
    title: item.title,
    summary: summaryFromBlock(item.block.join('\n'), item.title)
  }));
}

function parseNumberedListEvents(section) {
  return section
    .split('\n')
    .map((line) => line.trim().match(/^\d+[.、]\s+(.+?)\s*$/))
    .filter(Boolean)
    .map((match, index) => {
      const summary = trimSentence(match[1], `第 ${index + 1} 条主线`);
      return {
        title: titleFromSummary(summary, index + 1),
        summary
      };
    });
}

function firstParagraph(section) {
  const paragraph = paragraphsFromBlock(section)
    .map(compactText)
    .find((item) => item && !item.startsWith('###') && !item.startsWith('|') && !/^\d+[.、]/.test(item));
  return paragraph ?? '';
}

function parseEventsForChapter(chapter) {
  const markdown = readSource(sourceTimelinePath(chapter.chapter));

  if (chapter.chapter === 3) {
    const section = extractSection(markdown, [/整体时间线概览/]);
    return parseNumberedListEvents(section);
  }

  const overview = extractSection(markdown, [/时间线总览/]);
  if (overview) return parseHeadingEvents(overview);

  const causal = extractSection(markdown, [/关键因果链/]);
  const events = parseHeadingEvents(causal);
  const ending = extractSection(markdown, [/本章结尾的位置意义/]);
  const endingSummary = firstParagraph(ending);
  if (endingSummary) {
    events.push({
      title: '本章结尾的位置意义',
      summary: trimSentence(endingSummary, '本章结尾把主要线索收束到下一阶段的命运转折。')
    });
  }
  return events.length > 0 ? events : parseHeadingEvents(extractSection(markdown, [/按时间顺序排列的主要事件/])).slice(0, 12);
}

function inferIds(text, candidates, seed, fallback) {
  const clean = compactText(text);
  const map = new Map(seed.map((item) => [item.id, item]));
  const matches = candidates.filter((id) => {
    const item = map.get(id);
    if (!item) return false;
    return [item.name, ...(item.aliases ?? [])].some((label) => clean.includes(label));
  });
  return matches.length > 0 ? matches : fallback;
}

function relationDefaults() {
  return {
    spouse: [],
    children: [],
    parents: [],
    mentors: []
  };
}

const characterMap = new Map(
  characterSeed.map(([id, slug, name, aliases, generation, lineageType, role, summary, motifs]) => [
    id,
    { id, slug, name, aliases, generation, lineageType, role, summary, motifs }
  ])
);

const motifMap = new Map(
  motifSeed.map(([id, slug, name, summary, firstAppearanceChapter, coreMeanings]) => [
    id,
    { id, slug, name, summary, firstAppearanceChapter, coreMeanings }
  ])
);

const generated = chapters.map((chapter) => {
  const sourceEvents = parseEventsForChapter(chapter);
  const events = sourceEvents.slice(0, 12).map((event, index) => {
    const id = `chapter-${padChapter(chapter.chapter)}-${String(index + 1).padStart(2, '0')}`;
    const eventText = `${event.title} ${event.summary}`;
    return {
      id,
      chapter: chapter.chapter,
      order: index + 1,
      title: event.title,
      summary: event.summary,
      characters: inferIds(eventText, chapter.characters, [...characterMap.values()], chapter.characters.slice(0, 3)),
      motifs: inferIds(eventText, chapter.motifs, [...motifMap.values()], chapter.motifs.slice(0, 3)),
      themes: chapter.themes.slice(0, 3),
      relatedArticles: [chapterReadingSlug(chapter.chapter)]
    };
  });

  return { ...chapter, events };
});

cleanMarkdownDir('content/chapters');
cleanMarkdownDir('content/events');

for (const chapter of generated) {
  const chapterSlug = `chapter-${padChapter(chapter.chapter)}-${chapter.subtitle
    .toLowerCase()
    .replace(/[，。、《》：、\s]+/g, '-')
    .replace(/^-|-$/g, '')}`;
  writeMarkdown(
    `content/chapters/${padChapter(chapter.chapter)}.md`,
    {
      chapter: chapter.chapter,
      slug: chapterSlug,
      title: chapterTitle(chapter.chapter),
      subtitle: chapter.subtitle,
      phase: chapter.phase,
      summary: chapter.summary,
      keywords: chapter.keywords,
      events: chapter.events.map((event) => event.id),
      characters: chapter.characters,
      motifs: chapter.motifs,
      relatedArticles: [chapterReadingSlug(chapter.chapter)],
      sourceVisibility: 'private'
    },
    `## 本章位置

${chapter.summary}

## 阅读地图说明

本页主线事件由 \`情节顺序/《百年孤独》${chapterNames[chapter.chapter]}章完整时间顺序主要事件情节.md\` 结构化而来。全量微事件继续保留在源资料中，本页只呈现适合阅读地图浏览的主要节点。`
  );

  for (const event of chapter.events) {
    writeMarkdown(
      `content/events/${event.id}.md`,
      {
        id: event.id,
        chapter: event.chapter,
        order: event.order,
        title: event.title,
        summary: event.summary,
        characters: event.characters,
        motifs: event.motifs,
        themes: event.themes,
        relatedArticles: event.relatedArticles
      },
      ''
    );
  }
}

for (const chapter of generated) {
  const articleSource = articleSources[chapter.chapter];
  const body = readSource(articleSource);
  const eventIds = chapter.events.map((event) => event.id);
  writeMarkdown(
    `content/articles/${chapterReadingSlug(chapter.chapter)}.md`,
    {
      title: firstMarkdownHeading(body, `《百年孤独》${chapterTitle(chapter.chapter)}深度解读`),
      slug: chapterReadingSlug(chapter.chapter),
      type: 'chapter-reading',
      status: 'published',
      visibility: 'public',
      date: '2026-06-03',
      summary: chapter.summary,
      chapters: [chapter.chapter],
      characters: chapter.characters,
      motifs: chapter.motifs,
      themes: chapter.themes,
      intertexts: [],
      events: eventIds,
      copyrightLevel: 'original-analysis',
      searchable: true
    },
    body
  );
}

const allEvents = generated.flatMap((chapter) => chapter.events);
const allArticleSlugs = generated.map((chapter) => chapterReadingSlug(chapter.chapter));

for (const character of characterMap.values()) {
  const relatedChapters = generated
    .filter((chapter) => chapter.characters.includes(character.id))
    .map((chapter) => chapter.chapter);
  const relatedArticles = generated
    .filter((chapter) => chapter.characters.includes(character.id))
    .map((chapter) => chapterReadingSlug(chapter.chapter));
  writeMarkdown(
    `content/characters/${character.slug}.md`,
    {
      id: character.id,
      slug: character.slug,
      name: character.name,
      aliases: character.aliases,
      generation: character.generation,
      lineageType: character.lineageType,
      role: character.role,
      summary: character.summary,
      chapters: relatedChapters,
      motifs: character.motifs,
      articles: relatedArticles,
      relations: relationDefaults()
    },
    `## 命运摘要

${character.summary}

## 阅读入口

这个人物档案先服务于章节阅读地图，关联章节与解读会随着内容图谱继续扩展。`
  );
}

for (const motif of motifMap.values()) {
  const relatedEvents = allEvents.filter((event) => event.motifs.includes(motif.id)).map((event) => event.id);
  const relatedChapters = generated.filter((chapter) => chapter.motifs.includes(motif.id)).map((chapter) => chapter.chapter);
  const relatedCharacters = [...characterMap.values()]
    .filter((character) => character.motifs.includes(motif.id))
    .map((character) => character.id);
  const relatedArticles = generated
    .filter((chapter) => chapter.motifs.includes(motif.id))
    .map((chapter) => chapterReadingSlug(chapter.chapter));
  writeMarkdown(
    `content/motifs/${motif.slug}.md`,
    {
      id: motif.id,
      slug: motif.slug,
      name: motif.name,
      summary: motif.summary,
      firstAppearanceChapter: motif.firstAppearanceChapter,
      keyChapters: relatedChapters,
      coreMeanings: motif.coreMeanings,
      characters: relatedCharacters,
      events: relatedEvents,
      articles: relatedArticles
    },
    `## 意象说明

${motif.summary}

## 阅读入口

这个意象档案用于串联章节、人物与解读文章。`
  );
}

console.log(`Generated ${generated.length} chapters, ${allEvents.length} events, ${allArticleSlugs.length} chapter articles.`);
