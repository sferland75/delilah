import React from 'react';
import type { Assessment } from '@/types';

interface FunctionalAssessmentProps {
  assessment: Assessment;
}

export const FunctionalAssessment: React.FC<FunctionalAssessmentProps> = ({ assessment }) => {
  const { functionalAssessment } = assessment;

  return (
    <div>
      {/* Range of Motion */}
      {functionalAssessment.rangeOfMotion?.measurements?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Range of Motion</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Joint</th>
                  <th className="px-4 py-2">Movement</th>
                  <th className="px-4 py-2">Normal ROM</th>
                  <th className="px-4 py-2">Left</th>
                  <th className="px-4 py-2">Right</th>
                  <th className="px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {functionalAssessment.rangeOfMotion.measurements.map((measurement, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{measurement.joint}</td>
                    <td className="px-4 py-2">{measurement.movement}</td>
                    <td className="px-4 py-2">{measurement.normalROM}</td>
                    <td className="px-4 py-2">
                      {measurement.left?.active && `Active: ${measurement.left.active}`}
                      {measurement.left?.passive && <br />}
                      {measurement.left?.passive && `Passive: ${measurement.left.passive}`}
                    </td>
                    <td className="px-4 py-2">
                      {measurement.right?.active && `Active: ${measurement.right.active}`}
                      {measurement.right?.passive && <br />}
                      {measurement.right?.passive && `Passive: ${measurement.right.passive}`}
                    </td>
                    <td className="px-4 py-2">{measurement.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Berg Balance */}
      {functionalAssessment.bergBalance?.items && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Berg Balance Assessment</h3>
          <div className="grid gap-4">
            {Object.entries(functionalAssessment.bergBalance.items).map(([item, data], index) => (
              <div key={index} className="border-b pb-2">
                <div className="font-medium">{item.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="pl-4">
                  <div><strong>Score:</strong> {data.score}</div>
                  {data.notes && <div><strong>Notes:</strong> {data.notes}</div>}
                </div>
              </div>
            ))}
            {functionalAssessment.bergBalance.totalScore && (
              <div className="font-bold">
                Total Score: {functionalAssessment.bergBalance.totalScore}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Muscle Testing */}
      {functionalAssessment.manualMuscleTesting?.grades && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Manual Muscle Testing</h3>
          {Object.entries(functionalAssessment.manualMuscleTesting.grades).map(([joint, muscles], index) => (
            <div key={index} className="mb-4">
              <h4 className="font-medium mb-2">{joint}</h4>
              <div className="pl-4">
                {Object.entries(muscles).map(([muscle, movements], mIndex) => (
                  <div key={mIndex} className="mb-2">
                    <div className="font-medium">{muscle}</div>
                    <div className="pl-4">
                      {Object.entries(movements).map(([movement, sides], mvIndex) => (
                        <div key={mvIndex}>
                          <strong>{movement}:</strong> {
                            Object.entries(sides).map(([side, grade]) => 
                              `${side}: ${grade}`
                            ).join(', ')
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};