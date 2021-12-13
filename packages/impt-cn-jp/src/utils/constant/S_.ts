// 輸入承認証等識別コード
// code: コード
// name: 承認書等番号
// note: 備考
// mode: Mode

export const S_ = [
  {
    code: 'ACNO',
    name: '登録票等番号',
    note: '農薬取締法関係',
    mode: 'AS',
  },
  {
    code: 'ADNO',
    name: '覚醒剤原料輸入許可書番号',
    note: '覚醒剤取締法関係',
    mode: 'AS',
  },
  {
    code: 'AMNO',
    name: 'アルコール輸入事業許可書番号等',
    note: 'アルコール事業法関係（写し）',
    mode: 'AS',
  },
  {
    code: 'ANLZ',
    name: '分析番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'ANNO',
    name: '輸入検疫証明書等番号',
    note: '家畜伝染病予防法関係',
    mode: 'AS',
  },
  {
    code: 'CANO',
    name: '大麻輸入許可書番号',
    note: '大麻取締法関係',
    mode: 'AS',
  },
  {
    code: 'CRNO',
    name: '該当化学物質に係る官報告示の通し番号、類別整理番号又は施行令第2条の号番号',
    note: '化学物質の審査及び製造等の規制に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'CRNL',
    name: '許可書番号、通知書の番号等',
    note: '化学物質の審査及び製造等の規制に関する法律関係（写し）',
    mode: 'AS',
  },
  {
    code: 'CTBL',
    name: 'Ｂ／Ｌ番号',
    note: '',
    mode: '-S',
  },
  {
    code: 'CTNO',
    name: 'コンテナ番号',
    note: '',
    mode: '-S',
  },
  {
    code: 'EDNO',
    name: '輸出申告番号',
    note: '再輸入貨物の輸出許可番号',
    mode: 'AS',
  },
  {
    code: 'ENNO',
    name: '包括延納管理番号',
    note: '包括延納管理番号',
    mode: 'AS',
  },
  {
    code: 'EXNO',
    name: '火薬類輸入許可書番号',
    note: '火薬類取締法関係',
    mode: 'AS',
  },
  {
    code: 'FDNO',
    name: '食品等輸入届出済書等番号',
    note: '食品衛生法関係',
    mode: 'AS',
  },
  {
    code: 'FLNO',
    name: '登録証等番号等',
    note: '肥料の品質の確保等に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'FMNO',
    name: '輸入米穀（等）買入委託契約書等番号',
    note: '主要食糧の需給及び価格の安定に関する法律関係（写し）',
    mode: 'AS',
  },
  {
    code: 'FMNG',
    name: '米穀等輸入納付金納付申出書等番号（領収証書の原本の提出が必要なもの）',
    note: '主要食糧の需給及び価格の安定に関する法律関係（原本）',
    mode: 'AS',
  },
  {
    code: 'FONO',
    name: '関係番号等',
    note: '林業種苗法関係',
    mode: 'AS',
  },
  {
    code: 'FRNO',
    name: '輸入許可証番号',
    note: '水産資源保護法関係',
    mode: 'AS',
  },
  {
    code: 'FSNO',
    name: '銃砲所持許可証等番号',
    note: '銃砲刀剣類所持等取締法関係',
    mode: 'AS',
  },
  {
    code: 'GANO',
    name: '輸入検査合格証等番号',
    note: '高圧ガス保安法関係',
    mode: 'AS',
  },
  {
    code: 'GMNO',
    name: '',
    note: '減免税関係',
    mode: 'AS',
  },
  {
    code: 'HFNN',
    name: '本船・ふ中扱い承認申請番号（システム）',
    note: 'システムによる本船・ふ中扱い承認申請',
    mode: '-S',
  },
  {
    code: 'HFNO',
    name: '本船・ふ中扱い承認申請番号（マニュアル）',
    note: 'マニュアルによる本船・ふ中扱い承認申請',
    mode: '-S',
  },
  {
    code: 'HKAT',
    name: '包括審査扱い受理番号',
    note: '包括審査扱い受理番号',
    mode: 'AS',
  },
  {
    code: 'HUNO',
    name: '適法捕獲（採取）証明書等番号',
    note: '鳥獣の保護及び管理並びに狩猟の適正化に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'IANO',
    name: '総保入承認申請番号',
    note: '総保入承認申請番号',
    mode: 'AS',
  },
  {
    code: 'IAPN',
    name: '飼育等許可証等番号',
    note: '特定外来生物による生態系等に係る被害の防止に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'ILNJ',
    name: '輸入承認証等番号',
    note: '輸入貿易管理令関係（外為法関連機能を利用する場合）',
    mode: 'AS',
  },
  {
    code: 'ILNO',
    name: '輸入承認証等番号',
    note: '輸入貿易管理令関係（外為法関連機能を利用しない場合）',
    mode: 'AS',
  },
  {
    code: 'IMNO',
    name: '移入承認申請番号',
    note: '保税工場からの積戻し',
    mode: 'AS',
  },
  {
    code: 'INNO',
    name: '包括保険受理番号',
    note: '包括保険利用の場合',
    mode: 'AS',
  },
  {
    code: 'INVN',
    name: '複数インボイスに係る他のインボイス番号',
    note: 'インボイス番号',
    mode: 'AS',
  },
  {
    code: 'ISNO',
    name: '蔵入承認申請番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'JKAJ',
    name: '事前確認番号',
    note: '事前確認（外為法関連機能を利用する場合）',
    mode: 'AS',
  },
  {
    code: 'JKAK',
    name: '事前確認番号',
    note: '事前確認（外為法関連機能を利用しない場合）',
    mode: 'AS',
  },
  {
    code: 'JKYO',
    name: '事前教示番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'JORG',
    name: '対象番号等',
    note: 'スイス協定に基づき、日本原産品として輸入する場合',
    mode: 'AS',
  },
  {
    code: 'KANS',
    name: 'ＮＡＣＣＳ用関税割当証明書番号',
    note: '関税割当証明書の内容確認（システムを利用する場合）',
    mode: 'AS',
  },
  {
    code: 'KANW',
    name: '関税割当証明書番号',
    note: '関税割当証明書の内容確認（システムを利用しない場合）',
    mode: 'AS',
  },
  {
    code: 'KPNO',
    name: '',
    note: 'キンバリープロセス証明関係',
    mode: 'AS',
  },
  {
    code: 'MANO',
    name: '指定乳製品等輸入業務委託証明書等番号',
    note: '畜産経営の安定に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'MNOU',
    name: '未納税引取承認番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'NANO',
    name: '免許証番号等',
    note: '麻薬及び向精神薬取締法関係',
    mode: 'AS',
  },
  {
    code: 'OLNO',
    name: 'その他のライセンス番号等',
    note: 'その他のライセンス',
    mode: 'AS',
  },
  {
    code: 'OLTN',
    name: '保税運送承認番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'OPNO',
    name: 'あへん輸入委託証明書等番号',
    note: 'あへん法関係',
    mode: 'AS',
  },
  {
    code: 'OTHN',
    name: 'その他の参考情報',
    note: 'その他の参考情報',
    mode: 'AS',
  },
  {
    code: 'OTPL',
    name: '指定地外貨物検査許可番号',
    note: '指定地外貨物検査',
    mode: 'AS',
  },
  {
    code: 'OTST',
    name: '保税地域コード',
    note: '',
    mode: '-S',
  },
  {
    code: 'PANO',
    name: '製造販売業許可証等番号',
    note: '医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律関係（写し）',
    mode: 'AS',
  },
  {
    code: 'PANG',
    name: '輸入指定薬物用途誓約書番号',
    note: '医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律関係（輸入指定薬物用途誓約書を提出する場合）（原本）',
    mode: 'AS',
  },
  {
    code: 'PANE',
    name: '医薬品医療機器等輸出用届出番号',
    note: '医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'PASN',
    name: '製造販売承認書等番号',
    note: '医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律関係（写し）',
    mode: 'AS',
  },
  {
    code: 'PAYA',
    name: '医薬品医療機器等輸入報告番号',
    note: '医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'PAYL',
    name: '支払手段等の輸入許可証番号',
    note: '外国為替令関係',
    mode: 'AS',
  },
  {
    code: 'PDNO',
    name: '毒物劇物輸入業登録票番号等',
    note: '毒物及び劇物取締法関係',
    mode: 'AS',
  },
  {
    code: 'PDYA',
    name: '毒物劇物輸入報告番号',
    note: '毒物及び劇物取締法関係',
    mode: 'AS',
  },
  {
    code: 'PENO',
    name: '石油輸入業者登録通知書番号',
    note: '石油の備蓄の確保等に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'PICN',
    name: '日英特恵輸入証明書番号',
    note: '包括的な経済上の連携に関する日本国とグレートブリテン及び北アイルランド連合王国との間の協定に基づく農林水産省の所掌事務に係る物資の日英特恵輸入証明書に関する省令',
    mode: 'AS',
  },
  {
    code: 'PLNO',
    name: '植物輸入認可証明書等番号',
    note: '植物防疫法関係',
    mode: 'AS',
  },
  {
    code: 'PMNO',
    name: '特定一種病原体等輸入指定書等番号及び輸入検疫証明書等番号',
    note: '感染症の予防及び感染症の患者に対する医療に関する法律関係（写し）',
    mode: 'AS',
  },
  {
    code: 'PMNL',
    name: '輸入検疫証明書等番号',
    note: '感染症の予防及び感染症の患者に対する医療に関する法律関係（システムによる申請（動物検疫関連業務）を行い、共通管理番号を利用せずに出力された証明書を添付する場合）',
    mode: 'AS',
  },
  {
    code: 'PRNO',
    name: '定率法第19条に係る製造証明書番号',
    note: '定率法第19条に係る製造証明書番号',
    mode: 'AS',
  },
  {
    code: 'PSNO',
    name: '郵便切手類模造許可書番号',
    note: '郵便切手類模造等取締法関係',
    mode: 'AS',
  },
  {
    code: 'PTNO',
    name: '再輸入免税貨物のパーツ番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'Q15',
    name: '石油石炭税特例納付承認番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'RANO',
    name: '犬の輸入検疫証明書等番号',
    note: '狂犬病予防法関係',
    mode: 'AS',
  },
  {
    code: 'SHNO',
    name: '輸入許可証番号',
    note: '労働安全衛生法関係',
    mode: 'AS',
  },
  {
    code: 'SINO',
    name: '再輸入免税貨物のシリアル番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'SPNO',
    name: '指定糖の買入れ及び売戻し承諾書等番号',
    note: '砂糖及びでん粉の価格調整に関する法律関係',
    mode: 'AS',
  },
  {
    code: 'STNO',
    name: '輸入許可書番号',
    note: '印紙等模造取締法関係',
    mode: 'AS',
  },
  {
    code: 'TASY',
    name: '他所蔵置許可申請番号',
    note: '他所蔵置許可申請',
    mode: 'AS',
  },
  {
    code: 'VDNO',
    name: '評価申告書番号',
    note: '',
    mode: 'AS',
  },
  {
    code: 'WANA',
    name: 'CITES許可番号',
    note: 'ワシントン条約関係',
    mode: 'AS',
  },
  {
    code: 'ZAN8',
    name: '加工組立輸出貨物確認申告書番号',
    note: '暫定法第８条関係',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'DOKUGEKI',
    note: '毒物及び劇物取締法【特例】（「毒物及び劇物取締法に係る毒劇物の通関の際における取扱いについて」（令和２年８月31日財関第813号）に基づき「輸入確認証」を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'IYAKU',
    note: '医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律（動物用医薬品等）【規制対象外】（「医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律に係る動物用医薬品の通関の際における取扱いについて」（平成26年11月19日財関第1186号）に基づき「確認済輸入確認申請書」等を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'IYAKU',
    note: '医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律（人用医薬品）【非該当】（「医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律に係る医薬品等の通関の際における取扱いについて」（令和２年８月31日財関第812号）に基づき「輸入確認証」を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'IYAKU',
    note: '医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律（人用医薬品）【非該当】（「医薬品、医療機器等の品質、有効性及び安全性の確保等に関する法律に係る医薬品等の通関の際における取扱いについて」（令和２年８月31日財関第812号）に基づき「治験計画届書」を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'NOUYAKU',
    note: '農薬取締法【特例】（「農薬取締法に基づく農薬の輸入通関の際における取扱いについて」（平成16年3月26日財関第330号）に基づき「農薬輸入願」（別記様式第1号）を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'NOUYAKU',
    note: '農薬取締法【特例】（「農薬輸入リスト」及び「農薬の輸出入について」（平成15年2月28日 14生産第9525号）に基づき別記様式第3号を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'NOUYAKU',
    note: '農薬取締法【特例】（「農薬の輸出入について」（平成15年2月28日 14生産第9525号）に基づき別記様式第4号を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'KATIKU',
    note: '家畜伝染病予防法【非該当】（「輸入検査申請書」に「検査済」又は「非該当」である旨の押印がされた書面を提出する場合）（注）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'GAS',
    note: '高圧ガス保安法【適用除外】（「高圧ガス保安法の適用除外となるエアゾール製品等の通関の際における取扱いについて」（令和元年6月27日財関第862号）に基づき「試験成績書」（様式第1、第2又は第3）を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'GAS',
    note: '高圧ガス保安法【適用除外】（「高圧ガスを封入した緩衝装置等に係る輸入の通関の際における取扱いについて」（平成30年2月27日財関第257号）に基づき「適用除外確認証明書」（別紙様式第１、第2、第3又は第4）を提出する場合）（写し）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'SEKIYU',
    note: '石油の備蓄の確保等に関する法律【非該当】（「石油精製業者証明書」又は「特定石油販売業者証明書」を提出する場合）',
    mode: 'AS',
  },
  {
    code: 'TOKG',
    name: 'GAITAME',
    note: '外国為替及び外国貿易法【非該当】（「活のかんぱち稚魚の養殖用の確認について」（24水漁第248号平成24年5月8日）に基づき「確認書」を提出する場合）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'SYOKUHIN',
    note: '食品衛生法【非該当】（「食品衛生法に係る食品等の通関の際における取扱い等について」（昭和57年9月29日蔵関第1055号）に基づき届出を要しない貨物であることを証明するための書面（様式第３号）を提出する場合）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'ROUAN',
    note: '労働安全衛生法【非該当】（「アスベスト含有製品の輸入規制について」（平成18年8月23日経済産業省製造産業局車両課事務連絡）に基づき「石綿非含有の証明書」を提出する場合）',
    mode: 'AS',
  },
  {
    code: 'TOKU',
    name: 'ROUAN',
    note: '労働安全衛生法【非該当】（「石綿分析用試料等輸入届」（石綿障害予防規則様式第３号の２）を提出する場合）',
    mode: 'AS',
  },
];