import React, { useState, useRef } from 'react';
import { useBoolean } from 'ahooks';
import { Button, Dropdown, Modal, Menu } from 'antd';
import { Collapse, Row, Col, Card, Empty, message } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
////
import { ZIP_STATES } from '@/utils/const';
import ZipAreaSider from '@/components/Sider/ZipAreaSider';
import ZipAreaContent from '@/components/Content/ZipAreaContent';
import ZipAreaForm from '@/components/Form/ZipAreaForm';
import {
  updateNameByZipAreaId,
  deleteByZipAreaId,
} from '@/services/request/ziparea';

export interface ZipAreaProps {}

const ZipArea: React.FC<ZipAreaProps> = () => {
  const [areaData, setAreaData] = useState<any>();
  const [modalVisible, handleModelVisible] = useBoolean();
  const siderRef = useRef<any>(null);

  const handleSubmit = async (values: any) => {
    try {
      const name = values?.name;
      if (name === areaData?.name) return;
      await updateNameByZipAreaId({ id: areaData._id, name });
      setAreaData({ ...areaData, name });
      const newData = siderRef.current?.siderData?.map((s: any) =>
        s._id === areaData._id ? { ...s, name } : s,
      );
      siderRef.current?.setSiderData(newData);
    } catch (error) {
      message.error(error);
    }
  };


  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure delete this task?',
      content: 'Some descriptions',
      onOk: async () => {
        try {
          const id = areaData?._id;
          console.log(id)
          await deleteByZipAreaId({ id });
          setAreaData({});
          const newData = siderRef.current?.siderData?.filter(
            (s: any) => s._id !== id,
          );
          siderRef.current?.setSiderData(newData);
        } catch (error) {
          console.log(error);
        }
      },
    });
  };

  return (
    <>
      <ZipAreaForm
        title="编辑区域"
        dataSource={areaData}
        visible={modalVisible}
        onSubmit={handleSubmit}
        onVisibleChange={handleModelVisible.toggle}
      />
      <Row gutter={12} wrap={false}>
        <Col flex="210px">
          <ZipAreaSider
            ref={siderRef}
            value={areaData}
            onChange={setAreaData}
          />
        </Col>
        <Col flex="auto">
          {areaData?.name ? (
            <Card
              title={areaData?.name}
              extra={
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={handleModelVisible.setTrue}>
                        编辑
                      </Menu.Item>
                      <Menu.Item onClick={handleDelete}>删除</Menu.Item>
                    </Menu>
                  }
                >
                  <Button type="text">
                    <MoreOutlined />
                  </Button>
                </Dropdown>
              }
              actions={[
                <Button type="primary" disabled={true}>
                  <EditOutlined />
                  保存
                </Button>,
                <Button disabled={true}>
                  <DeleteOutlined /> 重置
                </Button>,
              ]}
              bodyStyle={{
                height: 'calc(100vh - 230px)',
                overflow: 'auto',
              }}
            >
              <Collapse>
                {ZIP_STATES.map((state, key) => {
                  const cityCount =
                    areaData?.states?.find(({ name }: any) => name === state)
                      ?.cityCount || 0;
                  return (
                    <Collapse.Panel
                      key={key}
                      header={`${state}（${cityCount}）`}
                    >
                      <ZipAreaContent
                        key={key}
                        state={state}
                        areaData={areaData}
                      />
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            </Card>
          ) : (
            <Card>
              <Empty description={false} />
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ZipArea;
