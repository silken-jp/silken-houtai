import React from 'react';

import AIDForm from './AIDForm';
import MICForm from './MICForm';

export interface AllCheckFormProps {
  IDAType: string;
  formType: string;
}

const AllCheckForm: React.FC<AllCheckFormProps> = (props) => {
  if (props?.formType === 'MIC') return <MICForm />;
  switch (props?.IDAType) {
    case 'AID':
      return <AIDForm />;
    case 'ASD':
      return <AIDForm />;
    case 'AHK':
      return <AIDForm />;
    case 'AHT':
      return <AIDForm />;
    case 'AIS':
      return <AIDForm />;
    case 'AIW':
      return <AIDForm />;
    case 'AST':
      return <AIDForm />;
    default:
      return null;
  }
};

export default AllCheckForm;
