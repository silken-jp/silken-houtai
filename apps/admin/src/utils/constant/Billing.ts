export function renderLabel(params: any[]) {
  return (value: string) =>
    params?.find?.((item) => item?.value === value)?.label;
}

export const BILLING = {
  STATUS: [
    { value: 0, label: '生成中' },
    { value: 1, label: '请求中' },
    { value: 2, label: '已支付' },
  ],
};
