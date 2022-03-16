import { useMemo } from 'react';
import { Row, Col } from 'antd';
import { useRequest } from 'ahooks';
import { useParams } from 'umi';
////
import { getImporterById } from '@/services/request/importer';

export interface ImporterPrintProps {}

const ImporterPrint: React.FC<ImporterPrintProps> = () => {
  const { importerId } = useParams<any>();
  const importAPI = useRequest(
    async () => await getImporterById({ importerId }),
    {
      onSuccess: () => {
        window.print();
      },
    },
  );

  const Card = useMemo(
    () => (
      <Col span={12}>
        <div
          style={{
            padding: '2mm',
            width: '86mm',
            height: '42mm',
            border: '1px solid',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>T {importAPI?.data?.Zip}</div>
          <div>{importAPI?.data?.address_jp}</div>
          <div>{importAPI?.data?.company_name_jp}</div>
          <div>{importAPI?.data?.Tel}</div>
        </div>
      </Col>
    ),
    [importAPI?.data],
  );

  if (importAPI?.loading) {
    return <>loading...</>;
  }

  if (importAPI?.error) {
    return <>error...</>;
  }

  return (
    <Row
      gutter={12}
      style={{ width: '180mm', height: '251mm', pageBreakAfter: 'always' }}
    >
      {Card}
      {Card}
      {Card}
      {Card}
      {Card}
      {Card}
      {Card}
      {Card}
      {Card}
      {Card}
      {Card}
      {Card}
    </Row>
  );
};

export default ImporterPrint;
