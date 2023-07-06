function getStyles() {
  return {
    header: {
      font: 'AlfaSlabOne',
      lineHeight: 1,
      fontSize: 22,
      margin: [0, 0, 0, 0],
    },
    subheader: {
      font: 'Hind',
      fontSize: 10,
      lineHeight: 1,
      bold: true,
      margin: [0, 6, 0, -2],
    },
    tableHeader: {
      bold: true,
    },
    d6cell: {
      bold: true,
    },
    body: {
      margin: [0, 0, 0, 3],
    },
    defaultStyle: {
      font: getDefaultFont(),
      fontSize: 9,
      lineHeight: 0.9,
      alignment: 'justify',
    },
  };
}
