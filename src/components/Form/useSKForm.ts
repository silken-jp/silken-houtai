import { useState } from 'react';
import { Form, message } from 'antd';

export const useSKForm = <T>() => {
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

export interface BasicFormProps<T> {
  title: string;
  visible: boolean;
  dataSource?: T;
  onSubmit?: (data: T) => void;
  onVisibleChange?: (visible: boolean) => void;
}
export const useSKFormBasic = <T>(props: BasicFormProps<T>) => {
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
        } catch (error) {
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
    },
    formProps: {
      form,
      validateMessages: { required: "'${label}' 是必选字段" },
    },
  };
};
