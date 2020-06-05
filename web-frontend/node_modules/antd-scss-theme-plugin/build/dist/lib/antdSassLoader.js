'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overloadSassLoaderOptions = exports.themeImporter = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = antdSassLoader;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require('loader-utils');

var _sassLoader = require('sass-loader');

var _sassLoader2 = _interopRequireDefault(_sassLoader);

var _importsToResolve = require('sass-loader/dist/importsToResolve');

var _importsToResolve2 = _interopRequireDefault(_importsToResolve);

var _loaderUtils2 = require('./loaderUtils');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Utility returning a node-sass importer that provides access to all of antd's theme variables.
 * @param {string} themeScssPath - Path to SCSS file containing Ant Design theme variables.
 * @param {string} contents - The compiled content of the SCSS file at themeScssPath.
 * @returns {function} Importer that provides access to all compiled Ant Design theme variables
 *   when importing the theme file at themeScssPath.
 */
const themeImporter = exports.themeImporter = (themeScssPath, contents) => (url, previousResolve, done) => {
  const request = (0, _loaderUtils.urlToRequest)(url);
  const pathsToTry = (0, _importsToResolve2.default)(request);

  const baseDirectory = _path2.default.dirname(previousResolve);
  for (let i = 0; i < pathsToTry.length; i += 1) {
    const potentialResolve = pathsToTry[i];
    if (_path2.default.resolve(baseDirectory, potentialResolve) === themeScssPath) {
      done({ contents });
      return;
    }
  }
  done();
};

/**
 * Modify sass-loader's options so that all antd variables are imported from the SCSS theme file.
 * @param {Object} options - Options for sass-loader.
 * @return {Object} Options modified to includ a custom importer that handles the SCSS theme file.
 */
const overloadSassLoaderOptions = exports.overloadSassLoaderOptions = (() => {
  var _ref = _asyncToGenerator(function* (options) {
    const newOptions = _extends({}, options);
    const scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);

    const contents = yield (0, _utils.compileThemeVariables)(scssThemePath);
    const extraImporter = themeImporter(scssThemePath, contents);

    let importer;
    if ('importer' in options) {
      if (Array.isArray(options.importer)) {
        importer = [...options.importer, extraImporter];
      } else {
        importer = [options.importer, extraImporter];
      }
    } else {
      importer = extraImporter;
    }

    newOptions.importer = importer;

    return newOptions;
  });

  return function overloadSassLoaderOptions(_x) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * A wrapper around sass-loader which overloads loader options to include a custom importer handling
 * variable imports from the SCSS theme file, and registers the theme file as a watched dependency.
 * @param {...*} args - Arguments passed to sass-loader.
 * @return {undefined}
 */
function antdSassLoader(...args) {
  const loaderContext = this;
  const callback = loaderContext.async();
  const options = (0, _loaderUtils.getOptions)(loaderContext);

  const newLoaderContext = _extends({}, loaderContext);

  overloadSassLoaderOptions(options).then(newOptions => {
    delete newOptions.scssThemePath; // eslint-disable-line no-param-reassign
    newLoaderContext.query = newOptions;

    const scssThemePath = (0, _loaderUtils2.getScssThemePath)(options);
    newLoaderContext.addDependency(scssThemePath);

    return _sassLoader2.default.call(newLoaderContext, ...args);
  }).catch(error => {
    // Remove unhelpful stack from error.
    error.stack = undefined; // eslint-disable-line no-param-reassign
    callback(error);
  });
}