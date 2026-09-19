const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../../docs');
const prefix = '/KDRUM-Public';
const types = {'.xml':'application/xml','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.pdf':'application/pdf','.mp4':'video/mp4','.json':'application/json'};
http.createServer((req,res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === prefix) { res.writeHead(301,{Location:prefix+'/'}); return res.end(); }
  if (!url.pathname.startsWith(prefix+'/')) { res.writeHead(404); return res.end(); }
  let relative;
  try { relative = decodeURIComponent(url.pathname.slice(prefix.length)); } catch { res.writeHead(400); return res.end(); }
  let file = path.resolve(root, '.'+relative);
  if (!file.startsWith(root+path.sep) && file !== root) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  const size = fs.statSync(file).size;
  const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
  const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range || '');
  let start=0, end=size-1;
  if(range) {
    start=Number(range[1]); end=range[2] ? Math.min(Number(range[2]),size-1) : size-1;
    if(start > end) {res.writeHead(416,{'Content-Range':`bytes */${size}`}); return res.end();}
    headers['Content-Range']=`bytes ${start}-${end}/${size}`;
  }
  headers['Content-Length']=end-start+1;
  res.writeHead(range ? 206 : 200,headers);
  if(req.method==='HEAD') return res.end();
  fs.createReadStream(file,{start,end}).pipe(res);
}).listen(Number(process.env.PORT || 8000),'127.0.0.1',()=>console.log('Pages preview ready under /KDRUM-Public/'));
