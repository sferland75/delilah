import React from 'react';
import type { Assessment } from '@/types';

interface NatureOfInjuryProps {
  assessment: Assessment;
}

export const NatureOfInjury: React.FC<NatureOfInjuryProps> = ({ assessment }) => {
  const { medicalHistory } = assessment;
  const { injury } = medicalHistory;

  return (
    <div>
      {injury.circumstance && (
        <p className="mb-4">{injury.circumstance}</p>
      )}
      
      {injury.immediateResponse && (
        <div className="mb-4">
          <strong>Immediate Response: </strong>
          <span>{injury.immediateResponse}</span>
        </div>
      )}
      
      {injury.subsequentCare && (
        <div className="mb-4">
          <strong>Subsequent Care: </strong>
          <span>{injury.subsequentCare}</span>
        </div>
      )}
    </div>
  );
};