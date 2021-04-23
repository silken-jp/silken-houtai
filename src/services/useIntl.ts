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
