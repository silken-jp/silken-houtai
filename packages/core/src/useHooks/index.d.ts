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
