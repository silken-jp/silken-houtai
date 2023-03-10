import { useRequest } from 'ahooks';
////
import { getAllAgents } from '@/services/request/agent';
import { getAllUsers } from '@/services/request/user';

interface Options {
  fieldNames?: {
    value?: string;
    label?: string;
  };
  onSuccess?: (data: any, params: any) => void;
}
export const useAgentOptions = (options?: Options) => {
  const allAgentsAPI = useRequest(
    () => getAllAgents({ page: 0, perPage: 99999 }),
    {
      cacheKey: 'agentOpts',
      onSuccess: options?.onSuccess,
    },
  );
  const agentOptions: any[] =
    allAgentsAPI?.data?.agents?.map((item: any) => ({
      [options?.fieldNames?.value || 'value']: item?._id,
      [options?.fieldNames?.label || 'label']: item?.name,
      value: item?._id,
      label: item?.name,
    })) || [];

  return { agentOptions };
};

export const useUserOptions = (options?: Options) => {
  const allUsersAPI = useRequest(
    () => getAllUsers({ page: 0, perPage: 99999 }),
    { cacheKey: 'userOpts' },
  );
  const userOptions: any[] =
    allUsersAPI?.data?.users?.map((item: any) => ({
      [options?.fieldNames?.value || 'value']: item?._id,
      [options?.fieldNames?.label || 'label']: item?.name,
    })) || [];

  return { userOptions };
};
