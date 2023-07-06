document.querySelector('#download').addEventListener('click', (ev) => {
  ev.preventDefault();
  createPdf().getDataUrl((dataUrl) => {
    OpenWindow(dataUrl, 'dominus');
  });
});

const fonts = {
  AlfaSlabOne: {
    normal: location.origin + '/fonts/AlfaSlabOne-Regular.ttf',
  },
  Hind: {
    normal: location.origin + '/fonts/Hind-Regular.ttf',
    bold: location.origin + '/fonts/Hind-Bold.ttf',
  },
};

function createPdf() {
  return pdfMake.createPdf(getDocumentDefination(), null, fonts);
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
              text: 'Este jogo foi feito utilizando Dominus, um sistema de RPG sem mestre. Você encontrará todas as regras do Dominus no verso desta folha.',
            },
            {
              layout: 'lightHorizontalLines', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: ['*', 'auto', 100, '*'],

                body: [
                  ['First', 'Second', 'Third', 'The last one'],
                  ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
                  [
                    { text: 'Bold value', bold: true },
                    'Val 2',
                    'Val 3',
                    'Val 4',
                  ],
                ],
              },
            },
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
    pageMargins: [25, 25],
    styles: getStyles(),
    pages: 6,
    defaultStyle: {
      font: 'Hind',
      fontSize: 9,
    },
    content: getContent(),
  };
}

function getStyles() {
  return {
    header: {
      font: 'AlfaSlabOne',
      fontSize: 26,
    },
  };
}

function OpenWindow(content, title = '') {
  var _window = window.open(content, title);
  if (_window) {
    // _window.document.write(
    //   `<html><head><title>${title}</title><style>body{margin:0; overflow: hidden;}</style></head><body height="100%" width="100%"><iframe src="${content}" height="100%" width="100%"></iframe></body></html>`
    // );
    _window.console.log(_window);
  }
  return _window;
}
