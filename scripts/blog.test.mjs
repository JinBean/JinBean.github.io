import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build, root } from './build-blog.mjs';

function fixture(t) {
  const directory=fs.mkdtempSync(path.join(root,'.blog-test-'));
  fs.cpSync(path.join(root,'_blog'),path.join(directory,'_blog'),{recursive:true});
  fs.cpSync(path.join(root,'_articles'),path.join(directory,'_articles'),{recursive:true});
  t.after(()=>{
    const resolved=path.resolve(directory);
    assert.equal(path.dirname(resolved),root);
    assert.ok(path.basename(resolved).startsWith('.blog-test-'));
    fs.rmSync(resolved,{recursive:true,force:true});
  });
  return directory;
}
const article = (extra='') => `---\ntitle: "A new & useful article"\ndate: "2026-09-21"\ncategory: Developer\n${extra}\n---\n\nAn introduction.\n\n## A heading\n\n- First item\n- Second item\n\n[Link](https://example.com)\n\n\`\`\`js\nconst value = 1;\n\`\`\`\n`;
test('one Markdown file generates an article, overview and the correct category',t=>{
  const dir=fixture(t);
  fs.writeFileSync(path.join(dir,'_articles/new-article.md'),article());
  const result=build(dir);
  assert.equal(result.articles,4);
  const read=f=>fs.readFileSync(path.join(dir,f),'utf8');
  const output=read('blog/new-article.html');
  assert.match(output,/<h2>A heading<\/h2>/);
  assert.match(output,/<ul>/);
  assert.match(output,/language-js/);
  assert.match(output,/A new &amp; useful article/);
  assert.match(output,/site-footer.js/);
  assert.match(read('blog/index.html'),/new-article.html/);
  assert.match(read('blog/personal_developer.html'),/new-article.html/);
  assert.doesNotMatch(read('blog/personal_alumni.html'),/new-article.html/);
  for(const url of ['blog/alumni/transparency.html','blog/art/instagramPart1.html','blog/instagramPart2.html']) assert.ok(fs.existsSync(path.join(dir,url)));
});
test('drafts stay out of listings and old generated pages are removed',t=>{
  const dir=fixture(t), file=path.join(dir,'_articles/new-article.md');
  fs.writeFileSync(file,article());build(dir);
  fs.writeFileSync(file,article('published: false'));build(dir);
  assert.ok(!fs.existsSync(path.join(dir,'blog/new-article.html')));
  assert.doesNotMatch(fs.readFileSync(path.join(dir,'blog/index.html'),'utf8'),/new-article.html/);
});
test('invalid metadata, duplicate URLs and output collisions fail before writing',t=>{
  const dir=fixture(t), file=path.join(dir,'_articles/new-article.md');
  build(dir);
  const before=fs.readFileSync(path.join(dir,'blog/index.html'),'utf8');
  fs.writeFileSync(file,article().replace('category: Developer','category: Unknown'));
  assert.throws(()=>build(dir),/category must/);
  fs.writeFileSync(file,article('permalink: /blog/art/instagramPart1.html'));
  assert.throws(()=>build(dir),/duplicate permalink/);
  fs.writeFileSync(file,article('permalink: /blog/../../index.html'));
  assert.throws(()=>build(dir),/invalid or reserved/);
  fs.writeFileSync(file,article());
  fs.writeFileSync(path.join(dir,'blog/new-article.html'),'An unrelated page');
  assert.throws(()=>build(dir),/not managed/);
  assert.equal(fs.readFileSync(path.join(dir,'blog/index.html'),'utf8'),before);
});
