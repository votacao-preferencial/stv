const apiKey = 'op_J_anEWNnPNdRshb';
const spreadsheetId = '1BCJo1ek8RLJSVF7qoK1sKGmpSvY3XsNyeXkcKBqm7xc';
const sheetName = 'distribuicao';
const apiURL = 'https://openpoll.api';

const options = {
    headers: {
        Authorization: `Bearer ${apiKey}`,
    },
};

function criarEnquete(titulo, candidatos) {
    const payload = {
        name: titulo,
        question: 'Vote em seus candidatos favoritos (em ordem de preferência):',
        options: candidatos,
    };

    const requestOptions = {
        ...options,
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
    };

    const response = UrlFetchApp.fetch(`${apiURL}/poll/create`, requestOptions);
    const jsonResponse = JSON.parse(response.getContentText());
    return jsonResponse.url;
}

function registrarEnquete(titulo, link, candidatos) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const newRow = sheet.getLastRow() + 1;

    sheet.getRange(newRow, 1, 1, 2 + candidatos.length).setValues([[titulo, link, ...candidatos]]);
}

function obterDadosEnquete(titulo) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();

    const enqueteData = data.find(row => row[0] === titulo);
    if (enqueteData) {
        return {
            link: enqueteData[1],
            candidatos: enqueteData.slice(2),
        };
    }
    return null;
}

function obterVotos(pollId) {
    const requestOptions = {
        ...options,
        method: 'get',
    };

    const response = UrlFetchApp.fetch(`${apiURL}/poll/${pollId}/results`, requestOptions);
    const jsonResponse = JSON.parse(response.getContentText());
    return jsonResponse.results.map(result => result.option);
}

function apuracaoSTV(votos, numVencedores) {
    let candidatos = [...new Set(votos.flat())];
    let vencedores = [];
    let rodada = 1;

    while (vencedores.length < numVencedores && candidatos.length > 0) {
        console.log(`\nRodada ${rodada}:`);
        const totais = calcularTotais(votos, candidatos);

        const menosVotado = totais[totais.length - 1].candidato;
        console.log(`Menos votado: ${menosVotado}`);

        candidatos = candidatos.filter(c => c !== menosVotado);
        votos = redistribuirVotos(votos, menosVotado);
        rodada++;
    }

    console.log(`\nOs candidatos ${vencedores.join(', ')} venceram por eliminação!`);
    return vencedores;
}

function calcularTotais(votos, candidatos) {
    const resultados = candidatos.reduce((acc, candidato) => ({...acc, [candidato]: 0}), {});

    votos.forEach(voto => {
        voto.forEach((candidato, index) => {
            if (resultados[candidato] !== undefined) {
                resultados[candidato] += (voto.length - index);
            }
        });
    });

    return Object.entries(resultados).map(([candidato, total]) => ({ candidato, total }))
        .sort((a, b) => b.total - a.total);
}

function redistribuirVotos(votos, eliminado) {
    return votos.map(voto => voto.filter(candidato => candidato !== eliminado));
}

// Teste com dados fictícios
const dados = [
    ['Candidato A', 'Candidato B', 'Candidato C'],
    ['Candidato B', 'Candidato A', 'Candidato C'],
    ['Candidato C', 'Candidato B', 'Candidato A'],
    ['Candidato A', 'Candidato C', 'Candidato B'],
    ['Candidato B', 'Candidato C', 'Candidato A'],
];

const numVencedores = 2;
const vencedores = apuracaoSTV(dados, numVencedores);
console.log(`Vencedores: ${vencedores.join(', ')}`);

const resultado = calcularTotais(dados, [...new Set(dados.flat())]);
console.table(resultado);