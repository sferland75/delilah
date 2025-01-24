import React from 'react';
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyOverview } from '../EnvironmentalSection/property-overview';
import { RoomAssessment } from '../EnvironmentalSection/room-assessment';
import { ExteriorFeatures } from '../EnvironmentalSection/exterior-features';
import { SafetyAssessment } from '../EnvironmentalSection/safety-assessment';

export function EnvironmentalAssessment() {
  const { watch } = useFormContext();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Environmental Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PropertyOverview />
          <RoomAssessment />
          <ExteriorFeatures />
          <SafetyAssessment />
        </CardContent>
      </Card>
    </div>
  );
}