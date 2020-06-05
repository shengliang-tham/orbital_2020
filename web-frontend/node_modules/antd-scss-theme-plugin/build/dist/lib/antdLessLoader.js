'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overloadLessLoaderOptions = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = antdLessLoader;

var _lessLoader = require('less-loader');

var _lessLoader2 = _interopRequireDefault(_lessLoader);

var _loaderUtils = require('loader-utils');

var _utils = require('./utils');

var _loaderUtils2 = require('./loaderUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Modify less-loader's options with variable overrides extracted from the SCSS theme.
 * @param {Object} options - Options for less-loader.
 * @return {Object} Options modified to include theme variables in the modifyVars property.
 */
const overloadLessLoaderOptions = exports.overloadLessLoaderOptions = options => {
  const scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);

  const themeModifyVars = (0, _utils.loadScssThemeAsLess)(scssThemePath);
  const newOptions = _extends({}, options, {
    modifyVars: _extends({}, themeModifyVars, options.modifyVars || {})
  });

  return newOptions;
};

/**
 * A wrapper around less-loader which overloads loader options and registers the theme file
 * as a watched dependency.
 * @param {...*} args - Arguments passed to less-loader.
 * @return {*} The return value of less-loader, if any.
 */
function antdLessLoader(...args) {
  const loaderContext = this;
  const options = (0, _loaderUtils.getOptions)(loaderContext);

  const newLoaderContext = _extends({}, loaderContext);
  try {
    const newOptions = overloadLessLoaderOptions(options);
    delete newOptions.scssThemePath;
    newLoaderContext.query = newOptions;
  } catch (error) {
    // Remove unhelpful stack from error.
    error.stack = undefined; // eslint-disable-line no-param-reassign
    throw error;
  }

  const scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
  newLoaderContext.addDependency(scssThemePath);

  return _lessLoader2.default.call(newLoaderContext, ...args);
}