import { Card, Descriptions } from 'antd';
////
import WashName from './components/WashName';
import WashAddress from './components/WashAddress';
import Zenkaku2Hankaku from './components/Zenkaku2Hankaku';

export interface ToolsProps {}

const Tools: React.FC<ToolsProps> = () => {
  return (
    <Card>
      <Descriptions bordered title="Wash Data" column={1}>
        <Descriptions.Item label="Zenkaku2Hankaku">
          <Zenkaku2Hankaku />
        </Descriptions.Item>
        <Descriptions.Item label="WashName">
          <WashName />
        </Descriptions.Item>
        <Descriptions.Item label="WashAddress">
          <WashAddress />
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default Tools;
