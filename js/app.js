const btnPreview = $('#preview');
const btnDownload = $('#download');
const URL = window.URL || window.webkitURL;
const url = new URL(location.href);
const theme = url.searchParams.get('theme');
window.demoMode = url.searchParams.get('demo') != null;

if ('dark' === theme || 'light' === theme) {
  document.documentElement.dataset.theme = url.searchParams.get('mode');
}

if (isMobile()) {
  btnPreview.style.display = 'none';
} else {
  btnPreview.addEventListener('click', (ev) => {
    const data = getData();
    if (!validateData(data)) return;
    btnPreview.setAttribute('aria-busy', 'true');
    btnPreview.disabled = true;
    readCoverImage(
      (result) => {
        data.coverImage = result;
        createPdf(data).getBlob((blob) => {
          try {
            const urlCreator = URL;
            const pdfUrl = urlCreator.createObjectURL(blob);
            window.open(pdfUrl, 'dominusgenPreview');
          } catch (e) {
            reject(e);
          }
        });
      },
      () => {
        btnPreview.removeAttribute('aria-busy');
        btnPreview.disabled = false;
      }
    );
  });
}

btnDownload.addEventListener('click', (ev) => {
  const data = getData();
  if (!validateData(data)) return;
  btnDownload.setAttribute('aria-busy', 'true');
  btnDownload.disabled = true;
  readCoverImage(
    (result) => {
      data.coverImage = result;
      const title = data.title ? `dominus-${data.title}` : 'dominus';
      createPdf(data).download(slugify(title));
    },
    () => {
      btnDownload.removeAttribute('aria-busy');
      btnDownload.disabled = false;
    }
  );
});

// auto save
if (!demoMode) {
  let autosaveInterval = 30000; // 30 seconds
  let autosaving = false;
  function autoSave() {
    if (autosaving) return;
    autosaving = true;
    const data = getData(false);
    delete data.cover;
    localStorage.setItem('dominus-pt_BR', JSON.stringify(data));
    autosaving = false;
  }
  setInterval(autoSave, autosaveInterval);
}

// auto restore
document.addEventListener('DOMContentLoaded', () => {
  const dataJson = localStorage.getItem('dominus-pt_BR');
  try {
    const data = demoMode ? getDemo() : JSON.parse(dataJson || '{}');
    if (demoMode) {
      window.demoCoverImage = data.coverImage;
    }
    for (const key of Object.keys(data)) {
      if (!key) continue;
      const field = $(`#${key}`);
      if (!field) continue;
      field.value = data[key];
    }
  } catch (e) {
    console.error(e.message);
  }
});

function createPdf(data) {
  const pdf = pdfMake.createPdf(
    getDocumentDefination(data),
    getTableLayouts(data),
    getFonts(data)
  );
  return pdf;
}

function validateData(data) {
  if (demoMode) return true;

  data.title = data.title?.trim();
  if (!data.title) {
    return !!alert('Seu jogo precisa de um título');
  }
  if (!data.cover) {
    return !!alert('Seu jogo precisa de uma imagem de capa');
  }

  return true;
}

function getContent(data) {
  const columnGap = 40;
  return [
    // first page
    {
      columnGap,
      columns: [
        {
          stack: [
            // second column consists of paragraphs
            { text: data.title, style: 'header' },
            {
              text: `Escrito por "${data.author}".`,
              style: 'body',
              fontSize: 10,
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
              text:
                data.description ||
                'Uma breve descrição da ambientação do seu jogo, em geral em uma frase ou parágrafo curto.',
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
                [data.plot_1, data.mission_1, data.ifnot_1],
                [data.plot_2, data.mission_2, data.ifnot_2],
                [data.plot_3, data.mission_3, data.ifnot_3],
                [data.plot_4, data.mission_4, data.ifnot_4],
                [data.plot_5, data.mission_5, data.ifnot_5],
                [data.plot_6, data.mission_6, data.ifnot_6],
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
              [
                [data.archtype_1],
                [data.archtype_2],
                [data.archtype_3],
                [data.archtype_4],
                [data.archtype_5],
                [data.archtype_6],
              ],
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
                [data.place_1, data.char_1, data.event_1],
                [data.place_2, data.char_2, data.event_2],
                [data.place_3, data.char_3, data.event_3],
                [data.place_4, data.char_4, data.event_4],
                [data.place_5, data.char_5, data.event_5],
                [data.place_6, data.char_6, data.event_6],
              ]
            ),
            {
              text: 'BANCO DE IDEIAS',
              style: 'subheader',
            },
            createTable(
              [
                data.idea_col_1_name.toUpperCase(),
                data.idea_col_2_name.toUpperCase(),
                data.idea_col_3_name.toUpperCase(),
                data.idea_col_4_name.toUpperCase(),
              ],
              [
                [
                  data.idea_col_1_1,
                  data.idea_col_2_1,
                  data.idea_col_3_1,
                  data.idea_col_4_1,
                ],
                [
                  data.idea_col_1_2,
                  data.idea_col_2_2,
                  data.idea_col_3_2,
                  data.idea_col_4_2,
                ],
                [
                  data.idea_col_1_3,
                  data.idea_col_2_3,
                  data.idea_col_3_3,
                  data.idea_col_4_3,
                ],
                [
                  data.idea_col_1_4,
                  data.idea_col_2_4,
                  data.idea_col_3_4,
                  data.idea_col_4_4,
                ],
                [
                  data.idea_col_1_5,
                  data.idea_col_2_5,
                  data.idea_col_3_5,
                  data.idea_col_4_5,
                ],
                [
                  data.idea_col_1_6,
                  data.idea_col_2_6,
                  data.idea_col_3_6,
                  data.idea_col_4_6,
                ],
              ],
              {
                widths: ['auto', '*', '*', '*'],
              }
            ),
            // createSpacer(0),
            getRuleX(1, data),
            getRuleX(2, data),
            getRuleX(3, data),
            getRuleX(4, data),
            getRuleX(5, data),
            getRuleX(6, data),
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
              alignment: 'justify',
            },
            {
              text: 'REGRA 2: HISTÓRIA',
              style: 'subheader',
            },
            {
              text: 'Para começar a sua história, escolha (ou role) um Lugar na tabela de Cenas. Sempre que entrar em uma Cena, role um dado. Se cair 3 ou menos, role um Personagem. Se cair 4 ou mais, role um Evento. Você pode ir para uma nova cena se achar apropriado (e tenha resolvido qualquer conflito aparente).',
              alignment: 'justify',
            },
            {
              text: 'REGRA 3: DESAFIO',
              style: 'subheader',
            },
            {
              text: 'Sempre que seu personagem tentar fazer algo que possa dar errado, você tem um Desafio: role um dado. Se tirar 4 ou mais, você conseguiu vencê-lo. Se houver algo nesta situação que lhe dê vantagem nesse Desafio, role 2 dados e escolha o maior. Caso algo lhe dê desvantagem, role 2 dados e escolha o menor.',
              alignment: 'justify',
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
              alignment: 'justify',
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
              text: 'As regras do Dominus foram criadas pelo coletivo “Iniciativa Dominus” \ne são licenciadas sob uma Licença Creative Commons Atribuição 4.0 Internacional.',
              alignment: 'center',
              fontSize: 8,
            },
          ],
        },
        {
          stack: [
            {
              pageBreak: 'before',
              text: data.title,
              style: ['header', 'title'],
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
                    image: data.coverImage,
                    width: 340,
                  },
                ],
              ],
              {
                widths: ['*'],
                d6: false,
                layout: 'invisible',
                heights: 340,
                margin: 0,
              }
            ),
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
                    text: `Escrito por \n${data.author}`,
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

function getRuleX(index, data) {
  const rule_title = data[`rule_x_title_${index}`];
  const rule_text = data[`rule_x_text_${index}`];
  if (!rule_title || !rule_text) return null;
  return {
    text: [{ text: 'REGRA X - ' + rule_title, bold: true }, ': ' + rule_text],
    style: 'body',
  };
}
