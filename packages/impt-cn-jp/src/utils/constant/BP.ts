// ＢＰ申請事由コード
//
// value: コード
// label: 申請事由

export const BP = [
  { value: '1A', label: '新規輸入品等による課税標準審査' },
  { value: '1B', label: '分析、検定等による税番審査' },
  { value: '1C', label: '免税該当審査' },
  { value: '2A', label: '消散、漏洩、変質又は損傷のおそれがある' },
  { value: '2B', label: '動植物、貴重品、危険物等である' },
  { value: '2C', label: '報道用の写真又はフィルムである' },
  { value: '2D', label: '展示会等に出品のため' },
  { value: '2E', label: '工場の操業等に支障をきたす' },
  { value: '2F', label: '工場管理面に支障をきたす' },
  { value: '2G', label: 'その他取引先への納期が切迫している' },
  { value: '3A', label: '課税標準未決定' },
  { value: '3B', label: '原産地証明書又は原産品申告書の提出が遅れる' },
  { value: '3C', label: '免税関係書類を整えるため' },
  { value: '3D', label: 'その他関税法第68条の必要書類が遅れる' },
  { value: '3E', label: '委託販売契約' },
  { value: '3F', label: '関税割当証明書申請中' },
  { value: '3G', label: '関税割当提出猶予' },
  { value: '3H', label: '関税割当証明書申請中（ＥＰＡ用）' },
  { value: '3J', label: '関税割当提出猶予（ＥＰＡ用）' },
  { value: '3K', label: '日英特恵輸入証明書の提出を予定している' },
  {
    value: '3L',
    label:
      '日英特恵輸入証明書の提出を予定している、かつ、英国協定に基づく原産品申告書の提出が遅れる',
  },
  { value: '4A', label: '作業終了届の提出が遅れる' },
  { value: '4B', label: '試運転用の燃料油等を船舶に積み込むため' },
  { value: '4C', label: 'その他やむを得ない理由があると認める場合' },
  { value: '9X', label: 'その他やむを得ない理由があると認める場合（自動処理）' },
];
