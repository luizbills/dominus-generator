document.querySelector('#download').addEventListener('click', (ev) => {
  ev.preventDefault();
  createPdf().getDataUrl((dataUrl) => {
    OpenWindow(dataUrl, 'dominus');
  });
});

function createPdf() {
  return pdfMake.createPdf(
    getDocumentDefination(),
    getTableLayouts(),
    getFonts()
  );
}

function getContent() {
  return [
    // first page
    {
      columnGap: 25,
      columns: [
        {
          stack: [
            // second column consists of paragraphs
            { text: 'NOME DO CENÁRIO', style: 'header' },
            {
              text: 'Este jogo foi escrito por "NOME DO AUTOR" e foi publicado sob a Licença CC BY 4.0 (Creative Commons Atribuição 4.0 Internacional).',
              style: 'body',
            },
            {
              text: 'REGRAS',
              style: 'subheader',
            },
            {
              style: 'body',
              text: 'Este jogo foi feito utilizando Dominus, um sistema de RPG sem mestre para jogos rápidos. Você encontrará todas as regras básicas do sistema no verso desta folha.',
            },
            {
              text: 'AMBIENTAÇÃO',
              style: 'subheader',
            },
            {
              style: 'body',
              text: 'Uma breve descrição da ambientação do seu jogo, em geral em uma frase ou parágrafo curto.',
            },
            {
              text: 'TRAMA',
              style: 'subheader',
            },
            {
              style: 'body',
              text: 'Role (ou escolha) uma linha de cada uma dessas três colunas:',
            },
            createTable(
              ['ALGO ACONTECEU...', 'VOCÊ PRECISA...', 'SENÃO...'],
              [
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
                ['', '', ''],
              ]
            ),
            {
              text: 'ARQUÉTIPOS',
              style: 'subheader',
            },
            {
              style: 'body',
              text: 'Role (ou escolha) na tabela abaixo para montar seu personagem:',
            },
            createTable(
              null,
              [['bla'], ['bla'], ['bla'], ['bla'], ['bla'], ['bla']],
              {
                headerRows: 0,
              }
            ),
          ],
        },
        {
          stack: [
            // second column consists of paragraphs
            'paragraph A',
            'paragraph B',
            'these paragraphs will be rendered one below another inside the column',
          ],
        },
      ],
    },
    {
      text: 'Regras',
      pageBreak: 'before',
    },
  ];
}

function getDocumentDefination() {
  return {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: 25,
    styles: getStyles(),
    pages: 6,
    defaultStyle: getStyles().defaultStyle,
    content: getContent(),
  };
}

function OpenWindow(content, title = '') {
  var _window = window.open(content, title);
  return _window;
}
