// import fs from 'fs';
// import elementos from './json/elementos.json' assert { type: 'json' };
fetch('js/json/elementos.json')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setup(data)
    });

const tabela = [[], [], [], [], [], [], [], [], []];

function setup(elementos) {
  for (const key in elementos) {
    const elemento = elementos[key];
    if (elemento.classe === 'Lantanídeos' || elemento.classe === 'Actinídios') {
      tabela[parseInt(elemento.periodo) + 1].push(elemento);
      continue;
    }
    tabela[parseInt(elemento.periodo) - 1].push(elemento);
  }

  for (const row in tabela) {
    $('table').append(`<tr role="row" aria-rowindex="${parseInt(row) + 1}"></tr>`);
    let aux = 2;
    for (const elemento of tabela[row]) {
      const classe = elemento.classe.replace(/\s/gm, '-');
      let index = elemento.grupo[0];
      if (elemento.classe === 'Lantanídeos' || elemento.classe === 'Actinídios') {
        index = ++aux;
      }
      $('tr').last().append(`
        <td role="cell" aria-colindex="${index}" data-classe="${classe}">
          <button role="presentation" data-bs-toggle="modal" data-bs-target="#detalhesModal" data-bs-elemento="${elemento.numero}">
            <span class="visually-hidden">${elemento.nome}</span>
            <span class="numero" aria-hidden="true"><span class="visually-hidden">Número atômico: </span>${elemento.numero}</span>
            <span class="simbolo"><span class="visually-hidden">Símbolo: </span>${elemento.simbolo}</span>
            <span class="massa"><span class="visually-hidden">Massa: </span>${elemento.massa}</span>
          </button>
        </td>
      `.trim());
    }
  }

  $('[aria-colindex="18"]').slice(0, 1)
      .before('<td role="cell" colspan="16" aria-colspan="16"></td>');

  $('[aria-colindex="13"]').slice(0, 2)
      .before('<td role="cell" colspan="10" aria-colspan="10"></td>');

  $('[aria-colindex="2"]').slice(-2)
      .add($('[aria-colindex="17"]').slice(-2))
      .after('<td role="cell"></td>');

  $('[aria-colindex="3"]').slice(-2)
      .before('<td role="cell" colspan="2" aria-colspan="2"></td>');

  const modal = document.querySelector('#detalhesModal');
  // modal.addEventListener('show.bs.modal', (e) => {
  modal.addEventListener('shown.bs.modal', (e) => {
    const numero = e.relatedTarget.getAttribute('data-bs-elemento');
    const elemento = elementos[numero];

    const content = document.getElementById('detalhesDescricao');
    content.innerHTML = `
    <h2 class="fs-5">${elemento.nome}</h2>
    <div aria-live="polite">
    <ul tabindex="1" role="presentation" lang="pt-BR" >
      <li>Número atômico: ${elemento.numero}.</li>
      <li>Símbolo: ${elemento.simbolo}.</li>
      <li>Massa atômica: ${elemento.massa}.</li>
      <li>Classificação: ${elemento.classe}.</li>
      <li>Período: ${elemento.periodo}º período.</li>
      <li>Grupo: ${elemento.grupo[0]}º grupo.</li>
      <li>Família: ${elemento.grupo[1]}, ${elemento.grupo[2]}.</li>
      <li>Configuração eletrônica: ${elemento.configuracao}.</li>
      <li>Curiosidade: ${elemento.curiosidade}.</li>
    </ul>
    </div>
  `.trim();

    // Acessibilidade: força leitura após conteúdo visível
    content.setAttribute('tabindex', '-1');
    content.setAttribute('role', 'document');
    content.setAttribute('aria-live', 'polite');
    content.focus();
  });
}

function test() {
  document.getElementById('detalhesDescricao').innerHTML = '<p>Ferro: Número atômico 26</p>';
  document.getElementById('detalhesDescricao').focus();
}
