import AIDForm from './Form/AIDForm';
import MICForm from './Form/MICForm';

export interface AllCheckFormProps {
  IDAType: string;
  formType: string;
  disabled: boolean;
}

const AllCheckForm: React.FC<AllCheckFormProps> = (props) => {
  if (props?.formType === 'MIC') return <MICForm disabled={props?.disabled} />;
  switch (props?.IDAType) {
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
};

export default AllCheckForm;
