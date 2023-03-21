import { Button } from 'antd';
////
import usePERImage from '@/services/useCTSActions/usePERImage';

export interface PERImageProps {
  dataSource: any;
}

const PERImage: React.FC<PERImageProps> = (props) => {
  const { PERImageApi } = usePERImage([]);

  if (!props.dataSource?.is_PER_image) return <></>;
  return (
    <Button
      size="small"
      type="primary"
      onClick={() =>
        PERImageApi.run({
          waybillIds: [props.dataSource?._id],
        })
      }
    >
      許可書
    </Button>
  );
};

export default PERImage;
