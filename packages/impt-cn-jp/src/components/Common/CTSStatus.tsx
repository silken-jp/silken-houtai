import { Result } from 'ahooks/lib/useRequest/src/types';
import { Row, Col, Statistic, Progress, Skeleton } from 'antd';

export interface CTSStatusProps extends Result<any, any> {
  type: 'MIC' | 'IDA';
}

const paragraph = { rows: 1 };

function numberFixed(a: number, b: number) {
  return b ? Number.parseFloat(((a * 100) / b).toFixed(2)) : 0;
}

function useData(data: any) {
  const cleansingCount = data?.cleansingCount || 0;
  const brokerCount = data?.brokerCount || 0;
  const createCount = data?.createCount || 0;
  const totalCount = data?.totalCount || 0;
  return {
    totalCount,
    cleansing: {
      count: cleansingCount,
      percent: numberFixed(cleansingCount, totalCount),
    },
    broker: {
      count: brokerCount,
      percent: numberFixed(brokerCount, totalCount),
    },
    create: {
      count: createCount,
      percent: numberFixed(createCount, totalCount),
    },
  };
}

const CTSStatus: React.FC<CTSStatusProps> = (props) => {
  const { cleansing, broker, create, totalCount } = useData(props?.data);

  return (
    <div className="sk-table-stat">
      <Skeleton loading={props?.loading} active paragraph={paragraph}>
        <Row gutter={32}>
          <Col span={6}>
            <Statistic
              title="クレンジング済"
              value={cleansing.count}
              suffix={`/ ${totalCount}`}
            />
            <Progress percent={cleansing.percent} />
          </Col>
          {props?.type === 'IDA' && (
            <Col span={6}>
              <Statistic
                title="クリエート済"
                value={create.count}
                suffix={`/ ${totalCount}`}
              />
              <Progress percent={create.percent} />
            </Col>
          )}
          <Col span={6}>
            <Statistic
              title="ブローカーチェック済"
              value={broker.count}
              suffix={`/ ${totalCount}`}
            />
            <Progress percent={broker.percent} />
          </Col>
          {props?.type === 'MIC' && (
            <Col span={6}>
              <Statistic
                title="クリエート済"
                value={create.count}
                suffix={`/ ${totalCount}`}
              />
              <Progress percent={create.percent} />
            </Col>
          )}
          <Col span={6}>
            <Statistic title="申告済" value={0} suffix={`/ ${totalCount}`} />
            <Progress percent={0} />
          </Col>
        </Row>
      </Skeleton>
    </div>
  );
};

export default CTSStatus;
