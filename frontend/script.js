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