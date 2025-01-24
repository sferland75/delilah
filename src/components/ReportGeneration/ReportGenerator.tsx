import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ReportHeader } from './components/ReportHeader';
import { ReportSection } from './components/ReportSection';
import { NatureOfInjury } from './components/sections/NatureOfInjury';
import { MedicalHistory } from './components/sections/MedicalHistory';
import { Symptoms } from './components/sections/Symptoms';
import { FunctionalAssessment } from './components/sections/FunctionalAssessment';
import { EnvironmentalAssessment } from './components/sections/EnvironmentalAssessment';
import { ADLAssessment } from './components/sections/ADLAssessment';
import { AMAGuidesAssessment } from './components/sections/AMAGuidesAssessment';
import { CareAssessment } from './components/sections/CareAssessment';
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
          <NatureOfInjury assessment={assessment} />
        </ReportSection>

        <ReportSection title="MEDICAL HISTORY">
          <MedicalHistory assessment={assessment} />
        </ReportSection>

        <ReportSection title="SYMPTOMS">
          <Symptoms assessment={assessment} />
        </ReportSection>

        <ReportSection title="FUNCTIONAL ASSESSMENT">
          <FunctionalAssessment assessment={assessment} />
        </ReportSection>

        <ReportSection title="ENVIRONMENTAL ASSESSMENT">
          <EnvironmentalAssessment assessment={assessment} />
        </ReportSection>

        <ReportSection title="ACTIVITIES OF DAILY LIVING">
          <ADLAssessment assessment={assessment} />
        </ReportSection>

        <ReportSection title="AMA GUIDES ASSESSMENT">
          <AMAGuidesAssessment assessment={assessment} />
        </ReportSection>

        <ReportSection title="CARE NEEDS AND COSTS">
          <CareAssessment assessment={assessment} />
        </ReportSection>
      </CardContent>
    </Card>
  );
};