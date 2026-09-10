import {readFileSync,writeFileSync,mkdirSync,cpSync,readdirSync,existsSync} from 'node:fs';
import path from 'node:path';
const read=p=>readFileSync(p,'utf8');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const content=Object.fromEntries(readdirSync('content').filter(f=>f.endsWith('.json')).map(f=>[f.slice(0,-5),JSON.parse(read('content/'+f))]));
for(const key of ['whatsapp1','whatsapp2']) if(!/^\d{8,15}$/.test(content.contacto[key])) throw Error('Número de WhatsApp inválido: '+key);
const image=(item)=>{
  if(!item.foto)return '';
  if(!/^\/uploads\/[\w\-./% ]+\.(jpe?g|png|webp|gif|avif)$/i.test(item.foto)||item.foto.includes('..'))throw Error('Foto inválida: usa el cargador del panel con JPG, PNG o WebP.');
  const file=decodeURIComponent(item.foto.slice(1));
  if(!existsSync(file))throw Error('Falta la foto: '+file);
  return `<img src="${escape(item.foto)}" alt="${escape(item.alternativo||item.titulo)}" loading="lazy" decoding="async">`;
};
const cards=(key)=>{
  if(!Array.isArray(content[key].items))throw Error('Lista inválida: '+key);
  return content[key].items.map((item,i)=>{
    const photo=image(item);
    if(key==='instalaciones')return `<article class="project p${i%4+1}${photo?' with-photo':''}">${photo}<div class="project-copy"><h3>${escape(item.titulo)}</h3><p>${escape(item.descripcion)}</p></div></article>`;
    return `<article class="product"><div class="product-top">${photo||escape(item.icono||'☀️')}</div><h3>${escape(item.titulo)}</h3><p>${escape(item.descripcion)}</p></article>`;
  }).join('\n');
};
let template=read('src/template.html');
let output=template.replace(/\{\{([\w.]+)\}\}/g,(_,key)=>{
  if(['instalaciones','catalogo'].includes(key))return cards(key);
  if(key==='telefono1'||key==='telefono2'){const n=content.contacto[key==='telefono1'?'whatsapp1':'whatsapp2'];return n.length===11&&n.startsWith('1')?n.slice(1,4)+'-'+n.slice(4,7)+'-'+n.slice(7):'+'+n;}
  const [group,field]=key.split('.');
  if(typeof content[group]?.[field]!=='string')throw Error('Falta texto: '+key);
  return escape(content[group][field]);
});
output=output.replace('</head>',`<style>
.project.with-photo{background:#0d2a20;position:relative;overflow:hidden;isolation:isolate}
.project.with-photo>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.project.with-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent,rgba(0,0,0,.85));z-index:-1}
.project-copy{width:100%}.project h3,.project p,.product h3,.product p{overflow-wrap:anywhere}
.product-top{overflow:hidden}.product-top img{width:100%;height:100%;object-fit:cover}
</style></head>`);
output=output.replaceAll('target="_blank"','target="_blank" rel="noopener noreferrer"');
mkdirSync('dist',{recursive:true});
writeFileSync('dist/index.html',output);
cpSync('admin','dist/admin',{recursive:true});cpSync('uploads','dist/uploads',{recursive:true});
if(existsSync('_headers'))cpSync('_headers','dist/_headers');
console.log('Web generada en dist. '+content.instalaciones.items.length+' instalaciones; '+content.catalogo.items.length+' productos.');
