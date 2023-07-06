function getFonts() {
  return {
    AlfaSlabOne: {
      normal: location.origin + '/fonts/AlfaSlabOne-Regular.ttf',
    },
    Hind: {
      normal: location.origin + '/fonts/Hind-Regular.ttf',
      bold: location.origin + '/fonts/Hind-Bold.ttf',
    },
  };
}

function getDefaultFont() {
  return 'Hind';
}
