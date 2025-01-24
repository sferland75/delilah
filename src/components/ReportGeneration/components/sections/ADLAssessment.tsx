import React from 'react';
import type { Assessment } from '@/types';

interface ADLAssessmentProps {
  assessment: Assessment;
}

export const ADLAssessment: React.FC<ADLAssessmentProps> = ({ assessment }) => {
  const { adl } = assessment;

  const formatIndependence = (level: string) => {
    return level?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div>
      {/* Basic ADLs */}
      {adl.basic && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Basic Activities of Daily Living</h3>
          
          {/* Bathing Section */}
          {adl.basic.bathing && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Bathing & Hygiene</h4>
              <div className="grid gap-3 pl-4">
                {Object.entries(adl.basic.bathing).map(([activity, details]) => (
                  <div key={activity} className="border-b pb-2">
                    <div className="font-medium">
                      {activity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {details.independence && (
                      <div><strong>Level:</strong> {formatIndependence(details.independence)}</div>
                    )}
                    {details.notes && <div className="mt-1">{details.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dressing Section */}
          {adl.basic.dressing && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Dressing</h4>
              <div className="grid gap-3 pl-4">
                {Object.entries(adl.basic.dressing).map(([activity, details]) => (
                  <div key={activity} className="border-b pb-2">
                    <div className="font-medium">
                      {activity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {details.independence && (
                      <div><strong>Level:</strong> {formatIndependence(details.independence)}</div>
                    )}
                    {details.notes && <div className="mt-1">{details.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transfers Section */}
          {adl.basic.transfers && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Transfers</h4>
              <div className="grid gap-3 pl-4">
                {Object.entries(adl.basic.transfers).map(([activity, details]) => (
                  <div key={activity} className="border-b pb-2">
                    <div className="font-medium">
                      {activity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {details.independence && (
                      <div><strong>Level:</strong> {formatIndependence(details.independence)}</div>
                    )}
                    {details.notes && <div className="mt-1">{details.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instrumental ADLs */}
      {adl.iadl && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Instrumental Activities of Daily Living</h3>
          
          {/* Household Management */}
          {adl.iadl.household && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Household Management</h4>
              <div className="grid gap-3 pl-4">
                {Object.entries(adl.iadl.household).map(([activity, details]) => (
                  <div key={activity} className="border-b pb-2">
                    <div className="font-medium">
                      {activity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {details.independence && (
                      <div><strong>Level:</strong> {formatIndependence(details.independence)}</div>
                    )}
                    {details.notes && <div className="mt-1">{details.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Activities */}
          {adl.iadl.community && (
            <div className="mb-6">
              <h4 className="font-medium mb-2">Community Activities</h4>
              <div className="grid gap-3 pl-4">
                {Object.entries(adl.iadl.community).map(([activity, details]) => (
                  <div key={activity} className="border-b pb-2">
                    <div className="font-medium">
                      {activity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {details.independence && (
                      <div><strong>Level:</strong> {formatIndependence(details.independence)}</div>
                    )}
                    {details.notes && <div className="mt-1">{details.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Work Status */}
      {adl.work && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Work Status Assessment</h3>
          {Object.entries(adl.work).map(([category, details]) => (
            <div key={category} className="mb-4">
              <h4 className="font-medium mb-2">
                {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h4>
              <div className="pl-4">
                {Object.entries(details).map(([item, value]) => (
                  <div key={item} className="mb-2">
                    <div className="font-medium">
                      {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="pl-4">{value.notes}</div>
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