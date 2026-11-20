import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

function readJsonFolder(folderRelPath) {
  const fullPath = path.join(rootDir, folderRelPath);
  if (!fs.existsSync(fullPath)) return [];

  const files = fs
    .readdirSync(fullPath)
    .filter((file) => file.endsWith('.json') && !file.endsWith('-manifest.json'))
    .sort()
    .reverse();

  const items = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(fullPath, file), 'utf8');
      items.push(JSON.parse(raw));
    } catch (err) {
      console.warn(`Skipping invalid JSON file ${file}:`, err.message);
    }
  }
  return items;
}

fs.mkdirSync(path.join(rootDir, 'data'), { recursive: true });

const newsItems = readJsonFolder('data/news');
const galleryItems = readJsonFolder('data/gallery');

fs.writeFileSync(
  path.join(rootDir, 'data/news-manifest.json'),
  JSON.stringify(newsItems, null, 2) + '\n',
  'utf8'
);

fs.writeFileSync(
  path.join(rootDir, 'data/gallery-manifest.json'),
  JSON.stringify(galleryItems, null, 2) + '\n',
  'utf8'
);

console.log(
  `Generated manifests: ${newsItems.length} news items, ${galleryItems.length} gallery items.`
);