import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { renderCardLink } from './card-link.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const categories = { Developer: 'personal_developer.html', Alumni: 'personal_alumni.html', 'Art Manager': 'personal_art.html' };
const markdown = new MarkdownIt({ html: true, typographer: false });
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const template = (name, values, directory) => fs.readFileSync(path.join(directory, '_blog/templates', name + '.html'), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, key) => {
  if (!(key in values)) throw new Error(`Missing template value: ${key}`);
  return values[key];
});
const plain = html => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const dateLabel = date => new Intl.DateTimeFormat('en-GB', {day:'2-digit',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date));
export function readArticles(directory = root) {
  const seen = new Set();
  return fs.readdirSync(path.join(directory, '_articles')).filter(f => f.endsWith('.md')).map(file => {
    const { data, content } = matter(fs.readFileSync(path.join(directory, '_articles', file), 'utf8'));
    for (const key of ['title','category']) if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`${file}: ${key} is required`);
    if (!Object.hasOwn(categories, data.category)) throw new Error(`${file}: category must be Developer, Alumni or Art Manager`);
    const date = data.date instanceof Date ? data.date.toISOString().slice(0,10) : String(data.date);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) throw new Error(`${file}: use a valid YYYY-MM-DD date`);
    if (!content.trim()) throw new Error(`${file}: article body is empty`);
    const slug = path.basename(file, '.md');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${file}: use a lowercase filename with hyphens`);
    const url = data.permalink || `/blog/${slug}.html`;
    if (!/^\/blog\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.html$/.test(url) || Object.values(categories).some(c => url === '/blog/'+c) || url === '/blog/index.html') throw new Error(`${file}: invalid or reserved permalink`);
    if(seen.has(url)) throw new Error(`${file}: duplicate permalink ${url}`);
    seen.add(url);
    const body = markdown.render(content);
    const excerpt = data.excerpt || plain(body.match(/<p>([\s\S]*?)<\/p>/)?.[1] || body).slice(0,180);
    return { ...data, date, url, body, excerpt, published: data.published !== false };
  }).sort((a,b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}
export function build(directory = root) {
  const articles = readArticles(directory).filter(a => a.published);
  const outputs = new Map();
  for (const article of articles) {
    const prefix = '../'.repeat(article.url.slice(1).split('/').length - 1);
    const categoryUrl = `${prefix}blog/${categories[article.category]}`;
    const navigation = `<nav id="nav" aria-label="Blog categories"><ul class="links"><li><a href="${prefix}blog/index.html#header">All posts</a></li>${Object.entries(categories).map(([name,file]) => `<li${name === article.category ? ' class="active"' : ''}><a href="${prefix}blog/${file}#header"${name === article.category ? ' aria-current="location"' : ''}>${escape(name)}</a></li>`).join('')}</ul></nav>`;
    outputs.set(article.url.slice(1), template('article', {
      root:prefix, title:escape(article.title), navigation, category_url:categoryUrl,
      date:escape(article.display_date || dateLabel(article.date)),
      subtitle:article.subtitle ? `<p>${escape(article.subtitle)}</p>` : '', body:article.body
    }, directory));
  }
  for (const [name, category, output] of [['all',null,'index.html'],['developer','Developer',categories.Developer],['alumni','Alumni',categories.Alumni],['art','Art Manager',categories['Art Manager']]]) {
    const selected = articles.filter(a => !category || a.category === category);
    const posts = selected.length ? `<section class="posts">${selected.map(a => {
      const title = escape(a.card_title || a.title);
      const href = a.url.slice('/blog/'.length);
      return `<article><header><div class="post-meta"><span class="date">${escape(dateLabel(a.date))}</span>${category ? '' : `<span class="post-category">${escape(a.category)}</span>`}</div><h2><a href="${href}">${title}</a></h2></header><p>${escape(a.excerpt)}</p>${renderCardLink({href,title:a.card_title||a.title,className:'post-link'})}</article>`;
    }).join('\n')}</section>` : '<section class="empty-posts"><p>No posts in this category yet.</p><a class="special" href="index.html">Browse all posts</a></section>';
    outputs.set('blog/'+output, template(name,{posts},directory));
  }
  const manifestFile = path.join(directory,'_blog/generated.json');
  const previous = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile,'utf8')) : [];
  const banner = '<!-- Generated from _articles and _blog/templates. Edit those sources, then run npm run build. -->\n';
  // Validate ownership before writing anything; never replace an unrelated page.
  for (const [file] of outputs) {
    const target = path.join(directory,file);
    if (fs.existsSync(target) && !previous.includes(file)) throw new Error(`Output already exists and is not managed: ${file}`);
  }
  for (const [file,html] of outputs) {
    const target = path.join(directory,file);
    fs.mkdirSync(path.dirname(target),{recursive:true});
    const result = banner+html;
    if (!fs.existsSync(target) || fs.readFileSync(target,'utf8')!==result) fs.writeFileSync(target,result);
  }
  for (const file of previous) {
    if(outputs.has(file)) continue;
    const target = path.resolve(directory,file);
    if (!target.startsWith(path.resolve(directory,'blog')+path.sep)) throw new Error('Invalid generated path');
    if(fs.existsSync(target) && fs.readFileSync(target,'utf8').startsWith(banner)) fs.unlinkSync(target);
  }
  fs.writeFileSync(manifestFile,JSON.stringify([...outputs.keys()],null,2)+'\n');
  return { articles:articles.length, pages:outputs.size };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log('Blog built:',build()); } catch(error) { console.error(error.message); process.exitCode=1; }
}
