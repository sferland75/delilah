"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symptoms = void 0;
const react_1 = __importDefault(require("react"));
const Symptoms = ({ assessment }) => {
    const { symptoms } = assessment;
    return (<div>
      {/* Physical Symptoms */}
      {symptoms.physical?.length > 0 && (<div className="mb-6">
          <h3 className="font-semibold mb-2">Physical Symptoms</h3>
          {symptoms.physical.map((symptom, index) => (<div key={index} className="mb-4 pl-4">
              <div className="font-medium">{symptom.location}</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <strong>Type:</strong> {symptom.painType}
                </div>
                <div>
                  <strong>Severity:</strong> {symptom.severity}
                </div>
                <div>
                  <strong>Frequency:</strong> {symptom.frequency}
                </div>
              </div>
              {symptom.aggravating && (<div className="mt-1">
                  <strong>Aggravating Factors:</strong> {symptom.aggravating}
                </div>)}
              {symptom.relieving && (<div className="mt-1">
                  <strong>Relieving Factors:</strong> {symptom.relieving}
                </div>)}
            </div>))}
        </div>)}

      {/* Cognitive Symptoms */}
      {symptoms.cognitive?.length > 0 && (<div className="mb-6">
          <h3 className="font-semibold mb-2">Cognitive Symptoms</h3>
          {symptoms.cognitive.map((symptom, index) => (<div key={index} className="mb-4 pl-4">
              <div className="font-medium">{symptom.symptom}</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <strong>Severity:</strong> {symptom.severity}
                </div>
                <div>
                  <strong>Frequency:</strong> {symptom.frequency}
                </div>
              </div>
              {symptom.impact && (<div className="mt-1">
                  <strong>Impact:</strong> {symptom.impact}
                </div>)}
              {symptom.management && (<div className="mt-1">
                  <strong>Management:</strong> {symptom.management}
                </div>)}
            </div>))}
        </div>)}

      {/* Emotional Symptoms */}
      {symptoms.emotional?.length > 0 && (<div className="mb-6">
          <h3 className="font-semibold mb-2">Emotional Symptoms</h3>
          {symptoms.emotional.map((symptom, index) => (<div key={index} className="mb-4 pl-4">
              <div className="font-medium">{symptom.symptom}</div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <strong>Severity:</strong> {symptom.severity}
                </div>
                <div>
                  <strong>Frequency:</strong> {symptom.frequency}
                </div>
              </div>
              {symptom.impact && (<div className="mt-1">
                  <strong>Impact:</strong> {symptom.impact}
                </div>)}
              {symptom.management && (<div className="mt-1">
                  <strong>Management:</strong> {symptom.management}
                </div>)}
            </div>))}
        </div>)}

      {/* General Notes */}
      {symptoms.generalNotes && (<div className="mt-4">
          <h3 className="font-semibold mb-2">Additional Notes</h3>
          <p>{symptoms.generalNotes}</p>
        </div>)}
    </div>);
};
exports.Symptoms = Symptoms;
