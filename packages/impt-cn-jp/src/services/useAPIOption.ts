import { useRequest } from 'ahooks';
////
import { getAllAgents } from '@/services/request/agent';
import { getAllUsers } from '@/services/request/user';

export const useAgentOptions = () => {
  const allAgentsAPI = useRequest(getAllAgents, { cacheKey: 'agentOpts' });
  const agentOptions: OPTION[] =
    allAgentsAPI?.data?.agents?.map((item: any) => ({
      value: item?._id,
      label: item?.name,
    })) || [];

  return { agentOptions };
};

export const useUserOptions = () => {
  const allUsersAPI = useRequest(getAllUsers, { cacheKey: 'userOpts' });
  const userOptions: OPTION[] =
    allUsersAPI?.data?.agents?.map((item: any) => ({
      value: item?._id,
      label: item?.name,
    })) || [];

  return { userOptions };
};
