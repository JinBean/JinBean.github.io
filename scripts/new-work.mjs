import fs from 'node:fs';
import path from 'node:path';
import { readWork, root } from './build-work.mjs';

const [title, category='Software development', section='project'] = process.argv.slice(2);
if(!title||!['featured','experience','project'].includes(section)){
  console.error('Usage: npm run new:work -- "Project title" "Category" "project"\nSections: featured, experience, project');
  process.exit(1);
}
const slug=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
if(!slug)throw new Error('Use at least one letter or number in the title');
const existing=readWork(root).filter(item=>item.section===section);
const order=existing.reduce((maximum,item)=>Math.max(maximum,item.order),0)+1;
const file=path.join(root,'_work-items',slug+'.md');
fs.writeFileSync(file,`---\ntitle: ${JSON.stringify(title)}\ncategory: ${JSON.stringify(category)}\nsection: ${JSON.stringify(section)}\norder: ${order}\nexcerpt: "A short summary for the Professional card."\npublished: false\n---\n\nWrite an introduction to the work here.\n\n## What I did\n\nDescribe the work, your role and the outcome.\n`,{flag:'wx'});
console.log(`Created _work-items/${slug}.md. Change published to true when ready.`);
