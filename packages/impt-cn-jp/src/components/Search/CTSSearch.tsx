import { Form, Input, Button, Row, Col, Select, DatePicker } from 'antd';
import { useRequest } from 'ahooks';
import { getAllUsers } from '@/services/request/user';
import { getAllAgents } from '@/services/request/agent';

export interface CTSSearchProps {
  form: any;
  search: any;
}

const CTSSearch: React.FC<CTSSearchProps> = (props) => {
  const { form, search } = props;

  const getData = async (params: any) => {
    return await getAllUsers({ page: 0, perPage: 9999, ...params });
  };
  const { data } = useRequest(getData, { cacheKey: 'userOpts' });
  const allAgentsAPI = useRequest(getAllAgents, { cacheKey: 'agentOpts' });

  const agents =
    allAgentsAPI?.data?.map((item: any) => ({
      value: item?._id,
      label: item?.name,
    })) || [];

  let CLSOpts = [];
  let BRCOpts = [];
  let CRTOpts = [];

  for (const item of data?.users || []) {
    const opt = { value: item?._id, label: item?.name };
    item?.is_cleanser && CLSOpts.push(opt);
    item?.is_broker && BRCOpts.push(opt);
    item?.is_creator && CRTOpts.push(opt);
  }

  const advanceSearchForm = (
    <div className="sk-table-search">
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="CLS" name="cleansers[]">
              <Select
                mode="multiple"
                allowClear
                placeholder="cleansers"
                options={CLSOpts}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="clsStartDate">
              <DatePicker placeholder="start date" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="clsEndDate">
              <DatePicker placeholder="end date" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="BRC" name="brokers[]">
              <Select
                mode="multiple"
                allowClear
                placeholder="brokers"
                options={BRCOpts}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="brcStartDate">
              <DatePicker placeholder="start date" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="brcEndDate">
              <DatePicker placeholder="end date" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="CRT" name="creators[]">
              <Select
                mode="multiple"
                allowClear
                placeholder="creators"
                options={CRTOpts}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="crtStartDate">
              <DatePicker placeholder="start date" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="crtEndDate">
              <DatePicker placeholder="end date" />
            </Form.Item>
          </Col>
        </Row>

        {/* <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="申告番号">
              <Input.TextArea placeholder="申告番号" rows={1}/>
            </Form.Item>
          </Col>
        </Row> */}

        <Row gutter={24}>
          <Col>
            <Form.Item label="代理商名" name="agent">
              <Select allowClear placeholder="代理商名" options={agents} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="STATUS" name="status">
              <Select
                placeholder="STATUS"
                allowClear
                options={[
                  { value: '0', label: 'CLS Undone' },
                  { value: '1', label: 'CLS Done' },
                  { value: '2', label: 'BRC Undone' },
                  { value: '3', label: 'BRC Done' },
                  { value: '4', label: 'CRT Undone' },
                  { value: '5', label: 'CRT Done' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="MAWB番号" name="mawbs">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item label="HAWB番号" name="hawbs">
              <Input.TextArea placeholder="HAWB番号" rows={1} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} justify="end" style={{ marginBottom: 24 }}>
          <Form.Item>
            <Button type="primary" onClick={search.submit}>
              検索
            </Button>
            <Button onClick={search.reset} style={{ marginLeft: 16 }}>
              リセット
            </Button>
            <Button type="link" onClick={search.changeType}>
              Simple Search
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );

  const searchForm = (
    <div className="sk-table-search">
      <Form form={form}>
        <Row justify="end" gutter={12}>
          <Col span={3}>
            <Form.Item name="agent">
              <Select
                allowClear
                onChange={search.submit}
                placeholder="代理商名"
                options={agents}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="status">
              <Select
                allowClear
                onChange={search.submit}
                placeholder="STATUS"
                options={[
                  { value: '0', label: 'CLS Undone' },
                  { value: '1', label: 'CLS Done' },
                  { value: '2', label: 'BRC Undone' },
                  { value: '3', label: 'BRC Done' },
                  { value: '4', label: 'CRT Undone' },
                  { value: '5', label: 'CRT Done' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="mawbs">
              <Input.Search placeholder="MAWB番号" onSearch={search.submit} />
            </Form.Item>
          </Col>
          <Button type="link" onClick={search.changeType}>
            Advanced Search
          </Button>
        </Row>
      </Form>
    </div>
  );

  return <> {search.type === 'simple' ? searchForm : advanceSearchForm}</>;
};

export default CTSSearch;
