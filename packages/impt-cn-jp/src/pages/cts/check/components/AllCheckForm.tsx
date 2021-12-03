import AIDForm from './Form/AIDForm';
import MICForm from './Form/MICForm';

export interface AllCheckFormProps {
  IDAType: string;
  formType: string;
}

const AllCheckForm: React.FC<AllCheckFormProps> = (props) => {
  if (props?.formType === 'MIC') return <MICForm />;
  switch (props?.IDAType) {
    case 'C':
      return <AIDForm />;
    case 'F':
      return <AIDForm />;
    case 'Y':
      return <AIDForm />;
    case 'H':
      return <AIDForm />;
    case 'N':
      return <AIDForm />;
    case 'J':
      return <AIDForm />;
    case 'P':
      return <AIDForm />;
    case 'S':
      return <AIDForm />;
    case 'M':
      return <AIDForm />;
    case 'A':
      return <AIDForm />;
    case 'G':
      return <AIDForm />;
    case 'K':
      return <AIDForm />;
    case 'D':
      return <AIDForm />;
    case 'U':
      return <AIDForm />;
    case 'L':
      return <AIDForm />;
    case 'B':
      return <AIDForm />;
    case 'E':
      return <AIDForm />;
    case 'R':
      return <AIDForm />;
    default:
      return <AIDForm />;
  }
};

export default AllCheckForm;
