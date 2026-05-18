let restaurantes = [];

async function loadRestaurantes() {
    try {
        const response = await fetch('data/restaurantes.json');
        if (!response.ok) throw new Error('Erro ao carregar dados');
        restaurantes = await response.json();
        populateConcelhos();
        renderRestaurantes(restaurantes);
    } catch (error) {
        console.error('Erro:', error);
        listaRestaurantes.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: #e74c3c;">Erro ao carregar os restaurantes. Tente novamente mais tarde.</p>';
    }
}

function populateConcelhos() {
    const regioes = ['Norte', 'Porto', 'Centro', 'Oeste', 'Lisboa', 'Sul', 'Ilhas'];
    regioes.forEach(r => {
        const option = document.createElement('option');
        option.value = r;
        option.textContent = r;
        filtroConcelho.appendChild(option);
    });
}

function renderEstrelas(avaliacao) {
    const fullStars = Math.floor(avaliacao);
    const hasHalf = avaliacao % 1 >= 0.5;
    let html = '';
    for (let i = 0; i < 5; i++) {
        html += i < fullStars ? '★' : '☆';
    }
    return html;
}

function formatPreco(preco) {
    const precos = { economico: '€', medio: '€€', caro: '€€€' };
    return precos[preco] || preco;
}

function renderRestaurantes(restaurantesFiltrados) {
    if (restaurantesFiltrados.length === 0) {
        listaRestaurantes.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 40px; color: #7f8c8d;">Não existem restaurantes com os filtros selecionados.</p>';
        return;
    }

    listaRestaurantes.innerHTML = restaurantesFiltrados.map(r => `
        <article class="card" data-id="${r.id}">
            <img src="${r.imagem}" alt="${r.nome}" class="card-img" loading="lazy">
            <div class="card-content">
                <span class="card-categoria">${r.categoria}</span>
                <h3>${r.nome}</h3>
                <p class="card-localizacao">📍 ${r.localizacao}</p>
                <div class="card-avaliacao">
                    <span class="estrelas">${renderEstrelas(r.avaliacao)}</span>
                    <span>${r.avaliacao}</span>
                </div>
                <p class="card-preco">${formatPreco(r.preco)}</p>
                <p class="card-descricao">${r.descricao.substring(0, 100)}...</p>
            </div>
        </article>
    `).join('');

    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => abrirModal(parseInt(card.dataset.id)));
    });
}

function filtrarRestaurantes() {
    const tipo = filtroTipo.value;
    const preco = filtroPreco.value;
    const regiao = filtroConcelho.value;
    const filtrados = restaurantes.filter(r => {
        const matchTipo = tipo === 'todos' || r.categoria === tipo;
        const matchPreco = preco === 'todos' || r.preco === preco;
        const matchRegiao = regiao === 'todos' || r.regiao === regiao;
        return matchTipo && matchPreco && matchRegiao;
    });
    renderRestaurantes(filtrados);
}

function abrirModal(id) {
    const r = restaurantes.find(rest => rest.id === id);
    if (!r) return;

    modalBody.innerHTML = `
        <img src="${r.imagem}" alt="${r.nome}" class="modal-img">
        <span class="modal-categoria">${r.categoria}</span>
        <h2>${r.nome}</h2>
        <div class="modal-info">
            <div class="modal-info-item">📍 ${r.localizacao} (${r.regiao})</div>
            <div class="modal-info-item">⭐ ${r.avaliacao} ${renderEstrelas(r.avaliacao)}</div>
            <div class="modal-info-item">💰 ${formatPreco(r.preco)}</div>
        </div>
        <div class="modal-horario">
            <h4>🕐 Horário</h4>
            <p>${r.horario}</p>
        </div>
        <p class="modal-descricao">${r.descricao}</p>
        <div class="modal-contacto">
            <h4>📞 Contacto</h4>
            <p>${r.contacto}</p>
            <p>${r.morada}</p>
        </div>
    `;
    modal.classList.add('show');
}

const listaRestaurantes = document.getElementById('listaRestaurantes');
const filtroTipo = document.getElementById('filtroTipo');
const filtroPreco = document.getElementById('filtroPreco');
const filtroConcelho = document.getElementById('filtroConcelho');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

modalClose.addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) modal.classList.remove('show'); });
filtroTipo.addEventListener('change', filtrarRestaurantes);
filtroPreco.addEventListener('change', filtrarRestaurantes);
filtroConcelho.addEventListener('change', filtrarRestaurantes);

loadRestaurantes();