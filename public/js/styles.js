function getStyles() {
  const bodyFontFamily = getDefaultFont();
  const styles = {
    defaultStyle: {
      font: bodyFontFamily,
      fontSize: 8,
      lineHeight: 0.9,
      alignment: 'left',
    },
    body: {},
    title: {
      fontSize: 26,
    },
    header: {
      font: 'AlfaSlabOne',
      lineHeight: 1,
      fontSize: 22,
      margin: [0, 0, 0, 0], // [left, top, right, bottom]
      alignment: 'left',
    },
    subheader: {
      fontSize: 9,
      lineHeight: 1,
      characterSpacing: 0.5,
      bold: true,
      margin: [0, 6, 0, -2], // [left, top, right, bottom]
      alignment: 'left',
    },
    tableHeader: {
      fontSize: 8,
      bold: true,
    },
    tableCell: {
      fontSize: 8,
    },
    d6Cell: {
      fontSize: 8,
      alignment: 'center',
      bold: true,
    },
    rules_x: {
      fontSize: 8,
      alignment: 'justify',
      margin: [0, 2, 0, 0], // [left, top, right, bottom]
    },
    after_tables: {
      fontSize: 8,
      alignment: 'justify',
      margin: [0, 2, 0, 0], // [left, top, right, bottom]
    },
    dominus_rules: {
      fontSize: 9,
      margin: [0, 0, 0, 6], // [left, top, right, bottom]
    },
  };
  return styles;
}
