import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'public/data');
fs.mkdirSync(dataDir, { recursive: true });

const collections = ['articles', 'chapters', 'characters', 'motifs', 'events'];
const manifest = Object.fromEntries(
  collections.map((collection) => {
    const dir = path.join(root, 'content', collection);
    const count = fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => file.endsWith('.md') || file.endsWith('.mdx')).length : 0;
    return [collection, count];
  })
);

fs.writeFileSync(
  path.join(dataDir, 'manifest.json'),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      collections: manifest
    },
    null,
    2
  )
);

console.log('Generated public/data/manifest.json');
