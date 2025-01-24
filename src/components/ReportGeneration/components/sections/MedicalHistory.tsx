import React from 'react';
import type { Assessment } from '@/types';

interface MedicalHistoryProps {
  assessment: Assessment;
}

export const MedicalHistory: React.FC<MedicalHistoryProps> = ({ assessment }) => {
  const { medicalHistory } = assessment;

  return (
    <div>
      {/* Medications */}
      {medicalHistory.medications?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Current Medications</h3>
          <ul className="list-disc pl-6">
            {medicalHistory.medications.map((med, index) => (
              <li key={index} className="mb-2">
                <strong>{med.name}</strong> {med.dosage && `- ${med.dosage}`}
                {med.frequency && `, ${med.frequency}`}
                {med.purpose && `: ${med.purpose}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pre-existing Conditions */}
      {medicalHistory.preExisting && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Pre-existing Conditions</h3>
          <p>{medicalHistory.preExisting}</p>
        </div>
      )}

      {/* Current Treatment */}
      {medicalHistory.currentTreatment?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Current Treatment</h3>
          {medicalHistory.currentTreatment.map((treatment, index) => {
            if (!treatment.name && !treatment.focus) return null;
            return (
              <div key={index} className="mb-4">
                {treatment.name && <strong>{treatment.name}</strong>}
                {treatment.providerType && ` (${treatment.providerType})`}
                {treatment.focus && <p className="ml-4">{treatment.focus}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* Surgeries */}
      {medicalHistory.surgeries && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Surgical History</h3>
          <p>{medicalHistory.surgeries}</p>
        </div>
      )}
    </div>
  );
};