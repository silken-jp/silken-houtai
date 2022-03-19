import { useState } from 'react';
import { useRequest } from 'ahooks';
import { Row, Col, Card, Empty, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useSKForm } from '@silken-houtai/core/lib/useHooks';
////
import ZipAreaSider from './components/ZipAreaSider';
import ZipAreaContent from './components/ZipAreaContent';
import Actions, { deleteConfirm } from '@/components/Common/Actions';
import ZipAreaForm from '@/components/Form/ZipAreaForm';
import { useIntlFormat } from '@/services/useIntl';
import { getZipAreas, createZipArea } from '@/services/request/ziparea';
import {
  updateNameByZipAreaId,
  deleteByZipAreaId,
} from '@/services/request/ziparea';

export interface ZipAreaProps {}

const ZipArea: React.FC<ZipAreaProps> = () => {
  // state
  const [areaData, setAreaData] = useState<any>();
  const [intlMenu] = useIntlFormat('menu');
  const { formType, formProps, handleOpen } =
    useSKForm.useForm<{ name: string }>();

  // api
  const zipAreasApi = useRequest(getZipAreas);

  // actions
  const handleSubmit = async (values: any) => {
    if (formType === 'add') {
      const { _id } = await createZipArea({ name: values?.name });
      zipAreasApi?.mutate([...zipAreasApi?.data, { _id, name: values?.name }]);
    }
    if (formType === 'edit') {
      try {
        const zipAreaId = areaData._id;
        const name = values?.name;
        if (name === areaData?.name) return;
        await updateNameByZipAreaId({ zipAreaId, name });
        updateZipAreaApi({ ...areaData, name });
      } catch (error: any) {
        message.error(error);
      }
    }
  };

  const handleAdd = () => {
    handleOpen({ title: '区域', type: 'add', data: null });
  };

  const handleEdit = () => {
    handleOpen({ title: '区域', type: 'edit', data: areaData });
  };

  const [handleDelete] = deleteConfirm({
    name: areaData?.name,
    submit: async () => {
      const zipAreaId = areaData?._id;
      await deleteByZipAreaId({ zipAreaId });
      setAreaData({});
      const newSiderData = zipAreasApi?.data?.filter(
        (s: any) => s._id !== zipAreaId,
      );
      zipAreasApi?.mutate(newSiderData);
    },
  });

  const updateZipAreaApi = (newAreaData: any) => {
    setAreaData(newAreaData);
    const newSiderData = zipAreasApi?.data?.map((s: any) =>
      s._id === newAreaData?._id ? newAreaData : s,
    );
    zipAreasApi?.mutate(newSiderData);
  };

  return (
    <PageContainer
      header={{
        title: `${intlMenu('setting.zipArea')}`,
        breadcrumb: {
          routes: [
            {
              path: '/delivery/settings/zip-area',
              breadcrumbName: intlMenu('setting'),
            },
            { path: '', breadcrumbName: intlMenu('setting.zipArea') },
          ],
        },
      }}
    >
      <ZipAreaForm type={formType} {...formProps} onSubmit={handleSubmit} />
      <Row gutter={12} wrap={false}>
        <Col flex="210px">
          <ZipAreaSider
            zipAreasApi={zipAreasApi}
            onChange={setAreaData}
            onAdd={handleAdd}
          />
        </Col>
        <Col flex="auto">
          {areaData?.name ? (
            <Card
              title={areaData?.name}
              extra={<Actions onEdit={handleEdit} onDelete={handleDelete} />}
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
    </PageContainer>
  );
};

export default ZipArea;
