import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { buildWork, root } from './build-work.mjs';

function fixture(t){
  const directory=fs.mkdtempSync(path.join(root,'.work-test-'));
  fs.cpSync(path.join(root,'_work'),path.join(directory,'_work'),{recursive:true});
  fs.cpSync(path.join(root,'_work-items'),path.join(directory,'_work-items'),{recursive:true});
  t.after(()=>{
    const resolved=path.resolve(directory);
    assert.equal(path.dirname(resolved),root);
    assert.ok(path.basename(resolved).startsWith('.work-test-'));
    fs.rmSync(resolved,{recursive:true,force:true});
  });
  return directory;
}
const entry=(extra='')=>`---\ntitle: "A useful project"\ncategory: "Accessibility"\nsection: "project"\norder: 20\nexcerpt: "A concise card description."\n${extra}\n---\n\nAn introduction.\n\n## What I did\n\n- Audited the interface\n- Improved the navigation\n`;
test('one Markdown file generates a work article and the correct listing section',t=>{
  const directory=fixture(t);
  fs.writeFileSync(path.join(directory,'_work-items/useful-project.md'),entry());
  const result=buildWork(directory);
  assert.equal(result.items,11);
  const article=fs.readFileSync(path.join(directory,'work/useful-project/index.html'),'utf8');
  assert.match(article,/<h2>What I did<\/h2>/);
  assert.match(article,/<ul>/);
  assert.match(article,/\.\.\/\.\.\/assets\/css\/site\.css/);
  const listing=fs.readFileSync(path.join(directory,'work.html'),'utf8');
  assert.match(listing,/A useful project/);
  assert.match(listing,/work\/useful-project\//);
  assert.ok(listing.indexOf('A useful project')>listing.indexOf('More Projects'));
});
test('featured metadata renders an image and drafts stay out of the site',t=>{
  const directory=fixture(t),file=path.join(directory,'_work-items/useful-project.md');
  fs.writeFileSync(file,entry('section: featured\nimage: "/images/example.jpg"\nimage_alt: "Example project"').replace('section: "project"\n',''));
  buildWork(directory);
  assert.match(fs.readFileSync(path.join(directory,'work.html'),'utf8'),/alt="Example project"/);
  fs.writeFileSync(file,entry('published: false'));
  buildWork(directory);
  assert.ok(!fs.existsSync(path.join(directory,'work/useful-project/index.html')));
  assert.doesNotMatch(fs.readFileSync(path.join(directory,'work.html'),'utf8'),/A useful project/);
});
test('listing-only items work and invalid metadata fails before output changes',t=>{
  const directory=fixture(t),file=path.join(directory,'_work-items/useful-project.md');
  buildWork(directory);
  const before=fs.readFileSync(path.join(directory,'work.html'),'utf8');
  fs.writeFileSync(file,entry('page: false').replace('\n\nAn introduction.\n\n## What I did\n\n- Audited the interface\n- Improved the navigation\n',''));
  assert.doesNotThrow(()=>buildWork(directory));
  assert.ok(!fs.existsSync(path.join(directory,'work/useful-project/index.html')));
  fs.writeFileSync(file,entry().replace('section: "project"','section: "unknown"'));
  assert.throws(()=>buildWork(directory),/section must/);
  assert.notEqual(fs.readFileSync(path.join(directory,'work.html'),'utf8'),before);
  fs.writeFileSync(file,entry('permalink: /../../index.html'));
  assert.throws(()=>buildWork(directory),/invalid permalink/);
});
test('the migrated CTF walkthrough keeps progressive disclosure',t=>{
  const directory=fixture(t);buildWork(directory);
  const html=fs.readFileSync(path.join(directory,'ctf.html'),'utf8');
  assert.match(html,/class="spoilerbutton"/);
  assert.match(html,/id="ctf-solution" hidden/);
});
