"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentTests = void 0;
const react_1 = __importDefault(require("react"));
const card_1 = require("@/components/ui/card");
const alert_1 = require("@/components/ui/alert");
const agents_1 = require("../agents");
const AgentTests = ({ assessment, onComplete }) => {
    const [results, setResults] = react_1.default.useState([]);
    const [isRunning, setIsRunning] = react_1.default.useState(false);
    const runTests = react_1.default.useCallback(async () => {
        setIsRunning(true);
        const testResults = [];
        // Test Medical History Agent
        try {
            const medicalAgent = new agents_1.MedicalHistoryAgent({ assessment });
            const medicalResult = medicalAgent.generateSection(assessment);
            testResults.push({
                agent: 'Medical History',
                passed: medicalResult.isValid,
                output: medicalResult,
                error: medicalResult.errors?.join(', ')
            });
        }
        catch (error) {
            testResults.push({
                agent: 'Medical History',
                passed: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        // Test ADL Agent
        try {
            const adlAgent = new agents_1.ADLAgent({ assessment });
            const adlResult = adlAgent.generateSection(assessment);
            testResults.push({
                agent: 'ADL',
                passed: adlResult.isValid,
                output: adlResult,
                error: adlResult.errors?.join(', ')
            });
        }
        catch (error) {
            testResults.push({
                agent: 'ADL',
                passed: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        // Test Environmental Agent
        try {
            const envAgent = new agents_1.EnvironmentalAgent({ assessment });
            const envResult = envAgent.generateSection(assessment);
            testResults.push({
                agent: 'Environmental',
                passed: envResult.isValid,
                output: envResult,
                error: envResult.errors?.join(', ')
            });
        }
        catch (error) {
            testResults.push({
                agent: 'Environmental',
                passed: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
        // Test AMA Guides Agent
        try {
            const amaAgent = new agents_1.AMAGuidesAgent({ assessment });
            const amaResult = amaAgent.generateSection(assessment);
            testResults.push({
                agent: 'AMA Guides',
                passed: amaResult.isValid,
                output: amaResult,
                error: amaResult.errors?.join(', ')
            });
        }
        catch (error) {
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
    react_1.default.useEffect(() => {
        runTests();
    }, [runTests]);
    return (<div className="space-y-4">
      <card_1.Card>
        <card_1.CardHeader>
          <h2 className="text-xl font-bold">Agent Tests</h2>
          <p className="text-gray-500">
            Testing individual report generation agents
          </p>
        </card_1.CardHeader>
        <card_1.CardContent>
          {isRunning ? (<div>Running tests...</div>) : (<div className="space-y-4">
              {results.map((result, index) => (<card_1.Card key={index}>
                  <card_1.CardHeader>
                    <h3 className="font-semibold">{result.agent} Agent</h3>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    {result.passed ? (<alert_1.Alert>
                        <alert_1.AlertTitle>Test Passed</alert_1.AlertTitle>
                        <alert_1.AlertDescription>
                          Agent successfully processed and formatted data
                        </alert_1.AlertDescription>
                      </alert_1.Alert>) : (<alert_1.Alert variant="destructive">
                        <alert_1.AlertTitle>Test Failed</alert_1.AlertTitle>
                        <alert_1.AlertDescription>
                          {result.error || 'Unknown error occurred'}
                        </alert_1.AlertDescription>
                      </alert_1.Alert>)}
                    {result.output && (<div className="mt-4">
                        <h4 className="font-medium mb-2">Sample Output:</h4>
                        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                          {JSON.stringify(result.output, null, 2)}
                        </pre>
                      </div>)}
                  </card_1.CardContent>
                </card_1.Card>))}
            </div>)}
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.AgentTests = AgentTests;
exports.default = exports.AgentTests;
