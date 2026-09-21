import fs from 'node:fs';
import path from 'node:path';
import { root, categories } from './build-blog.mjs';

const [title, category = 'Developer'] = process.argv.slice(2);
if (!title || !Object.hasOwn(categories,category)) {
  console.error('Usage: npm run new:article -- "My article title" "Developer"\nCategories: Developer, Alumni, Art Manager');
  process.exit(1);
}
const slug = title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
if(!slug) throw new Error('Use at least one letter or number in the title');
const date = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Singapore',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const filename = path.join(root,'_articles',slug+'.md');
fs.writeFileSync(filename,`---\ntitle: ${JSON.stringify(title)}\ndate: "${date}"\ncategory: ${JSON.stringify(category)}\nexcerpt: "A short summary for the article card."\npublished: false\n---\n\nWrite your introduction here.\n\n## A section heading\n\nWrite your article here.\n`,{flag:'wx'});
console.log(`Created _articles/${slug}.md. Change published to true when ready.`);
