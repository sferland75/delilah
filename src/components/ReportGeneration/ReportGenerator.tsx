import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportHeader } from './components/ReportHeader';
import { ReportSection } from './components/ReportSection';
import type { Assessment } from '@/types';

interface ReportGeneratorProps {
  assessment: Assessment;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ assessment }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardContent className="p-8">
        <ReportHeader assessment={assessment} />
        <ReportSection title="NATURE OF INJURY">
          {/* Nature of Injury content */}
        </ReportSection>
      </CardContent>
    </Card>
  );
};
