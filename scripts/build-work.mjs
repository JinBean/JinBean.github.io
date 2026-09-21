import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import { renderCardLink } from './card-link.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sections = ['featured','experience','project'];
const markdown = new MarkdownIt({ html:true, typographer:false });
const escape = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const renderTemplate = (name,values,directory) => fs.readFileSync(path.join(directory,'_work/templates',name+'.html'),'utf8').replace(/\{\{(\w+)\}\}/g,(_,key)=>{
  if(!(key in values))throw new Error(`Missing work template value: ${key}`);
  return values[key];
});
const cleanHref = url => url.endsWith('/index.html') ? url.slice(1,-10) : url.endsWith('.html') ? url.slice(1,-5) : url.slice(1);
const renderMedia = (item,directory,rootPrefix='') => {
  const imageFile=item.image?path.join(directory,String(item.image).slice(1)):'';
  const hasImage=Boolean(imageFile&&fs.existsSync(imageFile)&&fs.statSync(imageFile).isFile());
  const image=hasImage?`<img src="${escape(rootPrefix+String(item.image).slice(1))}" alt="${escape(item.image_alt||'')}" loading="lazy" onerror="this.remove()" />`:'';
  return `<div class="work-media${hasImage?'':' work-media--placeholder'}"${hasImage?'':' aria-hidden="true"'}>${image}</div>`;
};
const splitArticleResources = html => {
  const match=html.match(/\s*(<section class="features">[\s\S]*<\/section>)\s*$/);
  if(!match)return {article:html,resources:'',layoutClass:''};
  const linksInNewTabs=match[1].replace(/<a\b([^>]*)>/gi,(_tag,attributes)=>{
    const cleaned=attributes.replace(/\s+target=(?:"[^"]*"|'[^']*')/gi,'').replace(/\s+rel=(?:"[^"]*"|'[^']*')/gi,'');
    return `<a${cleaned} target="_blank" rel="noopener noreferrer">`;
  });
  return {
    article:html.slice(0,match.index).trimEnd()+'\n',
    resources:`<aside class="project-resources" aria-label="Related links">${linksInNewTabs}</aside>`,
    layoutClass:' project-layout--with-resources'
  };
};

export function readWork(directory=root) {
  const seen=new Set();
  return fs.readdirSync(path.join(directory,'_work-items')).filter(file=>file.endsWith('.md')).map(file=>{
    const {data,content}=matter(fs.readFileSync(path.join(directory,'_work-items',file),'utf8'));
    for(const key of ['title','category','section']) if(typeof data[key]!=='string'||!data[key].trim())throw new Error(`${file}: ${key} is required`);
    if(!sections.includes(data.section))throw new Error(`${file}: section must be featured, experience or project`);
    if(!Number.isInteger(data.order)||data.order<1)throw new Error(`${file}: order must be a positive whole number`);
    const slug=path.basename(file,'.md');
    if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw new Error(`${file}: use a lowercase filename with hyphens`);
    const hasPage=data.page!==false;
    if(hasPage&&!content.trim())throw new Error(`${file}: article body is empty`);
    const url=hasPage?(data.permalink||`/work/${slug}/index.html`):null;
    if(url&&!/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+(?:\.html|\/index\.html)$/.test(url))throw new Error(`${file}: invalid permalink`);
    if(url&&seen.has(url))throw new Error(`${file}: duplicate permalink ${url}`);
    if(url)seen.add(url);
    if(data.image&&(!String(data.image).startsWith('/images/')||String(data.image).includes('..')))throw new Error(`${file}: image must be an absolute /images/ path`);
    return {...data,slug,hasPage,url,body:hasPage?markdown.render(content):'',published:data.published!==false};
  }).sort((a,b)=>sections.indexOf(a.section)-sections.indexOf(b.section)||a.order-b.order||a.title.localeCompare(b.title));
}

export function buildWork(directory=root) {
  const items=readWork(directory).filter(item=>item.published);
  const outputs=new Map();
  for(const item of items.filter(item=>item.hasPage)) {
    const segments=item.url.slice(1).split('/');
    const rootPrefix='../'.repeat(segments.length-1);
    const content=splitArticleResources(item.body);
    outputs.set(item.url.slice(1),renderTemplate('article',{
      root:rootPrefix,title:escape(item.page_title||item.title),
      subtitle:item.subtitle?`<p>${escape(item.subtitle)}</p>`:'',body:content.article,
      resources:content.resources,layoutClass:content.layoutClass
    },directory));
  }
  const cardLink=item=>item.hasPage?cleanHref(item.url):'';
  const featured=`<div class="work-grid">${items.filter(item=>item.section==='featured').map((item,index)=>{
    const href=cardLink(item),title=escape(item.title);
    return `<article class="work-card" id="featured-${index+1}">${renderMedia(item,directory)}<div class="featured-copy"><span class="post-category">${escape(item.category)}</span><h2 class="major">${href?`<a href="${escape(href)}">${title}</a>`:title}</h2><p>${escape(item.excerpt||'')}</p>${renderCardLink({href,title:item.title,className:'work-link'})}</div></article>`;
  }).join('\n')}</div>`;
  const cards=section=>`<section class="features">${items.filter(item=>item.section===section).map(item=>{
    const href=cardLink(item),title=escape(item.title);
    return `<article class="work-card"><span class="post-category">${escape(item.category)}</span><h3 class="major">${href?`<a href="${escape(href)}">${title}</a>`:title}</h3><p>${escape(item.excerpt||'')}</p>${item.secondary_excerpt?`<p>${escape(item.secondary_excerpt)}</p>`:''}${renderCardLink({href,title:item.title,className:'work-link'})}</article>`;
  }).join('\n')}</section>`;
  outputs.set('work.html',renderTemplate('index',{featured,experiences:cards('experience'),projects:cards('project')},directory));

  const manifestFile=path.join(directory,'_work/generated.json');
  const previous=fs.existsSync(manifestFile)?JSON.parse(fs.readFileSync(manifestFile,'utf8')):[];
  const banner='<!-- Generated from _work-items and _work/templates. Edit those sources, then run npm run build. -->\n';
  for(const [file] of outputs){
    const target=path.join(directory,file);
    if(fs.existsSync(target)&&!previous.includes(file))throw new Error(`Work output already exists and is not managed: ${file}`);
  }
  for(const [file,html] of outputs){
    const target=path.join(directory,file);fs.mkdirSync(path.dirname(target),{recursive:true});
    const result=banner+html;if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==result)fs.writeFileSync(target,result);
  }
  for(const file of previous){
    if(outputs.has(file))continue;
    const target=path.resolve(directory,file);
    if(!target.startsWith(path.resolve(directory)+path.sep)||target===path.resolve(directory,'work.html'))throw new Error('Invalid generated work path');
    if(fs.existsSync(target)&&fs.readFileSync(target,'utf8').startsWith(banner))fs.unlinkSync(target);
  }
  fs.writeFileSync(manifestFile,JSON.stringify([...outputs.keys()],null,2)+'\n');
  return {items:items.length,pages:outputs.size};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log('Professional work built:',buildWork());}catch(error){console.error(error.message);process.exitCode=1;}
}
