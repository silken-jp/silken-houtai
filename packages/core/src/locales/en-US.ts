import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import options from './en-US/options';
import pages from './en-US/pages';
import waybill from './en-US/waybill';

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
