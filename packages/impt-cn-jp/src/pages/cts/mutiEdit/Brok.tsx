import { List, Button, Space, Card, Descriptions } from 'antd';
////
import CTSSearch from '@/components/Search/CTSSearch';
import { useCTS } from '@/services/useCTS';
import { updateWaybill } from '@/services/request/waybill';
import { getUserInfo } from '@/services/useStorage';
import { Link } from 'umi';

export default () => {
  const { form, state, tableProps, search, refreshAsync } = useCTS('M', {
    defaultPageSize: 2,
    pagination: {
      showSizeChanger: false,
    },
  });
  const userInfo = getUserInfo();

  async function handleSubmit(values: any, waybill_status: number) {
    if (values) {
      const newREF = `${values?.REF ? values.REF + ' ' : ''}${
        userInfo?.initialName
      }`;
      await updateWaybill({
        ...values,
        waybillId: values?._id,
        user: userInfo?._id,
        process_status: 4,
        process_type: 2,
        waybill_status,
        REF: newREF?.length > 20 ? values?.REF || '' : newREF,
      });
    }
  }

  return (
    <>
      <CTSSearch form={form} search={search} />
      <Card title="Broker Check">
        <List<API.Waybill>
          itemLayout="vertical"
          size="small"
          split={false}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            onChange: (current, pageSize) =>
              tableProps.onChange({
                current,
                pageSize,
              }),
          }}
          renderItem={(item) => {
            const handleHold = async () => {
              await handleSubmit(item, 2);
              await refreshAsync();
            };
            const handleSendBack = async () => {
              await handleSubmit(item, 3);
              await refreshAsync();
            };
            const handleAccept = async () => {
              await handleSubmit(item, 1);
              await refreshAsync();
            };
            return (
              <List.Item key={item._id}>
                {/* {item.content} */}
                <Descriptions
                  title={
                    <Link
                      to={`/cts/check/${item._id}?LS=${item.LS}&actionType=0&checkType=1`}
                    >
                      {item.HAB}
                    </Link>
                  }
                  extra={
                    <Space>
                      <Button onClick={handleHold}>Hold</Button>
                      <Button onClick={handleSendBack}>SendBack</Button>
                      <Button onClick={handleAccept} type="primary">
                        Accept
                      </Button>
                    </Space>
                  }
                  bordered
                  column={24}
                  size="small"
                >
                  <Descriptions.Item span={18} label="9.ImpCode">
                    {item.ImpCode}
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="9.NO">
                    {item.NO}
                  </Descriptions.Item>
                  <Descriptions.Item span={3} label="9.GW">
                    {item.GW}
                  </Descriptions.Item>
                  <Descriptions.Item span={18} label="50.CMN">
                    {item.CMN}
                  </Descriptions.Item>
                  <Descriptions.Item span={6} label="16.Tel">
                    {item.Tel}
                  </Descriptions.Item>
                  <Descriptions.Item span={18} label="10.ImpNameJP">
                    {item.ImpNameJP}
                  </Descriptions.Item>
                  <Descriptions.Item span={6} label="40.IP1~43.IP4">
                    {item.IP1} {item.IP2} {item.IP3} {item.IP4}
                  </Descriptions.Item>
                  <Descriptions.Item span={18} label="10.ImpName">
                    {item.ImpName}
                  </Descriptions.Item>
                  <Descriptions.Item span={6} label="53.NT1">
                    {item.NT1}
                  </Descriptions.Item>
                  <Descriptions.Item span={18} label="17.IADJP">
                    {item.IADJP}
                  </Descriptions.Item>
                  <Descriptions.Item span={6} label="44.FR1 ~ 46.FR3">
                    {item.FR1} {item.FR2} {item.FR3}
                  </Descriptions.Item>
                  <Descriptions.Item span={18} label="17.IAD">
                    {item.IAD}
                  </Descriptions.Item>
                  <Descriptions.Item span={6} label="47.IN1 ~ 49.IN3">
                    {item.IN1} {item.IN2} {item.IN3}
                  </Descriptions.Item>
                </Descriptions>
              </List.Item>
            );
          }}
        />
      </Card>
    </>
  );
};
