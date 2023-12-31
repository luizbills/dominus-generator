/**
 * @param {string} selector
 * @param {HTMLElement|null} root
 * @returns {HTMLElement}
 */
function $(selector, root = document) {
  return root.querySelector(selector);
}

function $$(selector, root = document) {
  return root.querySelectorAll(selector);
}

function getDocumentDefination(data) {
  return {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: 25,
    styles: getStyles(data),
    pages: 2,
    defaultStyle: getStyles().defaultStyle,
    images: getImages(data),
    content: getContent(data),
    info: {
      title: cleanString(data.title),
      author: cleanString(data.author),
      subject: 'Jogo de RPG baseado no Dominus',
      keywords: 'ttrpg, solo, gmless, dominus',
      creator: 'DOMINUSGEN <https://bills.itch.io/dominusgen>',
    },
  };
}

function getUrl(path) {
  const base = location.origin + location.pathname.replace('index.html', '');
  return base + path;
}

function createSpacer(size) {
  return {
    text: '',
    margin: [0, 0, 0, size],
  };
}

function createLine() {
  return {
    image: 'line',
    width: 380,
    opacity: 0.25,
  };
}

function getImages(data) {
  return {
    ccby: getUrl('images/ccby.png'),
    powererBy: getUrl('images/powered-by.png'),
    line: getUrl('images/line.png'),
  };
}

function slugify(str) {
  return String(str)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // remove consecutive hyphens
}

function resetCoverField() {
  const coverFile = $('.cover-file');
  if (coverFile) coverFile.value = '';
}

function getCover() {
  const input = $('.cover-file');
  return {
    type: 'file',
    value: input.files ? input.files[0] : null,
  };
}

function readCoverImage(callback) {
  const cover = getCover();
  const file = cover.value;

  if (!file && window.demoCoverImage) {
    callback(false, window.demoCoverImage);
    return;
  }

  const fr = new FileReader();
  fr.addEventListener('load', function (evt) {
    let error = false;
    if (!file.type.includes('image')) {
      error = 'Arquivo inválido para imagem da capa.';
    }
    callback(error, !error ? evt.target.result : null);
  });

  if (file) {
    fr.readAsDataURL(file);
  } else {
    console.error('Escolha uma imagem para a capa.');
    callback(true, null);
  }
}

function validateCover() {
  const cover = getCover();
  if (!cover.value && !window.demoCoverImage) {
    alert('Seu jogo precisa de uma imagem de capa');
    return false;
  }
  return true;
}

function getData(format = true) {
  const root = $('#fields');
  const fields = $$('input, textarea, select', root);
  const advanced = getAdvancedOptions();
  const data = {};

  for (const field of fields) {
    if (!field.id) continue;
    switch (field.type) {
      case 'checkbox':
        data[field.id] = field.checked ? 'yes' : '';
        break;
      default:
        data[field.id] = truncate(field.value || '', field.maxLength);
        break;
    }
    data[field.id] = truncate(field.value || '', field.maxLength);
  }

  data.advanced = format ? formatData(advanced) : advanced;

  return format ? formatData(data) : data;
}

function formatData(data) {
  for (const key of Object.keys(data)) {
    if (!data[key] || 'string' !== typeof data[key]) continue;
    data[key] = data[key].trim().replace(/\\n/g, '\n');
  }
  return data;
}

function hasData() {
  const data = getData();
  return Object.values(data).join('').trim() !== '';
}

function validateData(data) {
  data.title = trim(data.title);

  if (!data.title) {
    alert('Informe o título do jogo');
    return false;
  }

  if (!data.author) {
    alert('Informe o nome do autor(a) do jogo');
    return false;
  }

  return true;
}

function exportData() {
  const data = getData(false);

  if (!validateData(data)) return;

  const exportJson = {
    version: 1,
    data,
  };
  const filename = 'dominusgen-' + slugify(data.title);
  downloadObjectAsJson(exportJson, filename);
}

function getAdvancedOptions() {
  const root = $('#advanced');
  const fields = $$('input, select, textarea', root);
  const opts = {};

  for (const field of fields) {
    if (!field.id) continue;
    switch (field.type) {
      case 'checkbox':
        opts[field.id] = field.checked ? 'yes' : '';
        break;
      default:
        opts[field.id] = truncate(field.value || '', field.maxLength);
        break;
    }
  }

  return {
    ...opts,
  };
}

function importJsonFile(file, callback) {
  if (!file) return;

  const fr = new FileReader();

  if ('application/json' !== file.type) {
    const error = 'Tipo de arquivo inválido';
    return callback(error, null);
  }

  fr.addEventListener('load', function (evt) {
    let error = false;

    callback(error, !error ? evt.target.result : null);
  });

  if (file) {
    fr.readAsText(file, 'UTF-8');
  }
}

function restoreDataFromObject(object) {
  const data = getData(false);
  const result = {};

  for (const key of Object.keys(data)) {
    if ('advanced' === key) continue;
    if ('string' !== typeof object.data[key]) {
      console.error('Invalid value in key: ' + key);
      continue;
    }
    result[key] = truncate(object.data[key]);
  }

  // load advanced options
  object.data.advanced = object.data.advanced || {};
  result.advanced = {};
  for (const key of Object.keys(data.advanced)) {
    const value = object.data.advanced[key];
    if ('string' !== typeof value) {
      console.error('Invalid advanced value in key: ' + key, value);
      continue;
    }
    result.advanced[key] = truncate(value);
  }
  fillFields(result);
}

function fillFields(data) {
  for (const key of Object.keys(data)) {
    if ('string' !== typeof data[key]) continue;
    const field = $(`#${key}`);
    if (!field) continue;
    switch (field.type) {
      case 'checkbox':
        field.checked = 'yes' === data[key];
        break;
      default:
        field.value = data[key];
        break;
    }
  }

  const advancedRoot = $('#advanced');
  for (const key of Object.keys(data.advanced || {})) {
    if ('string' !== typeof data.advanced[key]) continue;
    const field = $(`#${key}`, advancedRoot);
    if (!field) {
      console.error('Not found advanced field with ID #', key);
      continue;
    }
    switch (field.type) {
      case 'checkbox':
        field.checked = 'yes' === data.advanced[key];
        break;
      default:
        field.value = data.advanced[key];
        break;
    }
  }
  resetCoverField();
}

function cleanString(str) {
  return (str || '').trim().replace(/[^0-9a-z\s]/gi, '');
}

// based on https://stackoverflow.com/a/54837767
function slugify(str) {
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') //remove diacritics
    .toLowerCase()
    .replace(/\s+/g, '-') //spaces to dashes
    .replace(/&/g, '-and-') //ampersand to and
    .replace(/[^\w\-]+/g, '') //remove non-words
    .replace(/\-\-+/g, '-') //collapse multiple dashes
    .replace(/^-+/, '') //trim starting dash
    .replace(/-+$/, ''); //trim ending dash
}

function isMobile() {
  return (
    'ontouchstart' in document.documentElement && window.innerWidth <= 1100
  );
}

function trim(str) {
  return 'string' === typeof str ? str.trim() : '';
}

function downloadObjectAsJson(object, filename) {
  const tmpNode = document.createElement('a');
  tmpNode.setAttribute(
    'href',
    'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(object))
  );
  tmpNode.setAttribute('download', filename + '.json');
  document.body.appendChild(tmpNode);
  tmpNode.click();
  tmpNode.remove();
}

function resetSections() {
  const sections = $$('details');
  for (let i = 0; i < sections.length; ++i) {
    const first = 0 === i;
    sections[i].open = first || sections[i].id === 'advanced';
    if (first) {
      $('#header-bottom').scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * @param {string} str
 * @param {int} maxlength
 * @returns {string}
 */
function truncate(str, maxlength = null) {
  if (!maxlength || maxlength < 0) {
    maxlength = 500;
  }
  return (str || '').substring(0, +maxlength || 0);
}
