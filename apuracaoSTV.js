function apuracaoSTV(votos, numVencedores) {
    let candidatos = [...new Set(votos.flat())];
    let vencedores = [];
    let rodada = 1;
  
    while (vencedores.length < numVencedores && candidatos.length > 0) {
      console.log(`\nRodada ${rodada}:`);
      const totais = calcularTotais(votos, candidatos);
  
      const quociente = Math.floor(votos.length / (numVencedores + 1)) + 1;
      const eleitosNestaRodada = totais.filter(t => t.total >= quociente).map(t => t.candidato);
  
      eleitosNestaRodada.forEach(candidato => {
        vencedores.push(candidato);
        candidatos = candidatos.filter(c => c !== candidato);
      });
  
      if (vencedores.length < numVencedores) {
        const menosVotado = totais[0].candidato;
        console.log(`Menos votado: ${menosVotado}`);
        candidatos = candidatos.filter(c => c !== menosVotado);
  
        votos = redistribuirVotos(votos, menosVotado);
      }
  
      rodada++;
    }
  
    return vencedores;
  }