document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#year, .year').forEach(el => el.textContent = new Date().getFullYear());
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  // Infer the public GitHub Pages repository from its URL.
  function getRepo() {
    const host = location.hostname;
    if (!host.endsWith('.github.io')) return null;
    const owner = host.slice(0, -'.github.io'.length);
    const parts = location.pathname.split('/').filter(Boolean);
    const repo = parts.length ? parts[0] : `${owner}.github.io`;
    return { owner, repo, full: `${owner}/${repo}` };
  }
  const repo = getRepo();

  // Public reviews are GitHub Issues tagged with the label "reseña-comunidad".
  const feed = document.querySelector('#community-reviews');
  if (feed) {
    if (!repo) {
      feed.innerHTML = '<div class="empty-state"><span>✒</span><h3>La biblioteca espera su primera voz</h3><p>Cuando el blog esté publicado en GitHub Pages, aquí aparecerán las reseñas públicas de la comunidad.</p></div>';
    } else {
      fetch(`https://api.github.com/repos/${repo.full}/issues?state=open&labels=${encodeURIComponent('reseña-comunidad')}&per_page=30`)
        .then(r => { if (!r.ok) throw new Error('No se pudieron cargar las reseñas.'); return r.json(); })
        .then(items => {
          const reviews = items.filter(i => !i.pull_request);
          if (!reviews.length) {
            feed.innerHTML = '<div class="empty-state"><span>✒</span><h3>La primera reseña puede ser tuya</h3><p>Las reseñas aprobadas aparecerán aquí para que toda la comunidad pueda leerlas.</p></div>';
            return;
          }
          feed.innerHTML = reviews.map(item => {
            const body = (item.body || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            const title = item.title.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            const user = (item.user?.login || 'Lector/a').replace(/[^\w.-]/g,'');
            const date = new Date(item.created_at).toLocaleDateString('es-DO',{day:'numeric',month:'long',year:'numeric'});
            return `<article class="user-review"><div class="review-head"><div><strong>${user}</strong><p class="review-book">${title}</p></div><span class="comment-date">${date}</span></div><p>${body.replace(/\n/g,'<br>')}</p><a class="text-link small" href="${item.html_url}" target="_blank" rel="noopener">Leer y comentar en GitHub ↗</a></article>`;
          }).join('');
        }).catch(() => {
          feed.innerHTML = '<div class="empty-state"><h3>No pudimos cargar las reseñas</h3><p>Comprueba que el repositorio sea público y que exista la etiqueta <strong>reseña-comunidad</strong>.</p></div>';
        });
    }
  }

  const reviewForm = document.querySelector('#review-form');
  if (reviewForm) reviewForm.addEventListener('submit', event => {
    event.preventDefault();
    const feedback = reviewForm.querySelector('.form-feedback');
    if (!repo) {
      feedback.textContent = 'Primero publica el blog en un repositorio público de GitHub Pages para activar los envíos.';
      return;
    }
    const data = new FormData(reviewForm);
    const title = `Reseña: ${String(data.get('book-title')).trim()} — ${String(data.get('reviewer')).trim()}`;
    const body = `**Libro:** ${String(data.get('book-title')).trim()}\n\n**Autor/a:** ${String(data.get('book-author')).trim()}\n\n**Género:** ${String(data.get('genre')).trim()}\n\n**Calificación:** ${String(data.get('rating'))}/5\n\n**Reseña de ${String(data.get('reviewer')).trim()}:**\n\n${String(data.get('review')).trim()}\n\n---\nEnviada desde El Tribunal de la Tinta.`;
    const params = new URLSearchParams({title, body, labels:'reseña-comunidad'});
    feedback.textContent = 'Se abrirá GitHub para que confirmes la publicación pública de tu reseña. Necesitarás una cuenta de GitHub.';
    window.open(`https://github.com/${repo.full}/issues/new?${params.toString()}`, '_blank', 'noopener');
  });

  // Public comments powered by Utterances. The repository must be public,
  // Issues enabled, and the Utterances GitHub App installed on the repository.
  const comments = document.querySelector('#github-comments');
  if (comments) {
    if (!repo) {
      comments.innerHTML = '<p class="muted">Los comentarios públicos se activarán cuando esta página esté publicada en GitHub Pages.</p>';
    } else {
      const script = document.createElement('script');
      script.src = 'https://utteranc.es/client.js';
      script.setAttribute('repo', repo.full);
      script.setAttribute('issue-term', 'pathname');
      script.setAttribute('label', 'comentarios');
      script.setAttribute('theme', 'github-light');
      script.crossOrigin = 'anonymous';
      script.async = true;
      comments.appendChild(script);
    }
  }
});
