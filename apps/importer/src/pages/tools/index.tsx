import { useState } from 'react';
import { Card, Descriptions, Checkbox } from 'antd';
////
import Wash from './components/Wash';
import GenName from './components/GenName';

export interface ToolsProps {}

const Tools: React.FC<ToolsProps> = () => {
  const [washOpt, setWashOpt] = useState({
    zenkaku2Hankaku: true,
    isWashName: true,
    isNameReverse: false,
    isWashIAD: true,
  });

  return (
    <Card>
      <Descriptions bordered title="Wash Data" column={1}>
        <Descriptions.Item label="Zenkaku2Hankaku">
          <Checkbox
            checked={washOpt.zenkaku2Hankaku}
            onChange={(e) =>
              setWashOpt({ ...washOpt, zenkaku2Hankaku: e.target.checked })
            }
          >
            全角から半角へ
          </Checkbox>
        </Descriptions.Item>
        <Descriptions.Item label="WashName">
          <Checkbox
            checked={washOpt.isWashName}
            onChange={(e) =>
              setWashOpt({ ...washOpt, isWashName: e.target.checked })
            }
          >
            名前を英文へ
          </Checkbox>
        </Descriptions.Item>
        <Descriptions.Item label="NameReverse">
          <Checkbox
            checked={washOpt.isNameReverse}
            onChange={(e) =>
              setWashOpt({ ...washOpt, isNameReverse: e.target.checked })
            }
          >
            名前を反転
          </Checkbox>
        </Descriptions.Item>
        <Descriptions.Item label="WashAddress">
          <Checkbox
            checked={washOpt.isWashIAD}
            onChange={(e) =>
              setWashOpt({ ...washOpt, isWashIAD: e.target.checked })
            }
          >
            住所を直す
          </Checkbox>
        </Descriptions.Item>
        <Descriptions.Item label="Action">
          <Wash payload={washOpt} />
        </Descriptions.Item>
      </Descriptions>
      <br />
      <br />
      <GenName />
    </Card>
  );
};

export default Tools;
