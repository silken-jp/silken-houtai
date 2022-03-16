import { useIntl } from 'umi';

function paramsFormat(params: string | string[], end: '' | '.') {
  if (Array.isArray(params)) {
    return params?.join('.') + end;
  } else if (params) {
    return params + end;
  } else {
    return '';
  }
}

export function useIntlFormat(f?: string | string[]) {
  const intl = useIntl();
  return [
    (id?: string | string[]) =>
      intl.formatMessage({
        id: paramsFormat(f || '', '.') + paramsFormat(id || '', ''),
      }),
  ];
}
