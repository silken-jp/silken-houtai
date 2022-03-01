import { Form, Input, Button, Row, Col, Select, DatePicker } from 'antd';

export interface CTSSearchProps {
  form: any;
  search: any;
}

const CTSSearch: React.FC<CTSSearchProps> = (props) => {
  const { form, search } = props;

  const advanceSearchForm = (
    <div className="sk-table-search">
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="CLS">
              <Select
                mode="multiple"
                allowClear
                placeholder="クレンザー"
                options={[
                  { value: 'FURUKI', label: 'FURUKI' },
                  { value: 'KOGA', label: 'KOGA' },
                  { value: 'YAN', label: 'YAN' },
                  { value: 'YANG', label: 'YANG' },
                  { value: 'YUAN', label: 'YUAN' },
                  { value: 'SHANG', label: 'SHANG' },
                  { value: 'IKARASHI', label: 'IKARASHI' },
                  { value: 'ANBE', label: 'ANBE' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item>
              <DatePicker.RangePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="BRC">
              <Select
                mode="multiple"
                allowClear
                placeholder="ブローカー "
                options={[
                  { value: 'FURUKI', label: 'FURUKI' },
                  { value: 'KOGA', label: 'KOGA' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item>
              <DatePicker.RangePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="CRT">
              <Select
                mode="multiple"
                allowClear
                placeholder="クリエーター"
                options={[
                  { value: 'FURUKI', label: 'FURUKI' },
                  { value: 'KOGA', label: 'KOGA' },
                  { value: 'YAN', label: 'YAN' },
                  { value: 'YANG', label: 'YANG' },
                  { value: 'YUAN', label: 'YUAN' },
                  { value: 'SHANG', label: 'SHANG' },
                  { value: 'IKARASHI', label: 'IKARASHI' },
                  { value: 'ANBE', label: 'ANBE' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item>
              <DatePicker.RangePicker />
            </Form.Item>
          </Col>
        </Row>

        {/* <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="申告番号" name="HAB">
              <Input.TextArea placeholder="申告番号" rows={1}/>
            </Form.Item>
          </Col>
        </Row> */}

        <Row gutter={24}>
          <Col span={4}>
            <Form.Item label="代理商名" name="agent">
              <Select
                placeholder="代理商名"
                options={[
                  { value: 'aaa', label: '佐川' },
                  { value: 'bbb', label: '大和' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="STATUS" name="process_status">
              <Select
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
          <Col span={6}>
            <Form.Item label="MAWB番号" name="MAB">
              <Input placeholder="MAWB番号" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="HAWB番号">
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
                options={[
                  { value: 'aaa', label: '佐川' },
                  { value: 'bbb', label: '大和' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="process_status">
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
