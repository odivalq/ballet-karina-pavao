/**
 * Ballet Karina Pavão - Sistema de Carregamento JSON
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se existe o elemento de notícias (Home)
    if (document.getElementById('news-feed')) {
        carregarUltimaNoticia();
    }
    // Verifica se existe o grid de eventos (Página de Eventos)
    if (document.getElementById('lista-andamento')) {
        carregarEventos();
    }
});

// Busca a última postagem do noticias.json
async function carregarUltimaNoticia() {
    try {
        const response = await fetch('noticias.json');
        const noticias = await response.json();
        const ultima = noticias[0]; // Assume que a primeira é a mais recente

        const container = document.getElementById('news-feed');
        container.innerHTML = `
            <div class="news-card">
                <img src="${ultima.imagem}" class="news-img" alt="Notícia">
                <div class="news-info">
                    <h3>${ultima.titulo}</h3>
                    <p>${ultima.texto}</p>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Erro ao buscar notícias:", err);
    }
}

// Busca eventos e distribui entre 'Andamento' e 'Passados'
async function carregarEventos() {
    try {
        const response = await fetch('eventos.json');
        const eventos = await response.json();

        const gridAndamento = document.getElementById('lista-andamento');
        const gridPassados = document.getElementById('lista-passados');

        eventos.forEach(evt => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${evt.imagens[0]}')"></div>
                <div class="card-body">
                    <h4>${evt.titulo}</h4>
                    <p>${evt.data}</p>
                </div>
            `;
            card.onclick = () => abrirModalEvento(evt);

            if (evt.status === 'andamento') {
                gridAndamento.appendChild(card);
            } else {
                gridPassados.appendChild(card);
            }
        });
    } catch (err) {
        console.error("Erro ao buscar eventos:", err);
    }
}

// Abre o modal e preenche com fotos e vídeos do JSON
function abrirModalEvento(evt) {
    const modal = document.getElementById('modalEvent');
    const content = document.getElementById('modal-body-content');

    // Monta fotos
    let fotosHtml = evt.imagens.map(img => `<img src="${img}" alt="Foto">`).join('');
    
    // Monta vídeos (espera URL de embed do YouTube/Vimeo)
    let videosHtml = evt.videos.map(vid => `
        <div class="video-container">
            <iframe width="100%" height="315" src="${vid}" frameborder="0" allowfullscreen></iframe>
        </div>
    `).join('');

    // Botão de inscrição se for evento em andamento
    let btnInscricao = evt.status === 'andamento' 
        ? `<a href="inscricao.html" class="btn-reg">Inscrever-se Agora</a>` 
        : '';

    content.innerHTML = `
        <h2>${evt.titulo}</h2>
        <p><strong>Data:</strong> ${evt.data}</p>
        <p>${evt.descricao}</p>
        ${btnInscricao}
        <div class="gallery-grid">${fotosHtml}</div>
        <div class="videos-list">${videosHtml}</div>
    `;

    modal.style.display = "block";
}

function closeModal() {
    document.getElementById('modalEvent').style.display = "none";
}