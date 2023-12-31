function getTableLayouts(data) {
  const dash = { length: 1, space: 1 };
  const def = {
    hLineWidth(i, node) {
      if (0 === i) return 1;
      return i === 1 || i === node.table.body.length ? 1.5 : 1;
    },
    vLineWidth(i, node) {
      return i === 0 || i === node.table.widths.length ? 0 : 1;
    },
    hLineColor(i, node) {
      return '#000';
    },
    vLineColor(i, node) {
      return 'black';
    },
    hLineStyle(i, node) {
      if (i <= 1 || i === node.table.body.length) {
        return null;
      }
      return { dash };
    },
    fillColor(rowIndex, node, columnIndex) {
      return rowIndex % 2 === 0 ? '#efefef' : null;
    },
  };
  return {
    invisible: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
    },
    noHeaders: {
      ...def,
      hLineWidth(i, node) {
        return i === 0 || i === node.table.body.length ? 1.5 : 1;
      },
      hLineStyle(i, node) {
        if (i === 0 || i === node.table.body.length) {
          return null;
        }
        return { dash };
      },
    },
    default: def,
  };
}

function createTable(headers, lines, opts = {}) {
  const object = {
    layout: opts.layout || (!headers ? 'noHeaders' : 'default'),
    table: {
      headerRows: opts.headerRows || 1,
      widths: [],
      heights: opts.heights || null,
      body: [],
    },
    margin: opts.margin || [0, 1, 0, 2], // [left, top, right, bottom]
  };

  if (opts.widths) {
    object.table.widths = opts.widths;
  } else {
    object.table.widths = Array(lines[0].length).fill('*');
  }

  if (object.table.widths.length > 1) {
    object.table.widths[0] = 'auto';
  }

  opts.d6 = opts.d6 == null ? true : opts.d6;

  if (opts.d6) {
    object.table.widths.unshift('auto');
  }

  if (headers && headers.length > 0) {
    const headerLine = [];
    if (opts.d6) {
      headerLine.push({
        text: 'd6',
        alignment: 'center',
        style: 'tableHeader',
      });
    }
    for (let header of headers) {
      if ('string' === typeof header) {
        header = { text: header, style: 'tableHeader' };
      }
      headerLine.push(header);
    }
    object.table.body.push(headerLine);
  }

  let i = 1;
  for (const line of lines) {
    const lineContent = [];
    if (opts.d6) {
      lineContent.push({
        text: i++,
        style: 'd6Cell',
      });
    }
    for (const value of line) {
      lineContent.push(
        typeof value !== 'string'
          ? value
          : {
              text: value,
              style: 'tableCell',
            }
      );
    }
    object.table.body.push(lineContent);
  }

  return object;
}
