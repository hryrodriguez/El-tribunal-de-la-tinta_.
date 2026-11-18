const fs = require('fs');
const path = require('path');

const URL = 'https://feaxgrwhdjbzcdhcxwsd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYXhncndoZGpiemNkaGN4d3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NjE3OTMsImV4cCI6MjEwODQzNzc5M30.WfdJuNqAhB_d-cmJycfGc6Jxpvs4ixfjGO4DtC2mzDo';

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

(async () => {
  const r = await fetch(
    `${URL}/rest/v1/posts?status=eq.publicado&select=*&order=publish_date.desc`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
  );
  if (!r.ok) throw new Error(await r.text());
  const posts = await r.json();

  fs.mkdirSync('_posts', { recursive: true });
  for (const f of fs.readdirSync('_posts')) {
    const p = path.join('_posts', f);
    if (fs.readFileSync(p, 'utf8').includes('generado: true')) fs.unlinkSync(p);
  }

  for (const p of posts) {
    const fm = [
      '---',
      'layout: post',
      `title: ${q(p.title)}`,
      `date: ${p.publish_date}`,
      `description: ${q(p.excerpt || '')}`,
      p.book_author ? `libro_autor: ${q(p.book_author)}` : '',
      p.rating ? `calificacion: ${p.rating}` : '',
      'generado: true',
      '---',
      '',
    ].filter((l, i) => l !== '' || i === 8 || i > 7);

    let intro = '';
    if (p.kind === 'resena' && (p.book_author || p.rating)) {
      intro =
        [p.book_author ? `**Autor:** ${p.book_author}` : '', p.rating ? `**Calificación:** ${p.rating}/5` : '']
          .filter(Boolean)
          .join(' · ') + '\n\n';
    }

    const file = `${p.publish_date}-${slug(p.title)}.md`;
    fs.writeFileSync(path.join('_posts', file), fm.join('\n') + '\n' + intro + (p.content || '') + '\n');
  }
  console.log(`Generadas ${posts.length} páginas`);
})();
