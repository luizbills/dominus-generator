document.querySelector('#download').addEventListener('click', (ev) => {
  ev.preventDefault();
  createPdf((pdf, data) => {
    pdf.getDataUrl((dataUrl) => {
      OpenWindow(dataUrl, 'dominus');
    });
  });
});

function createPdf(callback) {
  const data = getData();
  const pdf = pdfMake.createPdf(
    getDocumentDefination(),
    getTableLayouts(),
    getFonts()
  );
  callback(pdf, data);
}

function getContent() {
  const columnGap = 40;
  return [
    // first page
    {
      columnGap,
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
              text: 'Este jogo é baseado no Dominus, um sistema de RPG sem mestre para jogos rápidos. Você encontrará todas as regras básicas do sistema no verso desta folha.',
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
            {
              text: 'CENAS',
              style: 'subheader',
            },
            createTable(
              ['LUGARES', 'PERSONAGENS (1 a 3)', 'EVENTOS (4 a 6)'],
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
              text: 'BANCO DE IDEIAS',
              style: 'subheader',
            },
            createTable(
              ['ASSUNTO', 'AÇÃO', 'COISA', 'QUALIDADE'],
              [
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
                ['', '', '', ''],
              ],
              {
                widths: ['*', '*', '*', '*'],
              }
            ),
            // createSpacer(0),
            {
              text: [
                { text: 'REGRA X - SASASASASA', bold: true },
                ': assasaasassasasa',
              ],
              style: 'body',
            },
          ],
        },
      ],
    },

    // Second page
    {
      columnGap,
      columns: [
        {
          stack: [
            {
              text: 'REGRAS BÁSICAS',
              style: 'header',
              alignment: 'center',
              pageBreak: 'before',
            },
            {
              text: 'Estas são as regras do sistema Dominus',
              style: 'body',
              alignment: 'center',
            },
            createSpacer(18),
            {
              text: 'REGRA 1: PREPARAÇÃO',
              style: 'subheader',
            },
            {
              text: 'Escolha (ou role) um Arquétipo na tabela e dê um nome para seu personagem. Depois role um dado para cada uma das três colunas na tabela de Trama.',
            },
            {
              text: 'REGRA 2: HISTÓRIA',
              style: 'subheader',
            },
            {
              text: 'Para começar a sua história, escolha (ou role) um Lugar na tabela de Cenas. Sempre que entrar em uma Cena, role um dado. Se cair 3 ou menos, role um Personagem. Se cair 4 ou mais, role um Evento. Você pode ir para uma nova cena se achar apropriado (e tenha resolvido qualquer conflito aparente).',
            },
            {
              text: 'REGRA 3: DESAFIO',
              style: 'subheader',
            },
            {
              text: 'Sempre que seu personagem tentar fazer algo que possa dar errado, você tem um Desafio: role um dado. Se tirar 4 ou mais, você conseguiu vencê-lo. Se houver algo nesta situação que lhe dê vantagem nesse Desafio, role 2 dados e escolha o maior. Caso algo lhe dê desvantagem, role 2 dados e escolha o menor.',
            },
            {
              text: 'REGRA 4: DILEMA',
              style: 'subheader',
            },
            {
              text: 'Sempre que tiver uma dúvida cuja resposta não seja óbvia, determine duas opções possíveis (sim ou não, esquerda ou direita, acontece A ou acontece B etc) e role um dado. Se cair 3 ou menos é a primeira opção, e se cair 4 ou mais é a segunda opção.',
            },
            {
              text: 'REGRA 5: BANCO DE IDEIAS',
              style: 'subheader',
            },
            {
              text: 'Sempre que precisar elaborar melhor um Lugar, Personagem ou Evento, role no Banco de Ideias e interprete o resultado de qualquer coluna de acordo com o Cenário.',
            },
            {
              text: 'REGRA X: ESPECIAL',
              style: 'subheader',
            },
            {
              text: 'Cada cenário pode ter mais regras únicas e especiais.',
            },
            createSpacer(60),
            createLine(),
            createSpacer(12),
            {
              image: 'ccby',
              width: 65,
              alignment: 'center',
              margin: [0, 0, 0, 6],
              link: 'https://creativecommons.org/licenses/by/4.0/deed.pt_BR',
            },
            {
              text: 'As regras do Dominus foram criadas pelo coletivo “Iniciativa Dominus” \ne foram distruibuidas sob uma Licença Creative Commons Atribuição 4.0 Internacional',
              alignment: 'center',
              fontSize: 8,
            },
          ],
        },
        {
          stack: [
            {
              pageBreak: 'before',
              text: 'NOME LEGAL DO SEU CENÁRIO',
              style: ['header', 'title'],
              alignment: 'center',
            },
            createSpacer(10),
            createLine(),
            createSpacer(10),
            {
              image: 'defaultCover',
              width: 340,
              alignment: 'center',
            },
            createSpacer(10),
            createLine(),
            createSpacer(10),
            createTable(
              null,
              [
                [
                  {
                    image: 'powererBy',
                    width: 180,
                  },
                  {
                    text: 'Escrito por \nXXXXXXXXX',
                    alignment: 'right',
                    margin: [0, 0, 20, 0],
                    bold: true,
                    fontSize: 16,
                  },
                ],
              ],
              {
                widths: ['auto', '*'],
                d6: false,
                layout: 'invisible',
              }
            ),
          ],
        },
      ],
    },
  ];
}
