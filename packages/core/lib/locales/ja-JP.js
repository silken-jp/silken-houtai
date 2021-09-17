'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var component_1 = __importDefault(require('./ja-JP/component'));
var globalHeader_1 = __importDefault(require('./ja-JP/globalHeader'));
var menu_1 = __importDefault(require('./ja-JP/menu'));
var pages_1 = __importDefault(require('./ja-JP/pages'));
var waybill_1 = __importDefault(require('./ja-JP/waybill'));
exports['default'] = __assign(
  __assign(
    __assign(
      __assign(
        __assign(
          {
            'navBar.lang': '语言',
            'layout.user.link.help': '帮助',
            'layout.user.link.privacy': '隐私',
            'layout.user.link.terms': '条款',
          },
          pages_1['default'],
        ),
        globalHeader_1['default'],
      ),
      menu_1['default'],
    ),
    component_1['default'],
  ),
  waybill_1['default'],
);
