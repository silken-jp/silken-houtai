// インボイス価格条件コード
//
// value: コード
// label: コード内容
// note: 取引条件

export const IP2 = [
  {
    value: 'FOB',
    label: 'Free on Board',
    note: '指定船積港本船渡し条件',
  },
  {
    value: 'C&I',
    label: 'Cost and Insurance',
    note: '指定仕向港保険料込み条件',
  },
  {
    value: 'C&F',
    label: 'Cost and Freight',
    note: '指定仕向港運賃込み条件',
  },
  {
    value: 'CIF',
    label: 'Cost Insurance and Freight',
    note: '指定仕向港運賃保険料込み条件',
  },
  {
    value: 'EXW',
    label: 'EX Works',
    note: '工場渡し条件',
  },
  {
    value: 'FCA',
    label: 'Free Carrier (labeld place)',
    note: '運送人渡し（指定地）条件',
  },
  {
    value: 'FAS',
    label: 'Free Alongside Ship',
    note: '指定船積港船側渡し条件',
  },
  {
    value: 'DAP',
    label: 'Delivered at Place',
    note: '仕向地持込渡し条件',
  },
  {
    value: 'DAF',
    label: 'Delivered at Frontier',
    note: '国境渡し条件',
  },
  {
    value: 'DES',
    label: 'Delivered Ex Ship',
    note: '指定仕向港着船渡し条件',
  },
  {
    value: 'DDU',
    label: 'Delivered Duty Unpaid',
    note: '指定仕向地関税抜持込渡し条件',
  },
  {
    value: 'DPU',
    label: 'Delivered at Place Unloaded',
    note: '指定仕向地荷卸込持込渡し条件',
  },
  {
    value: 'DAT',
    label: 'Delivered at Terminal',
    note: 'ターミナル持込渡し条件',
  },
  {
    value: 'DEQ',
    label: 'Delivered Ex Quay',
    note: '指定仕向港関税込埠頭渡し条件',
  },
  {
    value: 'DDP',
    label: 'Delivered Duty Paid',
    note: '指定仕向地関税込持込渡し条件',
  },
  {
    value: 'CFR',
    label: 'Cost and Freight',
    note: '指定仕向港運賃込み条件',
  },
  {
    value: 'CPT',
    label: 'Carriage Paid To',
    note: '指定仕向地輸送費込み条件',
  },
  {
    value: 'CIP',
    label: 'Carriage and Insurance Paid To',
    note: '指定仕向地輸送費保険料込み条件',
  },
];
