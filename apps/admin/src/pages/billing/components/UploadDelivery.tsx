import * as Encoding from 'encoding-japanese';
import { Button, Space } from 'antd';
import { useState } from 'react';
////
import UploadXlsx from '@/components/Upload/UploadXlsx';
import { importDeliveryInvoices } from '@/services/request/waybill';

const mapHeader: any = {
  請求書番号: 'invoice_no',
  お客様コード: 'customer_no',
  お客様名称１: 'customer_name1',
  お客様名称２: 'customer_name2',
  伝票種別: 'document_type',
  担当営業所種別: 'office_type',
  担当営業所名称: 'office_name',
  日付種別: 'date_type',
  出荷日: 'shipment_date',
  お問合せNO: 'hab',
  都道府県: 'state',
  営業所種別: 'sales_office_type',
  営業所名称: 'sales_office_name',
  便種名称: 'flight_type',
  個数: 'no',
  税区分: 'tax_category',
  運賃合計金額: 'fee',
  代引手数料: 'COD_fee',
  保険料: 'insurance_fee',
  中継料: 'relay_fee',
  運賃請求金額: 'total_fee',
};

const successFormat = (count: number, sum: number) => ({
  message: `批量更新导入完成`,
  description: `已成功导入，并更新了 ${count}/${sum} 条数据`,
});
const failedFormat = (success: boolean, failedNo: string[]) => ({
  message: success ? `部分数据更新失败` : '导入失败',
  description: `更新失败行数: ${failedNo.join(', ')}`,
});

export interface UpdateMABProps {
  payload?: any;
  disabled?: boolean;
  onUpload?: () => void;
}

async function fixItemToObj(params: any[]) {
  let waybills = [];
  const headers: string[] = params[0];
  for (let i = 1; i < params.length; i++) {
    const line = params?.[i];
    let obj: { [key: string]: any } = {};
    if (!line || line?.length === 0) continue;
    for (let j = 0; j < headers.length; j++) {
      if (line[j] !== null || line[j] !== undefined) {
        const header = mapHeader?.[headers?.[j]?.trim?.()];
        const value = line?.[j]?.toString?.()?.trim?.();
        if (header) {
          obj[header] = value;
        }
      }
    }
    console.log(obj, Object.keys(obj));
    if (Object.keys(obj)?.length > 0) {
      waybills.push(obj);
    }
  }
  console.log(waybills);
  return waybills;
}

const UpdateMAB: React.FC<UpdateMABProps> = (props) => {
  const [loading, setLoading] = useState(false);
  async function onUpload(jsonArr: any[]) {
    try {
      setLoading(true);
      const deliveryInvoices = await fixItemToObj(jsonArr);
      console.log(deliveryInvoices);
      // return { success: null, failed: null };
      const { successCount: count, failedNo } = await importDeliveryInvoices({
        deliveryInvoices,
      });
      const success =
        count > 0 ? successFormat(count, jsonArr.length - 1) : null;
      const failed =
        failedNo?.length > 0 ? failedFormat(!!success, failedNo) : null;
      setLoading(false);
      return { success, failed };
    } catch (error: any) {
      setLoading(false);
      return {
        success: null,
        failed: error,
      };
    }
  }

  function handleUpload(jsonArr: any[]) {
    return onUpload(jsonArr);
  }

  if (props?.disabled) {
    return <Button disabled>更新</Button>;
  }
  return (
    <Space>
      <UploadXlsx
        onUpload={handleUpload}
        fixEncoding={(data) => Encoding.convert(data, 'UNICODE', 'SJIS')}
        text="更新請求料金"
        // rightHeader={rightHeader}
      />
    </Space>
  );
};

export default UpdateMAB;
