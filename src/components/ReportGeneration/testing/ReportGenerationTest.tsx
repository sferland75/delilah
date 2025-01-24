import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ReportGenerator } from '../ReportGenerator';
import { Button } from '@/components/ui/button';
import type { Assessment } from '@/types';

const ASSESSMENT_FILE = '/delilah_assessment_2025-01-14 (16).json';
const REPORT_FILE = '/Anderson, Patrick CVSIHACAT.pdf';

const ReportGenerationTest = () => {
  const [assessmentData, setAssessmentData] = useState<{ assessment: Assessment } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [renderErrors, setRenderErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load the assessment JSON
        const response = await window.fs.readFile(ASSESSMENT_FILE, { encoding: 'utf8' });
        const data = JSON.parse(response);
        setAssessmentData(data);
      } catch (err) {
        setError(`Error loading assessment data: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    loadData();
  }, []);

  const handleErrorBoundary = (error: Error, sectionName: string) => {
    setRenderErrors(prev => ({
      ...prev,
      [sectionName]: error.message
    }));
  };

  const handleCompareWithOriginal = async () => {
    try {
      const url = REPORT_FILE;
      window.open(url, '_blank');
    } catch (err) {
      setError(`Error opening comparison report: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!assessmentData) {
    return (
      <div className="p-4">
        Loading assessment data...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Report Generation Test</h2>
          <p className="text-gray-500">Testing report components with Anderson Care assessment</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={() => window.print()}>Print Preview</Button>
              <Button onClick={handleCompareWithOriginal} variant="outline">
                Compare with Original
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Reset Test
              </Button>
            </div>
            
            {Object.keys(renderErrors).length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Rendering Errors Detected</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {Object.entries(renderErrors).map(([section, message]) => (
                      <li key={section}>
                        <strong>{section}:</strong> {message}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="print:block">
        <ReportGenerator 
          assessment={assessmentData.assessment}
          onError={handleErrorBoundary}
        />
      </div>
    </div>
  );
};

export default ReportGenerationTest;