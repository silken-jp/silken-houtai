import React, { useState } from 'react';
import { useBoolean, useRequest } from 'ahooks';
import { Row, Col, Card, Empty, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
////
import ZipAreaSider from './components/ZipAreaSider';
import ZipAreaContent from './components/ZipAreaContent';
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import ZipAreaForm from '@/components/Form/ZipAreaForm';
import { useIntlFormat } from '@/services/useIntl';
import { getZipAreas } from '@/services/request/ziparea';
import { updateNameByZipAreaId, deleteByZipAreaId } from '@/services/request/ziparea';

export interface ZipAreaProps {}

const ZipArea: React.FC<ZipAreaProps> = () => {
  // state
  const [areaData, setAreaData] = useState<any>();
  const [modalVisible, handleModelVisible] = useBoolean();
  const [intlMenu] = useIntlFormat('menu');

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
    } catch (error: any) {
      message.error(error);
    }
  };
  const [handleDelete] = deleteConfirm({
    name: areaData?.name,
    submit: async () => {
      const zipAreaId = areaData?._id;
      await deleteByZipAreaId({ zipAreaId });
      setAreaData({});
      const newSiderData = zipAreasApi?.data?.filter((s: any) => s._id !== zipAreaId);
      zipAreasApi?.mutate(newSiderData);
    },
  });

  const updateZipAreaApi = (newAreaData: any) => {
    setAreaData(newAreaData);
    const newSiderData = zipAreasApi?.data?.map((s: any) => (s._id === newAreaData?._id ? newAreaData : s));
    zipAreasApi?.mutate(newSiderData);
  };

  return (
    <PageContainer
      header={{
        title: `${intlMenu('setting.zipArea')}`,
        breadcrumb: {
          routes: [
            { path: '/setting/zip-area', breadcrumbName: intlMenu('setting') },
            { path: '', breadcrumbName: intlMenu('setting.zipArea') },
          ],
        },
      }}
    >
      <ZipAreaForm
        title="区域"
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
              extra={<Actions onEdit={handleModelVisible.setTrue} onDelete={handleDelete} />}
            >
              <ZipAreaContent areaData={areaData} updateZipAreaApi={updateZipAreaApi} />
            </Card>
          ) : (
            <Card>
              <Empty description={false} />
            </Card>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ZipArea;
