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
    pages: 6,
    defaultStyle: getStyles().defaultStyle,
    images: getImages(data),
    background: getBackgroundLayer(data),
    content: getContent(data),
  };
}

function getUrl(path) {
  return location.origin + path;
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
    width: 350,
    opacity: 0.25,
  };
}

function getImages(data) {
  return {
    ccby: getUrl('/images/ccby.png'),
    defaultCover: getUrl('/images/cover.jpg'),
    powererBy: getUrl('/images/powered-by.png'),
    line: getUrl('/images/line.png'),
  };
}

function getBackgroundLayer(currentPage, pageSize) {
  return null;
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

function readCover(callback) {
  const input = $('#cover');
  const fr = new FileReader();
  const file = input.files[0];

  fr.addEventListener('load', function (evt) {
    if (!file.type.includes('image')) {
      return alert('Arquivo inválido para imagem da capa.');
    }
    callback(evt.target.result, evt);
  });

  if (file) {
    fr.readAsDataURL(file);
  } else {
    console.error('Please select a cover image');
  }
}

function getData() {
  const root = $('#fields');
  const fields = $$('input, textarea, select', root);

  const data = {};
  for (const field of fields) {
    data[field.id] = field.value || '';
  }

  return data;
}

function isMobile() {
  return (
    'ontouchstart' in document.documentElement && window.innerWidth <= 1100
  );
}
