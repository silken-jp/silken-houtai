import { useEffect, forwardRef } from 'react';
import jsbarcode from 'jsbarcode';
import dayjs from 'dayjs';

const flexL: React.CSSProperties = {
  display: 'flex',
};
const flexP: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};
const flexCenter: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

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

export interface WaybillProps {
  dataSource: API.Waybill;
}

const Waybill = forwardRef<HTMLDivElement, WaybillProps>((props, ref) => {
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

  useEffect(() => {
    getCodeBar(
      props.dataSource._id + 'shopCode',
      `C${EDI_code?.arr_code1}${EDI_code?.arr_code2}D`,
      {
        displayValue: false,
        height: 50,
      },
    );
    getCodeBar(props.dataSource._id + 'HAB', `D${props.dataSource.HAB}D`, {
      displayValue: false,
      height: 115,
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

  return (
    <div
      ref={ref}
      style={{
        margin: 1,
        width: '100mm',
        height: '150mm',
        border: '1px solid',
        fontFamily: 'msgothic',
        fontSize: 10,
        pageBreakAfter: 'always',
      }}
    >
      {/* 1 */}
      <div
        style={{
          ...flexL,
          height: '19mm',
          borderBottom: '1px solid',
        }}
      >
        <div
          style={{
            ...flexCenter,
            width: '67mm',
            borderRight: '1px solid',
          }}
        >
          <div>
            <span style={{ letterSpacing: 10, fontSize: 36, fontWeight: 600 }}>
              {EDI_code?.arr_code1}
            </span>
            <span style={{ letterSpacing: 10, fontSize: 21, fontWeight: 500 }}>
              {EDI_code?.arr_code2}
            </span>
          </div>
        </div>
        <div style={{ ...flexP, width: '33mm' }}>
          <div
            style={{
              padding: '0px 6px',
              height: '5mm',
              borderBottom: '1px solid',
            }}
          >
            発送日：{flightDate}
          </div>
          <div style={{ ...flexL, height: '14mm' }}>
            <div
              style={{
                padding: '10px 7px',
                width: '6mm',
                borderRight: '1px solid',
              }}
            >
              元払
            </div>
            <div style={{ ...flexP, width: '27mm' }}>
              <div
                style={{
                  ...flexL,
                  height: '9mm',
                  borderBottom: '1px solid',
                }}
              >
                <div
                  style={{
                    padding: '0px 4px',
                    width: '5mm',
                    borderRight: '1px solid',
                  }}
                >
                  個数
                </div>
                <div
                  style={{
                    width: '22mm',
                    margin: 'auto',
                    textAlign: 'center',
                  }}
                >
                  {NO}
                </div>
              </div>
              <div
                style={{
                  height: '5mm',
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
          width: '100mm',
          height: '27mm',
          borderBottom: '1px solid',
        }}
      >
        <div
          style={{
            padding: '32px 6px',
            width: '6mm',
            borderRight: '1px solid',
            fontSize: 17,
            lineHeight: 1.2,
          }}
        >
          お届先
        </div>
        <div style={{ padding: '4px 6px', width: '57mm' }}>
          <div>〒 {zip}</div>
          <div>{receiver_add}</div>
          <div style={{ fontSize: 18 }}>{`${ImpNameJP}\u2002様`}</div>
          <div>TEL {receiver_tel}</div>
        </div>
        <div
          style={{
            ...flexP,
            width: '37mm',
            height: '22mm',
            borderLeft: '1px solid',
            borderBottom: '2px solid',
          }}
        >
          <div
            style={{
              height: '5mm',
              borderBottom: '1px solid',
              textAlign: 'center',
            }}
          >
            着店バーコード
          </div>
          <div
            style={{
              height: '17mm',
              padding: '9px 0px',
              textAlign: 'center',
            }}
          >
            <img
              id={props.dataSource._id + 'shopCode'}
              width={117}
              height={68}
            />
          </div>
        </div>
      </div>
      {/* 3 */}
      <div
        style={{
          ...flexL,
          width: '100mm',
          height: '15mm',
          borderBottom: '1px solid',
        }}
      >
        <div style={{ ...flexP, width: '44mm', borderRight: '2px solid' }}>
          <div
            style={{
              ...flexL,
              height: '6mm',
              borderBottom: '1px solid',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '22mm',
                borderRight: '1px solid',
                fontSize: 18,
              }}
            >
              佐川急便(株)
            </div>
            <div style={{ width: '22mm', fontSize: 18 }}>東京営業所</div>
          </div>
          <div style={{ padding: '21px 6px', height: '19mm', fontSize: 17 }}>
            <div>
              お問合せTEL
              <span style={{ fontSize: 14 }}> 0570-01-0349</span>
            </div>
            <div>
              顧客コード
              <span style={{ fontSize: 14 }}> 151289260001</span>
            </div>
          </div>
        </div>
        <div
          style={{
            padding: '16px 6px',
            width: '6mm',
            borderRight: '1px solid',
            fontSize: 17,
            lineHeight: 1.3,
          }}
        >
          問合番号
        </div>
        <div
          style={{
            width: '50mm',
            padding: '20px 0px',
            textAlign: 'center',
          }}
        >
          <img id={props.dataSource._id + 'HAB'} width={179} height={67.5} />
          {props.dataSource.HAB}
        </div>
      </div>
      {/* 4 */}
      <div
        style={{
          ...flexL,
          width: '100mm',
          height: '18mm',
          borderBottom: '1px solid',
        }}
      >
        <div
          style={{
            padding: '2px 6px',
            width: '6mm',
            fontSize: 17,
            lineHeight: 1.2,
          }}
        >
          ご依頼主
        </div>
        <div
          style={{
            padding: 5,
            width: '46mm',
            borderRight: '1px solid black',
            fontSize: 13,
            lineHeight: 1.5,
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
            width: '6mm',
            fontSize: 17,
            lineHeight: 1.4,
          }}
        >
          出荷場
        </div>
        <div
          style={{
            padding: 5,
            width: '42mm',
            fontSize: 13,
            lineHeight: 1.5,
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
          width: '100mm',
          height: '18mm',
          borderBottom: '1px solid',
        }}
      >
        <div
          style={{
            padding: '12px 6px',
            width: '6mm',
            borderRight: '1px solid',
            fontSize: 17,
            lineHeight: 1.2,
          }}
        >
          記事欄
        </div>
        <div style={{ width: '42mm', paddingLeft: 4 }}>
          <div>
            EC貨物の返品などは直接購入されたECサイトまでお問い合わせください。
          </div>
        </div>
      </div>
      {/* 6 */}
      <div style={{ ...flexL, width: '100mm', height: '43mm' }}>
        <div
          style={{
            padding: '20px 5px',
            width: '20mm',
            borderRight: '1px solid',
          }}
        >
          <img id={props.dataSource._id + '2kg'} width={90} height={60} />
          <img id={props.dataSource._id + '5kg'} width={90} height={60} />
          <img id={props.dataSource._id + '10kg'} width={90} height={60} />
        </div>
        <div style={{ ...flexP, width: '60mm', borderRight: '1px solid' }}>
          <div style={{ height: '30mm', borderBottom: '1px solid' }}>
            <div>
              <div>【陸便】</div>
            </div>
          </div>
          <div style={{ padding: '5px 0px', height: '20mm' }}>
            【佐川急便(株) 京都市南区上烏羽角田町 68番地】
            <br />
            【佐川急便(株)の損害賠價限度額は荷物1個につき30万円です】
          </div>
        </div>
        <div style={{ padding: '45px 5px', width: '20mm' }}>
          <img id={props.dataSource._id + '20kg'} width={90} height={60} />
          <img id={props.dataSource._id + '30kg'} width={90} height={60} />
        </div>
      </div>
    </div>
  );
});

export default Waybill;
