"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAssessmentData = loadAssessmentData;
async function loadAssessmentData(filename) {
    try {
        const response = await window.fs.readFile(filename, { encoding: 'utf8' });
        return JSON.parse(response);
    }
    catch (error) {
        console.error('Error loading assessment data:', error);
        throw error;
    }
}
