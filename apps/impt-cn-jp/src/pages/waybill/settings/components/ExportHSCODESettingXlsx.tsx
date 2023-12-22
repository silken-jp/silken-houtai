import XLSX from 'xlsx';
import { Button, message } from 'antd';
import { useRequest } from 'ahooks';
////
import { getAllHScodes } from '@/services/request/hscodes';

export interface ExportHSCODESettingXlsxProps {}

const ExportHSCODESettingXlsx: React.FC<ExportHSCODESettingXlsxProps> = (
  props,
) => {
  const { loading, run } = useRequest(() => getAllHScodes(), {
    manual: true,
    onSuccess: async (result) => {
      console.log(result);
      handleExport(result?.hscodes);
    },
    onError: (err) => {
      message.error(err?.message);
    },
  });

  const handleExport = (data: any[]) => {
    // 修正数据格式
    const fixExportData = data?.map((d: any) => {
      return {
        CMD: d?.hscode,
        tax_rate: d?.tax_rate,
      };
    });

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(fixExportData, { skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws, 'MIC');

    ws['!cols'] = Array.from(Object.keys(fixExportData[0]), () => ({
      wch: 20,
    }));

    XLSX.writeFile(wb, `HSCODE_SETTING.xls`);
  };

  return (
    <Button type="primary" loading={loading} onClick={run}>
      エクスポート
    </Button>
  );
};

export default ExportHSCODESettingXlsx;
