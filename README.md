# Sistema de Enquete e Votação STV

## Descrição

Este projeto implementa um sistema de gerenciamento de enquetes com votação por STV (Single Transferable Vote). Ele permite a criação de enquetes, registro em uma planilha Google Sheets, coleta de votos e apuração dos resultados utilizando o método STV.

## Funcionalidades

* **Criação de enquetes:** Permite criar enquetes com título e lista de candidatos.
* **Registro de enquetes:** Registra os detalhes da enquete (título, link e candidatos) em uma planilha Google Sheets.
* **Coleta de votos:** Obtém os votos da enquete a partir de uma API externa.
* **Apuração STV:** Realiza a apuração dos votos utilizando o método STV e determina os vencedores.

## Como usar

1. **Criar uma enquete:** Utilize a função `criarEnquete(titulo, candidatos)` para criar uma nova enquete.
2. **Registrar a enquete:** Utilize a função `registrarEnquete(titulo, link, candidatos)` para registrar a enquete na planilha Google Sheets.
3. **Coletar os votos:** Utilize a função `obterVotos(pollId)` para obter os votos da enquete.
4. **Apurar os resultados:** Utilize a função `apuracaoSTV(votos, numVencedores)` para realizar a apuração dos votos e determinar os vencedores.
