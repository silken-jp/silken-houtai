'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.useFormBasic = exports.useForm = void 0;
var react_1 = require('react');
var antd_1 = require('antd');
var useForm = function () {
  var _a = (0, react_1.useState)(''),
    formType = _a[0],
    setFormType = _a[1];
  var _b = (0, react_1.useState)(''),
    title = _b[0],
    setTitle = _b[1];
  var _c = (0, react_1.useState)(false),
    visible = _c[0],
    setVisible = _c[1];
  var _d = (0, react_1.useState)(),
    dataSource = _d[0],
    setDataSource = _d[1];
  function handleOpen(parma) {
    setFormType(parma.type);
    setTitle(parma.title);
    setDataSource(parma.data);
    setVisible(true);
  }
  return {
    formType: formType,
    formProps: {
      title: title,
      dataSource: dataSource,
      visible: visible,
      onVisibleChange: setVisible,
    },
    handleOpen: handleOpen,
    updateState: {
      setTitle: setTitle,
      setVisible: setVisible,
      setDataSource: setDataSource,
    },
  };
};
exports.useForm = useForm;
var useFormBasic = function (props) {
  var _a = props.title,
    title = _a === void 0 ? '' : _a,
    _b = props.visible,
    visible = _b === void 0 ? false : _b;
  var _c = props.onSubmit,
    onSubmit = _c === void 0 ? function () {} : _c,
    _d = props.onVisibleChange,
    onVisibleChange = _d === void 0 ? function () {} : _d;
  var _e = (0, react_1.useState)(false),
    loading = _e[0],
    setLoading = _e[1];
  var form = antd_1.Form.useForm()[0];
  var onOk = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        form
          .validateFields()
          .then(function (v) {
            return __awaiter(void 0, void 0, void 0, function () {
              var error_1;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    _a.trys.push([0, 2, , 3]);
                    setLoading(true);
                    return [4 /*yield*/, onSubmit(v)];
                  case 1:
                    _a.sent();
                    onVisibleChange(false);
                    setLoading(false);
                    return [3 /*break*/, 3];
                  case 2:
                    error_1 = _a.sent();
                    antd_1.message.error(error_1);
                    return [3 /*break*/, 3];
                  case 3:
                    return [2 /*return*/];
                }
              });
            });
          })
          ['catch'](function (err) {
            console.log(err);
          });
        return [2 /*return*/];
      });
    });
  };
  var onCancel = function () {
    onVisibleChange(false);
  };
  var afterClose = function () {
    form.resetFields();
  };
  return {
    modalProps: {
      visible: visible,
      title: title,
      confirmLoading: loading,
      onCancel: onCancel,
      onOk: onOk,
      afterClose: afterClose,
      centered: true,
    },
    formProps: {
      form: form,
      validateMessages: { required: '【${label}】 は必須' },
    },
  };
};
exports.useFormBasic = useFormBasic;
