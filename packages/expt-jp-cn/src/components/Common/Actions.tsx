import { ModalFuncProps } from 'antd/lib/modal';
import { Menu, Dropdown, Button, Modal, message } from 'antd';
import { MoreOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

interface ActionsProps {
  onEdit?: (v: any) => void;
  onDelete?: (v: any) => void;
  iconType?: 'button' | 'text';
  menus?: {
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
  const menu = (
    <Menu onClick={handleMenu}>
      {props?.onEdit && (
        <Menu.Item key="edit" onClick={props.onEdit}>
          編集
        </Menu.Item>
      )}
      {props?.onDelete && (
        <Menu.Item key="delete" onClick={props.onDelete}>
          削除
        </Menu.Item>
      )}
      {props?.menus?.map((item) => (
        <Menu.Item key={item?.label} onClick={item.onClick}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
  return <Dropdown overlay={menu}>{icon}</Dropdown>;
};

interface DeleteConfirmProps extends ModalFuncProps {
  name?: String;
  submit?: (value: any) => void;
}

export function deleteConfirm(props: DeleteConfirmProps) {
  const handleDelete = (value: any) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      title: `删除【${props?.name}】`,
      content: `本操作无法撤回，确认删除?`,
      onOk: async () => {
        try {
          await props?.submit?.(value);
        } catch (error: any) {
          message.error('删除失败，请稍后再试');
        }
      },
      ...props,
    });
  };
  return [handleDelete];
}

export default Actions;
