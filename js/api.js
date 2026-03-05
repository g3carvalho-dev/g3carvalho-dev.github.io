// ─────────────────────────────────────────────────────────────
//  api.js  —  Todas as chamadas ao TMDB (ou ao Worker proxy)
//
//  ⚠️  SEGURANÇA: Troque BASE_URL pela URL do seu Cloudflare Worker
//      após seguir as instruções em worker.js.
//      Enquanto desenvolve localmente, pode usar TMDB_DIRECT + API_KEY.
// ─────────────────────────────────────────────────────────────

const WORKER_URL  = 'https://netwatchtv.gabrielgarciagc175.workers.dev';
const IMAGE_BASE  = 'https://image.tmdb.org/t/p/w500';
const IMAGE_ORIG  = 'https://image.tmdb.org/t/p/original';

// Faz fetch no Worker (que injeta a API Key internamente)
async function apiFetch(path) {
    const res = await fetch(`${WORKER_URL}${path}`);
    if (!res.ok) throw new Error(`Erro na API: ${res.status}`);
    return res.json();
}

// ── Filmes ────────────────────────────────────────────────────

async function getFilmesPopulares() {
    return apiFetch('/movie/popular?language=pt-BR');
}

async function getFilmesTopRated() {
    return apiFetch('/movie/top_rated?language=pt-BR');
}

async function getFilmesNowPlaying() {
    return apiFetch('/movie/now_playing?language=pt-BR');
}

async function getDetalhesFilme(id) {
    return apiFetch(`/movie/${id}?language=pt-BR&append_to_response=credits,videos`);
}

// ── Séries ────────────────────────────────────────────────────

async function getSeriesPopulares() {
    return apiFetch('/tv/popular?language=pt-BR');
}

async function getSeriesTopRated() {
    return apiFetch('/tv/top_rated?language=pt-BR');
}

async function getSeriesOnAir() {
    return apiFetch('/tv/on_the_air?language=pt-BR');
}

async function getDetalhesSerie(id) {
    return apiFetch(`/tv/${id}?language=pt-BR&append_to_response=credits,videos`);
}

// ── Tendências ────────────────────────────────────────────────

async function getTrendingAll(window = 'week') {
    return apiFetch(`/trending/all/${window}?language=pt-BR`);
}

async function getTrendingMovies(window = 'week') {
    return apiFetch(`/trending/movie/${window}?language=pt-BR`);
}

async function getTrendingTV(window = 'week') {
    return apiFetch(`/trending/tv/${window}?language=pt-BR`);
}

// ── Busca ─────────────────────────────────────────────────────

async function searchMulti(query) {
    return apiFetch(`/search/multi?language=pt-BR&query=${encodeURIComponent(query)}`);
}

async function searchMovies(query) {
    return apiFetch(`/search/movie?language=pt-BR&query=${encodeURIComponent(query)}`);
}

async function searchTV(query) {
    return apiFetch(`/search/tv?language=pt-BR&query=${encodeURIComponent(query)}`);
}

// ── Helpers ───────────────────────────────────────────────────

function getPosterUrl(path) {
    return path ? IMAGE_BASE + path : null;
}

function getBackdropUrl(path) {
    return path ? IMAGE_ORIG + path : null;
}

function getTitulo(item) {
    return item.title || item.name || 'Sem título';
}

function getAno(item) {
    const d = item.release_date || item.first_air_date || '';
    return d ? d.slice(0, 4) : '—';
}
