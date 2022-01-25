const src1 = [
  { value: '1', label: '航空貨物' },
  { value: '2', label: '郵便物' },
  { value: '3', label: '譲り受け輸入' },
  { value: '4', label: 'その他（海上コンテナ詰め貨物を除く）' },
  { value: '5', label: '海上コンテナ詰め貨物' },
];
const src2 = [
  { value: '1', label: '直輸出入及び保税展示場からの輸出入' },
  { value: '2', label: '蔵入れ又は蔵入れ貨物の積戻し' },
  { value: '3', label: '移し入れ又は移入貨物の積戻し' },
  { value: '4', label: '許可前引き取り承認又はその他の積戻し' },
  { value: '5', label: '蔵入れ貨物の輸入' },
  { value: '6', label: '移し入れ貨物の輸入' },
  { value: '7', label: '許可前引取輸入許可' },
  { value: '8', label: 'みなし輸入' },
  { value: '9', label: '総保入れ又は総保入貨物の積戻し' },
  { value: '10', label: '総保入貨物の輸入' },
];
const src3 = [
  { value: '1', label: '順委託加工契約に基づく輸出入' },
  { value: '2', label: '逆委託加工契約に基づく輸出入' },
  { value: '3', label: '賃貸借契約に基づく輸出入' },
  { value: '4', label: '駐留軍、国連軍貨物の輸出入' },
  { value: '5', label: '１年を超える延払い貨物の輸出入' },
  { value: '6', label: '削除' },
  { value: '7', label: '船（機）用条件付貨物の輸入' },
  { value: '8', label: 'その他' },
];

function eleToArr(item: any, arr: any[]) {
  let res = [];
  for (let i = 0; i < arr.length; i++) {
    const ele = arr[i];
    res.push({
      value: item?.value + ele?.value,
      label: `${item?.label}/${ele?.label}`,
    });
  }
  return res;
}

function arrToArr(arr1: any[], arr2: any[]) {
  let res: any = [];
  for (let i = 0; i < arr1.length; i++) {
    const element = arr1[i];
    res = [...res, ...eleToArr(element, arr2)];
  }
  return res;
}

export const BOK = arrToArr(arrToArr(src1, src2), src3);
