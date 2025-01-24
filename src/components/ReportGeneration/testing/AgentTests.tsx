import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  MedicalHistoryAgent,
  ADLAgent,
  EnvironmentalAgent,
  AMAGuidesAgent
} from '../agents';
import type { Assessment } from '@/types';

interface TestResult {
  agent: string;
  passed: boolean;
  error?: string;
  output?: any;
}

interface AgentTestsProps {
  assessment: Assessment;
  onComplete?: (results: TestResult[]) => void;
}

export const AgentTests: React.FC<AgentTestsProps> = ({ 
  assessment,
  onComplete 
}) => {
  const [results, setResults] = React.useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const runTests = React.useCallback(async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    // Test Medical History Agent
    try {
      const medicalAgent = new MedicalHistoryAgent({ assessment });
      const medicalResult = medicalAgent.generateSection(assessment);
      testResults.push({
        agent: 'Medical History',
        passed: medicalResult.isValid,
        output: medicalResult,
        error: medicalResult.errors?.join(', ')
      });
    } catch (error) {
      testResults.push({
        agent: 'Medical History',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test ADL Agent
    try {
      const adlAgent = new ADLAgent({ assessment });
      const adlResult = adlAgent.generateSection(assessment);
      testResults.push({
        agent: 'ADL',
        passed: adlResult.isValid,
        output: adlResult,
        error: adlResult.errors?.join(', ')
      });
    } catch (error) {
      testResults.push({
        agent: 'ADL',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test Environmental Agent
    try {
      const envAgent = new EnvironmentalAgent({ assessment });
      const envResult = envAgent.generateSection(assessment);
      testResults.push({
        agent: 'Environmental',
        passed: envResult.isValid,
        output: envResult,
        error: envResult.errors?.join(', ')
      });
    } catch (error) {
      testResults.push({
        agent: 'Environmental',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test AMA Guides Agent
    try {
      const amaAgent = new AMAGuidesAgent({ assessment });
      const amaResult = amaAgent.generateSection(assessment);
      testResults.push({
        agent: 'AMA Guides',
        passed: amaResult.isValid,
        output: amaResult,
        error: amaResult.errors?.join(', ')
      });
    } catch (error) {
      testResults.push({
        agent: 'AMA Guides',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setResults(testResults);
    onComplete?.(testResults);
    setIsRunning(false);
  }, [assessment, onComplete]);

  React.useEffect(() => {
    runTests();
  }, [runTests]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Agent Tests</h2>
          <p className="text-gray-500">
            Testing individual report generation agents
          </p>
        </CardHeader>
        <CardContent>
          {isRunning ? (
            <div>Running tests...</div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <h3 className="font-semibold">{result.agent} Agent</h3>
                  </CardHeader>
                  <CardContent>
                    {result.passed ? (
                      <Alert>
                        <AlertTitle>Test Passed</AlertTitle>
                        <AlertDescription>
                          Agent successfully processed and formatted data
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertTitle>Test Failed</AlertTitle>
                        <AlertDescription>
                          {result.error || 'Unknown error occurred'}
                        </AlertDescription>
                      </Alert>
                    )}
                    {result.output && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Sample Output:</h4>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                          {JSON.stringify(result.output, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentTests;