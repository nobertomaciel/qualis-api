// Endereço base da API
const API = 'http://localhost:8080/api';

// Carrega as áreas da API e popula os dropdowns
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
function mostraErro(mensagem) {
    document.getElementById('corpo-resultados').innerHTML =
    `<p class='estado-vazio' style="color: #c0504a;">${mensagem}</p>`;
    document.getElementById('contagem-resultados').textContent = '0 periódicos';

}

//Montar tabela com resultados

function renderizarTabela(periodicos){
    const contagem = document.getElementById('contagem-resultados');
    const corpo = document.getElementById('corpo-resultados');

    contagem.textContent = `${periodicos.length} periódico${periodicos.length}`;

    if (periodicos.length === 0) {
        corpo.innerHTML = '<p class="estado-vazio">Nenhum periódico encontrado</p>'
        return;

    }
    const linhas = periodicos.map(p => {
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

    corpo.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ISSN</th>
                    <th>Título</th>
                    <th>Área de Avaliação</th>
                    <th>Estrato</th>
                </tr>
            </thead>
            <tbody>${linhas}</tbody>
        </table>`;

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