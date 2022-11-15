import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import options from './zh-CN/options';
import pages from './zh-CN/pages';
import waybill from './zh-CN/waybill';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  ...pages,
  ...globalHeader,
  ...options,
  ...menu,
  ...component,
  ...waybill,
};
