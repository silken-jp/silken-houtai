import { useEffect, useRef, useState } from 'react';
import { Space, Modal, Button } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import jsbarcode from 'jsbarcode';
import dayjs from 'dayjs';

const flexL: React.CSSProperties = {
  display: 'flex',
};
const flexP: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

export interface WaybillProps {
  dataSource: API.Waybill;
}

const Waybill: React.FC<WaybillProps> = (props) => {
  // state
  const [visible, setVisible] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // format
  const {
    receiver_zip,
    receiver_add,
    receiver_tel,
    ImpNameJP,
    EDI_code,
    DATE,
    NO,
  } = props?.dataSource || {};
  const zip = receiver_zip.slice(0, 3) + '-' + receiver_zip.slice(3);
  const flightDate = dayjs(DATE).format('YYYY/MM/DD');

  function getCodeBar(id: string, code: string, options?: any) {
    try {
      let canvas = document.createElement('canvas');
      jsbarcode(canvas, code, {
        format: 'codabar',
        font: 'msgothic',
        fontSize: 36,
        width: 5,
        height: 60,
        ...options,
      });
      let img = document.getElementById(id) as HTMLImageElement;
      if (img) {
        img.src = canvas.toDataURL('image/png');
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCodeBar(
      props.dataSource._id + 'shopCode',
      `C${EDI_code?.arr_code1}${EDI_code?.arr_code2}D`,
      {
        displayValue: false,
        width: 6,
        height: 130,
      },
    );
    getCodeBar(props.dataSource._id + 'HAB', `D${props.dataSource.HAB}D`, {
      width: 3,
      height: 100,
    });
    getCodeBar(props.dataSource._id + '2kg', 'D002B', {
      text: '2kg(サイズ 60)',
    });
    getCodeBar(props.dataSource._id + '5kg', 'D005B', {
      text: '5kg(サイズ 80)',
    });
    getCodeBar(props.dataSource._id + '10kg', 'D010B', {
      text: '10kg(サイズ 100)',
    });
    getCodeBar(props.dataSource._id + '20kg', 'D020B', {
      text: '20kg(サイズ 140)',
    });
    getCodeBar(props.dataSource._id + '30kg', 'D030B', {
      text: '30kg(サイズ 160)',
    });
  });

  // action
  function handleOpen() {
    setVisible(true);
  }
  function handleClose() {
    setVisible(false);
  }
  function pdfPrint() {
    const elem = printRef.current as HTMLElement;
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });
    html2canvas(elem, { scale: 2 }).then(function (canvas) {
      const dataURI = canvas.toDataURL('image/jpeg');
      // const width = doc.internal.pageSize.width;
      doc.addImage(dataURI, 'JPEG', 10, 10, 100, 150);
      doc.save(`${props?.dataSource?.HAB}.pdf`);
    });
  }

  return (
    <>
      <Modal
        width={650}
        visible={visible}
        onCancel={handleClose}
        footer={
          <Button type="primary" onClick={pdfPrint}>
            print
          </Button>
        }
      >
        <div style={{ padding: 48 }}>
          <div
            ref={printRef}
            style={{
              margin: 1,
              width: 500,
              height: 750,
              border: '1px solid',
              fontFamily: 'msgothic',
              fontSize: 15,
            }}
          >
            {/* 1 */}
            <div
              style={{
                ...flexL,
                height: 95,
                borderBottom: '1px solid',
              }}
            >
              <div
                style={{
                  width: 335,
                  borderRight: '1px solid',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{ letterSpacing: 12, fontSize: 58, fontWeight: 600 }}
                >
                  {EDI_code?.arr_code1}
                </span>
                <span
                  style={{ letterSpacing: 10, fontSize: 32, fontWeight: 500 }}
                >
                  {EDI_code?.arr_code2}
                </span>
              </div>
              <div style={{ ...flexP, width: 165 }}>
                <div
                  style={{
                    padding: '0px 6px',
                    height: 25,
                    borderBottom: '1px solid',
                  }}
                >
                  発送日：{flightDate}
                </div>
                <div style={{ ...flexL, height: 70 }}>
                  <div
                    style={{
                      padding: '10px 7px',
                      width: 30,
                      borderRight: '1px solid',
                    }}
                  >
                    元払
                  </div>
                  <div style={{ ...flexP, width: 135 }}>
                    <div
                      style={{
                        ...flexL,
                        height: 45,
                        borderBottom: '1px solid',
                      }}
                    >
                      <div
                        style={{
                          padding: '0px 4px',
                          width: 25,
                          borderRight: '1px solid',
                        }}
                      >
                        個数
                      </div>
                      <div
                        style={{
                          width: 110,
                          margin: 'auto',
                          textAlign: 'center',
                        }}
                      >
                        {NO}
                      </div>
                    </div>
                    <div
                      style={{
                        height: 25,
                        margin: 'auto',
                        textAlign: 'center',
                        fontWeight: 500,
                      }}
                    >
                      NO{NO}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 2 */}
            <div
              style={{
                ...flexL,
                width: 500,
                height: 135,
                borderBottom: '1px solid',
              }}
            >
              <div
                style={{
                  padding: '32px 6px',
                  width: 30,
                  borderRight: '1px solid',
                  fontSize: 17,
                  lineHeight: 1.2,
                }}
              >
                お届先
              </div>
              <div style={{ padding: '4px 6px', width: 285 }}>
                <div>〒 {zip}</div>
                <div>{receiver_add}</div>
                <div style={{ fontSize: 18 }}>{`${ImpNameJP}\u2002様`}</div>
                <div>TEL {receiver_tel}</div>
              </div>
              <div
                style={{
                  ...flexP,
                  width: 185,
                  height: 110,
                  borderLeft: '1px solid',
                  borderBottom: '2px solid',
                }}
              >
                <div
                  style={{
                    height: 25,
                    borderBottom: '1px solid',
                    textAlign: 'center',
                  }}
                >
                  着店バーコード
                </div>
                <div style={{ height: 85, padding: '10px 12px' }}>
                  <img
                    id={props.dataSource._id + 'shopCode'}
                    width={160}
                    height={65}
                  />
                </div>
              </div>
            </div>
            {/* 3 */}
            <div
              style={{
                ...flexL,
                width: 500,
                height: 125,
                borderBottom: '1px solid',
              }}
            >
              <div style={{ ...flexP, width: 220, borderRight: '2px solid' }}>
                <div
                  style={{
                    ...flexL,
                    height: 32,
                    borderBottom: '1px solid',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 110,
                      borderRight: '1px solid',
                      fontSize: 18,
                    }}
                  >
                    佐川急便(株)
                  </div>
                  <div style={{ width: 110, fontSize: 18 }}>東京営業所</div>
                </div>
                <div style={{ padding: '21px 6px', height: 93, fontSize: 17 }}>
                  <div>
                    お問合せTEL
                    <span style={{ color: '#d9363e', fontSize: 14 }}>
                      {' '}
                      0570-01-0349
                    </span>
                  </div>
                  <div>
                    顧客コード
                    <span style={{ color: '#d9363e', fontSize: 14 }}>
                      {' '}
                      151289260001
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: '16px 6px',
                  width: 30,
                  borderRight: '1px solid',
                  fontSize: 17,
                  lineHeight: 1.3,
                }}
              >
                問合番号
              </div>
              <div style={{ width: 250, padding: '25px 15px' }}>
                <img
                  id={props.dataSource._id + 'HAB'}
                  width={220}
                  height={70}
                />
              </div>
            </div>
            {/* 4 */}
            <div
              style={{
                ...flexL,
                width: 500,
                height: 90,
                borderBottom: '1px solid',
              }}
            >
              <div
                style={{
                  padding: '2px 6px',
                  width: 30,
                  fontSize: 17,
                  lineHeight: 1.2,
                }}
              >
                ご依頼主
              </div>
              <div
                style={{
                  padding: 5,
                  width: 230,
                  borderRight: '1px solid black',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#d9363e',
                }}
              >
                <div>東京都新宿区市谷田町2丁目17</div>
                <div>市谷八重洲匕儿9階</div>
                <div>華南株式会社</div>
                <div>TEL: 03-5579-8595</div>
              </div>
              <div
                style={{
                  padding: '8px 6px',
                  width: 30,
                  fontSize: 17,
                  lineHeight: 1.4,
                }}
              >
                出荷場
              </div>
              <div
                style={{
                  padding: 5,
                  width: 210,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#d9363e',
                }}
              >
                <div>東京都足立区南花烟4-28-18</div>
                <div>華南株式会社</div>
                <div>TEL : 03-5851-9290</div>
              </div>
            </div>
            {/* 5 */}
            <div
              style={{
                ...flexL,
                width: 500,
                height: 90,
                borderBottom: '1px solid',
              }}
            >
              <div
                style={{
                  padding: '12px 6px',
                  width: 30,
                  borderRight: '1px solid',
                  fontSize: 17,
                  lineHeight: 1.2,
                }}
              >
                記事欄
              </div>
              <div style={{ width: 210 }}></div>
            </div>
            {/* 6 */}
            <div style={{ ...flexL, width: 500, height: 214 }}>
              <div
                style={{
                  padding: '20px 5px',
                  width: 100,
                  borderRight: '1px solid',
                }}
              >
                <img id={props.dataSource._id + '2kg'} width={90} height={60} />
                <img id={props.dataSource._id + '5kg'} width={90} height={60} />
                <img
                  id={props.dataSource._id + '10kg'}
                  width={90}
                  height={60}
                />
              </div>
              <div style={{ ...flexP, width: 300, borderRight: '1px solid' }}>
                <div style={{ height: 150, borderBottom: '1px solid' }}>
                  <div style={{ color: '#d9363e' }}>【陸便】</div>
                </div>
                <div style={{ padding: '5px 0px', height: 100, color: 'gray' }}>
                  【佐川急便(株) 京都市南区上烏羽角田町 68番地】
                  <br />
                  【佐川急便(株)の損害賠價限度額は荷物1個につき30万円です】
                </div>
              </div>
              <div style={{ padding: '45px 5px', width: 100 }}>
                <img
                  id={props.dataSource._id + '20kg'}
                  width={90}
                  height={60}
                />
                <img
                  id={props.dataSource._id + '30kg'}
                  width={90}
                  height={60}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Space>
        <Button size="small" type="link" onClick={handleOpen}>
          Download
        </Button>
      </Space>
    </>
  );
};

export default Waybill;
