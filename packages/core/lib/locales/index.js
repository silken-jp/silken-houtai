'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
exports.locales = void 0;
var ja_JP_1 = __importDefault(require('./ja-JP'));
var zh_CN_1 = __importDefault(require('./zh-CN'));
exports.locales = {
  'ja-JP': ja_JP_1['default'],
  'zh-CN': zh_CN_1['default'],
};
exports['default'] = exports.locales;
