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
const gallery=(item)=>{
  const paths=[item.foto,...(Array.isArray(item.galeria)?item.galeria:[])].filter(Boolean);
  return paths.map(f=>{ const copy={...item,foto:f}; image(copy); return f; });
};
const cards=(key)=>{
  if(!Array.isArray(content[key].items))throw Error('Lista inválida: '+key);
  return content[key].items.map((item,i)=>{
    const photo=image(item);
    if(key==='instalaciones'){
      const photos=gallery(item);
      const data=escape(JSON.stringify(photos));
      return `<article class="project p${i%4+1}${photo?' with-photo':''}" role="button" tabindex="0" data-title="${escape(item.titulo)}" data-description="${escape(item.detalle||item.descripcion)}" data-gallery="${data}" onclick="openGallery(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openGallery(this)}">${photo}<div class="project-copy"><span class="project-link">Ver proyecto <span aria-hidden="true">↗</span></span><h3>${escape(item.titulo)}</h3><p>${escape(item.descripcion)}</p></div></article>`;
    }
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
.project{cursor:pointer}.project-link{display:inline-flex;gap:6px;align-items:center;color:var(--lime);font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px}.modal-open{overflow:hidden}.gallery-modal[hidden]{display:none}.gallery-modal{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:20px}.gallery-backdrop{position:absolute;inset:0;background:rgba(3,16,11,.78);backdrop-filter:blur(8px)}.gallery-dialog{position:relative;z-index:1;width:min(920px,100%);max-height:calc(100vh - 40px);overflow:auto;background:#fff;border-radius:24px;box-shadow:0 30px 100px rgba(0,0,0,.35)}.gallery-media{position:relative;background:#071b14;min-height:280px}.gallery-media img{display:block;width:100%;height:min(62vh,560px);object-fit:contain}.gallery-close{position:absolute;right:14px;top:12px;z-index:2;border:0;border-radius:50%;width:40px;height:40px;background:rgba(255,255,255,.9);font-size:28px;line-height:1;cursor:pointer}.gallery-prev,.gallery-next{position:absolute;top:50%;transform:translateY(-50%);border:0;border-radius:50%;width:44px;height:44px;background:rgba(255,255,255,.9);font-size:34px;line-height:1;cursor:pointer}.gallery-prev{left:14px}.gallery-next{right:14px}.gallery-caption{padding:22px 26px 26px}.gallery-caption h2{margin:0 0 7px}.gallery-caption p{margin:0 0 12px;color:var(--muted)}.gallery-caption span{font-size:13px;font-weight:800;color:var(--green)}
.social-strip{background:#071b14;color:#eaf8f0;padding:12px 0;font-size:13px}.social-strip-inner{display:flex;align-items:center;justify-content:space-between;gap:18px}.social-links{display:flex;flex-wrap:wrap;gap:14px}.social-links a{color:#c8f26f;font-weight:800}.location-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:28px;align-items:stretch}.map-frame{min-height:340px;border-radius:22px;overflow:hidden;box-shadow:var(--shadow);background:#dfeee6}.map-frame iframe{width:100%;height:100%;min-height:340px;border:0}
</style></head>`);
output=output.replace('</body>',`<div class="gallery-modal" id="galleryModal" hidden role="dialog" aria-modal="true" aria-labelledby="galleryTitle"><div class="gallery-backdrop" onclick="closeGallery()"></div><div class="gallery-dialog"><button class="gallery-close" type="button" onclick="closeGallery()" aria-label="Cerrar">×</button><div class="gallery-media"><img id="galleryImage" alt=""><button class="gallery-prev" type="button" onclick="galleryMove(-1)" aria-label="Foto anterior">‹</button><button class="gallery-next" type="button" onclick="galleryMove(1)" aria-label="Foto siguiente">›</button></div><div class="gallery-caption"><h2 id="galleryTitle"></h2><p id="galleryDescription"></p><span id="galleryCount"></span></div></div></div><script>
let galleryState={items:[],index:0};
function openGallery(card){const m=document.getElementById('galleryModal');galleryState.items=JSON.parse(card.dataset.gallery||'[]');galleryState.index=0;document.getElementById('galleryTitle').textContent=card.dataset.title||'';document.getElementById('galleryDescription').textContent=card.dataset.description||'';m.hidden=false;document.body.classList.add('modal-open');renderGallery();}
function renderGallery(){const item=galleryState.items[galleryState.index];const img=document.getElementById('galleryImage');if(!item){img.removeAttribute('src');return;}img.src=item;img.alt=document.getElementById('galleryTitle').textContent;document.getElementById('galleryCount').textContent=(galleryState.index+1)+' / '+galleryState.items.length;}
function galleryMove(step){if(!galleryState.items.length)return;galleryState.index=(galleryState.index+step+galleryState.items.length)%galleryState.items.length;renderGallery();}
function closeGallery(){const m=document.getElementById('galleryModal');m.hidden=true;document.body.classList.remove('modal-open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeGallery();if(!document.getElementById('galleryModal').hidden&&e.key==='ArrowRight')galleryMove(1);if(!document.getElementById('galleryModal').hidden&&e.key==='ArrowLeft')galleryMove(-1);});
</script></body>`);
output=output.replaceAll('target="_blank"','target="_blank" rel="noopener noreferrer"');
mkdirSync('dist',{recursive:true});
writeFileSync('dist/index.html',output);
cpSync('admin','dist/admin',{recursive:true});cpSync('uploads','dist/uploads',{recursive:true});
if(existsSync('_headers'))cpSync('_headers','dist/_headers');
console.log('Web generada en dist. '+content.instalaciones.items.length+' instalaciones; '+content.catalogo.items.length+' productos.');
