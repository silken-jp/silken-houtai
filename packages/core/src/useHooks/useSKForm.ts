import { useState } from 'react';
import { Form, message } from 'antd';

export declare interface SKFormProps<T> {
  type?: string;
  title: string;
  visible: boolean;
  dataSource?: T;
  onSubmit?: (data: T) => void;
  onVisibleChange?: (visible: boolean) => void;
}

export declare interface BasicFormProps<T> {
  title: string;
  visible: boolean;
  dataSource?: T;
  onSubmit?: (data: T) => void;
  onVisibleChange?: (visible: boolean) => void;
}

export const useForm = <T>() => {
  const [formType, setFormType] = useState('');
  const [title, setTitle] = useState('');
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState<T>();

  function handleOpen(parma: { title: string; type: string; data?: any }) {
    setFormType(parma.type);
    setTitle(parma.title);
    setDataSource(parma.data);
    setVisible(true);
  }

  return {
    formType,
    formProps: {
      title,
      dataSource,
      visible,
      onVisibleChange: setVisible,
    },
    handleOpen,
    updateState: {
      setTitle,
      setVisible,
      setDataSource,
    },
  };
};

export const useFormBasic = <T>(props: BasicFormProps<T>) => {
  const { title = '', visible = false } = props;
  const { onSubmit = () => {}, onVisibleChange = () => {} } = props;

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onOk = async () => {
    form
      .validateFields()
      .then(async (v) => {
        try {
          setLoading(true);
          await onSubmit(v);
          onVisibleChange(false);
          setLoading(false);
        } catch (error: any) {
          message.error(error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCancel = () => {
    onVisibleChange(false);
  };

  const afterClose = () => {
    form.resetFields();
  };
  return {
    modalProps: {
      visible,
      title,
      confirmLoading: loading,
      onCancel,
      onOk,
      afterClose,
      centered: true,
      maskClosable: false,
    },
    formProps: {
      form,
      validateMessages: { required: '【${label}】 は必須' },
    },
  };
};
