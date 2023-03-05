// 空值判定
export function isEmpty(a: any) {
  if (a === '') return true; //检验空字符串
  if (a === 'null') return true; //检验字符串类型的null
  if (a === 'undefined') return true; //检验字符串类型的 undefined
  if (!a && a !== 0 && a !== '') return true; //检验 undefined 和 null
  if (Array.prototype.isPrototypeOf(a) && a.length === 0) return true; //检验空数组
  if (Object.prototype.isPrototypeOf(a) && Object.keys(a).length === 0)
    return true; //检验空对象
  return false;
}

// 移除对象的空属性
export function removeEmpty(obj: object): object {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => v !== undefined && v !== ''),
  );
}

// 递归移除对象的空属性
export function removeDeepEmpty(obj: object): object {
  return Object.entries(obj)
    .filter(([_, v]) => !isEmpty(v))
    .reduce(
      (a, [k, v]) => ({ ...a, [k]: v === Object(v) ? removeDeepEmpty(v) : v }),
      {},
    );
}
