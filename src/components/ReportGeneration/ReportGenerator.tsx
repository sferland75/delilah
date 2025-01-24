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
  onError?: (error: Error, sectionName: string) => void;
}

// Error boundary component for report sections
class SectionErrorBoundary extends React.Component<{
  children: React.ReactNode;
  sectionName: string;
  onError?: (error: Error, sectionName: string) => void;
}> {
  componentDidCatch(error: Error) {
    this.props.onError?.(error, this.props.sectionName);
  }

  render() {
    return this.props.children;
  }
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ assessment, onError }) => {
  const renderSection = (name: string, Component: React.ComponentType<{ assessment: Assessment }>) => (
    <SectionErrorBoundary sectionName={name} onError={onError}>
      <Component assessment={assessment} />
    </SectionErrorBoundary>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardContent className="p-8">
        <SectionErrorBoundary sectionName="Header" onError={onError}>
          <ReportHeader assessment={assessment} />
        </SectionErrorBoundary>
        
        <ReportSection title="NATURE OF INJURY">
          {renderSection('Nature of Injury', NatureOfInjury)}
        </ReportSection>

        <ReportSection title="MEDICAL HISTORY">
          {renderSection('Medical History', MedicalHistory)}
        </ReportSection>

        <ReportSection title="SYMPTOMS">
          {renderSection('Symptoms', Symptoms)}
        </ReportSection>

        <ReportSection title="FUNCTIONAL ASSESSMENT">
          {renderSection('Functional Assessment', FunctionalAssessment)}
        </ReportSection>

        <ReportSection title="ENVIRONMENTAL ASSESSMENT">
          {renderSection('Environmental Assessment', EnvironmentalAssessment)}
        </ReportSection>

        <ReportSection title="ACTIVITIES OF DAILY LIVING">
          {renderSection('ADL Assessment', ADLAssessment)}
        </ReportSection>

        <ReportSection title="AMA GUIDES ASSESSMENT">
          {renderSection('AMA Guides Assessment', AMAGuidesAssessment)}
        </ReportSection>

        <ReportSection title="CARE NEEDS AND COSTS">
          {renderSection('Care Assessment', CareAssessment)}
        </ReportSection>
      </CardContent>
    </Card>
  );
};