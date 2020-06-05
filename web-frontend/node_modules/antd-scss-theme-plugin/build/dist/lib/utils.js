'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compileThemeVariables = exports.loadScssThemeAsLess = exports.extractLessVariables = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

var _scssToJson = require('scss-to-json');

var _scssToJson2 = _interopRequireDefault(_scssToJson);

var _extractVariablesLessPlugin = require('./extractVariablesLessPlugin');

var _extractVariablesLessPlugin2 = _interopRequireDefault(_extractVariablesLessPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Return values of compiled Less variables from a compilable entry point.
 * @param {string} lessEntryPath - Root Less file from which to extract variables.
 * @param {Object} variableOverrides - Variable overrides of the form { '@var': 'value' } to use
 *   during compilation.
 * @return {Object} Object of the form { 'variable': 'value' }.
 */
const extractLessVariables = exports.extractLessVariables = (lessEntryPath, variableOverrides = {}) => {
  const lessEntry = _fs2.default.readFileSync(lessEntryPath, 'utf8');
  return new Promise((() => {
    var _ref = _asyncToGenerator(function* (resolve, reject) {
      try {
        yield _less2.default.render(lessEntry, {
          filename: lessEntryPath,
          javascriptEnabled: true,
          modifyVars: variableOverrides,
          plugins: [new _extractVariablesLessPlugin2.default({
            callback: function (variables) {
              return resolve(variables);
            }
          })]
        });
      } catch (error) {
        reject(error);
      }
    });

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })());
};

/**
 * Read variables from a SCSS theme file into an object with Less-style variable names as keys.
 * @param {string} themeScssPath - Path to SCSS file containing only SCSS variables.
 * @return {Object} Object of the form { '@variable': 'value' }.
 */
const loadScssThemeAsLess = exports.loadScssThemeAsLess = themeScssPath => {
  let rawTheme;
  try {
    rawTheme = (0, _scssToJson2.default)(themeScssPath);
  } catch (error) {
    throw new Error(`Could not compile the SCSS theme file "${themeScssPath}" for the purpose of variable ` + 'extraction. This is likely because it contains a Sass error.');
  }
  const theme = {};
  Object.keys(rawTheme).forEach(sassVariableName => {
    const lessVariableName = sassVariableName.replace(/^\$/, '@');
    theme[lessVariableName] = rawTheme[sassVariableName];
  });
  return theme;
};

/**
 * Use SCSS theme file to seed a full set of Ant Design's theme variables returned in SCSS.
 * @param {string} themeScssPath - Path to SCSS file containing SCSS variables meaningful to Ant
 *   Design.
 * @return {string} A string representing an SCSS file containing all the theme and color
 *   variables used in Ant Design.
 */
const compileThemeVariables = exports.compileThemeVariables = themeScssPath => {
  const themeEntryPath = require.resolve('antd/lib/style/themes/default.less');
  const variableOverrides = themeScssPath ? loadScssThemeAsLess(themeScssPath) : {};

  return extractLessVariables(themeEntryPath, variableOverrides).then(variables => Object.entries(variables).map(([name, value]) => `$${name}: ${value};\n`).join(''));
};