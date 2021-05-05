import React, { useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Button, Dropdown, Modal, Menu } from 'antd';
import { Row, Col, Card, Empty, message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
////
import ZipAreaSider from '@/components/Sider/ZipAreaSider';
import ZipAreaContent from '@/components/Content/ZipAreaContent';
import ZipAreaForm from '@/components/Form/ZipAreaForm';

////
import { getZipAreas } from '@/services/request/ziparea';
import {
  updateNameByZipAreaId,
  deleteByZipAreaId,
} from '@/services/request/ziparea';

export interface ZipAreaProps {}

const ZipArea: React.FC<ZipAreaProps> = () => {
  // state
  const [areaData, setAreaData] = useState<any>();
  const [modalVisible, handleModelVisible] = useBoolean();

  // api
  const zipAreasApi = useRequest<any>(getZipAreas);

  // actions
  const handleSubmit = async (values: any) => {
    try {
      const zipAreaId = areaData._id;
      const name = values?.name;
      if (name === areaData?.name) return;
      await updateNameByZipAreaId({ zipAreaId, name });
      updateZipAreaApi({ ...areaData, name });
    } catch (error) {
      message.error(error);
    }
  };
  const handleDelete = () => {
    Modal.confirm({
      title: '确定要删除本区域吗?',
      content: '删除后不可恢复数据',
      onOk: async () => {
        try {
          const zipAreaId = areaData?._id;
          await deleteByZipAreaId({ zipAreaId });
          setAreaData({});
          const newSiderData = zipAreasApi?.data?.filter(
            (s: any) => s._id !== zipAreaId,
          );
          zipAreasApi?.mutate(newSiderData);
        } catch (error) {
          message.error(error);
        }
      },
    });
  };
  const updateZipAreaApi = (newAreaData: any) => {
    setAreaData(newAreaData);
    const newSiderData = zipAreasApi?.data?.map((s: any) =>
      s._id === newAreaData?._id ? newAreaData : s,
    );
    zipAreasApi?.mutate(newSiderData);
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
          <ZipAreaSider zipAreasApi={zipAreasApi} onChange={setAreaData} />
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
            >
              <ZipAreaContent
                areaData={areaData}
                updateZipAreaApi={updateZipAreaApi}
              />
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
