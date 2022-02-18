import { Form, Input, Button, Row, Col, Select, DatePicker, Space } from 'antd';

export interface CTSSearchProps {
  form: any;
  search: any;
}

const CTSSearch: React.FC<CTSSearchProps> = (props) => {
  const { form, search } = props;

  const advanceSearchForm = (
    <div className="sk-table-search">
      <Form form={form}>
        <Row>
          <Col span={8}>
            <Space>
              <Form.Item label="クレンザー" name="c">
                <Select
                  placeholder="名前"
                  options={[
                    { value: '0', label: 'Aさん' },
                    { value: '1', label: 'Bさん' },
                    { value: '2', label: 'Cさん' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="cc">
                <DatePicker.RangePicker />
              </Form.Item>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <Form.Item label="クリエーター" name="d">
                <Select
                  placeholder="名前"
                  options={[
                    { value: '0', label: 'Aさん' },
                    { value: '1', label: 'Bさん' },
                    { value: '2', label: 'Cさん' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="dd">
                <DatePicker.RangePicker />
              </Form.Item>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <Form.Item label="ブローカー" name="e">
                <Select
                  placeholder="名前"
                  options={[
                    { value: '0', label: 'Aさん' },
                    { value: '1', label: 'Bさん' },
                    { value: '2', label: 'Cさん' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="ee">
                <DatePicker.RangePicker />
              </Form.Item>
            </Space>
          </Col>
        </Row>

        <Row>
          <Col span={16}>
            <Space>
              <Form.Item label="申告" name="ff">
                <Select
                  placeholder="STATUS"
                  options={[
                    { value: '0', label: '0' },
                    { value: '2', label: '1' },
                    { value: '2', label: '2' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="f">
                <Input placeholder="申告番号" />
              </Form.Item>
              <Form.Item name="fff">
                <Select
                  placeholder="申告者"
                  options={[
                    { value: '0', label: 'Aさん' },
                    { value: '1', label: 'Bさん' },
                    { value: '2', label: 'Cさん' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="ffff">
                <DatePicker.RangePicker />
              </Form.Item>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <Form.Item label="許可" name="b">
                <Select
                  placeholder="STATUS"
                  options={[
                    { value: '0', label: '許可済み' },
                    { value: '1', label: '未許可' },
                  ]}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="bb">
                <DatePicker.RangePicker />
              </Form.Item>
            </Space>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={4}>
            <Form.Item label="代理商名" name="a">
              <Select
                placeholder="代理商名"
                options={[
                  { value: 'aaa', label: '佐川' },
                  { value: 'bbb', label: '大和' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="MAWB番号" name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="HAWB番号" name="HAB">
              <Input placeholder="HAWB番号" />
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
          <Col span={2}>
            <Form.Item name="a">
              <Select
                onChange={search.submit}
                placeholder="代理商名"
                allowClear
                options={[
                  { value: 'aaa', label: '佐川' },
                  { value: 'bbb', label: '大和' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="MAB">
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
