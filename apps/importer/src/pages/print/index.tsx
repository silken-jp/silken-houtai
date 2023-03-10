import { useEffect } from 'react';
import { Row, Col } from 'antd';
import { useHistory } from 'umi';
////

export interface ImporterPrintProps {}

const ImporterPrint: React.FC<ImporterPrintProps> = () => {
  const history = useHistory<any>();
  const data = new URLSearchParams(history.location.search).get('data');
  const dataSource = JSON.parse(data || '');

  const pages = Array.from(
    { length: Math.ceil(dataSource?.length / 12) },
    (_, i) => {
      const temp = dataSource.slice(i * 12, (i + 1) * 12);
      const importers = Array.from({ length: 12 }, (_, j) =>
        temp?.[j] ? { key: j, ...temp?.[j] } : { key: j },
      );
      return { key: i, importers };
    },
  );

  useEffect(() => {
    window.print();
  }, []);

  return (
    <>
      {pages?.map(({ key, importers }) => {
        return (
          <Row
            key={key}
            style={{
              width: '180mm',
              height: '258mm',
              pageBreakAfter: 'always',
            }}
          >
            {importers?.map(({ key, ...item }) => {
              const style: React.CSSProperties = {
                marginBottom: '1mm',
                padding: '1mm',
                width: '86mm',
                height: '42mm',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: item?.Zip ? '1px solid' : 'none',
              };
              return (
                <Col key={key} span={12}>
                  <div style={style}>
                    {item?.Zip && (
                      <>
                        <div>〒 {item?.Zip}</div>
                        <div>{item?.address_jp}</div>
                        <div>
                          <div>{item?.company_name_jp}</div>
                          <div>ご担当者　様</div>
                        </div>
                        <Row align="bottom" justify="space-between">
                          <Col>{item?.Tel}</Col>
                          <Col style={{ color: '#d9363e' }}>
                            <div>請求書在中</div>
                            <div>{item?.code}</div>
                          </Col>
                        </Row>
                      </>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        );
      })}
    </>
  );
};

export default ImporterPrint;
