const fs = require('fs');
const path = require('path');

const URL = 'https://feaxgrwhdjbzcdhcxwsd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYXhncndoZGpiemNkaGN4d3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NjE3OTMsImV4cCI6MjEwODQzNzc5M30.WfdJuNqAhB_d-cmJycfGc6Jxpvs4ixfjGO4DtC2mzDo';

const get = async (ruta) => {
  const r = await fetch(`${URL}/rest/v1/${ruta}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
};

const slug = (s) =>
  String(s || 'sin-titulo')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

const q = (s) =>
  '"' + String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim() + '"';

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const paras = (t) =>
  esc(t)
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('\n\n');

const fecha = (d) =>
  new Date(d + 'T00:00').toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

(async () => {
  const hoy = new Date().toISOString().slice(0, 10);
  const posts = (await get('posts?status=eq.publicado&select=*&order=publish_date.desc')).filter(
    (p) => p.publish_date <= hoy
  );

  try {
    const s = await get('site?key=eq.about&select=value');
    fs.mkdirSync('_data', { recursive: true });
    fs.writeFileSync('_data/about.json', JSON.stringify(s[0]?.value || {}, null, 2));
  } catch (e) {
    console.log('No se pudo leer site:', e.message);
  }

  fs.mkdirSync('_posts', { recursive: true });
  for (const f of fs.readdirSync('_posts')) {
    const p = path.join('_posts', f);
    if (fs.readFileSync(p, 'utf8').includes('generado: true')) fs.unlinkSync(p);
  }

  for (const p of posts) {
    const resumen = p.excerpt || String(p.content || '').replace(/\s+/g, ' ').slice(0, 155);
    const fm = [
      '---',
      'layout: post',
      `title: ${q(p.title)}`,
      `date: ${p.publish_date}`,
      `fecha_texto: ${q(fecha(p.publish_date))}`,
      `description: ${q(resumen)}`,
      `kind: ${q(p.kind)}`,
      `category: ${q(p.category)}`,
      `genre: ${q(p.genre)}`,
      `libro_autor: ${q(p.book_author)}`,
      `calificacion: ${p.rating ?? '""'}`,
      `cover_url: ${q(p.cover_url)}`,
      `post_id: ${q(p.id)}`,
      'generado: true',
      '---',
    ].join('\n');

    const cuerpo = '{% raw %}\n' + paras(p.content) + '\n{% endraw %}\n';
    const archivo = `${p.publish_date}-${slug(p.title)}.md`;
    fs.writeFileSync(path.join('_posts', archivo), fm + '\n\n' + cuerpo);
  }
  console.log(`Generadas ${posts.length} páginas`);
})();
