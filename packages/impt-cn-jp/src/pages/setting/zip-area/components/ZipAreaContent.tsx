import React, { useRef, useState } from 'react';
import { Row, Col, Drawer, Button, Descriptions, message } from 'antd';
import { constant } from '@silken-houtai/core';
////
import { updateZipCodesByZipAreaId } from '@/services/request/ziparea';
import ZipAreaContentItem from './ZipAreaContentItem';

export interface ZipAreaContentProps {
  areaData: any;
  updateZipAreaApi: (v: any) => void;
}

const ZipAreaContent: React.FC<ZipAreaContentProps> = (props) => {
  // state
  const ref = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [stateName, setStateName] = useState('');

  // action
  async function handleSubmit() {
    try {
      setLoading(true);
      const { count, zipcodes } = ref?.current?.getZipcodes();
      await updateZipCodesByZipAreaId({
        zipcodes,
        state: stateName,
        zipAreaId: props.areaData?._id,
      });
      const newAreaData = {
        ...props.areaData,
        states: props.areaData.states?.map((s: any) => (s.name === stateName ? { ...s, count } : s)),
      };
      props.updateZipAreaApi(newAreaData);
      handleCancel();
    } catch (error: any) {
      handleCancel();
      message.error(error);
    }
  }
  function handleCancel() {
    setLoading(false);
    setVisible(false);
  }

  return (
    <>
      <Drawer
        title={stateName}
        width={600}
        maskClosable={false}
        onClose={handleCancel}
        visible={visible}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button disabled={loading} onClick={handleCancel} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button loading={loading} onClick={handleSubmit} type="primary">
              提交
            </Button>
          </div>
        }
      >
        <ZipAreaContentItem ref={ref} state={stateName} zipAreaId={props.areaData?._id} />
      </Drawer>
      <Descriptions bordered>
        {constant.ZIP_STATES_GROUPS.map((item, key) => {
          return (
            <Descriptions.Item label={item.name} key={key} span={3}>
              <Row>
                {item?.states?.map((state, key) => {
                  const cityCount = props?.areaData?.states?.find(({ name }: any) => name === state)?.count || 0;
                  const handleOpen = () => {
                    ref?.current?.resetSelected(state);
                    setStateName(state);
                    setVisible(true);
                  };
                  return (
                    <Col key={key} span={8}>
                      <Button type="link" onClick={handleOpen} key={key}>
                        {state}
                      </Button>
                      <span>{`（${cityCount}）`}</span>
                    </Col>
                  );
                })}
              </Row>
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </>
  );
};

export default ZipAreaContent;
