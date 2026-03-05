const API_KEY = '52732b89370dfc8d97def371ede08297';
const BASE = 'https://api.themoviedb.org/3/';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

async function buscarFilmes(url) {
    document.getElementById('status').textContent = 'Carregando...';
    document.getElementById('grid').innerHTML = '';

    const res = await fetch(url);
    const data = await res.json();

    document.getElementById('status').textContent = '';

    if (!data.results || data.results.length === 0) {
        document.getElementById('status').textContent = 'Nenhum filme encontrado.';
        return;
    }

    data.results.forEach(filme => {
        
        if (!filme.poster_path) return;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${IMAGE_BASE + filme.poster_path}" alt="${filme.title}">
            <div class="card-info">
                <h3>${filme.title}</h3>
                <span> ${filme.vote_average?.toFixed(1)}</span>
            </div>
        `;
        card.onclick = () => abrirModal(filme);
        document.getElementById('grid').appendChild(card);
    });
}

function buscar() {
    const query = document.getElementById('search-input').value.trim();
    
    if (!query) {
        carregarPopulares();
        return;
    }

    buscarFilmes(`${BASE}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`);
}

function carregarPopulares() {
    buscarFilmes(`${BASE}/movie/popular?api_key=${API_KEY}&language=pt-BR`);
}

function abrirModal(filme) {
    document.getElementById('modal-img').src = IMAGE_BASE + filme.poster_path;
    document.getElementById('modal-title').textContent = filme.title;
    document.getElementById('modal-overview').textContent = filme.overview || 'Sem descrição disponível.';
    document.getElementById('modal-note').textContent = filme.vote_average?.toFixed(1);
    document.getElementById('modal-overlay').classList.add('active');
}

function fecharModal() {
    if (!event || event.target === document.getElementById('modal-overlay') || event.currentTarget.id === 'modal-close') {
        document.getElementById('modal-overlay').classList.remove('active');
    }
}

// Pesquisar ao pressionar Enter
document.getElementById('search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscar();
});

// Inicializa
carregarPopulares();