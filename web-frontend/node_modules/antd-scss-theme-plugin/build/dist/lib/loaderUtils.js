'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScssThemePath = undefined;

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Get path to SCSS theme file specified in loader options or through the plugin's constructor.
 * @param {Object} options - Loader options.
 * @return {string} Path to SCSS theme file.
 */
// eslint-disable-next-line import/prefer-default-export
const getScssThemePath = exports.getScssThemePath = options => {
  const scssThemePath = options.scssThemePath || _index2.default.SCSS_THEME_PATH;

  if (!scssThemePath) {
    throw new Error('Path to an SCSS theme file must be specified through the scssThemePath loader option, ' + 'or passed to the plugin\'s constructor.');
  }

  return scssThemePath;
};