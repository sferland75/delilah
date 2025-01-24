import React from 'react';
import type { Assessment } from '@/types';

interface CareAssessmentProps {
  assessment: Assessment;
}

export const CareAssessment: React.FC<CareAssessmentProps> = ({ assessment }) => {
  const { care } = assessment;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  return (
    <div>
      {/* Personal Care */}
      {care.personalCare && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Personal Care</h3>
          <div className="grid gap-2 pl-4">
            {care.personalCare.type && (
              <div><strong>Type:</strong> {care.personalCare.type}</div>
            )}
            {care.personalCare.frequency && (
              <div><strong>Frequency:</strong> {care.personalCare.frequency}</div>
            )}
            {care.personalCare.provider && (
              <div><strong>Provider:</strong> {care.personalCare.provider}</div>
            )}
            {care.personalCare.notes && (
              <div className="mt-2">{care.personalCare.notes}</div>
            )}
          </div>
        </div>
      )}

      {/* Housekeeping */}
      {care.housekeeping && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Housekeeping</h3>
          <div className="grid gap-2 pl-4">
            {care.housekeeping.type && (
              <div><strong>Type:</strong> {care.housekeeping.type}</div>
            )}
            {care.housekeeping.frequency && (
              <div><strong>Frequency:</strong> {care.housekeeping.frequency}</div>
            )}
            {care.housekeeping.provider && (
              <div><strong>Provider:</strong> {care.housekeeping.provider}</div>
            )}
            {care.housekeeping.notes && (
              <div className="mt-2">{care.housekeeping.notes}</div>
            )}
          </div>
        </div>
      )}

      {/* Meal Preparation */}
      {care.mealPreparation && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Meal Preparation</h3>
          <div className="grid gap-2 pl-4">
            {care.mealPreparation.type && (
              <div><strong>Type:</strong> {care.mealPreparation.type}</div>
            )}
            {care.mealPreparation.frequency && (
              <div><strong>Frequency:</strong> {care.mealPreparation.frequency}</div>
            )}
            {care.mealPreparation.provider && (
              <div><strong>Provider:</strong> {care.mealPreparation.provider}</div>
            )}
            {care.mealPreparation.notes && (
              <div className="mt-2">{care.mealPreparation.notes}</div>
            )}
          </div>
        </div>
      )}

      {/* Transportation */}
      {care.transportation && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Transportation</h3>
          <div className="grid gap-2 pl-4">
            {care.transportation.type && (
              <div><strong>Type:</strong> {care.transportation.type}</div>
            )}
            {care.transportation.frequency && (
              <div><strong>Frequency:</strong> {care.transportation.frequency}</div>
            )}
            {care.transportation.provider && (
              <div><strong>Provider:</strong> {care.transportation.provider}</div>
            )}
            {care.transportation.notes && (
              <div className="mt-2">{care.transportation.notes}</div>
            )}
          </div>
        </div>
      )}

      {/* Cost Summary */}
      {care.costSummary && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Cost Summary</h3>
          <div className="grid gap-2 pl-4">
            {care.costSummary.monthly !== undefined && (
              <div><strong>Monthly Cost:</strong> {formatCurrency(care.costSummary.monthly)}</div>
            )}
            {care.costSummary.annual !== undefined && (
              <div><strong>Annual Cost:</strong> {formatCurrency(care.costSummary.annual)}</div>
            )}
            {care.costSummary.notes && (
              <div className="mt-2">{care.costSummary.notes}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};