import { useRequest } from 'ahooks';
////
import { getAllAgents } from '@/services/request/agent';

export const useAgentOptions = () => {
  const allAgentsAPI = useRequest(getAllAgents, { cacheKey: 'agentOpts' });
  const agentOptions =
    allAgentsAPI?.data?.agents?.map((item: any) => ({
      value: item?._id,
      label: item?.name,
    })) || [];

  return { agentOptions };
};
