import { useIntl } from 'umi';

export function useIntlWaybill() {
  // 国际化
  const intl = useIntl();
  return {
    home: intl.formatMessage({ id: 'waybill.header.home' }),
    smallPacket: intl.formatMessage({ id: 'waybill.header.smallPacket' }),
    bizPacket: intl.formatMessage({ id: 'waybill.header.bizPacket' }),
    info: intl.formatMessage({ id: 'waybill.header.info' }),
    hawb: intl.formatMessage({ id: 'waybill.hawb' }),
    hawbNo: intl.formatMessage({ id: 'waybill.hawbNo' }),
  };
}

export function useIntlPage() {
  // 国际化
  const intl = useIntl();
  return {
    waybill: intl.formatMessage({ id: 'menu.waybill' }),
    driver: intl.formatMessage({ id: 'menu.driver' }),
    setting: intl.formatMessage({ id: 'menu.setting' }),
    flight: intl.formatMessage({ id: 'menu.setting.flight' }),
    zipArea: intl.formatMessage({ id: 'menu.setting.zipArea' }),
  };
}
