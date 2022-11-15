import component from './ja-JP/component';
import globalHeader from './ja-JP/globalHeader';
import menu from './ja-JP/menu';
import options from './ja-JP/options';
import pages from './ja-JP/pages';
import waybill from './ja-JP/waybill';

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
