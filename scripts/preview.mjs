import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { build, root } from './build-blog.mjs';
import { buildWork } from './build-work.mjs';

const buildContent = () => ({blog:build(),professional:buildWork()});
console.log('Content built:',buildContent());
const liveReloadClients=new Set();
const reloadBrowsers=()=>{
  for(const response of liveReloadClients)response.write('data: reload\n\n');
};
let timer,rebuildPending=false;
const scheduleRefresh=rebuild=>{
  rebuildPending||=rebuild;
  clearTimeout(timer);
  timer=setTimeout(()=>{
    const shouldRebuild=rebuildPending;
    rebuildPending=false;
    try {
      if(shouldRebuild)console.log('Content rebuilt:',buildContent());
      reloadBrowsers();
    } catch(error) { console.error('Content not rebuilt:',error.message); }
  },150);
};
for(const directory of ['_content/blog/articles','_content/blog/templates','_content/work/articles','_content/work/templates']){
  fs.watch(path.join(root,directory),()=>scheduleRefresh(true));
}
for(const directory of ['assets/css','assets/js','images']){
  fs.watch(path.join(root,directory),()=>scheduleRefresh(false));
}
fs.watch(root,(_event,filename)=>{
  if(filename&&['index.html','work.html'].includes(String(filename)))scheduleRefresh(false);
});
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
const server = http.createServer((request,response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    if(pathname==='/__live-reload'){
      response.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store','Connection':'keep-alive'});
      response.write('retry: 500\n\n');
      liveReloadClients.add(response);
      request.on('close',()=>liveReloadClients.delete(response));
      return;
    }
    if(pathname.split('/').some(part=>part.startsWith('.')||part.startsWith('_')||['node_modules','scripts'].includes(part))) throw new Error('Private path');
    let filename = path.resolve(root,'.'+pathname);
    if(filename!==root && !filename.startsWith(root+path.sep)) throw new Error('Invalid path');
    if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename=path.join(filename,'index.html');
    if(!fs.existsSync(filename) && !path.extname(filename)) filename+='.html';
    // Some legacy extensionless URLs have an empty directory alongside their HTML file.
    if(!fs.existsSync(filename) && filename.endsWith(path.sep+'index.html')) filename=filename.slice(0,-11)+'.html';
    if(!fs.existsSync(filename)||!fs.statSync(filename).isFile()) {response.writeHead(404);response.end('Page not found');return;}
    const extension=path.extname(filename).toLowerCase();
    response.writeHead(200,{'Content-Type':types[extension]||'application/octet-stream','Cache-Control':'no-store'});
    if(extension==='.html'){
      const liveReload='<script>(()=>{const source=new EventSource("/__live-reload");source.onmessage=event=>{if(event.data==="reload")location.reload();};})();</script>';
      const html=fs.readFileSync(filename,'utf8');
      response.end(html.includes('</body>')?html.replace('</body>',liveReload+'</body>'):html+liveReload);
      return;
    }
    fs.createReadStream(filename).pipe(response);
  } catch {response.writeHead(400);response.end('Invalid request');}
});
const portArgument=process.argv.indexOf('--port');
const port=Number(portArgument>=0?process.argv[portArgument+1]:4173);
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port in use. Try npm run dev -- --port 4174':error.message);process.exit(1);});
server.listen(port,'127.0.0.1',()=>console.log(`Preview: http://localhost:${port}/ — watching blog and Professional Markdown.`));
