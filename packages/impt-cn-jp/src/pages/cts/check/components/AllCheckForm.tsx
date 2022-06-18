import { Space } from 'antd';

import AIDForm from './Form/AIDForm';
import MICForm from './Form/MICForm';
import HSCodeGroupModal from './Modal/HSCodeGroupModal';
import InvoiceGroupModal from './Modal/InvoiceGroupModal';
import NoteGroupModal from './Modal/NoteGroupModal';
import SeaGroupModal from './Modal/SeaGroupModal';

export interface AllCheckFormProps {
  IDA_type: string;
  waybill_type: string;
  disabled: boolean;
}

const AllCheckForm: React.FC<AllCheckFormProps> = (props) => {
  function renderIDAForm() {
    switch (props?.IDA_type) {
      case 'C':
        return <AIDForm disabled={props?.disabled} />;
      case 'F':
        return <AIDForm disabled={props?.disabled} />;
      case 'Y':
        return <AIDForm disabled={props?.disabled} />;
      case 'H':
        return <AIDForm disabled={props?.disabled} />;
      case 'N':
        return <AIDForm disabled={props?.disabled} />;
      case 'J':
        return <AIDForm disabled={props?.disabled} />;
      case 'P':
        return <AIDForm disabled={props?.disabled} />;
      case 'S':
        return <AIDForm disabled={props?.disabled} />;
      case 'M':
        return <AIDForm disabled={props?.disabled} />;
      case 'A':
        return <AIDForm disabled={props?.disabled} />;
      case 'G':
        return <AIDForm disabled={props?.disabled} />;
      case 'K':
        return <AIDForm disabled={props?.disabled} />;
      case 'D':
        return <AIDForm disabled={props?.disabled} />;
      case 'U':
        return <AIDForm disabled={props?.disabled} />;
      case 'L':
        return <AIDForm disabled={props?.disabled} />;
      case 'B':
        return <AIDForm disabled={props?.disabled} />;
      case 'E':
        return <AIDForm disabled={props?.disabled} />;
      case 'R':
        return <AIDForm disabled={props?.disabled} />;
      default:
        return <AIDForm disabled={props?.disabled} />;
    }
  }
  if (props?.waybill_type === 'MIC') {
    return <MICForm disabled={props?.disabled} />;
  } else if (props?.waybill_type === 'IDA') {
    return (
      <Space direction="vertical" size="large">
        <Space>
          <HSCodeGroupModal />
          <InvoiceGroupModal />
          <NoteGroupModal />
          <SeaGroupModal />
        </Space>
        {renderIDAForm()}
      </Space>
    );
  } else return null;
};

export default AllCheckForm;
