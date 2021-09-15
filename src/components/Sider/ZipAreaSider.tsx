import React from 'react';
import { useBoolean } from 'ahooks';
import { Menu, Button, Spin, message } from 'antd';
////
import { createZipArea } from '@/services/request/ziparea';
import ZipAreaForm from '@/components/Form/ZipAreaForm';

export interface ZipAreaSiderProps {
  zipAreasApi: any;
  onChange: (v: any) => void;
}

const ZipAreaSider: React.FC<ZipAreaSiderProps> = (props) => {
  // props
  const { data, loading, error, mutate } = props?.zipAreasApi;
  // state
  const [modalVisible, handleModelVisible] = useBoolean();
  // actions
  const handleSubmit = async (values: any) => {
    try {
      const { _id } = await createZipArea({ name: values?.name });
      mutate([...data, { _id, name: values?.name }]);
    } catch (error) {
      message.error(error);
    }
  };

  if (loading) return <Spin />;
  if (error) return <>error</>;
  return (
    <>
      <ZipAreaForm
        title="新規エリア"
        visible={modalVisible}
        onSubmit={handleSubmit}
        onVisibleChange={handleModelVisible.toggle}
      />
      <Button
        size="large"
        type="dashed"
        onClick={handleModelVisible.setTrue}
        block
      >
        新規
      </Button>
      <Menu mode="inline">
        {data?.map((area: any) => (
          <Menu.Item key={area._id} onClick={() => props.onChange(area)}>
            <span>{area.name}</span>
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
};

export default ZipAreaSider;
