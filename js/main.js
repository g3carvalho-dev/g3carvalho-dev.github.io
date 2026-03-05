// ─────────────────────────────────────────────────────────────
//  main.js  —  Navegação, animações de página, DOM, eventos
//  Depende de: api.js (carregado antes no HTML)
// ─────────────────────────────────────────────────────────────

// ── Utilitários de DOM ────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function mostrarSpinner(containerId = 'status') {
    const el = $(containerId);
    if (!el) return;
    el.innerHTML = `<div class="spinner"></div><br>Carregando...`;
}

function ocultarStatus() {
    const el = $('status');
    if (el) el.innerHTML = '';
}

function mostrarErro(msg, containerId = 'status') {
    const el = $(containerId);
    if (el) el.textContent = msg;
}

// ── Animação de entrada de página ────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('page-content').classList.add('page-enter');

    // Marca o link da nav correspondente à página atual
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.href === location.href) link.classList.add('active');
    });
});

// ── Criação de cards ──────────────────────────────────────────

function criarCard(item, delay = 0) {
    const poster = getPosterUrl(item.poster_path);
    const titulo = getTitulo(item);
    const nota   = item.vote_average?.toFixed(1) ?? '—';
    const ano    = getAno(item);
    const tipo   = item.media_type === 'tv' || item.name ? 'tv' : 'movie';
    const tipoBadge = tipo === 'tv' ? 'Série' : 'Filme';

    if (!poster) return null;

    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${delay * 0.045}s`;
    card.innerHTML = `
        <img src="${poster}" alt="${titulo}" loading="lazy">
        <div class="card-info">
            <h3>${titulo}</h3>
            <div class="card-meta">
                <span class="card-rating">⭐ ${nota}</span>
                <span class="card-type-badge">${tipoBadge}</span>
            </div>
        </div>
    `;
    card.addEventListener('click', () => abrirModal(item));
    return card;
}

function renderizarGrid(items, gridId = 'grid') {
    const grid = $(gridId);
    if (!grid) return;
    grid.innerHTML = '';

    let count = 0;
    items.forEach(item => {
        const card = criarCard(item, count);
        if (card) { grid.appendChild(card); count++; }
    });

    if (count === 0) mostrarErro('Nenhum resultado encontrado.');
}

// ── Modal ─────────────────────────────────────────────────────

function abrirModal(item) {
    const poster  = getPosterUrl(item.poster_path);
    const titulo  = getTitulo(item);
    const nota    = item.vote_average?.toFixed(1) ?? '—';
    const ano     = getAno(item);
    const tipo    = item.media_type === 'tv' || item.name ? 'tv' : 'movie';
    const id      = item.id;

    const img = $('modal-img');
    if (img) { img.src = poster || ''; img.alt = titulo; }

    const h2 = document.querySelector('#modal h2');
    if (h2) h2.textContent = titulo;

    const meta = $('modal-meta');
    if (meta) meta.innerHTML = `
        <span class="rating">⭐ ${nota}</span>
        <span>${ano}</span>
        <span>${tipo === 'tv' ? 'Série' : 'Filme'}</span>
    `;

    const overview = $('modal-overview');
    if (overview) overview.textContent = item.overview || 'Sem descrição disponível.';

    const detalhesBtn = $('modal-detalhes-btn');
    if (detalhesBtn) detalhesBtn.href = `detalhes.html?id=${id}&tipo=${tipo}`;

    const overlay = $('modal-overlay');
    if (overlay) overlay.classList.add('active');

    document.body.style.overflow = 'hidden';
}

function fecharModal(event) {
    const overlay = $('modal-overlay');
    if (!overlay) return;

    const clickouFora = event && event.target === overlay;
    const clickouFechar = !event || (event.currentTarget && event.currentTarget.id === 'modal-close');

    if (clickouFora || clickouFechar) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Fechar modal com ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModal();
});

// ── Hero Banner ───────────────────────────────────────────────

function renderizarHero(item) {
    const heroEl = $('hero');
    if (!heroEl || !item) return;

    const backdrop = getBackdropUrl(item.backdrop_path);
    const titulo   = getTitulo(item);
    const nota     = item.vote_average?.toFixed(1) ?? '—';
    const ano      = getAno(item);
    const tipo     = item.media_type === 'tv' || item.name ? 'tv' : 'movie';
    const tipoLabel = tipo === 'tv' ? 'Série' : 'Filme';

    if (backdrop) {
        const bd = heroEl.querySelector('.hero-backdrop');
        if (bd) bd.style.backgroundImage = `url(${backdrop})`;
    }

    const badge = heroEl.querySelector('.hero-badge');
    if (badge) badge.textContent = tipoLabel + ' em destaque';

    const titleEl = heroEl.querySelector('.hero-title');
    if (titleEl) titleEl.textContent = titulo;

    const metaEl = heroEl.querySelector('.hero-meta');
    if (metaEl) metaEl.innerHTML = `
        <span class="rating">⭐ ${nota}</span>
        <span>${ano}</span>
    `;

    const overviewEl = heroEl.querySelector('.hero-overview');
    if (overviewEl) overviewEl.textContent = item.overview || '';

    const btn = heroEl.querySelector('.hero-btn');
    if (btn) btn.href = `detalhes.html?id=${item.id}&tipo=${tipo}`;
}

// ── Tabs (filtro de categoria) ────────────────────────────────

function initTabs(onSelect) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            onSelect(tab.dataset.value);
        });
    });
}

// ── Busca com Enter ───────────────────────────────────────────

function initBuscaInput(onBuscar) {
    const input = $('search-input');
    if (!input) return;

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') onBuscar(input.value.trim());
    });
}
