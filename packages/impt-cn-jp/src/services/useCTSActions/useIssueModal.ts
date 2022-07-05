import useSKForm from '@silken-houtai/core/lib/useHooks';
import { message } from 'antd';
////
import { createIssue } from '../request/issue';
import { getUserInfo } from '../useStorage';

interface useIssueModelProps {
  selectedRows: any[];
}
const useIssueModel = (props: useIssueModelProps) => {
  const userInfo = getUserInfo();
  const { formType, formProps, handleOpen } = useSKForm.useForm<API.Issue>();

  const handleSubmit = async (v: any) => {
    if (formType === 'add') {
      await createIssue({
        waybill: props.selectedRows[0]?._id,
        created_user: userInfo?._id,
        issue_category: v?.issue_category,
        issue_detail: v?.issue_detail,
        status: v?.status,
        cargo_status: v?.cargo_status,
      });
    }
  };

  const handleAdd = () => {
    if (props.selectedRows?.length === 0) {
      message.warn('問題項目を選択してください。');
    } else if (props.selectedRows?.length === 1) {
      handleOpen({
        title: '新規issue',
        type: 'add',
        data: {
          waybill: props.selectedRows[0],
          created_user: userInfo,
        },
      });
    } else {
      message.warn('複数の項目を同時に新規できません。');
    }
  };

  return {
    formType,
    formProps,
    handleAdd,
    handleSubmit,
  };
};

export default useIssueModel;
