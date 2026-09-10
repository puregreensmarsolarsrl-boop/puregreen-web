import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,cpSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const temp=mkdtempSync(path.join(tmpdir(),'puregreen-test-'));
try{
 for(const f of ['build.mjs','src','content','admin','uploads'])cpSync(f,path.join(temp,f),{recursive:true});
 const run=()=>execFileSync(process.execPath,['build.mjs'],{cwd:temp,stdio:'pipe'});
 run();let out=readFileSync(path.join(temp,'dist/index.html'),'utf8');
 assert(!out.includes('{{'));assert(out.includes('calcularSolar()'));assert(out.includes('https://wa.me/18294611795'));
 const file=path.join(temp,'content/instalaciones.json');let data=JSON.parse(readFileSync(file));
 data.items.push({titulo:'Prueba <script>alert(1)</script>',descripcion:'Texto & foto',foto:'/uploads/prueba.png',alternativo:'Instalación prueba'});
 writeFileSync(path.join(temp,'uploads/prueba.png'),Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6sZkAAAAASUVORK5CYII=','base64'));
 writeFileSync(file,JSON.stringify(data));run();out=readFileSync(path.join(temp,'dist/index.html'),'utf8');
 assert(out.includes('&lt;script&gt;'));assert(out.includes('src="/uploads/prueba.png"'));assert(!out.includes('<script>alert(1)</script>'));
 data.items[0].foto='javascript:alert(1)';writeFileSync(file,JSON.stringify(data));assert.throws(run);
 const config=JSON.parse(readFileSync('admin/config.yml','utf8'));
 for(const collection of config.collections)for(const entry of collection.files){const values=JSON.parse(readFileSync(entry.file));for(const field of entry.fields)assert(field.name in values,entry.name+'.'+field.name);}
 console.log('OK: generación, esquema CMS, catálogo, foto persistente, escape HTML y rechazo de rutas inválidas.');
}finally{
 const resolved=path.resolve(temp);assert(resolved.startsWith(path.resolve(tmpdir())+path.sep)&&path.basename(resolved).startsWith('puregreen-test-'));rmSync(resolved,{recursive:true});
}
