function getDocumentDefination() {
  return {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: 25,
    styles: getStyles(),
    pages: 6,
    defaultStyle: getStyles().defaultStyle,
    images: getImages(),
    background: getBackgroundLayer(),
    content: getContent(),
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

function $(selector, root = document) {
  return root.querySelector(selector);
}

function getData() {
  // todo: get the input values
  return {
    title: $('title'),
    author: $('author'),
    description: $('description'),
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

function OpenWindow(content, title = '') {
  var _window = window.open(content, title);
  return _window;
}
