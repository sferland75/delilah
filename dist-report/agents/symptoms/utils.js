"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSymptomData = void 0;
const validateSymptomData = (symptom) => {
    return (typeof symptom === 'object' &&
        typeof symptom.location === 'string' &&
        (typeof symptom.severity === 'number' || typeof symptom.severity === 'string') &&
        typeof symptom.frequency === 'string' &&
        typeof symptom.description === 'string');
};
exports.validateSymptomData = validateSymptomData;
