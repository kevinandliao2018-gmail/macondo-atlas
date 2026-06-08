import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const ensureDir = (dir) => fs.mkdirSync(path.join(root, dir), { recursive: true });

for (const dir of ['content/articles', 'content/chapters', 'content/characters', 'content/motifs', 'content/events']) {
  ensureDir(dir);
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

function writeMarkdown(target, data, body) {
  fs.writeFileSync(path.join(root, target), `${frontmatter(data)}${body.trim()}\n`, 'utf8');
}

function readSource(source) {
  return fs.readFileSync(path.join(root, source), 'utf8');
}

const articles = [
  {
    target: 'content/articles/chapter-01-deep-reading.md',
    source: '章节解读/《百年孤独》章节分析-第一章全面深度分析.md',
    data: {
      title: '《百年孤独》第一章全面深度分析：由冰块开始，到冰块结束',
      slug: 'chapter-01-deep-reading',
      type: 'chapter-reading',
      status: 'published',
      visibility: 'public',
      date: '2026-06-02',
      summary: '从开篇的行刑队回忆、马孔多创世、冰块意象和家族原型进入全书的循环结构。',
      chapters: [1],
      characters: ['jose-arcadio-buendia', 'ursula-iguaran', 'melquiades', 'aureliano-buendia-colonel'],
      motifs: ['ice', 'solitude'],
      themes: ['time', 'genesis', 'family'],
      intertexts: ['bible-genesis'],
      events: ['colonel-remembers-ice', 'macondo-founded', 'ice-discovery'],
      copyrightLevel: 'original-analysis',
      searchable: true
    }
  },
  {
    target: 'content/articles/chapter-16-deep-reading.md',
    source: '章节解读/《百年孤独》章节分析-第十六章深度解读：时间的囚禁与生命的韧性.md',
    data: {
      title: '《百年孤独》第十六章深度解读：时间的囚禁与生命的韧性',
      slug: 'chapter-16-deep-reading',
      type: 'chapter-reading',
      status: 'published',
      visibility: 'public',
      date: '2026-06-02',
      summary: '解析四年十一个月零两天的大雨如何把马孔多带入潮湿、遗忘和衰败的停滞时间。',
      chapters: [16],
      characters: ['ursula-iguaran', 'aureliano-segundo', 'jose-arcadio-segundo'],
      motifs: ['rain', 'solitude'],
      themes: ['memory', 'decay', 'historical-trauma'],
      intertexts: [],
      events: ['four-year-rain', 'ursula-leeches', 'rain-stops'],
      copyrightLevel: 'original-analysis',
      searchable: true
    }
  },
  {
    target: 'content/articles/chapter-20-deep-reading.md',
    source: '章节解读/《百年孤独》章节分析-第二十章深度解读：终结的循环与永恒的孤独.md',
    data: {
      title: '《百年孤独》第二十章深度解读：终结的循环与永恒的孤独',
      slug: 'chapter-20-deep-reading',
      type: 'chapter-reading',
      status: 'published',
      visibility: 'public',
      date: '2026-06-02',
      summary: '从羊皮卷破译、最后的爱情、猪尾巴婴儿和飓风终结理解全书的闭环。',
      chapters: [20],
      characters: ['aureliano-babilonia', 'amaranta-ursula', 'melquiades'],
      motifs: ['solitude', 'parchment', 'hurricane'],
      themes: ['ending', 'fate', 'metafiction'],
      intertexts: [],
      events: ['parchment-deciphered', 'macondo-hurricane'],
      copyrightLevel: 'original-analysis',
      searchable: true
    }
  },
  {
    target: 'content/articles/ursula-century-guardian.md',
    source: '人物分析/《百年孤独》人物分析第一代乌尔苏拉·伊瓜兰.md',
    data: {
      title: '在黑暗中看见：乌尔苏拉·伊瓜兰的百年守护',
      slug: 'ursula-century-guardian',
      type: 'character-study',
      status: 'published',
      visibility: 'public',
      date: '2026-06-02',
      summary: '从“我就去死”到“雨停了就死”，理解乌尔苏拉作为家族支柱和时间见证者的一生。',
      chapters: [1, 2, 13, 16, 17],
      characters: ['ursula-iguaran', 'jose-arcadio-buendia'],
      motifs: ['rain', 'solitude'],
      themes: ['family', 'female-pillar', 'time'],
      intertexts: [],
      events: ['macondo-founded', 'ursula-leeches', 'rain-stops'],
      copyrightLevel: 'original-analysis',
      searchable: true
    }
  },
  {
    target: 'content/articles/macondo-rain-solitude-return.md',
    source: '马孔多在下雨/马孔多在下雨的隐喻v3.0.md',
    data: {
      title: '马孔多在下雨的隐喻',
      slug: 'macondo-rain-solitude-return',
      type: 'motif-essay',
      status: 'published',
      visibility: 'public',
      date: '2026-06-02',
      summary: '以“马孔多在下雨”为入口，进入雨、孤独、战争异化、语言失效和回归渴望。',
      chapters: [9, 16],
      characters: ['gerineldo-marquez', 'aureliano-buendia-colonel'],
      motifs: ['rain', 'solitude'],
      themes: ['war', 'memory', 'communication-failure'],
      intertexts: [],
      events: ['macondo-rain-telegram', 'four-year-rain'],
      canonical: 'macondo-rain-solitude-return',
      previousVersions: ['macondo-rain-v1', 'macondo-rain-v2'],
      copyrightLevel: 'original-analysis',
      searchable: true
    }
  },
  {
    target: 'content/articles/ice-memory-latin-america.md',
    source: '文章/冰块、记忆与拉丁美洲的孤独：从《百年孤独》到马尔克斯的文学人生.md',
    data: {
      title: '冰块、记忆与拉丁美洲的孤独：从《百年孤独》到马尔克斯的文学人生',
      slug: 'ice-memory-latin-america',
      type: 'motif-essay',
      status: 'published',
      visibility: 'public',
      date: '2026-06-02',
      summary: '从冰块的触感、童年记忆、拉美历史和马尔克斯写作人生理解《百年孤独》的起源意象。',
      chapters: [1, 15],
      characters: ['jose-arcadio-buendia', 'aureliano-buendia-colonel'],
      motifs: ['ice', 'solitude'],
      themes: ['memory', 'latin-america', 'writing'],
      intertexts: [],
      events: ['colonel-remembers-ice', 'ice-discovery'],
      copyrightLevel: 'original-analysis',
      searchable: true
    }
  },
  {
    target: 'content/articles/macondo-grand-view-garden.md',
    source: '马孔多与大观园/当大观园遇见马孔多：两个文学空间的百年对话.md',
    data: {
      title: '当大观园遇见马孔多：两个文学空间的百年对话',
      slug: 'macondo-grand-view-garden',
      type: 'intertext-study',
      status: 'published',
      visibility: 'public',
      date: '2026-06-02',
      summary: '比较马孔多与大观园作为文学空间如何承载家族衰败、文明记忆与叙事舞台。',
      chapters: [1, 20],
      characters: ['ursula-iguaran'],
      motifs: ['solitude'],
      themes: ['space', 'intertext', 'family-decline'],
      intertexts: ['dream-of-the-red-chamber', 'grand-view-garden'],
      events: ['macondo-founded', 'macondo-hurricane'],
      copyrightLevel: 'original-analysis',
      searchable: true
    }
  }
];

for (const article of articles) {
  writeMarkdown(article.target, article.data, readSource(article.source));
}

const chapters = [
  {
    file: 'content/chapters/01.md',
    data: {
      chapter: 1,
      slug: 'chapter-01-ice-and-genesis',
      title: '第一章',
      subtitle: '由冰块开始，到冰块结束',
      phase: '创世期',
      summary: '马孔多仍处于万物未命名的原初状态，冰块、吉卜赛人和家族原型共同启动全书循环。',
      keywords: ['冰块', '创世', '时间折叠', '梅尔基亚德斯', '马孔多'],
      events: ['colonel-remembers-ice', 'macondo-founded', 'ice-discovery'],
      characters: ['jose-arcadio-buendia', 'ursula-iguaran', 'melquiades', 'aureliano-buendia-colonel'],
      motifs: ['ice', 'solitude'],
      relatedArticles: ['chapter-01-deep-reading', 'ice-memory-latin-america', 'macondo-grand-view-garden'],
      sourceVisibility: 'private'
    },
    body: '## 本章位置\n\n第一章是马孔多的创世档案，也是全书时间结构的起点。行刑队、童年、冰块和父亲的形象在开篇被折叠到同一个下午。'
  },
  {
    file: 'content/chapters/16.md',
    data: {
      chapter: 16,
      slug: 'chapter-16-four-year-rain',
      title: '第十六章',
      subtitle: '雨下了四年十一个月零两天',
      phase: '衰败期',
      summary: '香蕉园大屠杀之后，马孔多进入漫长暴雨与集体遗忘，时间被潮湿和衰败囚禁。',
      keywords: ['雨', '遗忘', '衰败', '香蕉公司', '时间停滞'],
      events: ['four-year-rain', 'ursula-leeches', 'rain-stops'],
      characters: ['ursula-iguaran', 'aureliano-segundo', 'jose-arcadio-segundo'],
      motifs: ['rain', 'solitude'],
      relatedArticles: ['chapter-16-deep-reading', 'macondo-rain-solitude-return'],
      sourceVisibility: 'private'
    },
    body: '## 本章位置\n\n第十六章将大屠杀之后的历史创伤转化为漫长雨季。雨不是背景，而是占领马孔多、腐蚀家宅和洗去记忆的物质力量。'
  },
  {
    file: 'content/chapters/20.md',
    data: {
      chapter: 20,
      slug: 'chapter-20-hurricane-ending',
      title: '第二十章',
      subtitle: '终结的循环与永恒的孤独',
      phase: '终结期',
      summary: '最后的奥雷里亚诺破译羊皮卷，家族历史与文本同时闭合，马孔多被飓风抹去。',
      keywords: ['羊皮卷', '飓风', '终结', '孤独', '元叙事'],
      events: ['parchment-deciphered', 'macondo-hurricane'],
      characters: ['aureliano-babilonia', 'amaranta-ursula', 'melquiades'],
      motifs: ['solitude', 'parchment', 'hurricane'],
      relatedArticles: ['chapter-20-deep-reading', 'macondo-grand-view-garden'],
      sourceVisibility: 'private'
    },
    body: '## 本章位置\n\n第二十章是预言与阅读重合的终章。羊皮卷不只是命运文本，也是小说自身的镜像。'
  }
];

for (const chapter of chapters) {
  writeMarkdown(chapter.file, chapter.data, chapter.body);
}

const characters = [
  {
    file: 'content/characters/ursula-iguaran.md',
    data: {
      id: 'ursula-iguaran',
      slug: 'ursula-iguaran',
      name: '乌尔苏拉·伊瓜兰',
      aliases: ['乌尔苏拉'],
      generation: 1,
      lineageType: 'female-pillar',
      role: '家族支柱',
      summary: '布恩迪亚家族的母系奠基人，贯穿七代的时间见证者。',
      chapters: [1, 2, 13, 16, 17],
      motifs: ['rain', 'solitude'],
      articles: ['ursula-century-guardian'],
      relations: {
        spouse: ['jose-arcadio-buendia'],
        children: ['jose-arcadio', 'aureliano-buendia-colonel', 'amaranta'],
        parents: [],
        mentors: []
      }
    },
    body: '## 命运摘要\n\n乌尔苏拉以劳作、财富、记忆和意志支撑布恩迪亚家族。她晚年失明，却在黑暗中看清家族循环的真相。'
  },
  {
    file: 'content/characters/jose-arcadio-buendia.md',
    data: {
      id: 'jose-arcadio-buendia',
      slug: 'jose-arcadio-buendia',
      name: '何塞·阿尔卡蒂奥·布恩迪亚',
      aliases: ['创始人'],
      generation: 1,
      lineageType: 'jose-arcadio-line',
      role: '马孔多创始人',
      summary: '创立马孔多的族长，科学狂热、理想主义与孤独疯狂的源头人物。',
      chapters: [1, 2],
      motifs: ['ice', 'solitude'],
      articles: ['chapter-01-deep-reading'],
      relations: {
        spouse: ['ursula-iguaran'],
        children: ['jose-arcadio', 'aureliano-buendia-colonel', 'amaranta'],
        parents: [],
        mentors: ['melquiades']
      }
    },
    body: '## 命运摘要\n\n他从年轻族长变成被知识欲望吞噬的人，最终被绑在栗树下，成为家族循环的第一道阴影。'
  },
  {
    file: 'content/characters/aureliano-buendia-colonel.md',
    data: {
      id: 'aureliano-buendia-colonel',
      slug: 'aureliano-buendia-colonel',
      name: '奥雷里亚诺·布恩迪亚上校',
      aliases: ['奥雷里亚诺上校'],
      generation: 2,
      lineageType: 'aureliano-line',
      role: '战争与孤独的化身',
      summary: '面对行刑队时回想冰块的孩子，后来发动三十二场战争，并在小金鱼循环中耗尽自己。',
      chapters: [1, 5, 9, 17],
      motifs: ['ice', 'rain', 'solitude'],
      articles: ['chapter-01-deep-reading', 'macondo-rain-solitude-return'],
      relations: {
        spouse: [],
        children: [],
        parents: ['jose-arcadio-buendia', 'ursula-iguaran'],
        mentors: ['melquiades']
      }
    },
    body: '## 命运摘要\n\n奥雷里亚诺上校把孤独从童年的沉默带入政治和战争，又在战争之后回到纯粹重复的小金鱼劳动。'
  },
  {
    file: 'content/characters/melquiades.md',
    data: {
      id: 'melquiades',
      slug: 'melquiades',
      name: '梅尔基亚德斯',
      aliases: ['吉卜赛人', '羊皮卷书写者'],
      generation: 1,
      lineageType: 'outsider',
      role: '时间的编织者',
      summary: '带来发明、知识与羊皮卷的外来者，既是朋友、先知，也是文本命运的书写者。',
      chapters: [1, 3, 20],
      motifs: ['ice', 'parchment', 'solitude'],
      articles: ['chapter-01-deep-reading', 'chapter-20-deep-reading'],
      relations: {
        spouse: [],
        children: [],
        parents: [],
        mentors: []
      }
    },
    body: '## 命运摘要\n\n梅尔基亚德斯从外部世界把奇迹带入马孔多，也把马孔多的全部命运写入羊皮卷。'
  }
];

for (const character of characters) {
  writeMarkdown(character.file, character.data, character.body);
}

const motifs = [
  {
    file: 'content/motifs/rain.md',
    data: {
      id: 'rain',
      slug: 'rain',
      name: '雨',
      summary: '雨是孤独、遗忘、历史创伤和时间停滞的复合意象。',
      firstAppearanceChapter: 1,
      keyChapters: [9, 16, 17, 20],
      coreMeanings: ['孤独', '遗忘', '历史创伤', '时间停滞'],
      characters: ['gerineldo-marquez', 'aureliano-buendia-colonel', 'ursula-iguaran'],
      events: ['macondo-rain-telegram', 'four-year-rain', 'rain-stops'],
      articles: ['macondo-rain-solitude-return', 'chapter-16-deep-reading']
    },
    body: '## 意象说明\n\n雨在马孔多不是天气，而是语言失效、战争创伤和集体遗忘的水声。'
  },
  {
    file: 'content/motifs/ice.md',
    data: {
      id: 'ice',
      slug: 'ice',
      name: '冰块',
      summary: '冰块连接开篇记忆、童年惊奇、科学启蒙与文明寓言。',
      firstAppearanceChapter: 1,
      keyChapters: [1],
      coreMeanings: ['童年记忆', '科学启蒙', '时间凝固', '文明诱惑'],
      characters: ['jose-arcadio-buendia', 'aureliano-buendia-colonel', 'melquiades'],
      events: ['colonel-remembers-ice', 'ice-discovery'],
      articles: ['chapter-01-deep-reading', 'ice-memory-latin-america']
    },
    body: '## 意象说明\n\n冰块以冷的形式灼伤热带孩子的手，也让小说从第一句话开始拥有时间折叠的力量。'
  },
  {
    file: 'content/motifs/solitude.md',
    data: {
      id: 'solitude',
      slug: 'solitude',
      name: '孤独',
      summary: '孤独既是家族诅咒，也是人物、历史、语言与时间之间无法弥合的裂缝。',
      firstAppearanceChapter: 1,
      keyChapters: [1, 9, 16, 20],
      coreMeanings: ['家族诅咒', '存在处境', '历史隔绝', '语言断裂'],
      characters: ['ursula-iguaran', 'aureliano-buendia-colonel', 'melquiades'],
      events: ['macondo-rain-telegram', 'macondo-hurricane'],
      articles: ['chapter-20-deep-reading', 'macondo-rain-solitude-return']
    },
    body: '## 意象说明\n\n孤独不是单一情绪，而是布恩迪亚家族不断重复的存在结构。'
  }
];

for (const motif of motifs) {
  writeMarkdown(motif.file, motif.data, motif.body);
}

const events = [
  {
    file: 'content/events/chapter-01-01-colonel-remembers-ice.md',
    data: {
      id: 'colonel-remembers-ice',
      chapter: 1,
      order: 1,
      title: '行刑队前的奥雷里亚诺回想起冰块下午',
      summary: '未来、死亡和童年记忆被开篇一句话折叠在一起。',
      characters: ['aureliano-buendia-colonel', 'jose-arcadio-buendia'],
      motifs: ['ice', 'solitude'],
      themes: ['time'],
      relatedArticles: ['chapter-01-deep-reading']
    }
  },
  {
    file: 'content/events/chapter-01-02-macondo-founded.md',
    data: {
      id: 'macondo-founded',
      chapter: 1,
      order: 2,
      title: '迁徙者建立马孔多',
      summary: '寻找入海口失败后，何塞·阿尔卡蒂奥·布恩迪亚和同伴停下并建立村庄。',
      characters: ['jose-arcadio-buendia', 'ursula-iguaran'],
      motifs: ['solitude'],
      themes: ['genesis'],
      relatedArticles: ['chapter-01-deep-reading', 'macondo-grand-view-garden']
    }
  },
  {
    file: 'content/events/chapter-01-03-ice-discovery.md',
    data: {
      id: 'ice-discovery',
      chapter: 1,
      order: 3,
      title: '父亲带孩子见识冰块',
      summary: '冰块成为童年惊奇、科学启蒙和全书循环结构的起源意象。',
      characters: ['jose-arcadio-buendia', 'aureliano-buendia-colonel', 'melquiades'],
      motifs: ['ice'],
      themes: ['memory'],
      relatedArticles: ['chapter-01-deep-reading', 'ice-memory-latin-america']
    }
  },
  {
    file: 'content/events/chapter-16-01-four-year-rain.md',
    data: {
      id: 'four-year-rain',
      chapter: 16,
      order: 1,
      title: '大雨持续了四年十一个月零两天',
      summary: '雨把马孔多拖入灾年，也把大屠杀后的历史创伤变成潮湿的日常。',
      characters: ['ursula-iguaran', 'aureliano-segundo'],
      motifs: ['rain', 'solitude'],
      themes: ['historical-trauma'],
      relatedArticles: ['chapter-16-deep-reading', 'macondo-rain-solitude-return']
    }
  },
  {
    file: 'content/events/chapter-16-02-ursula-leeches.md',
    data: {
      id: 'ursula-leeches',
      chapter: 16,
      order: 2,
      title: '乌尔苏拉身上长满水蛭',
      summary: '雨灾侵入家族最老的身体，也侵入布恩迪亚家曾经最强韧的生命核心。',
      characters: ['ursula-iguaran'],
      motifs: ['rain'],
      themes: ['decay'],
      relatedArticles: ['chapter-16-deep-reading', 'ursula-century-guardian']
    }
  },
  {
    file: 'content/events/chapter-16-03-rain-stops.md',
    data: {
      id: 'rain-stops',
      chapter: 16,
      order: 3,
      title: '雨停后马孔多成为废墟',
      summary: '漫长雨季结束时，留下的是被冲坏的房屋、经济和记忆。',
      characters: ['ursula-iguaran', 'aureliano-segundo'],
      motifs: ['rain', 'solitude'],
      themes: ['memory'],
      relatedArticles: ['chapter-16-deep-reading']
    }
  },
  {
    file: 'content/events/chapter-20-01-parchment-deciphered.md',
    data: {
      id: 'parchment-deciphered',
      chapter: 20,
      order: 1,
      title: '奥雷里亚诺破译羊皮卷',
      summary: '阅读、预言和家族历史在最后时刻完全重合。',
      characters: ['aureliano-babilonia', 'melquiades'],
      motifs: ['parchment', 'solitude'],
      themes: ['metafiction'],
      relatedArticles: ['chapter-20-deep-reading']
    }
  },
  {
    file: 'content/events/chapter-20-02-macondo-hurricane.md',
    data: {
      id: 'macondo-hurricane',
      chapter: 20,
      order: 2,
      title: '马孔多被飓风抹去',
      summary: '当羊皮卷读到最后，家族与城镇一同被风从记忆中根除。',
      characters: ['aureliano-babilonia'],
      motifs: ['hurricane', 'solitude'],
      themes: ['ending'],
      relatedArticles: ['chapter-20-deep-reading', 'macondo-grand-view-garden']
    }
  }
];

for (const event of events) {
  writeMarkdown(event.file, event.data, '');
}

console.log(`Seeded ${articles.length} articles, ${chapters.length} chapters, ${characters.length} characters, ${motifs.length} motifs, ${events.length} events.`);
