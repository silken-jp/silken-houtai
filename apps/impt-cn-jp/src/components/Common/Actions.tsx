import { ModalFuncProps } from 'antd/lib/modal';
import { Menu, Dropdown, Button, Modal, message } from 'antd';
import { MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface ActionsProps {
  onEdit?: (v: any) => void;
  onDelete?: (v: any) => void;
  iconType?: 'button' | 'text';
  menus?: {
    key: string;
    label: string;
    onClick: (v: any) => void;
  }[];
}

const Actions: React.FC<ActionsProps> = (props) => {
  function handleMenu(e: any) {
    e.domEvent.stopPropagation();
  }

  function handleIcon(e: any) {
    e.stopPropagation();
  }
  const icon =
    props?.iconType === 'button' ? (
      <Button type="text" onClick={handleIcon}>
        <MoreOutlined />
      </Button>
    ) : (
      <MoreOutlined onClick={handleIcon} />
    );
  let items = props?.menus || [];
  if (props?.onDelete)
    items.unshift({ key: 'delete', onClick: props.onDelete, label: '削除' });
  if (props?.onEdit)
    items.unshift({ key: 'edit', onClick: props.onEdit, label: '編集' });
  return (
    <Dropdown overlay={<Menu onClick={handleMenu} items={items} />}>
      {icon}
    </Dropdown>
  );
};

interface DeleteConfirmProps extends ModalFuncProps {
  name?: String;
  submit?: (value: any) => void;
}

export function deleteConfirm(props: DeleteConfirmProps) {
  const handleDelete = (value: any) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: `DELETE【${props?.name}】`,
      content: `This operation cannot be withdrawn, confirm deletion?`,
      cancelText: 'cancel',
      okText: 'OK',
      onOk: async () => {
        try {
          await props?.submit?.(value);
        } catch (error: any) {
          message.error('Failed to delete, please try again later');
        }
      },
      ...props,
    });
  };
  return [handleDelete];
}

export default Actions;
