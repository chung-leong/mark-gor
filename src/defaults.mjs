import imports from 'marked/src/defaults.js';

const defaults = getDefaults();

function getDefaults() {
  return {
    htmlOnly: false,
    headerFormat: 'github',
    decodeEntities: true,
    fixBrokenTags: true,
    normalizeTags: true,
    omitLinefeed: true,
    omitDeclarations: true,
    omitEmbeddedCode: true,
    omitNonvisualWhitespace: true,
    omitTags: [ 'script', 'style', 'link', 'meta' ],
    ...imports.getDefaults()
  };
}

function mergeDefaults(options) {
  return Object.assign({}, defaults, options);
}

function changeDefaults(options) {
  Object.assign(defaults, options);
}

export {
  defaults,
  getDefaults,
  mergeDefaults,
  changeDefaults,
};
