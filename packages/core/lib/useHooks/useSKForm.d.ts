/// <reference types="react" />
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
export declare const useForm: <T>() => {
  formType: string;
  formProps: {
    title: string;
    dataSource: T;
    visible: boolean;
    onVisibleChange: import('react').Dispatch<import('react').SetStateAction<boolean>>;
  };
  handleOpen: (parma: { title: string; type: string; data?: any }) => void;
  updateState: {
    setTitle: import('react').Dispatch<import('react').SetStateAction<string>>;
    setVisible: import('react').Dispatch<import('react').SetStateAction<boolean>>;
    setDataSource: import('react').Dispatch<import('react').SetStateAction<T>>;
  };
};
export declare const useFormBasic: <T>(props: BasicFormProps<T>) => {
  modalProps: {
    visible: boolean;
    title: string;
    confirmLoading: boolean;
    onCancel: () => void;
    onOk: () => Promise<void>;
    afterClose: () => void;
    centered: boolean;
  };
  formProps: {
    form: import('antd').FormInstance<any>;
    validateMessages: {
      required: string;
    };
  };
};
