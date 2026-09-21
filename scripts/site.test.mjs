import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { root } from './build-blog.mjs';

const ignoredDirectories=new Set(['.git','_content','node_modules']);

function htmlFiles(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    if(entry.isDirectory())return ignoredDirectories.has(entry.name)?[]:htmlFiles(path.join(directory,entry.name));
    return entry.isFile()&&entry.name.endsWith('.html')?[path.join(directory,entry.name)]:[];
  });
}

test('all local links and assets in public HTML resolve',()=>{
  const missing=[];
  for(const file of htmlFiles(root)){
    const html=fs.readFileSync(file,'utf8');
    for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
      const reference=match[1];
      if(/^(?:https?:|mailto:|tel:|#|data:|javascript:|\{\{)/.test(reference))continue;
      const clean=reference.split(/[?#]/,1)[0];
      if(!clean)continue;
      const target=clean.startsWith('/')?path.join(root,clean.slice(1)):path.resolve(path.dirname(file),clean);
      const exists=[target,target+'.html',path.join(target,'index.html')].some(candidate=>fs.existsSync(candidate));
      if(!exists)missing.push(`${path.relative(root,file)} → ${reference}`);
    }
  }
  assert.deepEqual(missing,[]);
});
