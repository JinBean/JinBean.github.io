import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { build, root } from './build-blog.mjs';
import { buildWork } from './build-work.mjs';

const buildContent = () => ({blog:build(),professional:buildWork()});
console.log('Content built:',buildContent());
let timer;
for (const directory of ['_articles','_blog/templates','_work-items','_work/templates']) {
  fs.watch(path.join(root,directory), () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { console.log('Content rebuilt:',buildContent(), '— refresh your browser.'); }
      catch(error) { console.error('Content not rebuilt:',error.message); }
    },150);
  });
}
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
const server = http.createServer((request,response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if(pathname.split('/').some(part=>part.startsWith('.')||part.startsWith('_')||['node_modules','scripts'].includes(part))) throw new Error('Private path');
    let filename = path.resolve(root,'.'+pathname);
    if(filename!==root && !filename.startsWith(root+path.sep)) throw new Error('Invalid path');
    if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename=path.join(filename,'index.html');
    if(!fs.existsSync(filename) && !path.extname(filename)) filename+='.html';
    // Some legacy extensionless URLs have an empty directory alongside their HTML file.
    if(!fs.existsSync(filename) && filename.endsWith(path.sep+'index.html')) filename=filename.slice(0,-11)+'.html';
    if(!fs.existsSync(filename)||!fs.statSync(filename).isFile()) {response.writeHead(404);response.end('Page not found');return;}
    response.writeHead(200,{'Content-Type':types[path.extname(filename).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(filename).pipe(response);
  } catch {response.writeHead(400);response.end('Invalid request');}
});
const portArgument=process.argv.indexOf('--port');
const port=Number(portArgument>=0?process.argv[portArgument+1]:4173);
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port in use. Try npm run dev -- --port 4174':error.message);process.exit(1);});
server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://localhost:${port}/ — watching blog and Professional Markdown.`));
