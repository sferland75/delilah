"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const card_1 = require("@/components/ui/card");
const alert_1 = require("@/components/ui/alert");
const ReportGenerator_1 = require("../ReportGenerator");
const button_1 = require("@/components/ui/button");
const ASSESSMENT_FILE = '/delilah_assessment_2025-01-14 (16).json';
const REPORT_FILE = '/Anderson, Patrick CVSIHACAT.pdf';
const ReportGenerationTest = () => {
    const [assessmentData, setAssessmentData] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [renderErrors, setRenderErrors] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const loadData = async () => {
            try {
                // Load the assessment JSON
                const response = await window.fs.readFile(ASSESSMENT_FILE, { encoding: 'utf8' });
                const data = JSON.parse(response);
                setAssessmentData(data);
            }
            catch (err) {
                setError(`Error loading assessment data: ${err instanceof Error ? err.message : String(err)}`);
            }
        };
        loadData();
    }, []);
    const handleErrorBoundary = (error, sectionName) => {
        setRenderErrors(prev => ({
            ...prev,
            [sectionName]: error.message
        }));
    };
    const handleCompareWithOriginal = async () => {
        try {
            const url = REPORT_FILE;
            window.open(url, '_blank');
        }
        catch (err) {
            setError(`Error opening comparison report: ${err instanceof Error ? err.message : String(err)}`);
        }
    };
    if (error) {
        return (<alert_1.Alert variant="destructive" className="m-4">
        <alert_1.AlertTitle>Error</alert_1.AlertTitle>
        <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
      </alert_1.Alert>);
    }
    if (!assessmentData) {
        return (<div className="p-4">
        Loading assessment data...
      </div>);
    }
    return (<div className="w-full max-w-4xl mx-auto p-4 space-y-8">
      <card_1.Card>
        <card_1.CardHeader>
          <h2 className="text-2xl font-bold">Report Generation Test</h2>
          <p className="text-gray-500">Testing report components with Anderson Care assessment</p>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <button_1.Button onClick={() => window.print()}>Print Preview</button_1.Button>
              <button_1.Button onClick={handleCompareWithOriginal} variant="outline">
                Compare with Original
              </button_1.Button>
              <button_1.Button variant="outline" onClick={() => window.location.reload()}>
                Reset Test
              </button_1.Button>
            </div>
            
            {Object.keys(renderErrors).length > 0 && (<alert_1.Alert variant="destructive">
                <alert_1.AlertTitle>Rendering Errors Detected</alert_1.AlertTitle>
                <alert_1.AlertDescription>
                  <ul className="list-disc pl-4">
                    {Object.entries(renderErrors).map(([section, message]) => (<li key={section}>
                        <strong>{section}:</strong> {message}
                      </li>))}
                  </ul>
                </alert_1.AlertDescription>
              </alert_1.Alert>)}
          </div>
        </card_1.CardContent>
      </card_1.Card>

      <div className="print:block">
        <ReportGenerator_1.ReportGenerator assessment={assessmentData.assessment} onError={handleErrorBoundary}/>
      </div>
    </div>);
};
exports.default = ReportGenerationTest;
