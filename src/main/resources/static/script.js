// Endereço base da API
const API = 'http://localhost:8080/api';

// Variáveis de paginação
let todosResultados = [];
let paginaAtual = 1;
let limitePorPagina = 30;

// Controle do select de limite
document.getElementById('select-limite').addEventListener('change', function() {
    if (this.value === 'personalizado') {
        document.getElementById('input-limite').style.display = 'inline-block';
        document.getElementById('btn-aplicar-limite').style.display = 'inline-block';
        document.getElementById('input-limite').focus();
    } else {
        document.getElementById('input-limite').style.display = 'none';
        document.getElementById('btn-aplicar-limite').style.display = 'none';
        limitePorPagina = this.value === 'todos' ? Infinity : parseInt(this.value);
        paginaAtual = 1;
        renderizarPagina();
    }
});

// Validação do campo personalizado — só aceita números
document.getElementById('input-limite').addEventListener('keydown', function(e) {
    const permitidos = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    if (permitidos.includes(e.key)) return;
    if (!/^[0-9]$/.test(e.key)) e.preventDefault();
});

document.getElementById('input-limite').addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
});

document.getElementById('btn-aplicar-limite').addEventListener('click', function() {
    const val = parseInt(document.getElementById('input-limite').value);
    if (!val || val < 1) {
        document.getElementById('input-limite').style.border = '1px solid #c0504a';
        return;
    }
    document.getElementById('input-limite').style.border = '1px solid #d0d0c8';
    limitePorPagina = val;
    paginaAtual = 1;
    renderizarPagina();
});

async function carregarAreas() {
    const resposta = await fetch(`${API}/areas`);
    const areas = await resposta.json();

    const selectArea = document.getElementById('select-area');
    const selectAreaGrafico = document.getElementById('select-area-grafico');

    areas.forEach(area => {
        const opcao = document.createElement('option');
        opcao.value = area;
        opcao.textContent = area;

        selectArea.appendChild(opcao);
        selectAreaGrafico.appendChild(opcao.cloneNode(true));
    });
}

//Mostra mensagem de erro
function mostrarErro(mensagem) {
    document.getElementById('corpo-resultados').innerHTML =
    `<p class='estado-vazio' style="color: #c0504a;">${mensagem}</p>`;
    document.getElementById('contagem-resultados').textContent = '0 periódicos';

}

function mostrarCarregando() {
    document.getElementById('corpo-resultados').innerHTML =
        '<p class="estado-vazio">Buscando...</p>';
}

// Renderiza a página atual
function renderizarPagina() {
    const corpo = document.getElementById('corpo-resultados');

    if (todosResultados.length === 0) {
        corpo.innerHTML = '<p class="estado-vazio">Nenhum periódico encontrado</p>';
        return;
    }

    const isTotal = limitePorPagina === Infinity;
    const totalPaginas = isTotal ? 1 : Math.ceil(todosResultados.length / limitePorPagina);
    paginaAtual = Math.min(paginaAtual, totalPaginas);

    const inicio = isTotal ? 0 : (paginaAtual - 1) * limitePorPagina;
    const fim = isTotal ? todosResultados.length : Math.min(inicio + limitePorPagina, todosResultados.length);
    const fatia = todosResultados.slice(inicio, fim);

    const linhas = fatia.map(p => {
        const issn    = p.issn    || p['ISSN']                || '-';
        const titulo  = p.titulo  || p['Título']               || '-';
        const area    = p.areaAvaliacao || p['Área de Avaliação'] || '-';
        const estrato = p.estrato || p['Estrato']              || '-';
        return `<tr>
            <td>${issn}</td>
            <td>${titulo}</td>
            <td>${area}</td>
            <td><span class="tag ${estrato}">${estrato}</span></td>
        </tr>`;
    }).join('');

    let paginacao = '';
    if (!isTotal && totalPaginas > 1) {
        paginacao = `
            <div class="controles-pagina">
                <span class="info-pagina">Mostrando ${inicio + 1}–${fim} de ${todosResultados.length}</span>
                <div>
                    <button class="btn-pagina" onclick="mudarPagina(-1)" ${paginaAtual === 1 ? 'disabled' : ''}>← Anterior</button>
                    <button class="btn-pagina" onclick="mudarPagina(1)" ${paginaAtual === totalPaginas ? 'disabled' : ''}>Próxima →</button>
                </div>
            </div>`;
    }

    corpo.innerHTML = `
        <table>
            <thead>
                <tr><th>ISSN</th><th>Título</th><th>Área de Avaliação</th><th>Estrato</th></tr>
            </thead>
            <tbody>${linhas}</tbody>
        </table>
        ${paginacao}`;
}

// Atualiza a tabela com novos resultados
function renderizarTabela(periodicos) {
    todosResultados = periodicos;
    paginaAtual = 1;
    const contagem = document.getElementById('contagem-resultados');
    const selectLimite = document.getElementById('select-limite');
    contagem.textContent = `${periodicos.length} periódico${periodicos.length !== 1 ? 's' : ''}`;
    selectLimite.style.display = periodicos.length > 0 ? 'inline-block' : 'none';
    renderizarPagina();
}

// Muda de página
function mudarPagina(direcao) {
    paginaAtual += direcao;
    renderizarPagina();
    document.querySelector('.secao-resultados').scrollIntoView({ behavior: 'smooth' });
}

// Busca por ISSN
async function buscarPorIssn() {
    const issn = document.getElementById('input-issn').value.trim();
    if (!issn) return;

    mostrarCarregando();
    try {
        const resposta = await fetch(`${API}/issn/${encodeURIComponent(issn)}`);
        if (!resposta.ok) {
            const erro = await resposta.json();
            mostrarErro(erro.message);
            return;
        }
        const periodico = await resposta.json();
        renderizarTabela(periodico ? [periodico] : []);
    } catch (e) {
        mostrarErro('Erro ao conectar com a API. Verifique se o servidor está rodando.');
    }
}

// Busca por título
async function buscarPorTitulo() {
    const titulo = document.getElementById('input-titulo').value.trim();
    if (!titulo) return;


    mostrarCarregando();
    try {
        const resposta = await fetch(`${API}/titulo?titulo=${encodeURIComponent(titulo)}`);
        if (!resposta.ok) {
            const erro = await resposta.json();
            mostrarErro(erro.message);
            return;
        }
        renderizarTabela(await resposta.json());
    } catch (e) {
        mostrarErro('Erro ao conectar com a API. Verifique se o servidor está rodando.');
    }
}

// Busca por área
async function buscarPorArea() {
    const area = document.getElementById('select-area').value;
    if (!area) return;


    mostrarCarregando();
    try {
        const resposta = await fetch(`${API}/area?area=${encodeURIComponent(area)}`);
        if (!resposta.ok) {
            const erro = await resposta.json();
            mostrarErro(erro.message);
            return;
        }
        renderizarTabela(await resposta.json());
    } catch (e) {
        mostrarErro('Erro ao conectar com a API. Verifique se o servidor está rodando.');
    }
}

// Busca por estrato
async function buscarPorEstrato() {
    const estrato = document.getElementById('select-estrato').value;
    if (!estrato) return;


    mostrarCarregando();
    try {
        const resposta = await fetch(`${API}/estrato?estrato=${encodeURIComponent(estrato)}`);
        if (!resposta.ok) {
            const erro = await resposta.json();
            mostrarErro(erro.message);
            return;
        }
        renderizarTabela(await resposta.json());
    } catch (e) {
        mostrarErro('Erro ao conectar com a API. Verifique se o servidor está rodando.');
    }
}
// Busca distribuição por estrato e monta o gráfico
async function buscarDistribuicao() {
    const area = document.getElementById('select-area-grafico').value;
    if (!area) return;

    document.getElementById('barras-grafico').innerHTML =
        '<p class="estado-vazio">Carregando...</p>';

    try {
        const resposta = await fetch(`${API}/distribuicao?area=${encodeURIComponent(area)}`);
        if (!resposta.ok) {
            const erro = await resposta.json();
            document.getElementById('barras-grafico').innerHTML =
                `<p class="estado-vazio" style="color: #c0504a;">${erro.message}</p>`;
            return;
        }

        const dados = await resposta.json();
        const maximo = Math.max(...dados.map(d => d.quantidade));

        const barras = dados.map(d => {
            const largura = Math.round((d.quantidade / maximo) * 100);
            return `
                <div class="linha-barra">
                    <span class="rotulo-barra">${d.estrato}</span>
                    <div class="trilho-barra">
                        <div class="preenchimento-barra tag ${d.estrato}" style="width: ${largura}%">
                            <span>${d.quantidade}</span>
                        </div>
                    </div>
                </div>`;
        }).join('');

        document.getElementById('barras-grafico').innerHTML =
            `<div class="barras">${barras}</div>`;

    } catch (e) {
        document.getElementById('barras-grafico').innerHTML =
            '<p class="estado-vazio" style="color: #c0504a;">Erro ao conectar com a API.</p>';
    }
}

// Conecta os botões às funções
document.getElementById('btn-issn').addEventListener('click', buscarPorIssn);
document.getElementById('btn-titulo').addEventListener('click', buscarPorTitulo);
document.getElementById('btn-area').addEventListener('click', buscarPorArea);
document.getElementById('btn-estrato').addEventListener('click', buscarPorEstrato);
document.getElementById('btn-grafico').addEventListener('click', buscarDistribuicao);

// Permite buscar com Enter nos campos de texto
document.getElementById('input-issn').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarPorIssn();
});
document.getElementById('input-titulo').addEventListener('keydown', e => {
    if (e.key === 'Enter') buscarPorTitulo();
});

// Inicia carregando as áreas quando a página carregar
carregarAreas();