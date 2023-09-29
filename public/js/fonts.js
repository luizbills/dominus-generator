function getFonts(data) {
  return {
    AlfaSlabOne: {
      normal: getUrl('/fonts/AlfaSlabOne-Regular.ttf'),
    },
    Hind: {
      normal: getUrl('/fonts/Hind-Regular.ttf'),
      italics: getUrl('/fonts/Hind-Regular.ttf'),
      bold: getUrl('/fonts/Hind-Bold.ttf'),
    },
  };
}

function getDefaultFont() {
  return 'Hind';
}
