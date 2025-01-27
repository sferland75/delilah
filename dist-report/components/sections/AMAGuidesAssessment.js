"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMAGuidesAssessment = void 0;
const react_1 = __importDefault(require("react"));
const AMAGuidesAssessment = ({ assessment }) => {
    const { amaGuides } = assessment;
    const renderRating = (value) => {
        if (value === 0)
            return 'No Impairment';
        if (value === 1)
            return 'Mild Impairment';
        if (value === 2)
            return 'Moderate Impairment';
        if (value === 3)
            return 'Severe Impairment';
        if (value === 4)
            return 'Profound Impairment';
        return 'Not Assessed';
    };
    const calculateImpairmentClass = (value) => {
        if (value === 0)
            return 'text-green-600';
        if (value === 1)
            return 'text-yellow-600';
        if (value === 2)
            return 'text-orange-600';
        if (value === 3)
            return 'text-red-600';
        if (value === 4)
            return 'text-red-800';
        return 'text-gray-600';
    };
    return (<div>
      {/* Activities */}
      {amaGuides.activities && (<div className="mb-6">
          <h3 className="font-semibold mb-3">Activities Assessment</h3>
          <div className="grid gap-3 pl-4">
            <div className={calculateImpairmentClass(amaGuides.activities.self)}>
              <strong>Self Care:</strong> {renderRating(amaGuides.activities.self)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.activities.travel)}>
              <strong>Travel:</strong> {renderRating(amaGuides.activities.travel)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.activities.social)}>
              <strong>Social:</strong> {renderRating(amaGuides.activities.social)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.activities.recreational)}>
              <strong>Recreational:</strong> {renderRating(amaGuides.activities.recreational)}
            </div>
          </div>
        </div>)}

      {/* Social Functioning */}
      {amaGuides.social && (<div className="mb-6">
          <h3 className="font-semibold mb-3">Social Functioning</h3>
          <div className="grid gap-3 pl-4">
            <div className={calculateImpairmentClass(amaGuides.social.family)}>
              <strong>Family:</strong> {renderRating(amaGuides.social.family)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.social.friends)}>
              <strong>Friends:</strong> {renderRating(amaGuides.social.friends)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.social.community)}>
              <strong>Community:</strong> {renderRating(amaGuides.social.community)}
            </div>
          </div>
        </div>)}

      {/* Concentration */}
      {amaGuides.concentration && (<div className="mb-6">
          <h3 className="font-semibold mb-3">Concentration, Persistence and Pace</h3>
          <div className="grid gap-3 pl-4">
            <div className={calculateImpairmentClass(amaGuides.concentration.tasks)}>
              <strong>Task Completion:</strong> {renderRating(amaGuides.concentration.tasks)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.concentration.pace)}>
              <strong>Pace:</strong> {renderRating(amaGuides.concentration.pace)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.concentration.adaptability)}>
              <strong>Adaptability:</strong> {renderRating(amaGuides.concentration.adaptability)}
            </div>
          </div>
        </div>)}

      {/* Work Adaptation */}
      {amaGuides.workAdaptation && (<div className="mb-6">
          <h3 className="font-semibold mb-3">Work Adaptation</h3>
          <div className="grid gap-3 pl-4">
            <div className={calculateImpairmentClass(amaGuides.workAdaptation.performance)}>
              <strong>Performance:</strong> {renderRating(amaGuides.workAdaptation.performance)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.workAdaptation.flexibility)}>
              <strong>Flexibility:</strong> {renderRating(amaGuides.workAdaptation.flexibility)}
            </div>
            <div className={calculateImpairmentClass(amaGuides.workAdaptation.sustainability)}>
              <strong>Sustainability:</strong> {renderRating(amaGuides.workAdaptation.sustainability)}
            </div>
          </div>
        </div>)}

      {/* Overall Rating & Notes */}
      {(amaGuides.overallRating !== undefined || amaGuides.generalNotes) && (<div className="mt-6">
          {amaGuides.overallRating !== undefined && (<div className={`font-bold mb-3 ${calculateImpairmentClass(amaGuides.overallRating)}`}>
              Overall Rating: {renderRating(amaGuides.overallRating)}
            </div>)}
          {amaGuides.generalNotes && (<div className="mt-4">
              <h3 className="font-semibold mb-2">Additional Notes</h3>
              <p>{amaGuides.generalNotes}</p>
            </div>)}
        </div>)}
    </div>);
};
exports.AMAGuidesAssessment = AMAGuidesAssessment;
