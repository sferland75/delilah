"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentalAssessment = void 0;
const react_1 = __importDefault(require("react"));
const EnvironmentalAssessment = ({ assessment }) => {
    const { environmental } = assessment;
    return (<div>
      {/* Property Overview */}
      {environmental.propertyOverview && (<div className="mb-6">
          <h3 className="font-semibold mb-3">Property Overview</h3>
          
          {/* Hazards */}
          {environmental.propertyOverview.identifiedHazards?.length > 0 && (<div className="mb-4">
              <h4 className="font-medium mb-2">Identified Hazards</h4>
              <ul className="list-disc pl-6">
                {environmental.propertyOverview.identifiedHazards.map((hazard, index) => (<li key={index}>{hazard}</li>))}
              </ul>
            </div>)}

          {/* Modifications */}
          {environmental.propertyOverview.recommendedModifications?.length > 0 && (<div className="mb-4">
              <h4 className="font-medium mb-2">Recommended Modifications</h4>
              <ul className="list-disc pl-6">
                {environmental.propertyOverview.recommendedModifications.map((mod, index) => (<li key={index}>{mod}</li>))}
              </ul>
            </div>)}

          {/* Rooms Assessment */}
          {environmental.propertyOverview.rooms && Object.keys(environmental.propertyOverview.rooms).length > 0 && (<div className="mb-4">
              <h4 className="font-medium mb-2">Room Assessment</h4>
              <div className="grid gap-4">
                {Object.entries(environmental.propertyOverview.rooms).map(([room, details], index) => (<div key={index}>
                    <h5 className="font-medium">{room}</h5>
                    {Object.entries(details).length > 0 && (<ul className="list-disc pl-6">
                        {Object.entries(details).map(([key, value], idx) => (<li key={idx}>{key}: {value}</li>))}
                      </ul>)}
                  </div>))}
              </div>
            </div>)}
        </div>)}

      {/* Exterior */}
      {environmental.exterior?.length > 0 && (<div className="mb-6">
          <h3 className="font-semibold mb-3">Exterior Assessment</h3>
          <ul className="list-disc pl-6">
            {environmental.exterior.map((item, index) => (<li key={index}>{item}</li>))}
          </ul>
        </div>)}

      {/* Safety */}
      {environmental.safety && (<div className="mb-6">
          <h3 className="font-semibold mb-3">Safety Assessment</h3>
          
          {environmental.safety.hazards?.length > 0 && (<div className="mb-4">
              <h4 className="font-medium mb-2">Safety Hazards</h4>
              <ul className="list-disc pl-6">
                {environmental.safety.hazards.map((hazard, index) => (<li key={index}>{hazard}</li>))}
              </ul>
            </div>)}

          {environmental.safety.recommendations?.length > 0 && (<div className="mb-4">
              <h4 className="font-medium mb-2">Safety Recommendations</h4>
              <ul className="list-disc pl-6">
                {environmental.safety.recommendations.map((rec, index) => (<li key={index}>{rec}</li>))}
              </ul>
            </div>)}
        </div>)}
    </div>);
};
exports.EnvironmentalAssessment = EnvironmentalAssessment;
