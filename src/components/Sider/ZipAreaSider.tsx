import React, { useImperativeHandle } from 'react';
import { useRequest, useBoolean } from 'ahooks';
import { Menu, Button, Spin, message } from 'antd';

import { getZipAreas } from '@/services/request/ziparea';
import { createZipArea } from '@/services/request/ziparea';
import ZipAreaForm from '@/components/Form/ZipAreaForm';

export interface ZipAreaSiderProps {
  value: any;
  onChange: (v: any) => void;
}

interface ZipAreaSiderHandle {
  siderData: any[];
  setSiderData: (v: any) => void;
}

const ZipAreaSider: React.ForwardRefRenderFunction<
  ZipAreaSiderHandle,
  ZipAreaSiderProps
> = (props, ref) => {
  const { data, loading, error, mutate } = useRequest<any>(getZipAreas);
  const [modalVisible, handleModelVisible] = useBoolean();

  useImperativeHandle(ref, () => ({
    siderData: data,
    setSiderData: mutate,
  }));

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
        title="新建区域"
        visible={modalVisible}
        onSubmit={handleSubmit}
        onVisibleChange={handleModelVisible.toggle}
      />
      <Button onClick={handleModelVisible.setTrue} block>
        添加
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

export default React.forwardRef(ZipAreaSider);
