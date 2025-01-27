"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NatureOfInjury = void 0;
const react_1 = __importDefault(require("react"));
const NatureOfInjury = ({ assessment }) => {
    const { medicalHistory } = assessment;
    const { injury } = medicalHistory;
    return (<div>
      {injury.circumstance && (<p className="mb-4">{injury.circumstance}</p>)}
      
      {injury.immediateResponse && (<div className="mb-4">
          <strong>Immediate Response: </strong>
          <span>{injury.immediateResponse}</span>
        </div>)}
      
      {injury.subsequentCare && (<div className="mb-4">
          <strong>Subsequent Care: </strong>
          <span>{injury.subsequentCare}</span>
        </div>)}
    </div>);
};
exports.NatureOfInjury = NatureOfInjury;
